import React from 'react';
import './Badge.css';

const VARIANTS = { green: 'badge--green', red: 'badge--red', amber: 'badge--amber', blue: 'badge--blue', gray: 'badge--gray', indigo: 'badge--indigo' };

export default function Badge({ children, variant = 'gray' }) {
  return (
    <span className={`badge ${VARIANTS[variant] || 'badge--gray'}`}>
      {children}
    </span>
  );
}