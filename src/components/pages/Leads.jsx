import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { leads } from '../../data/mockData';
import './Leads.css';

/* ── Constants ────────────────────────────────────── */
const STATUS_VARIANT = {
  New: 'blue', Contacted: 'amber', Viewing: 'green',
  Negotiation: 'amber', Stale: 'red', Closed: 'green',
};
const SOURCE_VARIANT = { 'Meta Ads': 'blue', Website: 'gray', Manual: 'gray', Referral: 'gray' };
const UNIQUE_STATUSES = ['New', 'Contacted', 'Viewing', 'Negotiation', 'Stale', 'Closed'];
const UNIQUE_SOURCES  = ['Meta Ads', 'Website', 'Manual', 'Referral'];

/* ── Progress steps ───────────────────────────────── */
const PROGRESS_STEPS = ['Inquiry', 'Site Visit', 'Negotiation', 'Token', 'Registry'];
function getProgressStep(lead) {
  if (lead.status === 'Closed') return 4;
  if (lead.status === 'Negotiation') return 2;
  if (lead.status === 'Viewing') return 1;
  if (lead.status === 'Contacted') return 1;
  return 0;
}

/* ── Lead Detail Modal ────────────────────────────── */
function LeadModal({ lead, onClose }) {
  const [comments, setComments] = useState(lead.comments || []);
  const [draft, setDraft]       = useState('');
  const overlayRef              = useRef(null);

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === overlayRef.current) onClose(); };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const addComment = () => {
    if (!draft.trim()) return;
    setComments(prev => [...prev, {
      author: 'Aarav Kapoor', time: 'Just now', text: draft.trim(),
    }]);
    setDraft('');
  };

  const step = getProgressStep(lead);

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleBackdrop}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={`Lead details: ${lead.name}`}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <Avatar initials={lead.agentInitials} size="lg" color={lead.agentColor} />
            <div>
              <h2 className="modal-name">{lead.name}</h2>
              <p className="modal-sub">{lead.propertyName} · {lead.areaName}</p>
            </div>
          </div>
          <div className="modal-header-right">
            <Badge variant={STATUS_VARIANT[lead.status] || 'gray'}>{lead.status}</Badge>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Two col layout */}
          <div className="modal-cols">
            {/* Left */}
            <div className="modal-left">
              {/* Contact */}
              <section className="modal-section">
                <h3 className="modal-section-title">Contact Info</h3>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <span className="modal-info-label">Phone</span>
                    <span className="modal-info-value">{lead.phone}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Email</span>
                    <span className="modal-info-value">{lead.email}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Source</span>
                    <span className="modal-info-value"><Badge variant={SOURCE_VARIANT[lead.source] || 'gray'}>{lead.source}</Badge></span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Budget</span>
                    <span className="modal-info-value" style={{ fontWeight: 600 }}>{lead.budget}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Agent</span>
                    <span className="modal-info-value">{lead.agent}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Last Activity</span>
                    <span className="modal-info-value">{lead.lastActivity}</span>
                  </div>
                </div>
              </section>

              {/* Deal Progress */}
              <section className="modal-section">
                <h3 className="modal-section-title">Deal Progress</h3>
                <div className="progress-steps">
                  {PROGRESS_STEPS.map((s, i) => (
                    <div key={i} className={`progress-step ${i <= step ? 'progress-step--done' : ''} ${i === step ? 'progress-step--active' : ''}`}>
                      <div className="progress-dot" />
                      {i < PROGRESS_STEPS.length - 1 && <div className="progress-line" />}
                      <span className="progress-label">{s}</span>
                    </div>
                  ))}
                </div>
                <div className="modal-info-grid" style={{ marginTop: 12 }}>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Current Stage</span>
                    <span className="modal-info-value">{lead.dealProgress}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">Payment</span>
                    <span className="modal-info-value">{lead.paymentStatus}</span>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className="modal-section">
                <h3 className="modal-section-title">Notes</h3>
                <p className="modal-notes">{lead.notes}</p>
              </section>
            </div>

            {/* Right — Internal Comments */}
            <div className="modal-right">
              <section className="modal-section modal-section--full">
                <h3 className="modal-section-title">Internal Comments</h3>
                <div className="modal-thread">
                  {comments.length === 0
                    ? <p className="modal-thread-empty">No comments yet.</p>
                    : comments.map((c, i) => (
                      <div key={i} className="modal-comment">
                        <div className="modal-comment-meta">
                          <span className="modal-comment-author">{c.author}</span>
                          <span className="modal-comment-time">{c.time}</span>
                        </div>
                        <p className="modal-comment-text">{c.text}</p>
                      </div>
                    ))
                  }
                </div>
                <div className="modal-compose">
                  <input
                    className="modal-input"
                    placeholder="Add an internal note…"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                  />
                  <button className="modal-send-btn" onClick={addComment} disabled={!draft.trim()}>Post</button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Leads Page ───────────────────────────────────── */
