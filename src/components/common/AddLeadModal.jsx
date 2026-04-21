import React, { useState } from 'react';
import Modal from './Modal';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';

const SOURCES    = ['Meta Ads', 'Website', 'Manual', 'Referral'];
const STATUSES   = ['New', 'Contacted', 'Viewing', 'Negotiation'];
const PROPERTIES = [
  'Baner Heights', 'Hinjewadi Residency', 'Wakad Square', 'Kharadi Towers',
  'Viman Nagar Vista', 'Koregaon Park Suites', 'Ravet Green Park', 'Undri Meadows',
];
const EMPTY_FORM = {
  name: '', phone: '', email: '', budget: '',
  source: 'Meta Ads', status: 'New', agent: '',
  propertyName: '', areaName: '', notes: '',
};

function validate(f) {
  const e = {};
  if (!f.name.trim())   e.name   = 'Name is required';
  if (!f.phone.trim())  e.phone  = 'Phone is required';
  if (!f.budget.trim()) e.budget = 'Budget is required';
  if (!f.agent.trim())  e.agent  = 'Please assign an agent';
  if (f.email && !/\S+@\S+\.\S+/.test(f.email)) e.email = 'Invalid email';
  return e;
}

function TextField({ label, name, value, onChange, error, type = 'text', placeholder, span }) {
  return (
    <div className={`form-group${span ? ' span-2' : ''}`}>
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-input${error ? ' error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        autoComplete="off"
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options, span }) {
  return (
    <div className={`form-group${span ? ' span-2' : ''}`}>
      <label className="form-label">{label}</label>
      <select
        className={`form-select${error ? ' error' : ''}`}
        value={value}
        onChange={e => onChange(name, e.target.value)}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

function TextareaField({ label, name, value, onChange, placeholder, span }) {
  return (
    <div className={`form-group${span ? ' span-2' : ''}`}>
      <label className="form-label">{label}</label>
      <textarea
        className="form-textarea"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(name, e.target.value)}
      />
    </div>
  );
}

export default function AddLeadModal({ onClose }) {
  const { addLead, toast, agents } = useApp();
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    addLead(form);
    toast(`Lead "${form.name}" added successfully!`, 'success');
    setSaving(false);
    onClose();
  };

  const agentNames = agents.map(a => a.name);

  return (
    <Modal
      title="Add New Lead"
      onClose={onClose}
      width={640}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : 'Add Lead'}
          </Button>
        </>
      }
    >
      <div className="form-grid">
        <TextField   label="Full Name *"     name="name"         value={form.name}         onChange={handleChange} error={errors.name}   placeholder="e.g. Rohit Gupta" />
        <TextField   label="Phone *"         name="phone"        value={form.phone}        onChange={handleChange} error={errors.phone}  placeholder="+91 98200 00000" />
        <TextField   label="Email"           name="email"        value={form.email}        onChange={handleChange} error={errors.email}  placeholder="email@example.com" type="email" />
        <TextField   label="Budget *"        name="budget"       value={form.budget}       onChange={handleChange} error={errors.budget} placeholder="e.g. ₹85L or ₹1.2Cr" />
        <SelectField label="Source"          name="source"       value={form.source}       onChange={handleChange} options={SOURCES} />
        <SelectField label="Status"          name="status"       value={form.status}       onChange={handleChange} options={STATUSES} />
        <SelectField label="Assign Agent *"  name="agent"        value={form.agent}        onChange={handleChange} error={errors.agent}  options={agentNames} />
        <SelectField label="Property"        name="propertyName" value={form.propertyName} onChange={handleChange} options={PROPERTIES} />
        <TextField   label="Area / Location" name="areaName"     value={form.areaName}     onChange={handleChange} placeholder="e.g. Baner, Pune" />
        <TextareaField label="Notes"         name="notes"        value={form.notes}        onChange={handleChange} placeholder="Any additional context…" span />
      </div>
    </Modal>
  );
}