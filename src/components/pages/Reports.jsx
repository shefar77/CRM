import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { reportKpis, agentConversion, dropoffPoints } from '../../data/mockData';
import './Reports.css';

function KpiCard({ label, value, delta, trend }) {
  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      <p className={`kpi-delta kpi-delta--${trend}`}>{delta}</p>
    </div>
  );
}

function BarStat({ label, pct, color }) {
  return (
    <div className="bar-stat">
      <p className="bar-stat__label">{label}</p>
      <div className="bar-stat__row">
        <div className="bar-stat__track">
          <div className="bar-stat__fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="bar-stat__val" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
}

const ttcData = [18, 22, 25, 20, 23, 19, 24, 21, 23, 22, 20, 23];
const months  = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];

function TimeToClose() {
  const max = Math.max(...ttcData);
  return (
    <Card>
      <CardHeader title="Time-to-Close Trend" right={<Badge variant="gray">12 months</Badge>} />
      <CardBody>
        <div className="ttc-chart">
          {ttcData.map((val, i) => (
            <div key={i} className="ttc-bar-wrap">
              <span className="ttc-val">{val}d</span>
              <div className="ttc-bar-track">
                <div className="ttc-bar-fill" style={{ height: `${(val / max) * 100}%` }} />
              </div>
              <span className="ttc-month">{months[i]}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

const inventory = [
  { name: 'Baner Project',   units: 42, sold: 28, pct: 67 },
  { name: 'Hinjewadi Phase', units: 30, sold: 17, pct: 57 },
  { name: 'Kharadi Towers',  units: 60, sold: 31, pct: 52 },
  { name: 'Wakad Heights',   units: 24, sold: 10, pct: 42 },
];

function InventoryTurnover() {
  return (
    <Card>
      <CardHeader title="Inventory Turnover" right={<Badge variant="blue">April 2026</Badge>} />
      <CardBody noPad>
        <table className="data-table">
          <thead>
            <tr>
              <th className="th--padl">Project</th>
              <th>Units</th>
              <th>Sold</th>
              <th className="th--padr">Turnover</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((row, i) => (
              <tr key={i}>
                <td className="td--padl" style={{ fontWeight: 500 }}>{row.name}</td>
                <td>{row.units}</td>
                <td>{row.sold}</td>
                <td className="td--padr">
                  <div className="inv-row">
                    <div className="inv-track">
                      <div className="inv-fill" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="inv-pct">{row.pct}%</span>
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

export default function Reports() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">April 2026 · Q2 performance</p>
        </div>
        <div className="page-header__right">
          <select className="filter-select">
            <option>April 2026</option>
            <option>March 2026</option>
            <option>Q2 2026</option>
          </select>
          <Button variant="ghost">Export CSV</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {reportKpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>

      {/* Two-col: conversion + drop-off */}
      <div className="grid-2">
        <Card>
          <CardHeader title="Agent Conversion Rate" />
          <CardBody>
            {agentConversion.map((a, i) => (
              <BarStat key={i} label={a.name} pct={a.pct} color={a.color} />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Lead Drop-off Points" />
          <CardBody>
            {dropoffPoints.map((d, i) => (
              <BarStat key={i} label={d.label} pct={d.pct} color={d.color} />
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Time-to-close chart */}
      <TimeToClose />

      {/* Inventory */}
      <InventoryTurnover />
    </div>
  );
}