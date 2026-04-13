import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { kpis, pipeline, agents, funnel } from '../../data/mockData';
import './Dashboard.css';

function KpiCard({ label, value, delta, trend }) {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className={`kpi-delta kpi-delta--${trend}`}>{delta}</p>
    </div>
  );
}

function PipelineView() {
  return (
    <Card>
      <CardHeader title="Pipeline Overview" right={<Badge variant="blue">This month</Badge>} />
      <div className="pipeline">
        {pipeline.map((s, i) => (
          <div key={i} className="pipeline__stage">
            <p className="pipeline__label">{s.stage}</p>
            <p className="pipeline__count">{s.count}</p>
            <p className="pipeline__value">{s.value}</p>
            <div className="pipeline__track">
              <div className="pipeline__fill" style={{ width: `${s.pct}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function perfColor(pct) {
  if (pct >= 75) return 'var(--green)';
  if (pct >= 45) return 'var(--primary)';
  if (pct >= 30) return 'var(--amber)';
  return 'var(--red)';
}
function dealVariant(deals) {
  if (deals >= 15) return 'green';
  if (deals >= 8)  return 'blue';
  if (deals >= 5)  return 'gray';
  return 'red';
}

function Leaderboard() {
  return (
    <Card>
      <CardHeader title="Agent Leaderboard" right={<Badge variant="gray">April 2026</Badge>} />
      <CardBody noPad>
        <table className="data-table">
          <thead>
            <tr>
              <th className="th--padl">Agent</th>
              <th>Meetings</th>
              <th>Deals</th>
              <th>Resp. Rate</th>
              <th className="th--padr">Performance</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a, i) => (
              <tr key={a.id}>
                <td className="td--padl">
                  <div className="agent-row">
                    <span className="rank-num">{i + 1}</span>
                    <Avatar initials={a.initials} size="sm" color={a.color} />
                    <span style={{ fontWeight: i === 0 ? 500 : 400 }}>{a.name}</span>
                  </div>
                </td>
                <td>{a.meetings}</td>
                <td><Badge variant={dealVariant(a.deals)}>{a.deals}</Badge></td>
                <td>{a.responseRate}%</td>
                <td className="td--padr">
                  <div className="mini-bar">
                    <div className="mini-bar__fill" style={{ width: `${a.performance}%`, background: perfColor(a.performance) }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function ConversionFunnel() {
  return (
    <Card>
      <CardHeader title="Conversion Funnel" />
      <CardBody>
        {funnel.map((row, i) => (
          <div key={i} className="funnel-row">
            <span className="funnel-label">{row.label}</span>
            <div className="funnel-track">
              <div className="funnel-fill" style={{ width: `${row.pct}%`, background: row.color }} />
            </div>
            <span className="funnel-count">{row.count}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function ResponseTime() {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - 0.65);
  return (
    <Card>
      <CardHeader title="Avg. Response Time" />
      <CardBody>
        <div className="resp-wrap">
          <div className="resp-ring">
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border-light)" strokeWidth="6"/>
              <circle cx="40" cy="40" r={r} fill="none" stroke="var(--green)" strokeWidth="6"
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"/>
            </svg>
            <span className="resp-val">2.4h</span>
          </div>
          <p className="resp-status">Fast</p>
          <p className="resp-sub">Top 20% of teams</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monday, 13 April 2026 — Q2 overview</p>
        </div>
        <div className="page-header__right">
          <Button variant="primary">+ Add Lead</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      {/* Pipeline */}
      <PipelineView />

      {/* Bottom row */}
      <div className="dash-bottom">
        <div className="dash-bottom__main">
          <Leaderboard />
        </div>
        <div className="dash-bottom__side">
          <ConversionFunnel />
          <ResponseTime />
        </div>
      </div>
    </div>
  );
}