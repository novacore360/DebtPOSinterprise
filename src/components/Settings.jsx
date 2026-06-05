import React from 'react';
import { Download, Upload, Database, User, LogOut, TrendingUp } from 'lucide-react';

const card = { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:20 };

export default function Settings({ products, customers, purchases, user, logout }) {
  const exportData = () => {
    const data = { products, customers, purchases, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `marnie_pos_${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        alert(`Import preview:\n• ${data.products?.length||0} products\n• ${data.customers?.length||0} customers\n• ${data.purchases?.length||0} purchases\n\nNote: To import, push each record to Firestore via the admin panel.`);
      } catch { alert('Invalid JSON file.'); }
    };
    reader.readAsText(file); e.target.value = '';
  };

  const totalSales   = purchases.reduce((s,p) => s+(p.total_amount||0), 0);
  const paidSales    = purchases.filter(p=>p.status==='paid').reduce((s,p)=>s+(p.total_amount||0),0);
  const pendingCount = purchases.filter(p=>p.status!=='paid').length;

  // profit from product_data items
  const totalProfit = purchases.reduce((s, p) => {
    const items = p.product_data || [];
    return s + items.reduce((ss, item) => ss + (item.subtotal - (item.cost_price||0)*item.quantity), 0);
  }, 0);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16 }}>

      {/* Data Management */}
      <div style={card}>
        <h6 style={{ color:'#fff', fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:8, fontSize:14 }}>
          <Database size={15} color="#4e73df" /> Data Management
        </h6>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:14, lineHeight:1.5 }}>
          Export your data as a JSON backup or inspect a previously exported file.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          <button onClick={exportData} style={{ padding:'11px 14px', background:'rgba(78,115,223,0.15)', border:'1px solid rgba(78,115,223,0.3)', borderRadius:9, color:'#4e73df', cursor:'pointer', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
            <Download size={15} /> Export JSON Backup
          </button>
          <label style={{ padding:'11px 14px', background:'rgba(28,200,138,0.15)', border:'1px solid rgba(28,200,138,0.3)', borderRadius:9, color:'#1cc88a', cursor:'pointer', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
            <Upload size={15} /> Import / Inspect JSON
            <input type="file" accept=".json" onChange={handleImport} style={{ display:'none' }} />
          </label>
        </div>
      </div>

      {/* Account */}
      <div style={card}>
        <h6 style={{ color:'#fff', fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:8, fontSize:14 }}>
          <User size={15} color="#4e73df" /> Account & System
        </h6>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {[
            { label:'System',      value:'Marnie Store POS v2.1' },
            { label:'Database',    value:'Firebase Firestore' },
            { label:'Logged in as', value: user?.email||'Unknown', color:'#4e73df' },
            { label:'Status',      value:'● Connected', color:'#1cc88a' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', gap:8, flexWrap:'wrap' }}>
              <span style={{ color:'rgba(255,255,255,0.45)', fontSize:13 }}>{label}</span>
              <span style={{ color: color||'#fff', fontWeight:500, fontSize:13, wordBreak:'break-all' }}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={logout} style={{ marginTop:14, width:'100%', padding:11, background:'rgba(231,74,59,0.15)', border:'1px solid rgba(231,74,59,0.3)', borderRadius:9, color:'#e74a3b', cursor:'pointer', fontWeight:600, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>

      {/* Financial Summary */}
      <div style={{ ...card, gridColumn:'1 / -1' }}>
        <h6 style={{ color:'#fff', fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:8, fontSize:14 }}>
          <TrendingUp size={15} color="#1cc88a" /> Financial Summary
        </h6>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))', gap:12 }}>
          {[
            { label:'Total Revenue',  value:`₱${totalSales.toFixed(2)}`,   color:'#4e73df' },
            { label:'Paid Revenue',   value:`₱${paidSales.toFixed(2)}`,    color:'#1cc88a' },
            { label:'Total Profit',   value:`₱${totalProfit.toFixed(2)}`,  color:'#1cc88a' },
            { label:'Profit Margin',  value: totalSales>0 ? `${((totalProfit/totalSales)*100).toFixed(1)}%` : '0%', color:'#f6c23e' },
            { label:'Total Orders',   value: purchases.length,             color:'#36b9cc' },
            { label:'Pending Orders', value: pendingCount,                 color:'#f6c23e' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'13px 14px', textAlign:'center' }}>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, textTransform:'uppercase', letterSpacing:.4 }}>{label}</div>
              <div style={{ color, fontWeight:800, fontSize:20, marginTop:5 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
