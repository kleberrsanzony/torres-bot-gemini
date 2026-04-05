import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl overflow-hidden ${className}`}>{children}</div>
);

export default Card;
