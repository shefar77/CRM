import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Toggle from '../ui/Toggle';
import { automationRules } from '../../data/mockData';
import './Automation.css';

const RULE_CONFIG = {
  drip: {
    bg: '#EEF2FF',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="#4F46E5" strokeWidth="1.3"/>
        <path d="M7.5 4.5V8l2.5 1.5" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  stale_red: {
    bg: '#FEF2F2',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2L13.5 12H1.5L7.5 2z" stroke="#DC2626" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M7.5 6v3M7.5 10.5v.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  stale_amber: {
    bg: '#FFFBEB',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2L13.5 12H1.5L7.5 2z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M7.5 6v3M7.5 10.5v.5" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  birthday: {
    bg: '#F0FDF4',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="5" width="11" height="9" rx="1.5" stroke="#16A34A" strokeWidth="1.3"/>
        <path d="M5 5V3.5a2.5 2.5 0 015 0V5" stroke="#16A34A" strokeWidth="1.3"/>
      </svg>
    ),
  },
  festival: {
    bg: '#FFFBEB',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2l1.5 3 3.5.5-2.5 2.5.5 3.5L7.5 10l-3 1.5.5-3.5L2.5 5.5 6 5z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
  },
  followup: {
    bg: '#EEF2FF',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="2" width="11" height="11" rx="1.5" stroke="#4F46E5" strokeWidth="1.3"/>
        <path d="M5 7.5l2 2 3-3" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
};

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
      <CardHeader
        title={title}
        right={<Badge variant={activeCount > 0 ? 'blue' : 'gray'}>{activeCount}/{rules.length} active</Badge>}
      />
      <CardBody noPad>
        <div className="rules-list">
          {rules.map((rule, i) => (
            <RuleItem key={rule.id} rule={rule} configKey={configKeys[i] || configKeys[0]} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function Automation() {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Automation</h1>
          <p className="page-subtitle">6 active rules · 2 pending review</p>
        </div>
        <div className="page-header__right">
          <Button variant="primary">+ New Rule</Button>
        </div>
      </div>

      <div className="grid-2">
        <RulePanel
          title="Drip Reminders"
          rules={automationRules.drip}
          configKeys={['drip', 'drip', 'drip']}
        />
        <RulePanel
          title="Stale Lead Warnings"
          rules={automationRules.stale}
          configKeys={['stale_red', 'stale_amber']}
        />
        <RulePanel
          title="Birthday & Festival Alerts"
          rules={automationRules.alerts}
          configKeys={['birthday', 'festival']}
        />
        <RulePanel
          title="Auto Follow-up Tasks"
          rules={automationRules.followup}
          configKeys={['followup', 'followup']}
        />
      </div>
    </div>
  );
}