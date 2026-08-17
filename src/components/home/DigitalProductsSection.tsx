import React from 'react';
import { Package, ArrowRight, Check, Star, Download, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DigitalProductsSectionProps {
  onNavigate: (path: string) => void;
}

export const DigitalProductsSection: React.FC<DigitalProductsSectionProps> = ({ onNavigate }) => {
  const { products, categories } = useApp();

  const publishedProducts = products.filter((p) => p.status === 'published').slice(0, 3);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name : 'Digital Assets';
  };

  return (
    <section className="py-20 sm:py-28 border-b border-white/10 bg-[#080B1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Package className="w-4 h-4" />
              <span>Commercial Assets & Systems</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Curated Digital Products & Playbooks
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              High-leverage Notion systems, proposal frameworks, contract templates, and engineered prompt packs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/digital-products')}
            className="self-start md:self-auto px-6 py-3 rounded-xl btn-secondary-glass text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>View Digital Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {publishedProducts.length === 0 ? (
          <div className="p-12 text-center glass-panel rounded-3xl">
            <Package className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-200 font-bold">Digital Product Vault Under Maintenance</p>
            <p className="text-xs text-slate-400 mt-1">
              New templates and prompt packages will appear here once added by the admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate(`/digital-products/${prod.slug}`)}
                className="rounded-3xl glass-panel hover:border-indigo-500/50 hover:-translate-y-1 overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-2xl"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#050816]">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080B1A] via-[#080B1A]/20 to-transparent" />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-[#050816]/85 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
                        {prod.productType}
                      </span>
                    </div>
                    {prod.salePrice && (
                      <div className="absolute top-3.5 right-3.5">
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md">
                          Save ${(prod.price - prod.salePrice).toFixed(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-7">
                    <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      {getCategoryName(prod.categoryId)}
                    </p>
                    <h3 className="text-lg font-bold text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
                      {prod.shortDescription}
                    </p>

                    {/* Features list */}
                    <div className="mt-5 space-y-2 pt-4 border-t border-white/10">
                      {prod.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="p-7 pt-0 flex items-center justify-between border-t border-white/10 mt-4 pt-5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-white">
                        ${prod.salePrice ? prod.salePrice : prod.price}
                      </span>
                      {prod.salePrice && (
                        <span className="text-xs text-slate-500 line-through">
                          ${prod.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(`/digital-products/${prod.slug}`);
                    }}
                    className="px-4 py-2.5 rounded-xl btn-premium text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Asset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
