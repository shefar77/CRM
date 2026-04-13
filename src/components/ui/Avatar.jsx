import React from 'react';
import './Avatar.css';

const COLOR_MAP = {
  blue:   'avatar--blue',
  purple: 'avatar--purple',
  orange: 'avatar--orange',
  green:  'avatar--green',
  indigo: 'avatar--indigo',
  red:    'avatar--red',
};

export default function Avatar({ initials, size = 'md', color = 'blue' }) {
  return (
    <div
      className={`avatar avatar--${size} ${COLOR_MAP[color] || 'avatar--blue'}`}
      aria-label={initials}
    >
      {initials}
    </div>
  );
}