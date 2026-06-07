import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // Helper to safely parse local storage
  const loadFromStorage = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage`, e);
      return fallback;
    }
  };

  // State initialization
  const [currentUser, setCurrentUser] = useState(loadFromStorage('walletwise_user', null));
  const [isLoading, setIsLoading] = useState(true);
  
  const [expenses, setExpenses] = useState(loadFromStorage('walletwise_expenses', []));
  const [budgets, setBudgets] = useState(loadFromStorage('walletwise_budgets', {}));
  const [goals, setGoals] = useState(loadFromStorage('walletwise_goals', []));
  
  const [settings, setSettings] = useState(loadFromStorage('walletwise_settings', {
    currency: '$',
    dateFormat: 'MM/DD/YYYY',
    userName: currentUser?.name || 'User'
  }));
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Hardcoded default categories for Local Storage version
  const [categories] = useState([
    { id: 'housing', name: 'Housing & Rent', color: '#3b82f6' },
    { id: 'food', name: 'Food & Dining', color: '#ef4444' },
    { id: 'transportation', name: 'Transportation', color: '#f59e0b' },
    { id: 'utilities', name: 'Utilities', color: '#06b6d4' },
    { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6' },
    { id: 'shopping', name: 'Shopping', color: '#ec4899' },
    { id: 'health', name: 'Health & Medical', color: '#10b981' }
  ]);

  // Apply theme and persist changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist data whenever it changes
  useEffect(() => {
    localStorage.setItem('walletwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('walletwise_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('walletwise_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('walletwise_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('walletwise_user', JSON.stringify(currentUser));
      setSettings(prev => ({ ...prev, userName: currentUser.name }));
    } else {
      localStorage.removeItem('walletwise_user');
    }
  }, [currentUser]);

  // Simulate loading sequence for skeletons
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Fake 800ms delay to show skeletons
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Auth Methods (Mock Local Storage System)
  const login = async (email, password) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        // Extremely basic mock auth
        if (email && password) {
          const userObj = { id: 'user_1', name: email.split('@')[0], email };
          setCurrentUser(userObj);
          navigate('/');
          resolve(true);
        } else {
          reject(new Error("Invalid Credentials"));
        }
      }, 600);
    });
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (name && email && password) {
          const userObj = { id: 'user_' + Date.now(), name, email };
          setCurrentUser(userObj);
          navigate('/');
          resolve(true);
        } else {
          reject(new Error("Missing Fields"));
        }
      }, 600);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  // Expense Methods
  const addExpense = (expense) => {
    const newExp = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [newExp, ...prev]);
  };

  const editExpense = (id, updatedExpense) => {
    setExpenses(prev => prev.map(exp => (exp.id === id ? { ...exp, ...updatedExpense } : exp)));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  // Budget Methods
  const updateBudget = (categoryId, amount) => {
    setBudgets(prev => ({ ...prev, [categoryId]: parseFloat(amount) }));
  };

  // Goals Methods
  const addGoal = (goal) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals(prev => [...prev, newGoal]);
  };
  const updateGoalProgress = (id, newAmount) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: newAmount } : g));
  };
  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetMockData = () => {
    localStorage.removeItem('walletwise_expenses');
    localStorage.removeItem('walletwise_budgets');
    localStorage.removeItem('walletwise_goals');
    setExpenses([]);
    setBudgets({});
    setGoals([]);
  };


  return (
    <AppContext.Provider value={{
      currentUser, // Exporting as currentUser so ProtectedRoutes work
      isLoading,
      login,
      signup,
      logout,
      expenses,
      addExpense,
      editExpense,
      deleteExpense,
      budgets,
      updateBudget,
      categories,
      goals,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      settings,
      setSettings,
      updateSettings,
      resetMockData,
      theme,
      toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};
