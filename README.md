# WalletWise - Modern Expense Tracker 💸

WalletWise is a full-stack, production-ready personal finance application designed to help you track expenses, manage budgets, and gain intelligent AI insights into your spending habits.

## 🚀 Features

*   **Secure Authentication**: JWT-based user authentication system.
*   **Intelligent Dashboard**: Real-time insights, spending velocity alerts, and AI savings recommendations.
*   **Comprehensive Tracking**: Add, edit, and categorize your daily expenses seamlessly.
*   **Dynamic Budgeting**: Set category-specific monthly budgets and track your utilization with visual progress bars.
*   **Advanced Reports**: Filter transactions by month/year and export professional data in CSV and PDF formats.
*   **Dark Mode**: Native, beautiful dark mode support with system-preference detection.
*   **Responsive Design**: A fluid layout that works beautifully across mobile, tablet, and desktop displays.

## 🛠 Tech Stack

**Frontend:**
*   React.js
*   Vite
*   Tailwind CSS (Styling)
*   Recharts (Data Visualization)
*   React Router (Navigation)
*   Lucide React (Icons)
*   jsPDF & jsPDF-AutoTable (PDF Generation)

**Backend:**
*   Node.js & Express.js
*   PostgreSQL
*   JSON Web Tokens (JWT)
*   Bcrypt (Password Hashing)

## 🏁 Getting Started

### Prerequisites
*   Node.js installed on your machine.
*   PostgreSQL server running locally.

### 1. Database Setup
1. Create a PostgreSQL database named `walletwise`.
2. Locate the `backend/database/schema.sql` file.
3. Run the SQL script against your database to automatically create the required tables (`users`, `categories`, `expenses`, `budgets`, `goals`).

### 2. Start the Backend Server
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (defaults to port 5000):
   ```bash
   node server.js
   ```

### 3. Start the Frontend App
1. Open a new terminal in the root project directory:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:5173` in your browser.

## 🔒 Security & Performance
*   **Error Boundaries**: Catches component-level crashes and prevents white-screens-of-death.
*   **Skeleton Loading**: Seamless loading states utilizing `Suspense` and manual `isLoading` contexts to prevent layout shift.
*   **Optimized Rendering**: Extensive use of `useMemo` for complex chart and report calculations to ensure 60fps scrolling and interacting.

---
*Built with modern web standards to provide the best financial tracking experience.*
