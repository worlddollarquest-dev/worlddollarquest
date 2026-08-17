import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SEO } from '../components/common/SEO';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const { blogPosts, categories } = useApp();
  const { completeQuest, addXP } = useAuth();
  const { success } = useToast();
  const [claimedXP, setClaimedXP] = useState(false);

  const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];
  const category = categories.find((c) => c.id === post?.categoryId);

  const handleClaimReadingReward = () => {
    if (claimedXP) return;
    setClaimedXP(true);
    addXP(150);
    completeQuest('quest-01');
    success('Quest XP Claimed!', '+150 XP awarded for deep-reading editorial content.');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Link Copied!', 'Article URL copied to clipboard.');
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center">
        <p className="text-white">Article not found.</p>
        <button
          type="button"
          onClick={() => onNavigate('/blog')}
          className="mt-4 px-4 py-2 bg-teal-500 text-slate-950 rounded-xl text-xs font-bold"
        >
          &larr; Back to Guides
        </button>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        ogImage={post.coverImage}
        type="article"
      />

      <div className="min-h-screen bg-slate-950 pb-24">
        {/* Top Breadcrumbs */}
        <div className="border-b border-slate-900 bg-slate-950/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('/blog')}
              className="hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Guides</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="hover:text-teal-400 flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Category & Title */}
          <div className="space-y-4 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              {category?.name || 'Guide'}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                />
                <div>
                  <p className="text-white font-semibold">{post.author.name}</p>
                  <p className="text-[11px] text-slate-500">{post.author.role}</p>
                </div>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{post.readingTime} read</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Hero Cover Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 mb-10 shadow-2xl">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="text-xl sm:text-2xl font-bold text-white pt-6 pb-2 border-b border-slate-800"
                  >
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg font-bold text-teal-300 pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const listItems = paragraph.split('\n');
                return (
                  <ul key={index} className="space-y-2 pl-4 list-disc text-slate-300">
                    {listItems.map((item, idx) => (
                      <li key={idx}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Gamified Quest XP Completion Box */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Knowledge Quest Reward</span>
              </div>
              <h3 className="text-lg font-bold text-white">Finished reading this guide?</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Claim +150 XP towards your World Dollar Quest level and unlock platform achievements.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClaimReadingReward}
              disabled={claimedXP}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition-all shrink-0 flex items-center gap-2 shadow-lg ${
                claimedXP
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
              }`}
            >
              {claimedXP ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>XP Claimed (+150 XP)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Claim 150 Quest XP</span>
                </>
              )}
            </button>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-slate-800">
            {post.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400"
              >
                #{t}
              </span>
            ))}
          </div>
        </article>
      </div>
    </>
  );
};
