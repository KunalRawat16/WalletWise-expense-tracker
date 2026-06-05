import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Target, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { getCategoryIcon } from '../utils/icons';

const Budgets = () => {
  const { 
    expenses, 
    budgets, 
    updateBudget, 
    goals, 
    addGoal, 
    updateGoalProgress, 
    deleteGoal, 
    categories, 
    settings 
  } = useContext(AppContext);

  // States for Goal creation
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  // States for Budget editing
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [tempBudgetAmount, setTempBudgetAmount] = useState('');

  // States for adding funds to goals
  const [selectedGoalForFunds, setSelectedGoalForFunds] = useState(null);
  const [addFundAmount, setAddFundAmount] = useState('');

  // Pre-calculate current month expenses per category using useMemo
  const currentMonthCategorySpending = useMemo(() => {
    const today = new Date();
    const currentMonthNum = today.getMonth();
    const currentYearNum = today.getFullYear();
    
    return expenses.reduce((acc, exp) => {
      const expDate = new Date(exp.date);
      if (expDate.getMonth() === currentMonthNum && expDate.getFullYear() === currentYearNum) {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      }
      return acc;
    }, {});
  }, [expenses]);

  const getCategorySpending = (categoryId) => {
    return currentMonthCategorySpending[categoryId] || 0;
  };

  const handleEditBudget = (catId, currentVal) => {
    setEditingBudgetId(catId);
    setTempBudgetAmount(currentVal);
  };

  const handleSaveBudget = (catId) => {
    updateBudget(catId, tempBudgetAmount);
    setEditingBudgetId(null);
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;

    addGoal({
      name: goalName,
      target: parseFloat(goalTarget),
      current: parseFloat(goalCurrent) || 0,
      deadline: goalDeadline || null
    });

    // Reset Form
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDeadline('');
    setIsGoalModalOpen(false);
  };

  const handleAddFunds = (e) => {
    e.preventDefault();
    if (!selectedGoalForFunds || !addFundAmount) return;

    const newAmount = selectedGoalForFunds.current + parseFloat(addFundAmount);
    updateGoalProgress(selectedGoalForFunds.id, Math.min(newAmount, selectedGoalForFunds.target));
    
    setSelectedGoalForFunds(null);
    setAddFundAmount('');
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Monthly Budgets */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Monthly Budgets
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            Allocate monthly spending targets per category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const spending = getCategorySpending(cat.id);
            const budget = budgets[cat.id] || 0;
            const utilization = budget > 0 ? (spending / budget) * 100 : 0;
            const IconComponent = getCategoryIcon(cat.id);
            const isEditing = editingBudgetId === cat.id;

            return (
              <div key={cat.id} className="glass-card p-5 space-y-4 flex flex-col justify-between">
                <div>
                  {/* Category Title & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl text-white shadow-sm"
                        style={{ backgroundColor: cat.color }}
                      >
                        <IconComponent className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {cat.name}
                      </span>
                    </div>

                    {/* Action Button */}
                    {!isEditing ? (
                      <button 
                        onClick={() => handleEditBudget(cat.id, budget)}
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        title="Edit Budget"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSaveBudget(cat.id)}
                          className="px-2.5 py-1 text-xs font-bold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingBudgetId(null)}
                          className="px-2.5 py-1 text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Budget input or read-only values */}
                  <div className="mt-4 flex justify-between items-baseline">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spent</p>
                      <p className="text-base font-black text-slate-800 dark:text-slate-200">
                        {settings.currency}{spending.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Limit</p>
                      {isEditing ? (
                        <input
                          type="number"
                          value={tempBudgetAmount}
                          onChange={(e) => setTempBudgetAmount(e.target.value)}
                          className="w-20 px-2 py-0.5 mt-1 border border-slate-300 dark:border-slate-700 bg-transparent text-right text-sm font-bold rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      ) : (
                        <p className="text-base font-black text-slate-500 dark:text-slate-400">
                          {settings.currency}{budget.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>{utilization.toFixed(0)}% Utilized</span>
                    {budget > 0 && spending > budget && (
                      <span className="text-rose-500 flex items-center gap-1 font-bold animate-pulse">
                        <AlertCircle className="h-3 w-3" /> Overspent
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        utilization > 100 
                          ? 'bg-rose-500' 
                          : utilization > 80 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Savings Goals */}
      <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Savings Goals
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
              Set milestones and track progress for long-term items.
            </p>
          </div>

          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-sm self-start sm:self-auto"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Goal
          </button>
        </div>

        {/* Goals cards grid */}
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const progressPct = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
              return (
                <div key={goal.id} className="glass-card p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Goal Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{goal.name}</h4>
                        {goal.deadline && (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                            Target: {new Date(goal.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Progress details */}
                    <div className="flex justify-between items-baseline pt-2">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saved</p>
                        <span className="text-lg font-black text-emerald-500">
                          {settings.currency}{goal.current.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target</p>
                        <span className="text-sm font-black text-slate-600 dark:text-slate-400">
                          {settings.currency}{goal.target.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar & Add funds */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progressPct, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-wider">
                        {progressPct.toFixed(0)}% Completed
                      </p>
                    </div>

                    {/* Quick Deposit button */}
                    <button
                      onClick={() => setSelectedGoalForFunds(goal)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card text-center py-12 px-4">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 mb-3">
              <Target className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No savings goals yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Goal" to set target targets.</p>
          </div>
        )}
      </div>

      {/* Goal Creator Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsGoalModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Create Savings Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New iPhone, House Downpayment"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Amount</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="50000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Starting Saved</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Date</label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-colors text-sm"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {selectedGoalForFunds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedGoalForFunds(null)} />
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Add Funds</h3>
              <button onClick={() => setSelectedGoalForFunds(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Depositing funds into <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedGoalForFunds.name}</span>.
            </p>
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount to Add</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedGoalForFunds.target - selectedGoalForFunds.current}
                  placeholder="e.g. 5000"
                  value={addFundAmount}
                  onChange={(e) => setAddFundAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-colors text-sm"
              >
                Deposit Funds
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
