import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import AddLeadModal from '../common/AddLeadModal';
import PipelineModal from '../common/PipelineModal';
import { useApp } from '../../context/AppContext';
import { kpis, funnel } from '../../data/mockData';
import './Dashboard.css';
import '../common/PipelineModal.css';

function perfColor(p) { return p>=75?'var(--green)':p>=45?'var(--primary)':p>=30?'var(--amber)':'var(--red)'; }
function dealVariant(d) { return d>=15?'green':d>=8?'blue':d>=5?'gray':'red'; }

function KpiCard({ label, value, delta, trend, filter, onClick }) {
  const clickable = !!filter;
  return (
    <div className={`kpi-card${clickable?' kpi-card--clickable':''}`} onClick={() => clickable && onClick(filter)} title={clickable?`Filter: ${label}`:undefined}>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className={`kpi-delta kpi-delta--${trend}`}>{delta}</p>
      {clickable && <span className="kpi-cta">View leads →</span>}
    </div>
  );
}

function PipelineView({ leads }) {
  const [stageModal, setStageModal] = useState(null);
  const STAGES = [
    { stage:'New Lead',    key:'New',         color:'var(--primary)' },
    { stage:'Contacted',   key:'Contacted',   color:'var(--primary)' },
    { stage:'Viewing',     key:'Viewing',     color:'var(--primary)' },
    { stage:'Negotiation', key:'Negotiation', color:'var(--primary)' },
    { stage:'Closed',      key:'Closed',      color:'var(--green)'   },
  ];
  const stageValues = { New:'₹82Cr', Contacted:'₹43Cr', Viewing:'₹19Cr', Negotiation:'₹9.4Cr', Closed:'₹12.8Cr' };
  const maxCount = Math.max(...STAGES.map(s => leads.filter(l => l.status === s.key).length), 1);

  return (
    <>
      {stageModal && <PipelineModal stage={stageModal} onClose={() => setStageModal(null)} />}
      <Card>
        <CardHeader title="Pipeline Overview" right={<Badge variant="blue">Live</Badge>} />
        <div className="pipeline">
          {STAGES.map((s) => {
            const count = leads.filter(l => l.status === s.key).length;
            const pct   = Math.round((count / maxCount) * 100);
            return (
              <div key={s.key} className="pipeline__stage pipeline__stage--clickable" onClick={() => setStageModal(s.key)} title={`View ${s.stage} leads`}>
                <p className="pipeline__label">{s.stage}</p>
                <p className="pipeline__count">{count}</p>
                <p className="pipeline__value">{stageValues[s.key]}</p>
                <div className="pipeline__track"><div className="pipeline__fill" style={{ width:`${pct}%`, background:s.color }} /></div>
                <span className="pipeline__hint">Click to view →</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function Leaderboard({ agents }) {
  return (
    <Card>
      <CardHeader title="Agent Leaderboard" right={<Badge variant="gray">April 2026</Badge>} />
      <CardBody noPad>
        <table className="leaderboard-table">
          <thead><tr><th className="th--padl">Agent</th><th>Meetings</th><th>Deals</th><th>Resp. Rate</th><th className="th--padr">Performance</th></tr></thead>
          <tbody>
            {agents.map((a, i) => (
              <tr key={a.id}>
                <td className="td--padl"><div className="agent-row"><span className="rank-num">{i+1}</span><Avatar initials={a.initials} size="md" color={a.color}/><span className="agent-name">{a.name}</span></div></td>
                <td style={{fontWeight:500}}>{a.meetings}</td>
                <td><Badge variant={dealVariant(a.deals)}>{a.deals}</Badge></td>
                <td style={{color:'var(--text2)'}}>{a.responseRate}%</td>
                <td className="td--padr"><div className="mini-bar"><div className="mini-bar__fill" style={{width:`${a.performance}%`,background:perfColor(a.performance)}}/></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
} 

export default function Dashboard({ onKpiClick }) {
  const { leads, agents } = useApp();
  const [showAdd, setShowAdd] = useState(false);

  const liveKpis = [
    { label:'Total Leads',     value: leads.length.toLocaleString(), delta:'▲ 12% vs last month', trend:'up',      filter:'total'  },
    { label:'Active Leads',    value: leads.filter(l=>l.status!=='Closed').length, delta:'▲ 8% vs last month',  trend:'up',      filter:'active' },
    { label:'Deals Closed',    value: leads.filter(l=>l.status==='Closed').length, delta:'▼ 3% vs last month',  trend:'down',    filter:'closed' },
    { label:'Conversion Rate', value: leads.length ? `${((leads.filter(l=>l.status==='Closed').length/leads.length)*100).toFixed(1)}%` : '0%', delta:'— live', trend:'neutral', filter:null },
  ];

  return (
    <div className="page-content dashboard-page">
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} />}
      <div className="page-header">
        <div><h1 className="page-title">Dashboard</h1><p className="page-subtitle">April 2026 — Q2 overview</p></div>
        <div className="page-header__right"><Button variant="primary" onClick={() => setShowAdd(true)}>+ Add Lead</Button></div>
      </div>
      <div className="kpi-grid">
        {liveKpis.map((k,i) => <KpiCard key={i} {...k} onClick={onKpiClick} />)}
      </div>
      <PipelineView leads={leads} />
      <Leaderboard agents={agents} />
    </div>
  );
}