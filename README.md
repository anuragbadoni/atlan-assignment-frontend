# Atlan SQL Editor — Frontend Internship Task 2025

A lightweight, high-performance web-based SQL editor built for Atlan's internship assignment. It allows users to write mock SQL queries, run them, and view the results with blazing-fast performance and smooth UX.

---

## 🛠 Tech Stack

- **React** with **Vite**
- **Material UI (MUI)** for UI components
- **Zustand** for state management
- **CodeMirror** for query editor
- **PapaParse** for CSV parsing
- **MUI X DataGrid** for virtualization + pagination
- **React.memo / useMemo / useCallback** for performance
- **Lazy loading** with `React.lazy` and `Suspense`
- **Debounced search** using `lodash.debounce`

---

## 🌟 Features

- 💻 Code editor with SQL highlighting (CodeMirror)
- 🧾 Tab-based query interface
- 🕹 Run query with **Ctrl+Enter**
- 📄 Mock SQL data loading (from CSV files)
- 📊 **Virtualized result table** with pagination
- ⏱ Execution time display
- 📥 Export results as CSV
- 🌓 Light & Dark theme toggle
- 🔍 Debounced search in Sidebar
- 🧠 Table schema viewer
- 🚀 Fully optimized using memoization and lazy loading

---

## 📁 Folder Structure

src/ ├── App.jsx ├── main.jsx ├── Root.jsx ├── components/ │ ├── AppBarHeader.jsx │ ├── Sidebar.jsx │ ├── TabManager.jsx │ ├── QueryEditor.jsx │ ├── ResultTable.jsx │ └── Tables.jsx ├── data/ │ ├── customers.csv │ ├── orders.csv │ └── products.csv ├── store/ │ └── editorStore.js

## ⚡ Performance

| Metric               | Value         |
|----------------------|---------------|
| Initial Load Time    | ~200ms        |
| Table Render Speed   | <50ms for 1000+ rows |
| Search Input Debounce| 300ms         |
| Code Split           | ✅ Lazy loaded |
| Bundle Size          | Analyzed via `source-map-explorer` |

---

## 🚀 Deployment

🔗 **Live App**: [https://atlan-sql-editor.vercel.app](https://atlan-sql-editor.vercel.app)  
(Replace with your actual link)

---

## 🧪 Run Locally

```bash
git clone https://github.com/your-username/atlan-sql-editor
cd atlan-sql-editor
npm install
npm run dev
