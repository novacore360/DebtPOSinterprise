import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ── Wake up backup service silently on visit ───────────────────────────────
fetch('https://debtposinterprise-database-backup.onrender.com/', { mode: 'no-cors' })
  .catch(() => {}); // ignore failures — this is just a wake-up ping

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
