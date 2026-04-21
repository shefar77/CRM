import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './TopBar.css';

function NotifPanel({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  const notifs = [
    { id: 1, text: 'Deepak Nair lead is stale — 12 days inactive', time: '2h ago' },
    { id: 2, text: 'Pooja Iyer deal closed by Rahul Verma', time: '1d ago' },
    { id: 3, text: 'Manager approval needed: Sunita Joshi discount', time: '3h ago' },
    { id: 4, icon: '🎂', text: 'Birthday reminder: Karan Mehta — tomorrow', time: '5h ago' },
  ];

  return (
    <div className="notif-panel" ref={ref}>
      <div className="notif-panel__header">
        <span className="notif-panel__title">Notifications</span>
        <span className="notif-panel__count">{notifs.length} new</span>
      </div>
      <div className="notif-panel__list">
        {notifs.map(n => (
          <div key={n.id} className="notif-item">
            <span className="notif-item__icon">{n.icon}</span>
            <div className="notif-item__body">
              <p className="notif-item__text">{n.text}</p>
              <span className="notif-item__time">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="notif-panel__footer">
        <button className="notif-panel__clear" onClick={onClose}>Mark all as read</button>
      </div>
    </div>
  );
}

function SearchResults({ query, leads, onSelect, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  if (!query.trim()) return null;

  const q = query.toLowerCase();
  const results = leads.filter(l =>
    l.name.toLowerCase().includes(q) ||
    (l.agent && l.agent.toLowerCase().includes(q)) ||
    (l.propertyName && l.propertyName.toLowerCase().includes(q)) ||
    (l.areaName && l.areaName.toLowerCase().includes(q)) ||
    (l.status && l.status.toLowerCase().includes(q))
  ).slice(0, 6);

  return (
    <div className="search-results" ref={ref}>
      {results.length === 0 ? (
        <div className="search-results__empty">No results for "{query}"</div>
      ) : (
        <>
          <div className="search-results__label">Leads ({results.length})</div>
          {results.map(lead => (
            <button key={lead.id} className="search-result-item" onClick={() => { onSelect(lead); onClose(); }}>
              <div className="sri-avatar">{lead.agentInitials || '??'}</div>
              <div className="sri-info">
                <span className="sri-name">{lead.name}</span>
                <span className="sri-meta">{lead.budget} · {lead.status} · {lead.agent}</span>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

export default function TopBar({ onMenuToggle, onSearchSelect }) {
  const { leads } = useApp();
  const [search,      setSearch]      = useState('');
  const [showSearch,  setShowSearch]  = useState(false);
  const [showNotif,   setShowNotif]   = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowSearch(e.target.value.length > 0);
    if (showNotif) setShowNotif(false);
  };

  const handleSelect = (lead) => {
    setSearch('');
    setShowSearch(false);
    if (onSearchSelect) onSearchSelect(lead);
  };

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="topbar__search">
        <span className="topbar__search-icon">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M8.5 8.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </span>
        <input
          type="text"
          className="topbar__input"
          placeholder="Search leads, agents, properties…"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => search.length > 0 && setShowSearch(true)}
          aria-label="Search"
          autoComplete="off"
        />
        {search && (
          <button className="topbar__search-clear" onClick={() => { setSearch(''); setShowSearch(false); }} aria-label="Clear search">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {showSearch && (
          <SearchResults
            query={search}
            leads={leads}
            onSelect={handleSelect}
            onClose={() => setShowSearch(false)}
          />
        )}
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__actions">
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn notif-btn"
            aria-label="Notifications"
            onClick={() => { setShowNotif(v => !v); setShowSearch(false); }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5A4.5 4.5 0 003.5 6v2.5L2 10h12l-1.5-1.5V6A4.5 4.5 0 008 1.5z" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M6.5 10.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            <span className="notif-dot" />
          </button>
          {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
        </div>

        <button className="icon-btn" aria-label="Help" onClick={() => window.open('https://help.propertyadda.in', '_blank')}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M5.5 5.5a2 2 0 013.5 1.3c0 1.2-1.5 1.7-1.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="7.5" cy="11" r="0.6" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </header>
  );
}