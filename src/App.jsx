import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './components/pages/Dashboard';
import Leads from './components/pages/Leads';
import Automation from './components/pages/Automation';
import Collaboration from './components/pages/Collaboration';
import Reports from './components/pages/Reports';
import Settings from './components/pages/Settings';
import ToastContainer from './components/common/Toast';
import { useSidebar } from './hooks/useSidebar';
import './App.css';

export default function App() {
  const [page,         setPage]         = useState('dashboard');
  const [leadFilter,   setLeadFilter]   = useState('');
  const [searchedLead, setSearchedLead] = useState(null); 
  const { open, toggle, close } = useSidebar();

  const navigate = (id) => { setPage(id); close(); };

  const handleKpiClick = (filter) => {
    if (!filter) return;
    setLeadFilter(filter);
    setPage('leads');
  };

  const handleSearchSelect = (lead) => {
    setSearchedLead(lead);
    setPage('leads');
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onKpiClick={handleKpiClick} />;
      case 'leads':
        return (
          <Leads
            initialFilter={leadFilter}
            onFilterConsumed={() => setLeadFilter('')}
            openLeadId={searchedLead?.id}
            onLeadOpened={() => setSearchedLead(null)}
          />
        );
      case 'automation': return <Automation />;
      case 'collab':     return <Collaboration />;
      case 'reports':    return <Reports />;
      case 'settings':   return <Settings />;
      default:           return <Dashboard onKpiClick={handleKpiClick} />;
    }
  };

  return (
    <div className="app-shell">
      {open && <div className="sidebar-backdrop" onClick={close} />}
      <Sidebar activePage={page} onNavigate={navigate} isOpen={open} />
      <div className="app-main">
        <TopBar onMenuToggle={toggle} onSearchSelect={handleSearchSelect} />
        <main className="app-content">{renderPage()}</main>
      </div>
      <ToastContainer />
    </div>
  );
}