import React, { useState, useMemo } from 'react';
import { Card, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { leads } from '../../data/mockData';
import './Leads.css';

const STATUS_VARIANT = {
  New:         'blue',
  Contacted:   'amber',
  Viewing:     'green',
  Negotiation: 'amber',
  Stale:       'red',
  Closed:      'green',
};

const SOURCE_VARIANT = {
  'Meta Ads': 'blue',
  Website:    'gray',
  Manual:     'gray',
  Referral:   'gray',
};

const UNIQUE_STATUSES = ['New', 'Contacted', 'Viewing', 'Negotiation', 'Stale', 'Closed'];
const UNIQUE_SOURCES  = ['Meta Ads', 'Website', 'Manual', 'Referral'];

export default function Leads() {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterAgent,  setFilterAgent]  = useState('');
  const [search,       setSearch]       = useState('');

  const uniqueAgents = useMemo(() => [...new Set(leads.map(l => l.agent))], []);

  const filtered = useMemo(() => leads.filter(l => {
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterSource && l.source !== filterSource) return false;
    if (filterAgent  && l.agent  !== filterAgent)  return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterStatus, filterSource, filterAgent, search]);

  const clearAll = () => { setFilterStatus(''); setFilterSource(''); setFilterAgent(''); setSearch(''); };
  const hasFilter = filterStatus || filterSource || filterAgent || search;

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">{leads.length} total leads · {leads.filter(l => l.status !== 'Closed').length} active</p>
        </div>
        <div className="page-header__right">
          <Button variant="ghost">Export</Button>
          <Button variant="primary">+ New Lead</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="search"
          className="leads-search"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {UNIQUE_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filterSource} onChange={e => setFilterSource(e.target.value)}>
          <option value="">All Sources</option>
          {UNIQUE_SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filterAgent} onChange={e => setFilterAgent(e.target.value)}>
          <option value="">All Agents</option>
          {uniqueAgents.map(a => <option key={a}>{a}</option>)}
        </select>
        {hasFilter && (
          <button className="clear-btn" onClick={clearAll}>Clear filters</button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardBody noPad>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="th--padl">Name</th>
                  <th>Budget</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th className="th--padr">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-cell">No leads match the current filters.</td>
                  </tr>
                ) : filtered.map(lead => (
                  <tr key={lead.id}>
                    <td className="td--padl lead-name">{lead.name}</td>
                    <td className="lead-budget">{lead.budget}</td>
                    <td><Badge variant={SOURCE_VARIANT[lead.source] || 'gray'}>{lead.source}</Badge></td>
                    <td><Badge variant={STATUS_VARIANT[lead.status] || 'gray'}>{lead.status}</Badge></td>
                    <td>
                      <div className="agent-cell">
                        <Avatar initials={lead.agentInitials} size="sm" color={lead.agentColor} />
                        <span>{lead.agent}</span>
                      </div>
                    </td>
                    <td className="td--padr lead-time">{lead.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            Showing {filtered.length} of {leads.length} leads
          </div>
        </CardBody>
      </Card>
    </div>
  );
}