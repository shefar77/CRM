import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { sharedPool, approvals, comments } from '../../data/mockData';
import './Collaboration.css';

function SharedPool() {
  const [items, setItems]       = useState(sharedPool);
  const [assigns, setAssigns]   = useState({});

  const confirm = (id) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <Card>
      <CardHeader
        title="Shared Lead Pool"
        right={<Badge variant="amber">{items.length} unassigned</Badge>}
      />
      <CardBody noPad>
        <div className="pool-list">
          {items.length === 0
            ? <p className="pool-empty">All leads have been assigned.</p>
            : items.map(item => (
              <div key={item.id} className="pool-item">
                <Avatar initials={item.initials} size="md" color={item.color} />
                <div className="pool-info">
                  <p className="pool-name">{item.name} — {item.detail}</p>
                  <p className="pool-meta">
                    From {item.source} · {item.staleDays ? `Stale ${item.staleDays}` : 'New today'}
                  </p>
                </div>
                <div className="pool-actions">
                  <select
                    className="assign-select"
                    value={assigns[item.id] || ''}
                    onChange={e => setAssigns(a => ({ ...a, [item.id]: e.target.value }))}
                  >
                    <option value="">Assign…</option>
                    <option>Priya Sharma</option>
                    <option>Rahul Verma</option>
                    <option>Meena Khanna</option>
                    <option>Amit Rao</option>
                  </select>
                  {assigns[item.id] && (
                    <button className="confirm-btn" onClick={() => confirm(item.id)}>Confirm</button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </CardBody>
    </Card>
  );
}

function ApprovalQueue() {
  const [items, setItems] = useState(approvals);
  const dismiss = (id) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <Card>
      <CardHeader
        title="Manager Approval Queue"
        right={<Badge variant={items.length > 0 ? 'red' : 'green'}>{items.length} pending</Badge>}
      />
      <CardBody noPad>
        <div className="pool-list">
          {items.length === 0
            ? <p className="pool-empty">All requests reviewed.</p>
            : items.map(item => (
              <div key={item.id} className="pool-item">
                <div className="pool-info">
                  <p className="pool-name">{item.title}</p>
                  <p className="pool-meta">Requested by {item.requestedBy} · {item.time}</p>
                </div>
                <div className="approval-btns">
                  <button className="appr-btn appr-btn--yes" onClick={() => dismiss(item.id)}>Approve</button>
                  <button className="appr-btn appr-btn--no"  onClick={() => dismiss(item.id)}>Reject</button>
                </div>
              </div>
            ))
          }
        </div>
      </CardBody>
    </Card>
  );
}

function CommentsThread() {
  const [msgs, setMsgs] = useState(comments);
  const [draft, setDraft] = useState('');

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(prev => [...prev, {
      id: Date.now(),
      author: 'Aarav Kapoor (Manager)',
      initials: 'AK',
      color: 'indigo',
      time: 'Just now',
      text: draft.trim(),
    }]);
    setDraft('');
  };

  return (
    <Card>
      <CardHeader
        title="Internal Comments — Nisha Patel (₹1.2Cr)"
        right={<Badge variant="blue">Viewing</Badge>}
      />
      <CardBody noPad>
        <div className="thread-list">
          {msgs.map(msg => (
            <div key={msg.id} className="thread-item">
              <Avatar initials={msg.initials} size="sm" color={msg.color} />
              <div className="thread-body">
                <div className="thread-meta">
                  <span className="thread-author">{msg.author}</span>
                  <span className="thread-time">{msg.time}</span>
                </div>
                <p className="thread-text">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="thread-compose">
          <Avatar initials="AK" size="sm" color="indigo" />
          <input
            className="thread-input"
            placeholder="Add a comment… (Enter to send)"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button className="send-btn" onClick={send} disabled={!draft.trim()}>Send</button>
        </div>
      </CardBody>
    </Card>
  );
}

export default function Collaboration() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Collaboration</h1>
          <p className="page-subtitle">Shared leads · Comments · Handoffs · Approvals</p>
        </div>
      </div>

      <div className="grid-2">
        <SharedPool />
        <ApprovalQueue />
      </div>

      <CommentsThread />
    </div>
  );
}