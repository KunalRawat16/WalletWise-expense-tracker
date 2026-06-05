import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  User, 
  Coins, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings, resetMockData } = useContext(AppContext);
  const [userName, setUserName] = useState(settings.userName);
  const [currency, setCurrency] = useState(settings.currency);
  const [savedStatus, setSavedStatus] = useState(false);

  const currencies = [
    { symbol: '₹', name: 'Indian Rupee (INR)' },
    { symbol: '$', name: 'US Dollar (USD)' },
    { symbol: '€', name: 'Euro (EUR)' },
    { symbol: '£', name: 'British Pound (GBP)' },
    { symbol: '¥', name: 'Yen (JPY)' }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({ userName, currency });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data? This will overwrite your custom expenses, budgets, and goals with the default demo entries.")) {
      resetMockData();
      // Reload states
      setUserName(settings.userName);
      setCurrency(settings.currency);
      // Force reload to pick up localstorage defaults
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
          Settings
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
          Customize currency, profiles, and reset simulation data.
        </p>
      </div>

      {/* Profile & Currency settings card */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <User className="h-4.5 w-4.5 text-emerald-500" />
          General Profile Settings
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* User Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Profile Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {currencies.map((curr) => (
                  <option key={curr.symbol} value={curr.symbol} className="dark:bg-slate-900">
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm"
            >
              Save Profile
            </button>
            
            {savedStatus && (
              <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 animate-pulse">
                <ShieldCheck className="h-4.5 w-4.5" /> Settings Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Database control card */}
      <div className="glass-card p-6 space-y-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
          <RefreshCw className="h-4.5 w-4.5 text-amber-500" />
          Maintenance and Data Controls
        </h3>

        <div className="space-y-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
            Resetting the local database removes your custom changes and restores the high-fidelity sandbox dashboard with default transactions, budgets, and savings goals.
          </p>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 border border-amber-500/30 hover:bg-amber-500/5 text-amber-600 dark:text-amber-400 font-bold py-2.5 px-4 rounded-xl transition-all text-xs"
          >
            <RefreshCw className="h-4 w-4 animate-spin-hover" />
            Reset to default demo data
          </button>
        </div>
      </div>

      {/* AI Premium Highlights Card */}
      <div className="glass-card p-6 space-y-4 bg-gradient-to-br from-emerald-500/[0.03] to-teal-500/[0.03]">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
          Startup Roadmap Features (Simulated)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">OCR Receipt Scanner</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-1 font-medium">
              OCR extraction utilizes AWS Textract to parse amount, vendor name, and product items automatically.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Recurring Expenses Sync</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-1 font-medium">
              Checks recurring bank statements or utility bills and schedules them as automatic items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
