import React from 'react';
import { LogOut, Globe, Bell, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderBannerProps {
  profile: UserProfile | null;
  lang: 'ID' | 'ENG';
  onToggleLang: () => void;
  onLogout: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  profile,
  lang,
  onToggleLang,
  onLogout,
}) => {
  const isEng = lang === 'ENG';

  return (
    <div className="top-wave-banner">
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        {/* Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '5px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            color: '#0284C7',
            border: '1px solid rgba(2, 132, 199, 0.15)',
          }}
        >
          <ShieldCheck size={15} color="#0284C7" />
          <span>{isEng ? 'Safety Portal' : 'Portal K3L'}</span>
        </div>

        {/* Right actions: Language switch & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={onToggleLang}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              borderRadius: 16,
              padding: '5px 10px',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              color: '#0F172A',
              fontFamily: 'inherit',
            }}
          >
            <Globe size={13} color="#0D5BD7" />
            <span>{lang}</span>
          </button>

          <button
            onClick={onLogout}
            title={isEng ? 'Sign Out' : 'Keluar'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              color: '#DC2626',
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* User Greeting Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.15)',
            overflow: 'hidden',
          }}
        >
          <img
            src="/images/logo.png"
            alt="HERU Logo"
            style={{ width: '85%', height: '85%', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0369A1' }}>
            {isEng ? 'Hello, Worker' : 'Halo, Pekerja'}
          </div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
              marginTop: 2,
            }}
          >
            {profile?.full_name || (isEng ? 'Employee' : 'Karyawan')}
          </h2>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>{profile?.company_name || 'Instansi Terhubung'}</span>
            {profile?.department_name && (
              <>
                <span>•</span>
                <span>{profile.department_name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
