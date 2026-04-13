import React from 'react';
import './Toggle.css';

export default function Toggle({ enabled, onToggle, label }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      className={`toggle${enabled ? ' toggle--on' : ''}`}
      onClick={onToggle}
    />
  );
}