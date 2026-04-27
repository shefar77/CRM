import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Modal from '../common/Modal';
import AddLeadModal from '../common/AddLeadModal';
import { useApp } from '../../context/AppContext';
import './Leads.css';
import { toCSV, downloadCSV } from '../../utils/csvExport';

const STATUS_VARIANT = { New:'blue', Contacted:'amber', Viewing:'green', Negotiation:'amber', Stale:'red', Closed:'green' };
const SOURCE_VARIANT = { 'Meta Ads':'blue', Website:'gray', Manual:'gray', Referral:'gray' };
const ALL_STATUSES   = ['New','Contacted','Viewing','Negotiation','Stale','Closed'];
const ALL_SOURCES    = ['Meta Ads','Website','Manual','Referral'];
const PROGRESS_STEPS = ['Inquiry','Site Visit','Negotiation','Token','Registry'];

function getStep(l) {
  if (l.status==='Closed') return 4;
  if (l.status==='Negotiation') return 2;
  if (l.status==='Viewing') return 1;
  if (l.status==='Contacted') return 1;
  return 0;
}

function LeadModal({ lead, onClose }) {
  const { updateLead, assignAgent, addComment, agents, toast } = useApp();
  const [comments, setLocalComments] = useState(lead.comments || []);
  const [draft,    setDraft]         = useState('');
  const [status,   setStatus]        = useState(lead.status);
  const [saving,   setSaving]        = useState(false);
  const step = getStep({ ...lead, status });

  const handleStatusSave = async () => {
    if (status === lead.status) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateLead({ id: lead.id, status });
    toast(`${lead.name} moved to ${status}`, 'success');
    setSaving(false);
  };

  const handleAssign = (agentName) => {
    assignAgent(lead.id, agentName);
    toast(`Assigned to ${agentName}`, 'info');
  };

  const postComment = () => {
    if (!draft.trim()) return;
    const comment = { author: 'Aarav Kapoor', time: 'Just now', text: draft.trim() };
    addComment(lead.id, comment);
    setLocalComments(prev => [...prev, comment]);
    setDraft('');
    toast('Comment added', 'success');
  };

  return (
    <Modal
      title={`${lead.name} — Lead Details`}
      onClose={onClose}
      width={820}
      footer={
        <div style={{ display:'flex', gap:8, width:'100%', alignItems:'center' }}>
          <span style={{ flex:1, fontSize:11, color:'var(--text3)' }}>Last activity: {lead.lastActivity}</span>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="primary" onClick={handleStatusSave} disabled={saving || status===lead.status}>
            {saving ? 'Saving…' : 'Update Status'}
          </Button>
        </div>
      }
    >
      <div className="lead-modal-cols">
        {/* Left */}
        <div className="lead-modal-left">
          <section className="lm-section">
            <h3 className="lm-section-title">Contact Info</h3>
            <div className="lm-grid">
              <div className="lm-item"><span className="lm-lbl">Phone</span><span className="lm-val">{lead.phone}</span></div>
              <div className="lm-item"><span className="lm-lbl">Email</span><span className="lm-val" style={{color:'var(--primary)'}}>{lead.email}</span></div>
              <div className="lm-item"><span className="lm-lbl">Budget</span><span className="lm-val" style={{fontWeight:600}}>{lead.budget}</span></div>
              <div className="lm-item"><span className="lm-lbl">Source</span><span className="lm-val"><Badge variant={SOURCE_VARIANT[lead.source]||'gray'}>{lead.source}</Badge></span></div>
              <div className="lm-item"><span className="lm-lbl">Property</span><span className="lm-val">{lead.propertyName}</span></div>
              <div className="lm-item"><span className="lm-lbl">Area</span><span className="lm-val">{lead.areaName}</span></div>
            </div>
          </section>

          <section className="lm-section">
            <h3 className="lm-section-title">Status & Assignment</h3>
            <div className="lm-grid">
              <div className="lm-item lm-item--full">
                <span className="lm-lbl">Move to stage</span>
                <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                  {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="lm-item lm-item--full">
                <span className="lm-lbl">Assigned Agent</span>
                <select className="form-select" value={lead.agent} onChange={e => handleAssign(e.target.value)}>
                  {agents.map(a => <option key={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="lm-section">
            <h3 className="lm-section-title">Deal Progress</h3>
            <div className="progress-steps">
              {PROGRESS_STEPS.map((s, i) => (
                <div key={i} className={`progress-step${i<=step?' progress-step--done':''}${i===step?' progress-step--active':''}`}>
                  <div className="progress-dot"/>{i<PROGRESS_STEPS.length-1&&<div className="progress-line"/>}
                  <span className="progress-label">{s}</span>
                </div>
              ))}
            </div>
            <div className="lm-grid" style={{marginTop:10}}>
              <div className="lm-item"><span className="lm-lbl">Stage</span><span className="lm-val">{lead.dealProgress}</span></div>
              <div className="lm-item"><span className="lm-lbl">Payment</span><span className="lm-val">{lead.paymentStatus}</span></div>
            </div>
          </section>

          {lead.notes && (
            <section className="lm-section">
              <h3 className="lm-section-title">Notes</h3>
              <p className="lm-notes">{lead.notes}</p>
            </section>
          )}
        </div>

        {/* Right - Comments */}
        <div className="lead-modal-right">
          <section className="lm-section" style={{flex:1,display:'flex',flexDirection:'column'}}>
            <h3 className="lm-section-title">Internal Comments</h3>
            <div className="lm-thread">
              {comments.length === 0 && <p className="lm-empty">No comments yet.</p>}
              {comments.map((c, i) => (
                <div key={i} className="lm-comment">
                  <div className="lm-comment-meta"><span className="lm-comment-author">{c.author}</span><span className="lm-comment-time">{c.time}</span></div>
                  <p className="lm-comment-text">{c.text}</p>
                </div>
              ))}
            </div>
            <div className="lm-compose">
              <input className="form-input" placeholder="Add internal note… (Enter)" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();postComment();}}} />
              <Button variant="primary" size="sm" onClick={postComment} disabled={!draft.trim()}>Post</Button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  );
}

function InlineComment({ leadId, comments, onAdd }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const submit = (e) => {
    e.stopPropagation();
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
    setOpen(false);
  };

  return (
    <div className="inline-comment" ref={ref} onClick={e=>e.stopPropagation()}>
      <button className="inline-comment-btn" onClick={e=>{e.stopPropagation();setOpen(v=>!v);}}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3 12l2-3h7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        {comments.length > 0 && <span className="inline-comment-count">{comments.length}</span>}
      </button>
      {open && (
        <div className="inline-comment-popup" onClick={e=>e.stopPropagation()}>
          <div className="icp-thread">
            {comments.length===0 ? <p className="icp-empty">No notes yet.</p> : comments.map((c,i)=>(
              <div key={i} className="icp-msg">
                <div><span className="icp-author">{c.author}</span><span className="icp-time"> · {c.time}</span></div>
                <p className="icp-text">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="icp-compose">
            <input className="icp-input" placeholder="Add note…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')submit(e);}} autoFocus />
            <button className="icp-send" onClick={submit} disabled={!draft.trim()}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Leads({ initialFilter = '', onFilterConsumed, openLeadId, onLeadOpened}) {
  const { leads, addComment, assignAgent, agents, toast } = useApp();
  const [filterStatus, setFilterStatus] = useState('');
  const [activeOnly,   setActiveOnly]   = useState(false);
  const [filterSource, setFilterSource] = useState('');
  const [filterAgent,  setFilterAgent]  = useState('');
  const [search,       setSearch]       = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAdd,      setShowAdd]      = useState(false);

  useEffect(() => {
    if (!initialFilter) return;
    setFilterStatus('');
    setFilterSource('');
    setFilterAgent('');
    setSearch('');
    setActiveOnly(false);
    if (initialFilter === 'closed') {
      setFilterStatus('Closed');
    } else if (initialFilter === 'active') {
      setActiveOnly(true);         
    }
    if (onFilterConsumed) onFilterConsumed();
  }, [initialFilter]);

  useEffect(() => {
    if (!openLeadId) return;
    const lead = leads.find(l => l.id === openLeadId);
    if (lead) setSelectedLead(lead);
    if (onLeadOpened) onLeadOpened();
  }, [openLeadId, leads]);

  const uniqueAgents = useMemo(() => [...new Set(leads.map(l => l.agent))], [leads]);

  const filtered = useMemo(() => leads.filter(l => {
    if (activeOnly && (l.status === 'Closed' || l.status === 'Stale')) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterSource && l.source !== filterSource) return false;
    if (filterAgent  && l.agent  !== filterAgent)  return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [leads, filterStatus, filterSource, filterAgent, search, activeOnly]);

  const clearAll = () => { setFilterStatus(''); setFilterSource(''); setFilterAgent(''); setSearch(''); setActiveOnly(false); };
  const hasFilter = filterStatus || filterSource || filterAgent || search || activeOnly;

  const handleAddComment = (leadId, text) => {
    addComment(leadId, { author: 'Aarav Kapoor', time: 'Just now', text });
    toast('Comment added', 'success');
  };

  const handleAssignAgent = (leadId, agentName) => {
    assignAgent(leadId, agentName);
    toast(`Assigned to ${agentName}`, 'info');
  };

  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
    }
  }, [leads]);

   const handleExport = () => {
    const rows = [["Name","Budget","Property","Area","Source","Status","Agent","Last Activity"]];
    filtered.forEach(l => rows.push([l.name, l.budget, l.propertyName||'', l.areaName||'', l.source, l.status, l.agent, l.lastActivity]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), { href: url, download: "leads.csv" });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Leads exported as CSV", "success");
  };
  
  return (
    <div className="page-content">
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} />}
      {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="page-subtitle">{leads.length} total · {leads.filter(l=>l.status!=='Closed').length} active</p>
        </div>
        <div className="page-header__right">
          <Button variant="ghost">Export</Button>
          <Button variant="primary" onClick={() => setShowAdd(true)}>+ New Lead</Button>
        </div>
      </div>

      <div className="filter-bar">
        <input type="search" className="leads-search" placeholder="Search by name…" value={search} onChange={e=>setSearch(e.target.value)} />
        <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filterSource} onChange={e=>setFilterSource(e.target.value)}>
          <option value="">All Sources</option>
          {ALL_SOURCES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filterAgent} onChange={e=>setFilterAgent(e.target.value)}>
          <option value="">All Agents</option>
          {uniqueAgents.map(a=><option key={a}>{a}</option>)}
        </select>
        {hasFilter && <button className="clear-btn" onClick={clearAll}>Clear</button>}
      </div>

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
                  <th>Comments</th>
                  <th className="th--padr">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="empty-cell">No leads match current filters.</td></tr>
                ) : filtered.map(lead => (
                  <tr key={lead.id} className="lead-row" onClick={() => setSelectedLead(lead)}>
                    <td className="td--padl lead-name">{lead.name}</td>
                    <td className="lead-budget">{lead.budget}</td>
                    <td>
                      <span className="prop-name">{lead.propertyName || '—'}</span>
                      <span className="prop-area">{lead.areaName}</span>
                    </td>
                    <td><Badge variant={SOURCE_VARIANT[lead.source]||'gray'}>{lead.source}</Badge></td>
                    <td><Badge variant={STATUS_VARIANT[lead.status]||'gray'}>{lead.status}</Badge></td>
                    <td onClick={e=>e.stopPropagation()}>
                      <div className="agent-cell">
                        <Avatar initials={lead.agentInitials} size="sm" color={lead.agentColor} />
                        <select
                          className="agent-assign-select"
                          value={lead.agent}
                          onChange={e => handleAssignAgent(lead.id, e.target.value)}
                        >
                          {agents.map(a => <option key={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                    </td>
                    <td onClick={e=>e.stopPropagation()}>
                      <InlineComment leadId={lead.id} comments={lead.comments||[]} onAdd={text => handleAddComment(lead.id, text)} />
                    </td>
                    <td className="td--padr lead-time">{lead.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">Showing {filtered.length} of {leads.length} leads</div>
        </CardBody>
      </Card>
    </div>
  );
}