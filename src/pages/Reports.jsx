import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  PieChart, 
  TrendingUp, 
  List,
  FileSpreadsheet
} from 'lucide-react';
import { getCategoryIcon } from '../utils/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const { expenses, categories, settings } = useContext(AppContext);

  // States for filters
  const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'yearly'
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Derive filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      if (reportType === 'monthly') {
        return expDate.getMonth() === parseInt(selectedMonth) && expDate.getFullYear() === parseInt(selectedYear);
      } else {
        return expDate.getFullYear() === parseInt(selectedYear);
      }
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, reportType, selectedMonth, selectedYear]);

  // Calculations
  const totalSpent = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTransactions = filteredExpenses.length;
  
  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredExpenses.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return Object.entries(map)
      .map(([id, amount]) => {
        const cat = categories.find(c => c.id === id) || { name: 'Other', color: '#64748b' };
        return { id, name: cat.name, color: cat.color, amount };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, categories]);

  const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  // EXPORT TO CSV
  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) return;

    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const csvRows = [headers.join(',')];

    filteredExpenses.forEach(exp => {
      const cat = categories.find(c => c.id === exp.category);
      const row = [
        exp.date,
        `"${cat ? cat.name : 'Unknown'}"`,
        `"${(exp.description || '').replace(/"/g, '""')}"`,
        exp.amount
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `WalletWise_Report_${reportType}_${reportType === 'monthly' ? selectedMonth + 1 : selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // EXPORT TO PDF
  const handleExportPDF = () => {
    if (filteredExpenses.length === 0) return;

    const doc = new jsPDF();
    const title = reportType === 'monthly' 
      ? `WalletWise Monthly Report: ${new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      : `WalletWise Yearly Report: ${selectedYear}`;

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Total Spent: ${settings.currency}${totalSpent.toLocaleString()}`, 14, 32);
    doc.text(`Total Transactions: ${totalTransactions}`, 14, 38);
    if (topCategory) {
      doc.text(`Top Category: ${topCategory.name} (${settings.currency}${topCategory.amount.toLocaleString()})`, 14, 44);
    }

    const tableColumn = ["Date", "Category", "Description", `Amount (${settings.currency})`];
    const tableRows = [];

    filteredExpenses.forEach(exp => {
      const cat = categories.find(c => c.id === exp.category);
      const row = [
        exp.date,
        cat ? cat.name : 'Unknown',
        exp.description || '-',
        exp.amount.toLocaleString()
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 52,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [16, 185, 129] } // Emerald-500
    });

    doc.save(`WalletWise_Report_${reportType}_${reportType === 'monthly' ? selectedMonth + 1 : selectedYear}.pdf`);
  };

  // Year options (last 5 years)
  const years = Array.from({length: 5}, (_, i) => today.getFullYear() - i);
  // Month options
  const months = Array.from({length: 12}, (_, i) => {
    return new Date(2000, i, 1).toLocaleDateString('default', { month: 'long' });
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-500" />
            Financial Reports
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
            Generate and export custom spending reports.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredExpenses.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={handleExportPDF}
            disabled={filteredExpenses.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setReportType('monthly')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
              reportType === 'monthly' 
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setReportType('yearly')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
              reportType === 'yearly' 
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto ml-auto">
          {reportType === 'monthly' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 sm:flex-none"
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>
          )}
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex-1 sm:flex-none"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Spent</p>
              <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">
                {settings.currency}{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transactions</p>
              <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white">
                {totalTransactions}
              </h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
              <List className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Category</p>
              <h3 className="text-xl font-black mt-1 text-slate-800 dark:text-white truncate max-w-[120px]">
                {topCategory ? topCategory.name : 'N/A'}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <PieChart className="h-5 w-5" />
            </div>
          </div>
          {topCategory && (
            <p className="text-xs text-slate-500 mt-2 font-semibold">
              {settings.currency}{topCategory.amount.toLocaleString()} spent
            </p>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            Transaction History
          </h3>
        </div>
        
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredExpenses.map((exp) => {
                  const categoryObj = categories.find(c => c.id === exp.category) || { name: 'Other', color: '#64748b' };
                  const IconComponent = getCategoryIcon(exp.category);

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-medium">
                        {new Date(exp.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-1.5 rounded-md text-white"
                            style={{ backgroundColor: categoryObj.color }}
                          >
                            <IconComponent className="h-3 w-3" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {categoryObj.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {exp.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-black text-slate-800 dark:text-slate-200">
                        {settings.currency}{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 dark:text-slate-500">
            <p className="font-semibold">No transactions found for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
