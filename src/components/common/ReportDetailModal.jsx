import React from 'react';
import Modal from './Modal';
import { useApp } from '../../context/AppContext';

function Bar({ pct, color = 'var(--primary)', height = 8 }) {
  return (
    <div style={{ flex: 1, height, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width .5s ease' }} />
    </div>
  );
}

function RevenueDetail({ leads }) {
  const closed = leads.filter(l => l.status === 'Closed');
  const byAgent = {};
  closed.forEach(l => {
    if (!byAgent[l.agent]) byAgent[l.agent] = { count: 0, revenue: 0 };
    byAgent[l.agent].count++;
    const raw = l.budget?.replace('₹','').replace('L','0000').replace('Cr','0000000') || '0';
    byAgent[l.agent].revenue += parseFloat(raw) || 0;
  });
  const rows = Object.entries(byAgent).sort((a,b) => b[1].count - a[1].count);
  const maxDeals = Math.max(...rows.map(r => r[1].count), 1);

  return (
    <div>
      <div className="rd-summary">
        <div className="rd-stat"><span className="rd-stat-val">₹12.8Cr</span><span className="rd-stat-label">Revenue MTD</span></div>
        <div className="rd-stat"><span className="rd-stat-val">{closed.length}</span><span className="rd-stat-label">Deals Closed</span></div>
        <div className="rd-stat"><span className="rd-stat-val">₹20L</span><span className="rd-stat-label">Avg Deal Size</span></div>
        <div className="rd-stat"><span className="rd-stat-val">4.98%</span><span className="rd-stat-label">Conv. Rate</span></div>
      </div>
      <h3 className="rd-section-title">Agent-wise Breakdown</h3>
      <div className="rd-rows">
        {rows.map(([agent, d]) => (
          <div key={agent} className="rd-row">
            <span className="rd-row-label">{agent}</span>
            <Bar pct={(d.count / maxDeals) * 100} />
            <span className="rd-row-val">{d.count} deals</span>
          </div>
        ))}
        {rows.length === 0 && <p style={{ color: 'var(--text3)', fontSize: 12 }}>No closed deals yet.</p>}
      </div>
      <h3 className="rd-section-title" style={{ marginTop: 20 }}>Monthly Revenue Trend</h3>
      <div className="rd-bar-chart">
        {['Oct','Nov','Dec','Jan','Feb','Mar','Apr'].map((m,i) => {
          const vals = [8,10,9,11,13,12,13];
          const max = 14;
          return (
            <div key={m} className="rd-bar-col">
              <span className="rd-bar-lbl">₹{vals[i]}Cr</span>
              <div className="rd-bar-track">
                <div className="rd-bar-fill" style={{ height: `${(vals[i]/max)*100}%`, background: i === 6 ? 'var(--primary)' : 'var(--primary-bg)', borderTop: i === 6 ? '2px solid var(--primary)' : 'none' }} />
              </div>
              <span className="rd-bar-month">{m}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DropoffDetail({ leads }) {
  const stages = ['New', 'Contacted', 'Viewing', 'Negotiation', 'Closed'];
  const counts = stages.map(s => leads.filter(l => l.status === s).length);
  const total  = counts[0] || 1;
  return (
    <div>
      <h3 className="rd-section-title">Lead Drop-off by Stage</h3>
      <div className="rd-funnel">
        {stages.map((s,i) => {
          const pct = Math.round((counts[i] / total) * 100);
          const dropped = i > 0 ? counts[i-1] - counts[i] : 0;
          return (
            <div key={s} className="rd-funnel-row">
              <div className="rd-funnel-info">
                <span className="rd-funnel-stage">{s}</span>
                {i > 0 && <span className="rd-funnel-drop">▼ {counts[i-1] - counts[i]} dropped ({100 - pct}%)</span>}
              </div>
              <Bar pct={pct} color={i === stages.length-1 ? 'var(--green)' : 'var(--primary)'} height={12} />
              <span className="rd-row-val">{counts[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimeDetail() {
  const data = [
    { agent: 'Priya Sharma', avgDays: 18, deals: 18 },
    { agent: 'Rahul Verma',  avgDays: 22, deals: 14 },
    { agent: 'Meena Khanna', avgDays: 27, deals: 9 },
    { agent: 'Amit Rao',     avgDays: 31, deals: 7 },
    { agent: 'Sunita Das',   avgDays: 38, deals: 3 },
  ];
  const max = Math.max(...data.map(d => d.avgDays));
  return (
    <div>
      <div className="rd-summary">
        <div className="rd-stat"><span className="rd-stat-val">23d</span><span className="rd-stat-label">Team Average</span></div>
        <div className="rd-stat"><span className="rd-stat-val">18d</span><span className="rd-stat-label">Best (Priya)</span></div>
        <div className="rd-stat"><span className="rd-stat-val">38d</span><span className="rd-stat-label">Longest</span></div>
        <div className="rd-stat"><span className="rd-stat-val">▲ 2d</span><span className="rd-stat-label">Improvement</span></div>
      </div>
      <h3 className="rd-section-title">By Agent</h3>
      <div className="rd-rows">
        {data.map(d => (
          <div key={d.agent} className="rd-row">
            <span className="rd-row-label">{d.agent}</span>
            <Bar pct={(d.avgDays / max) * 100} color={d.avgDays <= 20 ? 'var(--green)' : d.avgDays <= 28 ? 'var(--primary)' : 'var(--amber)'} />
            <span className="rd-row-val">{d.avgDays}d avg</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryDetail() {
  const projects = [
    { name: 'Baner Heights',       total: 42, sold: 28, reserved: 8,  available: 6  },
    { name: 'Hinjewadi Residency',  total: 30, sold: 17, reserved: 5,  available: 8  },
    { name: 'Kharadi Towers',       total: 60, sold: 31, reserved: 12, available: 17 },
    { name: 'Wakad Square',         total: 24, sold: 10, reserved: 4,  available: 10 },
  ];
  return (
    <div>
      <div className="rd-summary">
        <div className="rd-stat"><span className="rd-stat-val">156</span><span className="rd-stat-label">Total Units</span></div>
        <div className="rd-stat"><span className="rd-stat-val">86</span><span className="rd-stat-label">Sold</span></div>
        <div className="rd-stat"><span className="rd-stat-val">29</span><span className="rd-stat-label">Reserved</span></div>
        <div className="rd-stat"><span className="rd-stat-val">41</span><span className="rd-stat-label">Available</span></div>
      </div>
      <h3 className="rd-section-title">Project-wise Inventory</h3>
      <div className="rd-inventory-grid">
        {projects.map(p => (
          <div key={p.name} className="rd-inv-card">
            <div className="rd-inv-name">{p.name}</div>
            <div className="rd-inv-bar-wrap">
              <div className="rd-inv-bar" style={{ width: `${(p.sold/p.total)*100}%`, background: 'var(--green)' }} title="Sold" />
              <div className="rd-inv-bar" style={{ width: `${(p.reserved/p.total)*100}%`, background: 'var(--amber)' }} title="Reserved" />
              <div className="rd-inv-bar" style={{ width: `${(p.available/p.total)*100}%`, background: 'var(--border-light)' }} title="Available" />
            </div>
            <div className="rd-inv-legend">
              <span style={{ color: 'var(--green)' }}>● {p.sold} sold</span>
              <span style={{ color: 'var(--amber)' }}>● {p.reserved} reserved</span>
              <span style={{ color: 'var(--text3)' }}>● {p.available} free</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DETAIL_MAP = {
  'Avg. Time to Close': { title: 'Time-to-Close Analysis',  component: TimeDetail },
  'Drop-off Rate':      { title: 'Lead Drop-off Analysis',   component: DropoffDetail },
  'Inventory Turnover': { title: 'Inventory Breakdown',      component: InventoryDetail },
  'Revenue (MTD)':      { title: 'Revenue Deep Dive',        component: RevenueDetail },
};

export default function ReportDetailModal({ metric, onClose }) {
  const { leads } = useApp();
  const config = DETAIL_MAP[metric];
  if (!config) return null;
  const Comp = config.component;
  return (
    <Modal title={config.title} onClose={onClose} width={680}>
      <Comp leads={leads} />
    </Modal>
  );
}

export { DETAIL_MAP };