export default function Leads({ initialFilter = '', onFilterConsumed }) {
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterAgent,  setFilterAgent]  = useState('');
  const [search,       setSearch]       = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  // Local comments state per lead
  const [leadComments, setLeadComments] = useState(
    () => Object.fromEntries(leads.map(l => [l.id, l.comments || []]))
  );

  // Apply initialFilter from dashboard KPI click
  useEffect(() => {
    if (!initialFilter) return;
    if (initialFilter === 'active') setFilterStatus('');
    if (initialFilter === 'closed') setFilterStatus('Closed');
    if (initialFilter === 'total')  { setFilterStatus(''); setFilterSource(''); setFilterAgent(''); setSearch(''); }
    if (onFilterConsumed) onFilterConsumed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter]);

  // Active = not Closed
  const activeFilter = initialFilter === 'active';

  const uniqueAgents = useMemo(() => [...new Set(leads.map(l => l.agent))], []);

  const filtered = useMemo(() => leads.filter(l => {
    if (activeFilter && l.status === 'Closed') return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterSource && l.source !== filterSource) return false;
    if (filterAgent  && l.agent  !== filterAgent)  return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterStatus, filterSource, filterAgent, search, activeFilter]);

  const clearAll = () => { setFilterStatus(''); setFilterSource(''); setFilterAgent(''); setSearch(''); };
  const hasFilter = filterStatus || filterSource || filterAgent || search || activeFilter;

  const addComment = (leadId, text) => {
    setLeadComments(prev => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), { author: 'Aarav Kapoor', time: 'Just now', text }],
    }));
  };

  return (
    <div className="page-content">
      {selectedLead && (
        <LeadModal
          lead={{ ...selectedLead, comments: leadComments[selectedLead.id] || [] }}
          onClose={() => setSelectedLead(null)}
        />
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">
            {leads.length} total leads · {leads.filter(l => l.status !== 'Closed').length} active
            {activeFilter && <span className="filter-tag">Showing: Active only</span>}
            {filterStatus === 'Closed' && <span className="filter-tag">Showing: Closed deals</span>}
          </p>
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
        {hasFilter && <button className="clear-btn" onClick={clearAll}>Clear filters</button>}
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
                  <th>Property | Area</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>Internal Comments</th>
                  <th className="th--padr">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="empty-cell">No leads match the current filters.</td>
                  </tr>
                ) : filtered.map(lead => {
                  const comments = leadComments[lead.id] || [];
                  return (
                    <tr
                      key={lead.id}
                      className="lead-row"
                      onClick={() => setSelectedLead(lead)}
                      title="Click to view full details"
                    >
                      <td className="td--padl lead-name">{lead.name}</td>
                      <td className="lead-budget">{lead.budget}</td>
                      <td className="lead-property">
                        <span className="prop-name">{lead.propertyName}</span>
                        <span className="prop-area">{lead.areaName}</span>
                      </td>
                      <td><Badge variant={SOURCE_VARIANT[lead.source] || 'gray'}>{lead.source}</Badge></td>
                      <td><Badge variant={STATUS_VARIANT[lead.status] || 'gray'}>{lead.status}</Badge></td>
                      <td>
                        <div className="agent-cell">
                          <Avatar initials={lead.agentInitials} size="sm" color={lead.agentColor} />
                          <span>{lead.agent}</span>
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <InlineComment
                          comments={comments}
                          onAdd={(text) => addComment(lead.id, text)}
                        />
                      </td>
                      <td className="td--padr lead-time">{lead.lastActivity}</td>
                    </tr>
                  );
                })}
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

/* ── Inline Comment Cell ──────────────────────────── */
function InlineComment({ comments, onAdd }) {
  const [open, setOpen]   = useState(false);
  const [draft, setDraft] = useState('');
  const ref               = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const submit = (e) => {
    e.stopPropagation();
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
    setOpen(false);
  };

  return (
    <div className="inline-comment" ref={ref}>
      <button
        className="inline-comment-btn"
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        title={comments.length ? `${comments.length} comment(s)` : 'Add comment'}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <rect x="1" y="1" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M3 12l2-3h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        {comments.length > 0 && <span className="inline-comment-count">{comments.length}</span>}
      </button>

      {open && (
        <div className="inline-comment-popup" onClick={e => e.stopPropagation()}>
          <div className="icp-thread">
            {comments.length === 0
              ? <p className="icp-empty">No notes yet.</p>
              : comments.map((c, i) => (
                <div key={i} className="icp-msg">
                  <span className="icp-author">{c.author}</span>
                  <span className="icp-time">{c.time}</span>
                  <p className="icp-text">{c.text}</p>
                </div>
              ))
            }
          </div>
          <div className="icp-compose">
            <input
              className="icp-input"
              placeholder="Add note…"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submit(e); }}
              autoFocus
            />
            <button className="icp-send" onClick={submit} disabled={!draft.trim()}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}