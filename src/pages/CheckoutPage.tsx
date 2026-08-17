import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Zap,
  Tag,
  Mail,
  User,
  Phone,
  FileCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { paymentService } from '../services/paymentService';
import { downloadService } from '../services/downloadService';
import { emailService } from '../services/emailService';
import { PaymentProvider, CurrencyCode, OrderItem } from '../types';

export const CheckoutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    discount,
    total,
    selectedCurrency,
    setSelectedCurrency,
    appliedCoupon,
    formatPrice,
    clearCart,
  } = useCart();

  const { createOrder } = useApp();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Form State
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('sandbox');

  // Mobile Wallet Specific State
  const [walletType, setWalletType] = useState<'bkash' | 'nagad' | 'easypaisa' | 'jazzcash'>('bkash');
  const [walletAccount, setWalletAccount] = useState('');
  const [walletTxnId, setWalletTxnId] = useState('');

  // Card specific state (mock form for live appearance)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Agreement
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerEmail && user.email) setCustomerEmail(user.email);
      if (!customerName && user.user_metadata?.full_name) {
        setCustomerName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  // If cart is empty, redirect or display notice
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="p-4 rounded-xl bg-slate-800 text-teal-400 inline-block mb-4">
            <CreditCard className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Items In Checkout</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please add at least one digital product to your cart before proceeding to the checkout portal.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/digital-products')}
            className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setCheckoutError('Please enter a valid email address for instant digital file delivery.');
      return;
    }

    if (!customerName.trim()) {
      setCheckoutError('Please enter your full name.');
      return;
    }

    if (!agreeTerms) {
      setCheckoutError('Please agree to the digital product terms and refund policies.');
      return;
    }

    if (selectedProvider === 'mobile_wallet') {
      if (!walletAccount.trim() || !walletTxnId.trim()) {
        setCheckoutError('Please enter your Mobile Wallet account number and Transaction TrxID.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // 1. Process payment with provider adapter
      const paymentResult = await paymentService.processPayment({
        provider: selectedProvider,
        amount: total,
        currency: selectedCurrency,
        customerEmail,
        customerName,
        customerPhone,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.salePrice !== undefined ? i.product.salePrice : i.product.price,
          total: (i.product.salePrice !== undefined ? i.product.salePrice : i.product.price) * i.quantity,
          downloadFilePath: i.product.fileUrl || `products/${i.product.slug}/package.zip`,
        })),
        metadata: {
          walletType: selectedProvider === 'mobile_wallet' ? walletType : undefined,
          walletAccount: selectedProvider === 'mobile_wallet' ? walletAccount : undefined,
          walletTxnId: selectedProvider === 'mobile_wallet' ? walletTxnId : undefined,
          appliedCoupon: appliedCoupon?.code,
        },
      });

      if (!paymentResult.success) {
        setCheckoutError(paymentResult.errorMessage || 'Payment processing failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      // 2. Prepare Order Items
      const orderItems: OrderItem[] = items.map((item) => {
        const unitPrice = item.product.salePrice !== undefined ? item.product.salePrice : item.product.price;
        return {
          productId: item.product.id,
          productName: item.product.name,
          productSlug: item.product.slug,
          quantity: item.quantity,
          unitPrice,
          total: unitPrice * item.quantity,
          downloadFilePath: item.product.fileUrl || `products/${item.product.slug}/package.zip`,
        };
      });

      // 3. Create persistent Order record via AppContext (persists to Supabase & local state)
      const createdOrder = await createOrder(
        {
          customerId: user?.id,
          customerName,
          customerEmail,
          customerPhone: customerPhone || undefined,
          subtotal,
          discount,
          total,
          currency: selectedCurrency,
          paymentProvider: selectedProvider,
          paymentReference: paymentResult.transactionId || paymentResult.orderId,
          paymentStatus: paymentResult.status === 'completed' ? 'paid' : 'pending',
          orderStatus: paymentResult.status === 'completed' ? 'completed' : 'processing',
          couponCode: appliedCoupon?.code,
          adminNotes:
            selectedProvider === 'mobile_wallet'
              ? `Mobile Wallet: ${walletType.toUpperCase()} | Account: ${walletAccount} | TrxID: ${walletTxnId}`
              : undefined,
        },
        orderItems
      );

      // 4. Generate Digital Download Entitlements for instant access
      const generatedEntitlements = await downloadService.generateEntitlementsForOrder(
        createdOrder.id,
        orderItems,
        customerEmail
      );

      // 5. Send Transactional Confirmation Email
      await emailService.sendOrderConfirmationEmail(createdOrder, orderItems, generatedEntitlements);

      // 6. Show toast notification
      showToast('Order completed successfully! Instant downloads are ready.', 'success');

      // 7. Clear cart
      clearCart();

      // 8. Redirect to success delivery page
      onNavigate(`/checkout/success?orderId=${createdOrder.id}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Secure Express Checkout
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Encrypted transaction portal. Digital files are provisioned immediately upon confirmation.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
            <span className="text-[11px] font-semibold uppercase text-slate-400 px-2">Currency:</span>
            {(['USD', 'PKR', 'BDT'] as CurrencyCode[]).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setSelectedCurrency(curr)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedCurrency === curr
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Payment Details */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Info */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">
                  1
                </span>
                Fulfillment & Customer Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address (Where download links will be sent) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Phone Number (Optional for SMS updates)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000 / +880 / +92"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Provider Selection */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">
                  2
                </span>
                Select Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instant Sandbox Mode */}
                <div
                  onClick={() => setSelectedProvider('sandbox')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider === 'sandbox'
                      ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                      INSTANT TEST
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Instant Sandbox Mode</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Simulate real instant payment and verify immediate download delivery.
                  </p>
                </div>

                {/* Stripe / Card */}
                <div
                  onClick={() => setSelectedProvider('stripe')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider === 'stripe'
                      ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      VISA / MC / AMEX
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Credit / Debit Card</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Powered by Stripe with 256-bit secure tokenization.
                  </p>
                </div>

                {/* PayPal */}
                <div
                  onClick={() => setSelectedProvider('paypal')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider === 'paypal'
                      ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      PAYPAL
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">PayPal Express</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Fast, secure checkout with your PayPal balance or bank.
                  </p>
                </div>

                {/* Mobile Wallets */}
                <div
                  onClick={() => setSelectedProvider('mobile_wallet')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider === 'mobile_wallet'
                      ? 'bg-teal-950/40 border-teal-500 text-white ring-1 ring-teal-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      SOUTH ASIA
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Mobile Wallet</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    bKash, Nagad, Easypaisa, JazzCash direct payment.
                  </p>
                </div>
              </div>

              {/* Provider Specific Input Forms */}
              {selectedProvider === 'stripe' && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <p className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Stripe Card Details
                  </p>
                  <div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number (4242 4242 4242 4242)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC / CWW"
                      className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {selectedProvider === 'mobile_wallet' && (
                <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile Wallet Payment Verification
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['bkash', 'nagad', 'easypaisa', 'jazzcash'] as const).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWalletType(w)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                          walletType === w
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Sender Mobile Number</label>
                      <input
                        type="text"
                        value={walletAccount}
                        onChange={(e) => setWalletAccount(e.target.value)}
                        placeholder="e.g. 01700000000 / 03001234567"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Transaction ID (TrxID)</label>
                      <input
                        type="text"
                        value={walletTxnId}
                        onChange={(e) => setWalletTxnId(e.target.value.toUpperCase())}
                        placeholder="e.g. 9J12K8XP9"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono uppercase"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Send <span className="text-amber-300 font-bold">{formatPrice(total)}</span> to merchant number <span className="font-mono text-white font-bold">+8801700000000</span> and enter your TrxID above.
                  </p>
                </div>
              )}
            </div>

            {/* Error Message */}
            {checkoutError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1">{checkoutError}</div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Pay Action */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
              <h2 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
                Purchased Digital Items ({items.length})
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => {
                  const unitPrice = product.salePrice !== undefined ? product.salePrice : product.price;
                  return (
                    <div key={product.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2.5 flex-1 pr-2 truncate">
                        <FileCheck className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="text-slate-200 truncate font-medium">{product.name}</span>
                        {quantity > 1 && (
                          <span className="text-slate-500 font-mono">x{quantity}</span>
                        )}
                      </div>
                      <span className="font-semibold text-white shrink-0">
                        {formatPrice(unitPrice * quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 pt-4 border-t border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-teal-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon ({appliedCoupon?.code})
                    </span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>Digital Fulfillment</span>
                  <span className="text-teal-400 font-semibold uppercase">Instant Download</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Amount Due</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-teal-400">
                      {formatPrice(total)}
                    </span>
                    {selectedCurrency !== 'USD' && (
                      <p className="text-[10px] text-slate-400">
                        (≈ ${total.toFixed(2)} USD)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Digital Policy Checkbox */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-0"
                  />
                  <span>
                    I agree to the <span className="text-slate-200 underline">Terms of Service</span> and acknowledge that digital downloads are accessible immediately upon payment.
                  </span>
                </label>
              </div>

              {/* Complete Payment Button */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authorizing Payment & Provisioning Files...
                    </span>
                  ) : (
                    <>
                      Pay {formatPrice(total)} & Access Downloads
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>256-Bit Bank Grade SSL • Supabase Verified</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
