import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import './Settings.css';

function SInput({ value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <input
      type={type}
      className="setting-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={type === 'password' ? 'new-password' : 'off'}
    />
  );
}

function SSelect({ value, onChange, options }) {
  return (
    <select className="setting-select" value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function SRow({ label, hint, children }) {
  return (
    <div className="setting-row">
      <div className="setting-row__label-wrap">
        <span className="setting-row__label">{label}</span>
        {hint && <span className="setting-row__hint">{hint}</span>}
      </div>
      <div className="setting-row__control">{children}</div>
    </div>
  );
}

function SSection({ title, subtitle, children }) {
  return (
    <div className="settings-section">
      {(title || subtitle) && (
        <div className="settings-section__head">
          {title    && <h3 className="settings-section__title">{title}</h3>}
          {subtitle && <p  className="settings-section__sub">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function InviteAgentField({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete="off" />
    </div>
  );
}
function InviteAgentRole({ value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Role</label>
      <select className="form-select" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select role…</option>
        <option value="Senior Agent">Senior Agent</option>
        <option value="Agent">Agent</option>
        <option value="Junior Agent">Junior Agent</option>
        <option value="Manager">Manager</option>
      </select>
    </div>
  );
}

function InviteAgentModal({ onClose }) {
  const { addAgent, toast } = useApp();
  const [inviteName,  setInviteName]  = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole,  setInviteRole]  = useState('');
  const [sending,     setSending]     = useState(false);
  const [errors,      setErrors]      = useState({});

  const validate = () => {
    const e = {};
    if (!inviteName.trim())  e.name  = 'Name is required';
    if (!inviteEmail.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(inviteEmail)) e.email = 'Invalid email';
    if (!inviteRole)         e.role  = 'Please select a role';
    return e;
  };

  const handleSend = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSending(true);
    await new Promise(r => setTimeout(r, 700));
    const initials = inviteName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    addAgent({
      id: Date.now(),
      name: inviteName,
      initials,
      color: 'blue',
      email: inviteEmail,
      phone: invitePhone,
      role: inviteRole,
      meetings: 0, deals: 0, responseRate: 0, performance: 0,
    });
    toast(`Invite sent to ${inviteEmail}`, 'success');
    setSending(false);
    onClose();
  };

  return (
    <Modal
      title="Invite New Agent"
      onClose={onClose}
      width={480}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSend} disabled={sending}>
            {sending ? 'Sending…' : 'Send Invite'}
          </Button>
        </>
      }
    >
      <div className="form-grid">
        <div className="form-group span-2">
          <label className="form-label">Full Name *</label>
          <input type="text" className={`form-input${errors.name?' error':''}`} value={inviteName} onChange={e => { setInviteName(e.target.value); setErrors(p=>({...p,name:undefined})); }} placeholder="e.g. Riya Shah" autoComplete="off" />
          {errors.name  && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group span-2">
          <label className="form-label">Email Address *</label>
          <input type="email" className={`form-input${errors.email?' error':''}`} value={inviteEmail} onChange={e => { setInviteEmail(e.target.value); setErrors(p=>({...p,email:undefined})); }} placeholder="agent@company.com" autoComplete="off" />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="text" className="form-input" value={invitePhone} onChange={e => setInvitePhone(e.target.value)} placeholder="+91 98200 00000" autoComplete="off" />
        </div>
        <div className="form-group">
          <label className="form-label">Role *</label>
          <select className={`form-select${errors.role?' error':''}`} value={inviteRole} onChange={e => { setInviteRole(e.target.value); setErrors(p=>({...p,role:undefined})); }}>
            <option value="">Select role…</option>
            <option>Senior Agent</option>
            <option>Agent</option>
            <option>Junior Agent</option>
            <option>Manager</option>
          </select>
          {errors.role  && <span className="form-error">{errors.role}</span>}
        </div>
        <div className="form-group span-2" style={{ background:'var(--primary-bg)', borderRadius:6, padding:'10px 12px' }}>
          <p style={{ fontSize:12, color:'var(--primary)', lineHeight:1.5 }}>
            📧 An invitation email will be sent with a one-time link to set up their account. They'll appear as <strong>Pending</strong> until they accept.
          </p>
        </div>
      </div>
    </Modal>
  );
}

function EditAgentModal({ agent, onClose }) {
  const { updateLead, toast } = useApp();
  const [name, setName] = useState(agent.name);
  const [role, setRole] = useState(agent.role || 'Agent');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    toast(`${name} updated`, 'success');
    setSaving(false);
    onClose();
  };

  return (
    <Modal title={`Edit — ${agent.name}`} onClose={onClose} width={400}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" onClick={handleSave} disabled={saving}>{saving?'Saving…':'Save'}</Button></>}>
      <div className="form-grid">
        <div className="form-group span-2">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} autoComplete="off" />
        </div>
        <div className="form-group span-2">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option>Senior Agent</option><option>Agent</option><option>Junior Agent</option><option>Manager</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}

const TABS = [
  { id: 'profile',       label: 'Profile',       icon: '👤' },
  { id: 'notifications', label: 'Notifications',  icon: '🔔' },
  { id: 'preferences',   label: 'Preferences',    icon: '⚙️'  },
  { id: 'team',          label: 'Team & Access',  icon: '👥' },
  { id: 'integrations',  label: 'Integrations',   icon: '🔗' },
];

export default function Settings({ onNavigate }) {
  const { currentUser, prefs, agents, integrations, updateUser, updatePrefs, addAgent, removeAgent, toggleIntegration, toast } = useApp();

  const [activeTab, setActiveTab] = useState('profile');
  const [saved,     setSaved]     = useState(false);

  const [pName,    setPName]    = useState(currentUser.name);
  const [pEmail,   setPEmail]   = useState(currentUser.email);
  const [pPhone,   setPPhone]   = useState(currentUser.phone);
  const [pRole,    setPRole]    = useState(currentUser.role);
  const [pCompany, setPCompany] = useState(currentUser.company);
  const [curPwd,   setCurPwd]   = useState('');
  const [newPwd,   setNewPwd]   = useState('');
  const [cfmPwd,   setCfmPwd]   = useState('');
  const [pwdError, setPwdError] = useState('');

  const [emailNotif,   setEmailNotif]   = useState(prefs.emailNotif);
  const [whatsapp,     setWhatsapp]     = useState(prefs.whatsapp);
  const [staleAlerts,  setStaleAlerts]  = useState(prefs.staleAlerts);
  const [dealUpdates,  setDealUpdates]  = useState(prefs.dealUpdates);
  const [weeklyReport, setWeeklyReport] = useState(prefs.weeklyReport);

  const [timezone,   setTimezone]   = useState(prefs.timezone);
  const [currency,   setCurrency]   = useState(prefs.currency);
  const [dateFormat, setDateFormat] = useState(prefs.dateFormat);
  const [language,   setLanguage]   = useState(prefs.language);

  const [autoAssign,       setAutoAssign]       = useState(prefs.autoAssign);
  const [roundRobin,       setRoundRobin]       = useState(prefs.roundRobin);
  const [managerApproval,  setManagerApproval]  = useState(prefs.managerApproval);
  const [showInvite,       setShowInvite]       = useState(false);
  const [editAgent,        setEditAgent]        = useState(null);

  const handleSave = async () => {
    if (newPwd) {
      if (!curPwd) { setPwdError('Enter your current password'); return; }
      if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters'); return; }
      if (newPwd !== cfmPwd) { setPwdError('Passwords do not match'); return; }
    }
    setPwdError('');

    updateUser({ name: pName, email: pEmail, phone: pPhone, role: pRole, company: pCompany });
    updatePrefs({ emailNotif, whatsapp, staleAlerts, dealUpdates, weeklyReport, timezone, currency, dateFormat, language, autoAssign, roundRobin, managerApproval });

    if (newPwd) { setCurPwd(''); setNewPwd(''); setCfmPwd(''); }

    setSaved(true);
    toast('Settings saved successfully', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDiscard = () => {
    setPName(currentUser.name); setPEmail(currentUser.email); setPPhone(currentUser.phone);
    setPRole(currentUser.role); setPCompany(currentUser.company);
    setEmailNotif(prefs.emailNotif); setWhatsapp(prefs.whatsapp);
    setStaleAlerts(prefs.staleAlerts); setDealUpdates(prefs.dealUpdates); setWeeklyReport(prefs.weeklyReport);
    setTimezone(prefs.timezone); setCurrency(prefs.currency); setDateFormat(prefs.dateFormat); setLanguage(prefs.language);
    setAutoAssign(prefs.autoAssign); setRoundRobin(prefs.roundRobin); setManagerApproval(prefs.managerApproval);
    toast('Changes discarded', 'info');
  };

  const AGENT_COLORS = ['#EEF2FF:#4F46E5','#FDF4FF:#7C3AED','#FFF7ED:#C2410C','#F0FDF4:#16A34A','#FEF2F2:#DC2626'];

  const renderProfile = () => (
    <>
      <SSection title="Personal Information" subtitle="Your name and contact details — visible to all team members.">
        <SRow label="Full Name"><SInput value={pName}    onChange={setPName}    placeholder="Your full name" /></SRow>
        <SRow label="Email Address"><SInput value={pEmail}   onChange={setPEmail}   type="email" placeholder="you@company.com" /></SRow>
        <SRow label="Phone"><SInput value={pPhone}   onChange={setPPhone}   placeholder="+91 98200 00000" /></SRow>
        <SRow label="Role / Designation"><SInput value={pRole}    onChange={setPRole}    placeholder="e.g. Sales Manager" /></SRow>
        <SRow label="Company Name"><SInput value={pCompany} onChange={setPCompany} placeholder="Company name" /></SRow>
      </SSection>

      <div className="settings-divider" />

      <SSection title="Change Password" subtitle="Leave blank if you don't want to update your password.">
        <SRow label="Current Password"><SInput value={curPwd} onChange={setCurPwd} type="password" placeholder="Enter current password" /></SRow>
        <SRow label="New Password"><SInput value={newPwd} onChange={v => { setNewPwd(v); setPwdError(''); }} type="password" placeholder="Min. 8 characters" /></SRow>
        <SRow label="Confirm Password"><SInput value={cfmPwd} onChange={v => { setCfmPwd(v); setPwdError(''); }} type="password" placeholder="Repeat new password" /></SRow>
        {pwdError && <p className="settings-error">{pwdError}</p>}
      </SSection>
    </>
  );

  const renderNotifications = () => (
    <>
      <SSection title="Channels" subtitle="Choose how you want to receive alerts and updates.">
        <SRow label="Email Notifications" hint="Activity digests, lead updates, reminders"><Toggle enabled={emailNotif}   onToggle={() => setEmailNotif(v => !v)}   /></SRow>
        <SRow label="WhatsApp Alerts"     hint="Instant alerts via WhatsApp Business">     <Toggle enabled={whatsapp}     onToggle={() => setWhatsapp(v => !v)}     /></SRow>
      </SSection>
      <div className="settings-divider" />
      <SSection title="Alert Types" subtitle="Control which events trigger a notification.">
        <SRow label="Stale Lead Warnings"      hint="Alert when a lead has no activity for 7+ days">       <Toggle enabled={staleAlerts}  onToggle={() => setStaleAlerts(v => !v)}  /></SRow>
        <SRow label="Deal Status Updates"      hint="Notify when a lead moves to a new pipeline stage">    <Toggle enabled={dealUpdates}  onToggle={() => setDealUpdates(v => !v)}  /></SRow>
        <SRow label="Weekly Performance Report" hint="Sent every Monday morning at 9 AM">                  <Toggle enabled={weeklyReport} onToggle={() => setWeeklyReport(v => !v)} /></SRow>
      </SSection>
    </>
  );

  const renderPreferences = () => (
    <SSection title="Regional Settings" subtitle="Timezone, currency, and display preferences.">
      <SRow label="Timezone">
        <SSelect value={timezone} onChange={setTimezone} options={[
          { value:'asia-kolkata',  label:'(UTC+5:30) India Standard Time' },
          { value:'asia-dubai',    label:'(UTC+4:00) Dubai' },
          { value:'europe-london', label:'(UTC+0:00) London' },
          { value:'america-ny',    label:'(UTC-5:00) New York' },
        ]} />
      </SRow>
      <SRow label="Currency">
        <SSelect value={currency} onChange={setCurrency} options={[
          { value:'inr', label:'₹ Indian Rupee (INR)' },
          { value:'usd', label:'$ US Dollar (USD)' },
          { value:'aed', label:'AED Dirham (AED)' },
        ]} />
      </SRow>
      <SRow label="Date Format">
        <SSelect value={dateFormat} onChange={setDateFormat} options={[
          { value:'dd-mm-yyyy', label:'DD/MM/YYYY' },
          { value:'mm-dd-yyyy', label:'MM/DD/YYYY' },
          { value:'yyyy-mm-dd', label:'YYYY-MM-DD' },
        ]} />
      </SRow>
      <SRow label="Language">
        <SSelect value={language} onChange={setLanguage} options={[
          { value:'en', label:'English' },
          { value:'hi', label:'Hindi' },
          { value:'mr', label:'Marathi' },
        ]} />
      </SRow>
    </SSection>
  );

  const renderTeam = () => (
    <>
      <SSection title="Lead Assignment" subtitle="Configure how new leads are distributed to agents.">
        <SRow label="Auto-assign Leads"         hint="New leads are automatically assigned to available agents">  <Toggle enabled={autoAssign}      onToggle={() => setAutoAssign(v => !v)}      /></SRow>
        <SRow label="Round-robin Distribution"  hint="Rotate assignments equally across all active agents">       <Toggle enabled={roundRobin}      onToggle={() => setRoundRobin(v => !v)}      /></SRow>
        <SRow label="Manager Approval Required" hint="Discounts and handoffs require manager sign-off">           <Toggle enabled={managerApproval} onToggle={() => setManagerApproval(v => !v)} /></SRow>
      </SSection>
      <div className="settings-divider" />
      <SSection title="Team Members" subtitle={`${agents.length} agents on this workspace.`}>
        <div className="team-list">
          {agents.map((m, i) => {
            const pair   = AGENT_COLORS[i % AGENT_COLORS.length].split(':');
            const bg     = pair[0], fg = pair[1];
            return (
              <div key={m.id} className="team-member">
                <div className="team-avatar" style={{ background: bg, color: fg }}>{m.initials}</div>
                <div className="team-info">
                  <span className="team-name">{m.name}</span>
                  <span className="team-role">{m.role || 'Agent'}</span>
                </div>
                <div className="team-actions">
                  <button className="team-action-btn" onClick={() => setEditAgent(m)}>Edit</button>
                  <button className="team-action-btn team-action-btn--danger" onClick={() => {
                    removeAgent(m.id);
                    toast(`${m.name} removed`, 'info');
                  }}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14 }}>
          <Button variant="ghost" onClick={() => setShowInvite(true)}>+ Invite Agent</Button>
        </div>
      </SSection>
    </>
  );

  const renderIntegrations = () => (
    <SSection title="Connected Platforms" subtitle="Manage your third-party connections and data sources.">
      {integrations.map(item => (
        <div key={item.id} className="integration-row">
          <div className="integration-logo" style={{ fontSize: 22 }}>{item.logo}</div>
          <div className="integration-info">
            <span className="integration-name">{item.name}</span>
            <span className="integration-desc">{item.desc}</span>
            {item.connected && (
              <span className="integration-status-dot">● Live — syncing now</span>
            )}
          </div>
          <div className="integration-action">
            {item.connected ? (
              <div className="integration-connected-wrap">
                <span className="integration-connected">✓ Connected</span>
                <button
                  className="team-action-btn team-action-btn--danger"
                  onClick={() => { toggleIntegration(item.id); toast(`${item.name} disconnected`, 'info'); }}
                >Disconnect</button>
              </div>
            ) : (
              <button
                className="team-action-btn integration-connect-btn"
                onClick={() => { toggleIntegration(item.id); toast(`${item.name} connected!`, 'success'); }}
              >Connect</button>
            )}
          </div>
        </div>
      ))}
    </SSection>
  );

  const tabContent = {
    profile:       renderProfile(),
    notifications: renderNotifications(),
    preferences:   renderPreferences(),
    team:          renderTeam(),
    integrations:  renderIntegrations(),
  };

  return (
    <div className="page-content">
      {showInvite   && <InviteAgentModal onClose={() => setShowInvite(false)} />}
      {editAgent    && <EditAgentModal   agent={editAgent} onClose={() => setEditAgent(null)} />}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account, preferences, and team</p>
        </div>
        <div className="page-header__right">
          {saved && <span className="save-badge">✓ Saved</span>}
          <Button variant="ghost"   onClick={handleDiscard}>Discard</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar tabs */}
        <nav className="settings-nav" aria-label="Settings sections">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav__item${activeTab === tab.id ? ' settings-nav__item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-nav__icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="settings-content">
          <Card>
            <CardHeader
              title={TABS.find(t => t.id === activeTab)?.label}
              right={
                activeTab === 'profile'
                  ? <div className="avatar-upload">
                      <div className="profile-avatar" style={{ background:'#E0E7FF', color:'#3730A3' }}>
                        {currentUser.initials || 'AK'}
                      </div>
                      <button className="avatar-change-btn" onClick={() => toast('Avatar upload coming soon', 'info')}>Change Photo</button>
                    </div>
                  : null
              }
            />
            <CardBody>
              {tabContent[activeTab]}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}