import React from 'react';
import './Card.css';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ title, right }) {
  return (
    <div className="card-header">
      <span className="card-title">{title}</span>
      {right && <div className="card-header-right">{right}</div>}
    </div>
  );
}

export function CardBody({ children, noPad = false }) {
  return (
    <div className={`card-body${noPad ? ' card-body--nopad' : ''}`}>
      {children}
    </div>
  );
}