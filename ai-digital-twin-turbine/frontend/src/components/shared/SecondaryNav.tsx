import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SecondaryNavProps {
  active: 'dashboard' | 'report' | 'controls';
}

const SecondaryNav: React.FC<SecondaryNavProps> = ({ active }) => {
  const navigate = useNavigate();

  return (
    <nav className="nav-links">
      <button
        className={`nav-link ${active === 'dashboard' ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
      >
        Live Dashboard
      </button>
      <button
        className={`nav-link ${active === 'report' ? 'active' : ''}`}
        onClick={() => navigate('/report')}
      >
        AI Report
      </button>
      <button
        className={`nav-link ${active === 'controls' ? 'active' : ''}`}
        onClick={() => navigate('/controls')}
      >
        Controls
      </button>
    </nav>
  );
};

export default SecondaryNav;