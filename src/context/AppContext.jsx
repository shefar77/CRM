import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { leads as initialLeads, agents as initialAgents } from '../data/mockData';

function loadUser() {
  try {
    const saved = localStorage.getItem('crm_user');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return { name: 'Aarav Kapoor', role: 'Sales Manager', email: 'aarav.kapoor@propdesk.in', phone: '+91 98200 00001', company: 'Property Adda', initials: 'AK' };
}

function loadPrefs() {
  try {
    const saved = localStorage.getItem('crm_prefs');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return {
    emailNotif: true, whatsapp: true, staleAlerts: true, dealUpdates: true, weeklyReport: false,
    timezone: 'asia-kolkata', currency: 'inr', dateFormat: 'dd-mm-yyyy', language: 'en',
    autoAssign: true, roundRobin: false, managerApproval: true,
  };
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const initState = {
  leads:       initialLeads.map((l, i) => ({ ...l, id: l.id || i + 1 })),
  agents:      initialAgents,
  toasts:      [],
  loading:     {},
  currentUser: loadUser(),
  prefs:       loadPrefs(),
  integrations: [
    { id: 'meta',      name: 'Meta Ads',           desc: 'Auto-import leads from Facebook & Instagram campaigns', connected: true,  logo: '📘', color: '#1877F2' },
    { id: 'whatsapp',  name: 'WhatsApp Business',  desc: 'Send automated messages and follow-up sequences',      connected: true,  logo: '💬', color: '#25D366' },
    { id: 'sheets',    name: 'Google Sheets',       desc: 'Export lead data and reports to Google Sheets',        connected: false, logo: '📊', color: '#34A853' },
    { id: 'magic',     name: 'MagicBricks',         desc: 'Sync property listings and incoming inquiries',        connected: false, logo: '🏠', color: '#E31E26' },
    { id: 'acres99',   name: '99acres',             desc: 'Pull leads directly from 99acres listings',            connected: false, logo: '🏢', color: '#FF6B35' },
    { id: 'hubspot',   name: 'HubSpot',             desc: 'Sync contacts and deals with HubSpot CRM',            connected: false, logo: '🔶', color: '#FF7A59' },
  ],
};

function reducer(state, action) {
  switch (action.type) {

    case 'ADD_LEAD': {
      const agent = state.agents.find(a => a.name === action.payload.agent);
      return {
        ...state,
        leads: [{
          ...action.payload,
          id: Date.now(),
          lastActivity: 'Just now',
          comments: [],
          dealProgress: 'Initial inquiry',
          paymentStatus: 'Not started',
          agentInitials: agent?.initials || action.payload.agent?.slice(0,2).toUpperCase() || '??',
          agentColor: agent?.color || 'blue',
        }, ...state.leads],
      };
    }

    case 'UPDATE_LEAD':
      return { ...state, leads: state.leads.map(l => l.id === action.payload.id ? { ...l, ...action.payload, lastActivity: 'Just now' } : l) };

    case 'DELETE_LEAD':
      return { ...state, leads: state.leads.filter(l => l.id !== action.id) };

    case 'ASSIGN_AGENT': {
      const agent = state.agents.find(a => a.name === action.agentName);
      return {
        ...state,
        leads: state.leads.map(l =>
          l.id === action.leadId
            ? { ...l, agent: action.agentName, agentInitials: agent?.initials || '??', agentColor: agent?.color || 'blue', lastActivity: 'Just now' }
            : l
        ),
      };
    }

    case 'ADD_COMMENT':
      return {
        ...state,
        leads: state.leads.map(l =>
          l.id === action.leadId
            ? { ...l, comments: [...(l.comments || []), action.comment], lastActivity: 'Just now' }
            : l
        ),
      };

    case 'UPDATE_USER': {
      const updated = { ...state.currentUser, ...action.payload, initials: getInitials(action.payload.name || state.currentUser.name) };
      try { localStorage.setItem('crm_user', JSON.stringify(updated)); } catch (_) {}
      return { ...state, currentUser: updated };
    }

    case 'UPDATE_PREFS': {
      const updated = { ...state.prefs, ...action.payload };
      try { localStorage.setItem('crm_prefs', JSON.stringify(updated)); } catch (_) {}
      return { ...state, prefs: updated };
    }

    case 'ADD_AGENT':
      return { ...state, agents: [...state.agents, action.payload] };

    case 'REMOVE_AGENT':
      return { ...state, agents: state.agents.filter(a => a.id !== action.id) };

    case 'TOGGLE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(i =>
          i.id === action.id ? { ...i, connected: !i.connected } : i
        ),
      };

    case 'TOAST_ADD':
      return { ...state, toasts: [...state.toasts, action.payload] };

    case 'TOAST_REMOVE':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) };

    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };

    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initState);

  const addLead          = useCallback((data)               => dispatch({ type: 'ADD_LEAD',            payload: data }),             []);
  const updateLead       = useCallback((data)               => dispatch({ type: 'UPDATE_LEAD',          payload: data }),             []);
  const deleteLead       = useCallback((id)                 => dispatch({ type: 'DELETE_LEAD',          id }),                       []);
  const assignAgent      = useCallback((leadId, agentName)  => dispatch({ type: 'ASSIGN_AGENT',         leadId, agentName }),        []);
  const addComment       = useCallback((leadId, comment)    => dispatch({ type: 'ADD_COMMENT',          leadId, comment }),          []);
  const updateUser       = useCallback((data)               => dispatch({ type: 'UPDATE_USER',          payload: data }),             []);
  const updatePrefs      = useCallback((data)               => dispatch({ type: 'UPDATE_PREFS',         payload: data }),             []);
  const addAgent         = useCallback((data)               => dispatch({ type: 'ADD_AGENT',            payload: data }),             []);
  const removeAgent      = useCallback((id)                 => dispatch({ type: 'REMOVE_AGENT',         id }),                       []);
  const toggleIntegration= useCallback((id)                 => dispatch({ type: 'TOGGLE_INTEGRATION',   id }),                       []);
  const setLoading       = useCallback((key, val)           => dispatch({ type: 'SET_LOADING',          key, value: val }),          []);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'TOAST_ADD', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'TOAST_REMOVE', id }), 3500);
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      addLead, updateLead, deleteLead, assignAgent, addComment,
      updateUser, updatePrefs, addAgent, removeAgent, toggleIntegration,
      toast, setLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};