import React from 'react';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './components/pages/Dashboard';
import Leads from './components/pages/Leads';
import Automation from './components/pages/Automation';
import Collaboration from './components/pages/Collaboration';
import Reports from './components/pages/Reports';
import { usePage } from './hooks/usePage';
import { useSidebar } from './hooks/useSidebar';
import './App.css';

const PAGES = {
  dashboard:   <Dashboard />,
  leads:       <Leads />,
  automation:  <Automation />,
  collab:      <Collaboration />,
  reports:     <Reports />,
};

export default function App() {
  const { page, setPage } = usePage('dashboard');
  const { open, toggle, close } = useSidebar();

  return (
    <div className="app-shell">
      {/* Mobile backdrop */}
      {open && <div className="sidebar-backdrop" onClick={close} />}

      <Sidebar
        activePage={page}
        onNavigate={(id) => { setPage(id); close(); }}
        isOpen={open}
      />

      <div className="app-main">
        <TopBar onMenuToggle={toggle} />
        <main className="app-content">
          {PAGES[page] ?? <Dashboard />}
        </main>
      </div>
    </div>
  );
}