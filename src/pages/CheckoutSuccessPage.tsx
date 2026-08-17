import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Download,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Mail,
  Sparkles,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { downloadService } from '../services/downloadService';
import { Order, OrderItem, DownloadEntitlement, PaymentTransaction } from '../types';

export const CheckoutSuccessPage: React.FC<{
  orderId?: string;
  onNavigate: (path: string) => void;
}> = ({ orderId: propOrderId, onNavigate }) => {
  const { orders, fetchOrderDetails } = useApp();
  const { showToast } = useToast();

  // Extract orderId from prop or window location search params
  const urlParams = new URLSearchParams(window.location.search);
  const activeOrderId = propOrderId || urlParams.get('orderId') || (orders.length > 0 ? orders[0].id : '');

  const [orderDetails, setOrderDetails] = useState<{
    order: Order;
    items: OrderItem[];
    entitlements: DownloadEntitlement[];
    transactions: PaymentTransaction[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!activeOrderId) {
        setLoading(false);
        return;
      }

      const details = await fetchOrderDetails(activeOrderId);
      if (isMounted) {
        if (details) {
          // If entitlements are not yet attached, fetch directly from downloadService
          if (details.entitlements.length === 0) {
            const ents = await downloadService.getOrderEntitlements(activeOrderId);
            details.entitlements = ents;
          }
          setOrderDetails(details);
        } else {
          // Fallback to finding in local orders
          const found = orders.find((o) => o.id === activeOrderId);
          if (found) {
            const ents = await downloadService.getOrderEntitlements(activeOrderId);
            setOrderDetails({
              order: found,
              items: found.items || [],
              entitlements: ents,
              transactions: [],
            });
          }
        }
        setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeOrderId, fetchOrderDetails, orders]);

  const handleDownload = async (entitlement: DownloadEntitlement) => {
    setDownloadingId(entitlement.id);

    try {
      const result = await downloadService.processDownload(entitlement.accessToken);
      if (result.success) {
        showToast(`Download initiated for ${entitlement.productName}!`, 'success');
        // Update remaining counts in local state
        setOrderDetails((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            entitlements: prev.entitlements.map((e) =>
              e.id === entitlement.id ? { ...e, downloadCount: e.downloadCount + 1 } : e
            ),
          };
        });
      } else {
        showToast(result.error || 'Failed to process download.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Download error occurred.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const copyOrderNumber = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    showToast('Order number copied to clipboard!', 'info');
    setTimeout(() => setCopiedToken(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading your order confirmation...</p>
        </div>
      </div>
    );
  }

  const order = orderDetails?.order;
  const entitlements = orderDetails?.entitlements || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-b from-teal-950/40 to-slate-900/90 border border-teal-500/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="inline-flex p-4 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Payment Confirmed & Access Granted!
          </h1>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Thank you for your purchase. Your digital package files and lifetime access tokens have been provisioned below.
          </p>

          {order && (
            <div className="mt-6 inline-flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <span className="text-slate-400">Order Ref:</span>
              <span className="font-mono text-teal-400 font-bold">{order.orderNumber}</span>
              <button
                type="button"
                onClick={() => copyOrderNumber(order.orderNumber)}
                className="text-slate-500 hover:text-white transition-colors"
                title="Copy order number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Digital Downloads Fulfillment Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                Your Instant Digital Downloads
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click below to download your assets. You can also re-download any time from your account dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg self-start sm:self-auto font-medium">
              <ShieldCheck className="w-4 h-4" />
              Direct Supabase CDN
            </div>
          </div>

          {entitlements.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>Preparing digital download packages...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {entitlements.map((ent) => {
                const remaining = Math.max(0, ent.downloadLimit - ent.downloadCount);
                const isDownloading = downloadingId === ent.id;

                return (
                  <div
                    key={ent.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-teal-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                          Ready to Download
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Token: {ent.accessToken.substring(0, 12)}...
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{ent.productName}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>Includes: Full Prompt Database, JSON Workflows & PDF Guide</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-teal-400 font-medium">
                          {remaining} of {ent.downloadLimit} downloads remaining
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isDownloading || remaining <= 0}
                      onClick={() => handleDownload(ent)}
                      className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          Streaming...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download Package (.ZIP)
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Email Confirmation Notice */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
            <Mail className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p>
              A receipt and secure download access link have been dispatched to{' '}
              <span className="text-white font-medium">{order?.customerEmail || 'your email'}</span>. Check your spam folder if you do not see it within 2 minutes.
            </p>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800">
              Order Summary & Invoice
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-6">
              <div>
                <span className="text-slate-500 block mb-1">Customer</span>
                <span className="text-white font-semibold">{order.customerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Payment Method</span>
                <span className="text-white font-semibold uppercase">{order.paymentProvider || 'Sandbox'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Payment Status</span>
                <span className="text-teal-400 font-bold uppercase">{order.paymentStatus}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Total Paid</span>
                <span className="text-teal-400 font-bold text-sm">
                  {order.currency} ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <button
                type="button"
                onClick={() => onNavigate('/quest-dashboard')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-teal-400" />
                Go to Quest Dashboard
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/digital-products')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-bold text-xs border border-teal-500/30 transition-colors flex items-center justify-center gap-2"
              >
                Browse More Tools & Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
