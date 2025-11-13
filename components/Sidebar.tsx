import React from 'react';
import type { ProductCategory } from '../types';

interface SidebarProps {
  productCategories: ProductCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ productCategories }) => {
  return (
    <aside className="w-80 glass-card text-gray-200 p-6 flex flex-col border-r border-white/10 overflow-y-auto animate-slideInLeft">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">Skylar</h1>
        </div>
        <h2 className="text-sm text-gray-400 font-medium tracking-wide">House of Advertisements</h2>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col space-y-6">
        {productCategories.map((category, categoryIndex) => (
          <div key={category.name} className="animate-fadeIn" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 pb-3 mb-3 border-b border-white/10">
              {category.name}
            </h3>
            <div className="flex flex-col space-y-2">
              {category.products.map((product, productIndex) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${(categoryIndex * 0.1) + (productIndex * 0.05)}s` }}
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                    <product.icon className="h-4 w-4 flex-shrink-0 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">{product.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Powered by AI</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Gemini AI Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;