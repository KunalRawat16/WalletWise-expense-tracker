import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Plus, 
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { getCategoryIcon } from '../utils/icons';
import AddExpenseModal from '../components/AddExpenseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const Expenses = () => {
  const { expenses, deleteExpense, categories, settings } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Filter and Sort Expenses
  const filteredExpenses = expenses
    .filter(exp => {
      const matchesSearch = (exp.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
      
      const expenseDate = new Date(exp.date);
      const matchesStartDate = startDate ? expenseDate >= new Date(startDate) : true;
      const matchesEndDate = endDate ? expenseDate <= new Date(endDate) : true;

      return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy, startDate, endDate]);

  const handleEditClick = (exp) => {
    setExpenseToEdit(exp);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      showToast('Expense deleted successfully!');
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
            All Expenses
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            Manage, filter, and track individual transactions.
          </p>
        </div>
        
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all text-sm self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Expense
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto items-stretch lg:items-center">
          
          {/* Date Range Filters */}
          <div className="flex gap-2 flex-1 lg:flex-none">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              title="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              title="End Date"
            />
          </div>

          {/* Category Filter */}
          <div className="relative flex-1 lg:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Sort By Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium appearance-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
            <ArrowUpDown className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Expense List Content */}
      <div className="glass-card overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/40">
                  {paginatedExpenses.map((exp) => {
                    const categoryObj = categories.find(c => c.id === exp.category) || { name: 'Other', color: '#64748b' };
                    const IconComponent = getCategoryIcon(exp.category);

                    return (
                      <tr 
                        key={exp.id} 
                        className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-xl text-white shadow-sm flex-shrink-0"
                              style={{ backgroundColor: categoryObj.color }}
                            >
                              <IconComponent className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {categoryObj.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {exp.description || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          {new Date(exp.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-black text-slate-800 dark:text-slate-100">
                          {settings.currency}{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(exp)}
                              className="p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all"
                              title="Edit Expense"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setExpenseToDelete(exp)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                              title="Delete Expense"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-200/50 dark:divide-slate-800/40">
              {paginatedExpenses.map((exp) => {
                const categoryObj = categories.find(c => c.id === exp.category) || { name: 'Other', color: '#64748b' };
                const IconComponent = getCategoryIcon(exp.category);

                return (
                  <div key={exp.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2.5 rounded-xl text-white shadow-sm flex-shrink-0"
                          style={{ backgroundColor: categoryObj.color }}
                        >
                          <IconComponent className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {exp.description || categoryObj.name}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                            {categoryObj.name} • {new Date(exp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                          {settings.currency}{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleEditClick(exp)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-emerald-500 dark:text-slate-400 transition-all"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setExpenseToDelete(exp)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 hover:text-rose-500 dark:text-slate-400 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-900/10">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Showing <span className="font-bold text-slate-800 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{filteredExpenses.length}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Previous
                  </button>
                  <div className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                     <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Page {currentPage} of {totalPages}</span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 mb-4">
              <SlidersHorizontal className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No transactions found</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find any expenses matching your criteria. Try adjusting your search query or filters.
            </p>
          </div>
        )}
      </div>

      {/* Local Modal Hook */}
      {isModalOpen && (
        <AddExpenseModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          expenseToEdit={expenseToEdit} 
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={expenseToDelete?.description || categories.find(c => c.id === expenseToDelete?.category)?.name || 'this expense'}
      />

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

export default Expenses;
