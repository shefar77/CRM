import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ReportDetailModal from '../common/ReportDetailModal';
import '../common/ReportDetailModal.css';
import { useApp } from '../../context/AppContext';
import './Reports.css';
import { toCSV, downloadCSV } from '../../utils/csvExport';


function BarStat({ label, pct, color }) {
  return (
    <div className="bar-stat">
      <p className="bar-stat__label">{label}</p>
      <div className="bar-stat__row">
        <div className="bar-stat__track"><div className="bar-stat__fill" style={{width:`${pct}%`,background:color}}/></div>
        <span className="bar-stat__val" style={{color}}>{pct}%</span>
      </div>
    </div>
  );
}

const ttcData = [18,22,25,20,23,19,24,21,23,22,20,23];
const months  = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
const inventory = [
  {name:'Baner Project',   units:42,sold:28,pct:67},
  {name:'Hinjewadi Phase', units:30,sold:17,pct:57},
  {name:'Kharadi Towers',  units:60,sold:31,pct:52},
  {name:'Wakad Heights',   units:24,sold:10,pct:42},
];

export default function Reports() {
  const { leads, toast } = useApp();
  const [detailMetric, setDetailMetric] = useState(null);

  const agentConv = [
    {name:'Priya Sharma',pct:88,color:'var(--green)'},
    {name:'Rahul Verma', pct:72,color:'var(--primary)'},
    {name:'Meena Khanna',pct:54,color:'var(--primary)'},
    {name:'Amit Rao',    pct:41,color:'var(--amber)'},
    {name:'Sunita Das',  pct:28,color:'var(--red)'},
  ];
  const dropoff = [
    {label:'Lead → Contacted',    pct:47,color:'var(--amber)'},
    {label:'Contacted → Viewing', pct:43,color:'var(--amber)'},
    {label:'Viewing → Offer',     pct:50,color:'var(--primary)'},
    {label:'Offer → Closed',      pct:68,color:'var(--green)'},
  ];

  const closedCount = leads.filter(l=>l.status==='Closed').length;
  const convRate    = leads.length ? ((closedCount/leads.length)*100).toFixed(1) : 0;
  const max = Math.max(...ttcData);

  const reportKpis = [
    {label:'Avg. Time to Close', value:'23d',     delta:'▲ 2d faster',   trend:'up',      detail:true},
    {label:'Drop-off Rate',      value:'68%',     delta:'▼ worsened 4%', trend:'down',    detail:true},
    {label:'Inventory Turnover', value:'12.4%',   delta:'▲ 1.2%',        trend:'up',      detail:true},
    {label:'Revenue (MTD)',      value:'₹12.8Cr', delta:'— On track',    trend:'neutral', detail:true},
  ];

  const handleExportCSV = () => {
    const activeLeads = leads.filter(l => l.status !== 'Closed').length;
    const closedLeads = leads.filter(l => l.status === 'Closed').length;
    const headers = ['Metric', 'Value'];
    const dataRows = [
      ['Total Leads',       leads.length],
      ['Active Leads',      activeLeads],
      ['Deals Closed',      closedLeads],
      ['Conversion Rate',   leads.length ? ((closedLeads / leads.length) * 100).toFixed(1) + '%' : '0%'],
      ['Avg Time to Close', '23 days'],
      ['Revenue MTD',       '₹12.8Cr'],
      ['Inventory Turnover','12.4%'],
      ['Drop-off Rate',     '68%'],
    ];
    downloadCSV(toCSV([headers, ...dataRows]), 'propdesk-report.csv');
    toast('Report exported as CSV', 'success');
  };

  return (
    <div className="page-content">
      {detailMetric && <ReportDetailModal metric={detailMetric} onClose={() => setDetailMetric(null)} />}

      <div className="page-header">
        <div><h1 className="page-title">Reports</h1><p className="page-subtitle">April 2026 · Q2 performance</p></div>
        <div className="page-header__right">
          <select className="filter-select"><option>April 2026</option><option>March 2026</option><option>Q2 2026</option></select>
          <Button variant="ghost" onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>

      <div className="kpi-grid">
        {reportKpis.map((k,i) => (
          <div key={i} className={`kpi-card${k.detail?' kpi-card--clickable':''}`} onClick={() => k.detail && setDetailMetric(k.label)} title={k.detail?'Click for detailed breakdown':undefined}>
            <p className="kpi-label">{k.label}</p>
            <p className="kpi-value">{k.value}</p>
            <p className={`kpi-delta kpi-delta--${k.trend}`}>{k.delta}</p>
            {k.detail && <span className="kpi-cta">View breakdown →</span>}
          </div>
        ))}
      </div>

      <div className="grid-2">
        <Card>
          <CardHeader title="Agent Conversion Rate" />
          <CardBody>{agentConv.map((a,i) => <BarStat key={i} label={a.name} pct={a.pct} color={a.color}/>)}</CardBody>
        </Card>
        <Card>
          <CardHeader title="Lead Drop-off Points" />
          <CardBody>{dropoff.map((d,i) => <BarStat key={i} label={d.label} pct={d.pct} color={d.color}/>)}</CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Time-to-Close Trend" right={<Badge variant="gray">12 months</Badge>}/>
        <CardBody>
          <div className="ttc-chart">
            {ttcData.map((val,i) => (
              <div key={i} className="ttc-bar-wrap">
                <span className="ttc-val">{val}d</span>
                <div className="ttc-bar-track"><div className="ttc-bar-fill" style={{height:`${(val/max)*100}%`}}/></div>
                <span className="ttc-month">{months[i]}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Inventory Turnover" right={<Badge variant="blue">April 2026</Badge>}/>
        <CardBody noPad>
          <table className="data-table">
            <thead><tr><th className="th--padl">Project</th><th>Units</th><th>Sold</th><th className="th--padr">Turnover</th></tr></thead>
            <tbody>
              {inventory.map((row,i) => (
                <tr key={i}>
                  <td className="td--padl" style={{fontWeight:500}}>{row.name}</td>
                  <td>{row.units}</td><td>{row.sold}</td>
                  <td className="td--padr">
                    <div className="inv-row">
                      <div className="inv-track"><div className="inv-fill" style={{width:`${row.pct}%`}}/></div>
                      <span className="inv-pct">{row.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}