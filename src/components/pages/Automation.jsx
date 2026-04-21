import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { automationRules } from '../../data/mockData';
import './Automation.css';

const RULE_CONFIG = {
  drip:        { bg:'#EEF2FF', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="#4F46E5" strokeWidth="1.3"/><path d="M7.5 4.5V8l2.5 1.5" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  stale_red:   { bg:'#FEF2F2', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2L13.5 12H1.5L7.5 2z" stroke="#DC2626" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7.5 6v3M7.5 10.5v.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  stale_amber: { bg:'#FFFBEB', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2L13.5 12H1.5L7.5 2z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round"/><path d="M7.5 6v3M7.5 10.5v.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  birthday:    { bg:'#F0FDF4', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="5" width="11" height="9" rx="1.5" stroke="#16A34A" strokeWidth="1.3"/><path d="M5 5V3.5a2.5 2.5 0 015 0V5" stroke="#16A34A" strokeWidth="1.3"/></svg> },
  festival:    { bg:'#FFFBEB', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2l1.5 3 3.5.5-2.5 2.5.5 3.5L7.5 10l-3 1.5.5-3.5L2.5 5.5 6 5z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
  followup:    { bg:'#EEF2FF', icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="2" width="11" height="11" rx="1.5" stroke="#4F46E5" strokeWidth="1.3"/><path d="M5 7.5l2 2 3-3" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
};

const TRIGGER_OPTIONS = ['Lead created', 'Lead becomes stale', 'Status changes', 'Site visit logged', 'Deal closed', 'Birthday', 'Festival', 'No activity for X days'];
const ACTION_OPTIONS  = ['Send WhatsApp message', 'Send email', 'Create agent task', 'Reassign lead', 'Flag as stale', 'Notify manager'];
const EMPTY_RULE = { title: '', trigger: '', action: '', days: '' };

function NewRuleTitle({ value, onChange, error }) {
  return (
    <div className="form-group span-2">
      <label className="form-label">Rule Name *</label>
      <input className={`form-input${error?' error':''}`} placeholder="e.g. Day 1: WhatsApp intro" value={value} onChange={e => onChange('title', e.target.value)} autoComplete="off" />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
function NewRuleTrigger({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Trigger</label>
      <select className="form-select" value={value} onChange={e => onChange('trigger', e.target.value)}>
        <option value="">Select trigger…</option>
        {TRIGGER_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function NewRuleAction({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Action</label>
      <select className="form-select" value={value} onChange={e => onChange('action', e.target.value)}>
        <option value="">Select action…</option>
        {ACTION_OPTIONS.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
function NewRuleDays({ value, onChange }) {
  return (
    <div className="form-group span-2">
      <label className="form-label">Description / Notes</label>
      <input className="form-input" placeholder="e.g. Sent 24h after lead is created" value={value} onChange={e => onChange('days', e.target.value)} autoComplete="off" />
    </div>
  );
}

function NewRuleModal({ onClose }) {
  const { toast } = useApp();
  const [rule, setRule]     = useState(EMPTY_RULE);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (key, val) => {
    setRule(prev => ({ ...prev, [key]: val }));
    setErrors(prev => { if (!prev[key]) return prev; const n = {...prev}; delete n[key]; return n; });
  };

  const handleSave = async () => {
    const e = {};
    if (!rule.title.trim()) e.title = 'Rule name is required';
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    toast(`Automation rule "${rule.title}" created!`, 'success');
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Create Automation Rule" onClose={onClose} width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" onClick={handleSave} disabled={saving}>{saving?'Saving…':'Create Rule'}</Button></>}>
      <div className="form-grid">
        <NewRuleTitle   value={rule.title}   onChange={handleChange} error={errors.title} />
        <NewRuleTrigger value={rule.trigger} onChange={handleChange} />
        <NewRuleAction  value={rule.action}  onChange={handleChange} />
        <NewRuleDays    value={rule.days}    onChange={handleChange} />
      </div>
    </Modal>
  );
}

function RuleItem({ rule, configKey }) {
  const [enabled, setEnabled] = useState(rule.enabled);
  const cfg = RULE_CONFIG[configKey] || RULE_CONFIG.drip;
  return (
    <div className="rule-item">
      <div className="rule-icon" style={{ background: cfg.bg }}>{cfg.icon}</div>
      <div className="rule-body">
        <p className="rule-title">{rule.title}</p>
        <p className="rule-desc">{rule.desc}</p>
      </div>
      <Toggle enabled={enabled} onToggle={() => setEnabled(v => !v)} />
    </div>
  );
}

function RulePanel({ title, rules, configKeys }) {
  const activeCount = rules.filter(r => r.enabled).length;
  return (
    <Card>
      <CardHeader title={title} right={<Badge variant={activeCount>0?'blue':'gray'}>{activeCount}/{rules.length} active</Badge>} />
      <CardBody noPad>
        <div className="rules-list">
          {rules.map((rule, i) => <RuleItem key={rule.id} rule={rule} configKey={configKeys[i]||configKeys[0]} />)}
        </div>
      </CardBody>
    </Card>
  );
}

export default function Automation() {
  const [showNewRule, setShowNewRule] = useState(false);
  return (
    <div className="page-content">
      {showNewRule && <NewRuleModal onClose={() => setShowNewRule(false)} />}
      <div className="page-header">
        <div><h1 className="page-title">Automation</h1><p className="page-subtitle">Active rules · auto-run on triggers</p></div>
        <div className="page-header__right">
          <Button variant="primary" onClick={() => setShowNewRule(true)}>+ New Rule</Button>
        </div>
      </div>
      <div className="grid-2">
        <RulePanel title="Drip Reminders"         rules={automationRules.drip}    configKeys={['drip','drip','drip']} />
        <RulePanel title="Stale Lead Warnings"    rules={automationRules.stale}   configKeys={['stale_red','stale_amber']} />
        <RulePanel title="Birthday & Festival Alerts" rules={automationRules.alerts} configKeys={['birthday','festival']} />
        <RulePanel title="Auto Follow-up Tasks"   rules={automationRules.followup} configKeys={['followup','followup']} />
      </div>
    </div>
  );
}