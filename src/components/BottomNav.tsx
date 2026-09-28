import React from 'react';
import { LayoutGrid, Clock, FileText, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  lang: 'ID' | 'ENG';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, lang }) => {
  const isEng = lang === 'ENG';

  const tabs = [
    { id: 0, label: isEng ? 'Dashboard' : 'Dashboard', icon: LayoutGrid },
    { id: 1, label: isEng ? 'History' : 'Riwayat', icon: Clock },
    { id: 2, label: isEng ? 'Reports' : 'Laporan', icon: FileText },
    { id: 3, label: isEng ? 'Profile' : 'Profil', icon: User },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        height: 62,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #F1F5F9',
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.06)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        padding: '4px 8px',
        boxSizing: 'border-box',
      }}
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        const color = isActive ? '#0284C7' : '#94A3B8';

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            type="button"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: color,
              padding: '2px 0',
              fontFamily: 'inherit',
              transition: 'color 0.15s ease',
            }}
          >
            <IconComponent size={22} color={color} strokeWidth={isActive ? 2.4 : 2} />
            <span
              style={{
                fontSize: 10.5,
                fontWeight: isActive ? 700 : 500,
                color: color,
                marginTop: 3,
                letterSpacing: '0.1px',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
