import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Coins,
  Copy,
  Check,
  QrCode,
  Share2,
  Info,
  Clock,
  ExternalLink,
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
  // Primary active payment method is USDT
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('usdt');

  // USDT Specific State
  const [usdtNetwork, setUsdtNetwork] = useState<'TRC20' | 'ERC20'>('TRC20');
  const [usdtTxId, setUsdtTxId] = useState('');
  const [usdtSenderAddress, setUsdtSenderAddress] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showShareNotice, setShowShareNotice] = useState(false);

  // Mobile Wallet Specific State
  const [walletType, setWalletType] = useState<'bkash' | 'nagad' | 'easypaisa' | 'jazzcash'>('bkash');
  const [walletAccount, setWalletAccount] = useState('');
  const [walletTxnId, setWalletTxnId] = useState('');

  // Coming soon notice modal / state
  const [comingSoonNotice, setComingSoonNotice] = useState<string | null>(null);

  // Agreement
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const usdtDepositAddresses: Record<'TRC20' | 'ERC20', { address: string; networkName: string; contract: string; note: string }> = {
    TRC20: {
      address: 'TGTiqyvzVeJ2epbcugsY5o2YdbAX6k4M59',
      networkName: 'TRX Tron (TRC20)',
      contract: '***jLj6t',
      note: 'Fastest transfer (~1-3 mins) & lowest network gas fees (~1 USDT)',
    },
    ERC20: {
      address: '0x23626e3b11ad9be9f1a1b12a3fb7e7b89d35588f',
      networkName: 'ETH Ethereum (ERC20)',
      contract: '***31ec7',
      note: 'Standard Ethereum network USDT transfer',
    },
  };

  const currentUsdtConfig = usdtDepositAddresses[usdtNetwork];

  useEffect(() => {
    if (user) {
      if (!customerEmail && user.email) setCustomerEmail(user.email);
      if (!customerName && user.user_metadata?.full_name) {
        setCustomerName(user.user_metadata.full_name);
      }
    }
  }, [user]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(currentUsdtConfig.address);
    setCopiedAddress(true);
    showToast(`${usdtNetwork} Deposit address copied to clipboard!`, 'success');
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  const handleSaveAndShare = () => {
    const textToShare = `World Dollar Quest USDT Deposit Details:\nNetwork: ${currentUsdtConfig.networkName}\nDeposit Address: ${currentUsdtConfig.address}\nAmount Due: $${total.toFixed(2)} USDT`;
    if (navigator.share) {
      navigator
        .share({
          title: 'WDQ USDT Deposit Details',
          text: textToShare,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      setShowShareNotice(true);
      showToast('Deposit details copied to clipboard to save & share!', 'success');
      setTimeout(() => setShowShareNotice(false), 4000);
    }
  };

  // If cart is empty, redirect or display notice
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="p-4 rounded-xl bg-slate-800 text-teal-400 inline-block mb-4">
            <Coins className="w-8 h-8" />
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

    // USDT Validation
    if (selectedProvider === 'usdt') {
      if (!usdtTxId.trim()) {
        setCheckoutError('Please enter your USDT Transaction Hash / TxID after completing the transfer.');
        return;
      }
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
        usdtDetails:
          selectedProvider === 'usdt'
            ? {
                network: usdtNetwork,
                senderAddress: usdtSenderAddress,
                txId: usdtTxId,
                depositAddress: currentUsdtConfig.address,
              }
            : undefined,
        metadata: {
          usdtDetails:
            selectedProvider === 'usdt'
              ? {
                  network: usdtNetwork,
                  senderAddress: usdtSenderAddress,
                  txId: usdtTxId,
                  depositAddress: currentUsdtConfig.address,
                }
              : undefined,
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
      const adminNote =
        selectedProvider === 'usdt'
          ? `USDT Crypto Transfer | Network: ${usdtNetwork} | TxID: ${usdtTxId} | Sender: ${usdtSenderAddress || 'N/A'} | Deposit Address: ${currentUsdtConfig.address}`
          : selectedProvider === 'mobile_wallet'
          ? `Mobile Wallet: ${walletType.toUpperCase()} | Account: ${walletAccount} | TrxID: ${walletTxnId}`
          : undefined;

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
          adminNotes: adminNote,
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
      showToast('Order confirmed! Instant digital downloads are now ready.', 'success');

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

  const handleSelectComingSoon = (providerName: 'stripe' | 'paypal') => {
    const label = providerName === 'stripe' ? 'Credit / Debit Card (Stripe)' : 'PayPal Express';
    setComingSoonNotice(
      `${label} gateway is currently in onboarding and will be available soon. Please use the active USDT (Crypto) payment option for immediate instant checkout.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                  Secure Checkout
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold tracking-normal">
                    USDT Active
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Instant automated digital file delivery. Send USDT directly or test in sandbox mode.
                </p>
              </div>
            </div>
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

        {/* Coming Soon Alert Modal / Toast */}
        <AnimatePresence>
          {comingSoonNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start justify-between gap-3 shadow-lg"
            >
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-0.5">Payment Method Coming Soon</p>
                  <p className="text-amber-200/90 leading-relaxed">{comingSoonNotice}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setComingSoonNotice(null)}
                className="text-amber-400 hover:text-white font-bold text-xs px-2 py-1 bg-amber-500/20 rounded-lg shrink-0 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address (For digital download delivery) *
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
                    <Phone className="w-3.5 h-3.5 text-slate-500" /> Phone Number (Optional)
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold border border-teal-500/30">
                    2
                  </span>
                  Select Payment Method
                </h2>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  USDT Active Now
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. USDT CRYPTO (PRIMARY ACTIVE OPTION) */}
                <div
                  onClick={() => setSelectedProvider('usdt')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                    selectedProvider === 'usdt'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Coins className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ACTIVE • INSTANT
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    USDT (Tether Crypto)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Tron (TRC20) & Ethereum (ERC20). Scan QR or copy address from Binance/Bybit/TrustWallet.
                  </p>
                </div>

                {/* 2. STRIPE (COMING SOON) */}
                <div
                  onClick={() => handleSelectComingSoon('stripe')}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/60 text-slate-400 cursor-pointer transition-all relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-slate-300">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      COMING SOON
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                    Credit / Debit Card (Stripe)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Visa, Mastercard, Amex, Apple Pay & Google Pay (In onboarding).
                  </p>
                </div>

                {/* 3. PAYPAL (COMING SOON) */}
                <div
                  onClick={() => handleSelectComingSoon('paypal')}
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/60 text-slate-400 cursor-pointer transition-all relative group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-slate-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      COMING SOON
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-300">PayPal Express</h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Fast checkout with PayPal balance or bank (In onboarding).
                  </p>
                </div>

                {/* 4. Instant Sandbox Mode (Testing) */}
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
                    Simulate test checkout and verify download delivery.
                  </p>
                </div>
              </div>

              {/* ----------------- USDT DEDICATED PAYMENT INTERFACE ----------------- */}
              {selectedProvider === 'usdt' && (
                <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
                        ₮
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Deposit USDT</h4>
                        <p className="text-[11px] text-slate-400">
                          Transfer exact amount to the official Binance deposit address below
                        </p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl text-right">
                      <span className="text-[10px] uppercase text-emerald-400 font-semibold block">
                        Amount to Transfer
                      </span>
                      <span className="text-sm font-black text-white font-mono">
                        ${total.toFixed(2)} USDT
                      </span>
                    </div>
                  </div>

                  {/* Network Selector (TRC20 vs ERC20) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Select Deposit Network:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setUsdtNetwork('TRC20')}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          usdtNetwork === 'TRC20'
                            ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">TRX Tron (TRC20)</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                              Recommended
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Low fee (~1 USDT) • 1-3 mins
                          </span>
                        </div>
                        {usdtNetwork === 'TRC20' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setUsdtNetwork('ERC20')}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          usdtNetwork === 'ERC20'
                            ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/50'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">ETH Ethereum (ERC20)</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Standard Ethereum Network
                          </span>
                        </div>
                        {usdtNetwork === 'ERC20' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    </div>
                  </div>

                  {/* QR Code and Address Display Card */}
                  <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-5">
                    {/* QR Code Container with Tether Badge */}
                    <div className="relative p-2.5 bg-white rounded-xl shadow-lg shrink-0 flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(
                          currentUsdtConfig.address
                        )}`}
                        alt="USDT Deposit QR Code"
                        className="w-36 h-36 rounded"
                      />
                      {/* Centered Tether Icon Badge */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-[#26A17B] border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-sm">
                          ₮
                        </div>
                      </div>
                    </div>

                    {/* Address & Copy Details */}
                    <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                      <div>
                        <div className="flex items-center justify-center sm:justify-between text-[11px] text-slate-400 mb-1">
                          <span>Deposit Address ({usdtNetwork}):</span>
                          <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
                            Contract {currentUsdtConfig.contract}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all flex items-center justify-between gap-2">
                          <span className="font-semibold">{currentUsdtConfig.address}</span>
                        </div>
                      </div>

                      {/* Action Buttons: Copy & Share */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCopyAddress}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            copiedAddress
                              ? 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {copiedAddress ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Address Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Address
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveAndShare}
                          className="py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Share2 className="w-3.5 h-3.5" /> Save / Share
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-tight">
                        ⚠️ Send only <span className="text-emerald-300 font-bold">USDT</span> via the{' '}
                        <span className="text-white font-bold">{currentUsdtConfig.networkName}</span> network to avoid loss of funds.
                      </p>
                    </div>
                  </div>

                  {/* Customer Transaction Inputs */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1">
                        <span>Transaction Hash / TxID *</span>
                        <span className="text-[10px] text-emerald-400 font-normal">
                          (Found in your Binance/wallet withdrawal history)
                        </span>
                      </label>
                      <input
                        type="text"
                        required={selectedProvider === 'usdt'}
                        value={usdtTxId}
                        onChange={(e) => setUsdtTxId(e.target.value.trim())}
                        placeholder="e.g. 7f4a2b9c8e1d3... or TRC20 Transaction Hash"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono tracking-wide"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                        <span>Your Sender Wallet Address / Exchange (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={usdtSenderAddress}
                        onChange={(e) => setUsdtSenderAddress(e.target.value.trim())}
                        placeholder="e.g. Binance / Bybit / Trust Wallet / 0x... / T..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- MOBILE WALLET INTERFACE (SECONDARY) ----------------- */}
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
                    Send <span className="text-amber-300 font-bold">{formatPrice(total)}</span> to merchant number{' '}
                    <span className="font-mono text-white font-bold">+8801700000000</span> and enter your TrxID above.
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
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
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
                  <span>Digital Delivery</span>
                  <span className="text-emerald-400 font-semibold uppercase">Instant Download</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Amount Due</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      ${total.toFixed(2)} USDT
                    </span>
                    {selectedCurrency !== 'USD' && (
                      <p className="text-[10px] text-slate-400">
                        (≈ {formatPrice(total)})
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
                    I agree to the <span className="text-slate-200 underline">Terms of Service</span> and acknowledge that digital downloads are accessible immediately upon confirmation.
                  </span>
                </label>
              </div>

              {/* Complete Payment Button */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Verifying & Provisioning Files...
                    </span>
                  ) : (
                    <>
                      {selectedProvider === 'usdt' ? (
                        <>Confirm USDT Payment & Download</>
                      ) : (
                        <>Pay ${total.toFixed(2)} & Access Downloads</>
                      )}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit Encrypted Portal • Instant Token Generation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
