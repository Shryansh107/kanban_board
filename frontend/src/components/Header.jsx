import React from 'react';
import * as Icons from '../assets/Icons';

export default function Header() {
  return (
    <header className="header" id="app-header">
      <div className="header-brand">
        <Icons.Logo />
        <span>Kanban Board</span>
      </div>
    </header>
  );
}
