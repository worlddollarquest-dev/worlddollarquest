import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Zap,
  ShoppingBag,
  Download,
  FileCheck,
  Clock,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { downloadService } from '../services/downloadService';
import { SEO } from '../components/common/SEO';
import { DownloadEntitlement } from '../types';

interface QuestDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const QuestDashboardPage: React.FC<QuestDashboardPageProps> = ({ onNavigate }) => {
  const { user, quests, badges, completeQuest } = useAuth();
  const { orders } = useApp();
  const { success, showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'quests' | 'downloads'>('quests');
  const [userEntitlements, setUserEntitlements] = useState<DownloadEntitlement[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Filter orders for the current user
  const myOrders = orders.filter(
    (o) =>
      (user?.email && o.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.id && o.customerId === user.id)
  );

  useEffect(() => {
    async function loadEntitlements() {
      if (user?.email) {
        const entitlements = await downloadService.getCustomerEntitlements(user.email);
        setUserEntitlements(entitlements);
      }
    }
    loadEntitlements();
  }, [user?.email, orders]);

  const handleDownload = async (entitlement: DownloadEntitlement) => {
    setIsDownloading(entitlement.id);
    try {
      const result = await downloadService.processDownload(entitlement.accessToken);
      if (result.success) {
        showToast(`Download started for ${entitlement.productName}!`, 'success');
        setUserEntitlements((prev) =>
          prev.map((e) => (e.id === entitlement.id ? { ...e, downloadCount: e.downloadCount + 1 } : e))
        );
      } else {
        showToast(result.error || 'Failed to download.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Download error.', 'error');
    } finally {
      setIsDownloading(null);
    }
  };

  const xpProgress = ((user.xp % 500) / 500) * 100;
  const xpNeeded = 500 - (user.xp % 500);

  const handleQuestAction = (questId: string, actionUrl: string) => {
    onNavigate(actionUrl);
  };

  return (
    <>
      <SEO
        title="Quest Progression Hub & Badges"
        description="Track your digital learning journey, earn XP by mastering tools and guides, and unlock solopreneur achievement badges."
      />

      <div className="min-h-screen bg-slate-950 pb-24">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Trophy className="w-3.5 h-3.5" />
                <span>Gamified Solopreneur Progression</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                World Dollar Quest Member Hub
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Level up your digital earning capabilities, complete practical quests, and manage your purchased digital toolkits and download keys.
              </p>
            </div>
          </div>
        </section>

        {/* User Stats Card */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Avatar & Rank */}
              <div className="md:col-span-4 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl border-2 border-teal-400 object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-teal-400 text-slate-950 font-black text-[10px] font-mono">
                    LVL {user.level}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{user.name}</h2>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="md:col-span-5 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Total XP: <strong className="text-white font-mono">{user.xp.toLocaleString()}</strong></span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {xpNeeded} XP to Level {user.level + 1}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, xpProgress))}%` }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="md:col-span-3 flex md:justify-end">
                <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Daily Streak</p>
                    <p className="text-base font-black text-amber-300 font-mono">
                      {user.streakDays} Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('quests')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'quests'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              Active Quests & Badges
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('downloads')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'downloads'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              My Digital Downloads ({userEntitlements.length || myOrders.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Quests & Badges */}
        {activeTab === 'quests' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Active Quests */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      Action Checklist
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Active Quests</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {quests.filter((q) => q.isCompleted).length} / {quests.length} Completed
                  </span>
                </div>

                <div className="space-y-4">
                  {quests.map((quest) => (
                    <div
                      key={quest.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        quest.isCompleted
                          ? 'bg-slate-900/40 border-emerald-500/20'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            quest.isCompleted
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {quest.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Zap className="w-5 h-5 text-amber-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                quest.isCompleted ? 'text-slate-300 line-through' : 'text-white'
                              }`}
                            >
                              {quest.title}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                              +{quest.rewardXP} XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{quest.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {quest.isCompleted ? (
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleQuestAction(quest.id, quest.actionUrl)}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <span>Go to Quest</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges Gallery */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Credentials
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Unlocked Badges</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-between space-y-3 ${
                        badge.isUnlocked
                          ? 'bg-slate-900 border-indigo-500/30 shadow-lg'
                          : 'bg-slate-900/30 border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div
                        className={`p-4 rounded-2xl ${
                          badge.isUnlocked
                            ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
                            : 'bg-slate-950 border border-slate-800 text-slate-600'
                        }`}
                      >
                        {badge.isUnlocked ? (
                          <Award className="w-7 h-7 text-teal-400" />
                        ) : (
                          <Lock className="w-7 h-7" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {badge.description}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          badge.isUnlocked
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {badge.isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Digital Downloads */}
        {activeTab === 'downloads' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {userEntitlements.length === 0 && myOrders.length === 0 ? (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Digital Products Purchased Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                  Explore our premium prompts, automation workflows, and freelancing kits to unlock instant file downloads.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('/digital-products')}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                >
                  Browse Digital Store
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Your Purchased Download Licenses</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct access to zip packages, JSON prompt matrices, and guides.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userEntitlements.map((ent) => {
                    const remaining = Math.max(0, ent.downloadLimit - ent.downloadCount);
                    return (
                      <div
                        key={ent.id}
                        className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase">
                              License Active
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {remaining} / {ent.downloadLimit} downloads left
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white">{ent.productName}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                            <Key className="w-3.5 h-3.5 text-slate-500" />
                            <span className="font-mono text-[11px]">Token: {ent.accessToken.substring(0, 14)}...</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Expiry: 1 Year
                          </span>
                          <button
                            type="button"
                            disabled={isDownloading === ent.id || remaining <= 0}
                            onClick={() => handleDownload(ent)}
                            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            {isDownloading === ent.id ? 'Starting...' : 'Download (.ZIP)'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Past Orders Ledger */}
                {myOrders.length > 0 && (
                  <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
                    <h4 className="text-base font-bold text-white mb-4">Past Orders & Invoices</h4>
                    <div className="divide-y divide-slate-800 text-xs">
                      {myOrders.map((ord) => (
                        <div key={ord.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                {ord.paymentStatus}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString()} • {ord.paymentProvider?.toUpperCase() || 'SANDBOX'}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-teal-400">
                              {ord.currency} ${ord.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

