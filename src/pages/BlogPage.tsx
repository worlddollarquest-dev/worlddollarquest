import React, { useState } from 'react';
import { BookOpen, Search, Clock, ArrowRight, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/common/SEO';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const { blogPosts, categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const articleCategories = categories.filter((c) => c.type === 'article');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.categoryId === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch && post.status === 'published';
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Guides';
  };

  return (
    <>
      <SEO
        title="Editorial Guides & Case Studies"
        description="In-depth breakdowns on remote client acquisition, prompt engineering architectures, digital asset packaging, and sustainable online earning."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Header Hero */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>World Dollar Quest Editorial Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Practical Playbooks & In-Depth Guides
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Actionable frameworks, real-world case studies, and field notes designed to help you navigate modern digital work and remote economics.
              </p>
            </div>
          </div>
        </section>

        {/* Filter and Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Topics
              </button>
              {articleCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles and topics..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigate(`/blog/${post.slug}`)}
                className="rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-teal-500/40 overflow-hidden transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-950/80 text-teal-300 border border-teal-500/30">
                        {getCategoryName(post.categoryId)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{post.readingTime}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{post.author.name}</span>
                  </span>
                  <span className="text-xs font-bold text-teal-400 group-hover:text-teal-300 flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
