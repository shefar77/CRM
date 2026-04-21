import React, { useState } from 'react';
import Modal from './Modal';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';

const STATUS_VARIANT = {
  New: 'blue', Contacted: 'amber', Viewing: 'green',
  Negotiation: 'amber', Stale: 'red', Closed: 'green',
};
const ALL_STATUSES = ['New', 'Contacted', 'Viewing', 'Negotiation', 'Closed', 'Stale'];

export default function PipelineModal({ stage, onClose }) {
  const { leads, updateLead, assignAgent, agents, toast } = useApp();
  const stageLeads = leads.filter(l => l.status === stage);
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (lead, newStatus) => {
    setUpdating(lead.id);
    await new Promise(r => setTimeout(r, 400));
    updateLead({ id: lead.id, status: newStatus });
    toast(`${lead.name} moved to ${newStatus}`, 'success');
    setUpdating(null);
  };

  const handleAgentChange = (lead, agentName) => {
    assignAgent(lead.id, agentName);
    toast(`${lead.name} assigned to ${agentName}`, 'info');
  };

  return (
    <Modal title={`${stage} — ${stageLeads.length} leads`} onClose={onClose} width={700}>
      {stageLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)', fontSize: 13 }}>
          No leads in this stage.
        </div>
      ) : (
        <div className="pipeline-modal-list">
          {stageLeads.map(lead => (
            <div key={lead.id} className={`pipeline-modal-card${updating === lead.id ? ' loading' : ''}`}>
              <div className="pmc-top">
                <div className="pmc-info">
                  <Avatar initials={lead.agentInitials} size="md" color={lead.agentColor} />
                  <div>
                    <div className="pmc-name">{lead.name}</div>
                    <div className="pmc-meta">{lead.budget} · {lead.propertyName || '—'}</div>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[lead.status] || 'gray'}>{lead.status}</Badge>
              </div>

              <div className="pmc-controls">
                <div className="pmc-field">
                  <label className="pmc-label">Move to stage</label>
                  <select
                    className="form-select"
                    value={lead.status}
                    onChange={e => handleStatusChange(lead, e.target.value)}
                    disabled={updating === lead.id}
                  >
                    {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="pmc-field">
                  <label className="pmc-label">Assigned agent</label>
                  <select
                    className="form-select"
                    value={lead.agent}
                    onChange={e => handleAgentChange(lead, e.target.value)}
                  >
                    {agents.map(a => <option key={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="pmc-field pmc-field--meta">
                  <span className="pmc-label">Source</span>
                  <span className="pmc-val">{lead.source}</span>
                </div>
                <div className="pmc-field pmc-field--meta">
                  <span className="pmc-label">Last activity</span>
                  <span className="pmc-val">{lead.lastActivity}</span>
                </div>
              </div>
              {updating === lead.id && <div className="pmc-updating">Updating…</div>}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}