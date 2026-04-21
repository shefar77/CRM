import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { id: 'leads',     label: 'Leads',     badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c0-2.5 2.5-4.5 5.5-4.5S13 10.5 13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'automation',label: 'Automation', badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1v3M7.5 11v3M1 7.5h3M11 7.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.3"/></svg> },
  { id: 'collab',    label: 'Collaboration', badge: 3,
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 13c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M10 10c1.2.3 2.5 1.3 2.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'reports',   label: 'Reports',   badge: null,
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12V8h2.5v4H2zM6.25 12V5H8.75v7H6.25zM10.5 12V2H13v10h-2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg> },
];

const SYSTEM_ITEMS = [
  { id: 'settings',  label: 'Settings',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M3.2 3.2l1.1 1.1M10.7 10.7l1.1 1.1M3.2 11.8l1.1-1.1M10.7 4.3l1.1-1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
];

function UserMenu({ user, onNavigate, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div className="user-menu" ref={ref}>
      <div className="user-menu__header">
        <div className="user-menu__avatar">{user.initials || 'AK'}</div>
        <div>
          <div className="user-menu__name">{user.name}</div>
          <div className="user-menu__email">{user.email}</div>
        </div>
      </div>
      <div className="user-menu__divider" />
      <button className="user-menu__item" onClick={() => { onNavigate('settings'); onClose(); }}>
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        Profile & Settings
      </button>
      <button className="user-menu__item" onClick={() => { onNavigate('settings'); onClose(); }}>
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 13c0-2.5 2.5-4.5 5.5-4.5S13 10.5 13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        My Account
      </button>
      <div className="user-menu__divider" />
      <button className="user-menu__item user-menu__item--danger" onClick={onClose}>
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-3-3-3M13 7H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Sign Out
      </button>
    </div>
  );
}

export default function Sidebar({ activePage, onNavigate, isOpen }) {
  const { currentUser, leads } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const leadCount = leads.length;

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="logo-mark">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="white"><path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z"/></svg>
        </div>
        <div className="logo-text">
          <span className="logo-name">Property Adda</span>
          <span className="logo-sub">Real Estate CRM</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        <div className="nav-group">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span className="nav-item__label">{item.label}</span>
              {item.id === 'leads' && leadCount > 0 && (
                <span className="nav-item__badge">{leadCount}</span>
              )}
              {item.badge && item.id !== 'leads' && (
                <span className="nav-item__badge">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        <div className="nav-group">
          <p className="nav-section-label">System</p>
          {SYSTEM_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'nav-item--active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span className="nav-item__label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer user chip — click opens dropdown */}
      <div className="sidebar__footer" style={{ position: 'relative' }}>
        {showUserMenu && (
          <UserMenu
            user={currentUser}
            onNavigate={onNavigate}
            onClose={() => setShowUserMenu(false)}
          />
        )}
        <button
          className="agent-chip"
          onClick={() => setShowUserMenu(v => !v)}
          aria-label="User menu"
          aria-expanded={showUserMenu}
        >
          <div className="avatar avatar--md avatar--indigo">{currentUser.initials || 'AK'}</div>
          <div className="agent-chip__info">
            <span className="agent-chip__name">{currentUser.name}</span>
            <span className="agent-chip__role">{currentUser.role}</span>
          </div>
          <svg className="agent-chip__chevron" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d={showUserMenu ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}