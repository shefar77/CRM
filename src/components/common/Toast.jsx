import React from 'react';
import { useApp } from '../../context/AppContext';
import './Toast.css';

const ICONS = {
  success: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6.5" fill="#16A34A"/>
      <path d="M4.5 7.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6.5" fill="#DC2626"/>
      <path d="M5 5l5 5M10 5l-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="6.5" fill="#4F46E5"/>
      <path d="M7.5 5v1M7.5 7.5v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast-icon">{ICONS[t.type] || ICONS.info}</span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
}