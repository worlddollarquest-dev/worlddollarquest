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
    <section className="py-16 sm:py-24 border-b border-slate-900 bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Package className="w-4 h-4" />
              <span>Commercial Assets & Systems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Digital Products & Playbooks
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              High-leverage Notion systems, proposal frameworks, contract templates, and engineered prompt packs.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/digital-products')}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View Digital Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {publishedProducts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">Digital Product Vault Under Maintenance</p>
            <p className="text-xs text-slate-500 mt-1">
              New templates and prompt packages will appear here once added by the admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onNavigate(`/digital-products/${prod.slug}`)}
                className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-indigo-500/40 overflow-hidden transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                        {prod.productType}
                      </span>
                    </div>
                    {prod.salePrice && (
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Save ${(prod.price - prod.salePrice).toFixed(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {getCategoryName(prod.categoryId)}
                    </p>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {prod.shortDescription}
                    </p>

                    {/* Features list */}
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

                {/* Footer Pricing & CTA */}
                <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white font-mono">
                      ${prod.salePrice || prod.price}
                    </span>
                    {prod.salePrice && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        ${prod.price}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
