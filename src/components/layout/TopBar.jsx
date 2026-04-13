import React, { useState } from 'react';
import './TopBar.css';

export default function TopBar({ onMenuToggle }) {
  const [search, setSearch] = useState('');

  return (
    <header className="topbar">
      {/* Hamburger – mobile only */}
      <button className="topbar__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Search */}
      <div className="topbar__search">
        <span className="topbar__search-icon">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8.5 8.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="search"
          className="topbar__input"
          placeholder="Search leads, agents, properties…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search"
        />
      </div>

      <div className="topbar__spacer" />

      {/* Right actions */}
      <div className="topbar__actions">
        {/* Notifications */}
        <button className="icon-btn notif-btn" aria-label="Notifications">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5A4.5 4.5 0 003.5 6v2.5L2 10h12l-1.5-1.5V6A4.5 4.5 0 008 1.5z" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6.5 10.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          <span className="notif-dot" />
        </button>

        {/* Help */}
        <button className="icon-btn" aria-label="Help">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5.5 5.5a2 2 0 013.5 1.3c0 1.2-1.5 1.7-1.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="7.5" cy="11" r="0.6" fill="currentColor"/>
          </svg>
        </button>

        <div className="topbar__divider" />

        {/* User */}
        <div className="topbar__user">
          <div className="topbar__avatar">AK</div>
          <div className="topbar__user-info">
            <span className="topbar__user-name">Aarav K.</span>
            <span className="topbar__user-role">Manager</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </header>
  );
}