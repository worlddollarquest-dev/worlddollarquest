import React, { useState } from 'react';
import { Package, Search, Filter, Check, ArrowRight, Download, Star, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/common/SEO';

interface DigitalProductsPageProps {
  onNavigate: (path: string) => void;
}

export const DigitalProductsPage: React.FC<DigitalProductsPageProps> = ({ onNavigate }) => {
  const { products, categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const productCategories = categories.filter((c) => c.type === 'product');

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' || prod.categoryId === selectedCategory;
    const matchesType =
      selectedType === 'all' || prod.productType === selectedType;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesType && matchesSearch && prod.status === 'published';
  });

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Digital Products';
  };

  return (
    <>
      <SEO
        title="Curated Digital Products & Operating Systems"
        description="High-utility downloadable Notion systems, prompt databases, client acquisition playbooks, and freelancing proposal templates."
      />

      <div className="min-h-screen bg-slate-950 pb-20">
        {/* Hero Header */}
        <section className="pt-12 pb-14 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-[#090d16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Package className="w-3.5 h-3.5" />
                <span>Instant Digital Delivery • Lifetime Updates</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Digital Products & Freelance Operating Systems
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Save dozens of hours with production-ready Notion dashboards, engineered prompt vaults, client contract agreements, and outreach playbooks.
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Catalog Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            {/* Category selection */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Categories
              </button>
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, prompt packs..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl">
              <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-300 font-medium">No matching products found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search query or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onNavigate(`/digital-products/${prod.slug}`)}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/40 overflow-hidden transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Header preview image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                          {prod.productType}
                        </span>
                      </div>
                      {prod.salePrice && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Save ${(prod.price - prod.salePrice).toFixed(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body content */}
                    <div className="p-6">
                      <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                        {getCategoryName(prod.categoryId)}
                      </p>
                      <h3 className="text-lg font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                        {prod.shortDescription}
                      </p>

                      {/* Feature Highlights */}
                      <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-800/60">
                        {prod.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                            <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-white font-mono">
                        ${prod.salePrice || prod.price}
                      </span>
                      {prod.salePrice && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ${prod.price}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};
