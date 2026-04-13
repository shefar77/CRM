import React from 'react';
import './Button.css';

export default function Button({ children, variant = 'ghost', size = 'md', onClick, disabled = false, type = 'button' }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}