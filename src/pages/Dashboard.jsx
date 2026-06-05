import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { 
  TrendingUp, 
  ArrowUpRight, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  Lightbulb,
  Receipt,
  Eye
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { getCategoryIcon } from '../utils/icons';

const Dashboard = () => {
  const { expenses, budgets, settings, categories } = useContext(AppContext);

  // Get current month details
  const today = useMemo(() => new Date(), []);
  const currentMonthNum = today.getMonth();
  const currentYearNum = today.getFullYear();
  const monthName = today.toLocaleDateString('default', { month: 'long' });

  // Filter current month expenses
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonthNum && expDate.getFullYear() === currentYearNum;
    });
  }, [expenses, currentMonthNum, currentYearNum]);

  // Calculations
  const totalSpending = useMemo(() => currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0), [currentMonthExpenses]);
  const totalBudget = useMemo(() => Object.values(budgets).reduce((sum, val) => sum + val, 0), [budgets]);
  const budgetUtilization = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;
  const totalTransactions = currentMonthExpenses.length;

  // Category summary for Donut Chart
  const categoryData = useMemo(() => {
    return categories.map(cat => {
      const amount = currentMonthExpenses
        .filter(exp => exp.category === cat.id)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return {
        name: cat.name,
        value: amount,
        color: cat.color
      };
    }).filter(data => data.value > 0);
  }, [categories, currentMonthExpenses]);

  // Daily trend data for current month (up to current day)
  const dailyTrendData = useMemo(() => {
    const trend = [];
    const currentDay = today.getDate();
    for (let i = 1; i <= currentDay; i++) {
      const dayStr = `${currentYearNum}-${String(currentMonthNum + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayAmount = expenses
        .filter(exp => exp.date === dayStr)
        .reduce((sum, exp) => sum + exp.amount, 0);
      
      const formattedDate = new Date(currentYearNum, currentMonthNum, i).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      trend.push({
        day: formattedDate,
        amount: dayAmount
      });
    }
    return trend;
  }, [expenses, today, currentYearNum, currentMonthNum]);

  // Monthly trend data for last 6 months
  const monthlyTrendData = useMemo(() => {
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYearNum, currentMonthNum - i, 1);
      const mNum = d.getMonth();
      const yNum = d.getFullYear();
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
      
      const monthAmount = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === mNum && expDate.getFullYear() === yNum;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
        
      trend.push({
        month: monthStr,
        amount: monthAmount
      });
    }
    return trend;
  }, [expenses, currentYearNum, currentMonthNum]);

  // Find highest spending category
  const highestSpend = [...categoryData].sort((a, b) => b.value - a.value)[0];

  // Recent transactions (latest 5 overall)
  const recentTransactions = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  // AI Spending Insight Engine
  const getAIInsight = () => {
    if (totalBudget === 0 && totalSpending === 0) {
      return {
        text: `Welcome! Start by setting up a monthly budget and logging your first expense to unlock personalized AI insights.`,
        type: 'success'
      };
    }

    const currentDay = today.getDate();
    const daysInMonth = new Date(currentYearNum, currentMonthNum + 1, 0).getDate();
    const monthProgress = currentDay / daysInMonth;
    const expectedSpendVelocity = totalBudget * monthProgress;

    // 1. Critical Budget Overrun
    if (budgetUtilization >= 100) {
      return {
        text: `Alert: You have exceeded your monthly budget by ${settings.currency}${(totalSpending - totalBudget).toFixed(0)}. Immediate spending freeze recommended on non-essential categories.`,
        type: 'danger'
      };
    } 
    // 2. High Velocity Warning (Spending too fast early in the month)
    else if (totalSpending > expectedSpendVelocity * 1.3) {
      return {
        text: `Velocity Alert: You've spent ${budgetUtilization.toFixed(0)}% of your budget, but we are only ${(monthProgress * 100).toFixed(0)}% through the month. Slow down spending.`,
        type: 'warning'
      };
    }
    // 3. Category Imbalance
    else if (highestSpend && highestSpend.value > totalBudget * 0.4) {
      return {
        text: `Category Imbalance: ${highestSpend.name} consumes ${((highestSpend.value / totalSpending) * 100).toFixed(0)}% of your monthly spend. Consider setting a strict micro-budget for this category.`,
        type: 'warning'
      };
    } 
    // 4. Positive Reinforcement
    else {
      return {
        text: `Excellent pacing! You are spending below your expected daily average. You are projected to save ${settings.currency}${(totalBudget - (totalSpending / monthProgress)).toFixed(0)} this month.`,
        type: 'success'
      };
    }
  };

  const aiInsight = getAIInsight();

  // Dynamic Savings Recommendations
  const getSavingsRecommendation = () => {
    if (!highestSpend) return `Start logging expenses to receive tailored savings strategies based on your habits.`;
    
    const catName = highestSpend.name.toLowerCase();
    if (catName.includes('food') || catName.includes('dining')) {
      return `Try meal prepping on Sundays. Cooking at home 3 more times a week could save you up to ${settings.currency}${(highestSpend.value * 0.25).toFixed(0)} this month.`;
    } else if (catName.includes('transport')) {
      return `Consider carpooling, public transit, or grouping errands to cut down on transportation costs by ~15%.`;
    } else if (catName.includes('shopping') || catName.includes('entertainment')) {
      return `Implement a '48-hour rule' for non-essential purchases. Wait two days before checking out your online carts.`;
    } else if (catName.includes('utility') || catName.includes('housing')) {
      return `Audit your monthly subscriptions and negotiate utility rates. Small fixed-cost reductions compound significantly over the year.`;
    }
    return `Try setting up an automated "Save-the-Change" policy to sweep remaining budget into your Emergency Fund.`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Insight */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm transition-all duration-300 ${
        aiInsight.type === 'danger' 
          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/30 text-red-800 dark:text-red-300'
          : aiInsight.type === 'warning'
          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30 text-amber-800 dark:text-amber-300'
          : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300'
      }`}>
        <div className={`p-2 rounded-xl ${
          aiInsight.type === 'danger'
            ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
            : aiInsight.type === 'warning'
            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
        }`}>
          {aiInsight.type === 'danger' ? <AlertTriangle className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-xs uppercase tracking-wider mb-0.5">WalletWise Spending Insight</h4>
          <p className="text-sm font-medium leading-relaxed">{aiInsight.text}</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Spending */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Spend this Month</p>
              <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
                {settings.currency}{totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>Active in {monthName}</span>
          </div>
        </div>

        {/* Budget Target & Utilization */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Remaining Budget</p>
              <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
                {settings.currency}{(totalBudget - totalSpending).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${
              budgetUtilization > 90 
                ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}>
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>Limit: {settings.currency}{totalBudget.toLocaleString()}</span>
              <span>{budgetUtilization.toFixed(0)}% used</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUtilization > 90 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Transactions</p>
              <h3 className="text-2xl font-black mt-2 text-slate-800 dark:text-white">
                {totalTransactions}
              </h3>
            </div>
            <div className="p-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>Avg. per expense:</span>
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {settings.currency}{totalTransactions > 0 ? (totalSpending / totalTransactions).toFixed(0) : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Spending Trend (Area Chart) */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <span>Daily Spending Trend</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full font-medium uppercase tracking-normal">
              {monthName}
            </span>
          </h3>
          <div className="h-72 w-full flex-1 min-h-[250px] sm:min-h-[280px]">
            {dailyTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" className="hidden dark:block" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgb(15, 23, 42)', 
                      borderRadius: '12px',
                      color: 'white',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                    labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No spending data for this month yet.
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown (Donut Chart) */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
            Category Breakdown
          </h3>
          <div className="h-72 w-full flex-1 flex flex-col justify-center min-h-[250px] sm:min-h-[280px]">
            {categoryData.length > 0 ? (
              <>
                <div className="relative flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${settings.currency}${value.toLocaleString()}`, 'Spent']}
                        contentStyle={{ 
                          backgroundColor: 'rgb(15, 23, 42)', 
                          borderRadius: '12px',
                          color: 'white',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Spent</span>
                    <span className="text-lg font-black text-slate-800 dark:text-white">
                      {settings.currency}{totalSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4 max-h-24 overflow-y-auto pr-1">
                  {categoryData.slice(0, 4).map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                        {entry.name}
                      </span>
                    </div>
                  ))}
                  {categoryData.length > 4 && (
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 col-span-2 text-center pt-1 font-semibold">
                      + {categoryData.length - 4} more categories
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No categories to display.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="glass-card p-6 flex flex-col">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 uppercase tracking-wider">
          Monthly Spending Overview (Last 6 Months)
        </h3>
        <div className="h-72 w-full min-h-[250px] sm:min-h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" className="hidden dark:block" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(148, 163, 184, 0.1)'}}
                contentStyle={{ 
                  backgroundColor: 'rgb(15, 23, 42)', 
                  borderRadius: '12px',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }} 
                labelStyle={{ fontWeight: 'bold', fontSize: '12px', color: '#3b82f6' }}
                formatter={(value) => [`${settings.currency}${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Spent']}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions & Quick Goal Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="glass-card p-6 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Recent Transactions
            </h3>
            <Link 
              to="/expenses" 
              className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View All
            </Link>
          </div>

          <div className="space-y-3.5 flex-1">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((exp) => {
                const categoryObj = categories.find(c => c.id === exp.category) || { name: 'Other', color: '#64748b' };
                const IconComponent = getCategoryIcon(exp.category);
                
                return (
                  <div 
                    key={exp.id} 
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-800 transition-all bg-slate-50/30 dark:bg-slate-900/20"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div 
                        className="p-2.5 rounded-xl text-white shadow-sm flex-shrink-0"
                        style={{ backgroundColor: categoryObj.color }}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                          {exp.description || categoryObj.name}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                          {categoryObj.name} • {new Date(exp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-black text-slate-800 dark:text-slate-100 ml-4">
                      -{settings.currency}{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm py-12">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>

        {/* System Diagnostics / Fast Stats */}
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5 uppercase tracking-wider">
            Quick Analysis
          </h3>
          <div className="space-y-4 flex-1">
            {/* Highest Spending Category */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Highest Spending Area</p>
              {highestSpend ? (
                <div className="mt-2.5 flex justify-between items-center">
                  <div>
                    <h4 className="text-base font-black text-slate-800 dark:text-white truncate max-w-[120px] sm:max-w-[150px]">{highestSpend.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Total spent this month</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-rose-500">
                      {settings.currency}{highestSpend.value.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {((highestSpend.value / totalSpending) * 100).toFixed(0)}% of total
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">No category spends yet.</p>
              )}
            </div>

            {/* Savings Goal Progress */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-3 w-3 text-amber-500" />
                AI Savings Recommendation
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 font-medium">
                {getSavingsRecommendation()}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-emerald-800 dark:text-emerald-400 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider">Premium Mode</p>
                <p className="text-xs font-medium mt-0.5">Try multi-device cloud sync</p>
              </div>
              <button className="text-xs bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/10">
                Go Cloud
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
