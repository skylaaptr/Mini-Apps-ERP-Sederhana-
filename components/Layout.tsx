
import React from 'react';
import { User } from '../types';
import { DashboardIcon, SalesIcon, InventoryIcon, FinancialsIcon, DocumentsIcon, LogoutIcon } from './icons';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  currentPage: string;
  onNavClick: (page: string) => void;
}

const navItems = [
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Sales', icon: SalesIcon },
  { name: 'Inventory', icon: InventoryIcon },
  { name: 'Financials', icon: FinancialsIcon },
  { name: 'Documents', icon: DocumentsIcon },
];

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, currentPage, onNavClick }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
          Mini ERP
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(item.name);
                }}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === item.name
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6 mr-3" />
                {item.name}
              </a>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
           <button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogoutIcon className="w-6 h-6 mr-3" />
                Logout
            </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
          <div>
            <span className="text-sm text-gray-600">Welcome, <span className="font-semibold text-dark">{user.username}</span></span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
