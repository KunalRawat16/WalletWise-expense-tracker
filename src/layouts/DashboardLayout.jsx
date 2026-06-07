import React, { useContext, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Settings, 
  Sun, 
  Moon, 
  Plus,
  Coins,
  LogOut,
  FileText
} from 'lucide-react';
import AddExpenseModal from '../components/AddExpenseModal';
import { DashboardSkeleton } from '../components/SkeletonLoading';

const DashboardLayout = () => {
  const { theme, toggleTheme, settings, logout, isLoading } = useContext(AppContext);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: Receipt },
    { name: 'Budgets & Goals', path: '/budgets', icon: Wallet },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Sidebar - Desktop only */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-10 transition-colors duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="bg-emerald-500 p-2.5 rounded-xl text-white shadow-md shadow-emerald-500/20">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              WalletWise
            </h1>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Fintech Tracker</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                  active 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500 pl-3' 
                    : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left mt-6"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            Logout
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            <Plus className="h-5 w-5" />
            Add Expense
          </button>
        </div>
      </aside>

      {/* Floating Action Button - Mobile only */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-24 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-xl shadow-emerald-500/30 z-30 transition-all hover:scale-110 active:scale-95"
        aria-label="Add Expense"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
          <div className="truncate pr-2 max-w-[50%] sm:max-w-none">
            <h2 className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500 truncate">Welcome Back</h2>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
              Hello, <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-extrabold">{settings?.userName || 'User'}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            {/* Logout */}
            <button 
              onClick={logout}
              className="hidden sm:block p-2.5 rounded-xl border border-red-200/50 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-all"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-4">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-teal-500/10 text-sm sm:text-base">
                {(settings?.userName || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{settings?.userName || 'Loading...'}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Basic Tier</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto overflow-x-hidden mb-16 md:mb-0">
          {isLoading ? <DashboardSkeleton /> : <Outlet />}
        </main>

        {/* Bottom Nav Bar - Mobile only */}
        <nav className="md:hidden sticky bottom-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 z-30 transition-colors duration-300 mt-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-all ${
                  active ? 'text-emerald-500 scale-105' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Icon className="h-5.5 w-5.5" />
                <span>{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Global Add/Edit Modal */}
      {isModalOpen && (
        <AddExpenseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl font-medium text-sm flex items-center gap-3 border border-slate-700">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
