import React from 'react';
import type { ProductCategory } from '../types';

interface SidebarProps {
  productCategories: ProductCategory[];
}

const Sidebar: React.FC<SidebarProps> = ({ productCategories }) => {
  return (
    <aside
      className="w-64 bg-gray-900/60 text-gray-200 p-4 flex flex-col border-r border-gray-700/50 overflow-y-auto"
      style={{ backdropFilter: 'blur(16px)' }}
    >
      <h1 className="text-2xl font-bold text-white mb-2">Skylar</h1>
      <h2 className="text-sm text-blue-400 mb-8">House of Advertisements</h2>
      
      <nav className="flex flex-col space-y-4">
        {productCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 pb-2 mb-1">
              {category.name}
            </h3>
            <div className="flex flex-col space-y-1">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium text-gray-300"
                >
                  <product.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;