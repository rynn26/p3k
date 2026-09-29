import React, { useState } from 'react';
import {
  Menu,
  Bell,
  LayoutGrid,
  Accessibility,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import {
  PhysicsAtomIcon,
  ChemistryFlaskIcon,
  BiologyLeafIcon,
  ErgonomicsSittingIcon,
  StressHeadIcon,
  Smk3ShieldIcon,
} from '../components/K3CategoryIcons';
import { UserProfile, RebaAssessmentRecord, NbmAssessmentRecord } from '../types';

interface DashboardScreenProps {
  profile: UserProfile | null;
  onOpenErgonomics: () => void;
  onOpenHistory: () => void;
  onNavigateToProfile?: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
  rebaRecords: RebaAssessmentRecord[];
  nbmRecords: NbmAssessmentRecord[];
  lang: 'ID' | 'ENG';
  onToggleLang: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  profile,
  onOpenErgonomics,
  onOpenHistory,
  onNavigateToProfile,
  onOpenAdmin,
  onLogout,
  lang,
  onToggleLang,
}) => {
  const isEng = lang === 'ENG';
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showNavSheet, setShowNavSheet] = useState(false);

  const showUnderDevelopment = (title: string) => {
    setToastMsg(
      isEng
        ? `Module ${title} is currently under development.`
        : `Modul ${title} saat ini masih dalam tahap pengembangan.`
    );
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  const modules = [
    {
      id: 'physics',
      title: isEng ? 'Physics' : 'Fisika',
      icon: PhysicsAtomIcon,
      circleColor: '#1D68F2',
      isActive: false,
    },
    {
      id: 'chemical',
      title: isEng ? 'Chemical' : 'Kimia',
      icon: ChemistryFlaskIcon,
      circleColor: '#7C3AED',
      isActive: false,
    },
    {
      id: 'biological',
      title: isEng ? 'Biological' : 'Biologi',
      icon: BiologyLeafIcon,
      circleColor: '#22C55E',
      isActive: false,
    },
    {
      id: 'ergonomics',
      title: isEng ? 'Ergonomics' : 'Ergonomi',
      icon: ErgonomicsSittingIcon,
      circleColor: '#F59E0B',
      isActive: true,
    },
    {
      id: 'stress',
      title: isEng ? 'Stress' : 'Stres',
      icon: StressHeadIcon,
      circleColor: '#EF4444',
      isActive: false,
    },
    {
      id: 'smk3',
      title: isEng ? 'SMK3' : 'SMK3',
      icon: Smk3ShieldIcon,
      circleColor: '#0284C7',
      isActive: false,
    },
  ];

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        paddingBottom: 90,
        boxSizing: 'border-box',
      }}
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#334155',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 600,
            zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Lock size={15} color="#94A3B8" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP HERO WAVE BANNER (WONDR STYLE) - SAMA PERSIS FLUTTER */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(to bottom right, #E0F2FE, #BAE6FD)',
          padding: '24px 18px 36px 18px',
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Action Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {/* Drawer Menu Button (Circle) */}
          <button
            onClick={() => setShowNavSheet(true)}
            type="button"
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <Menu size={20} />
          </button>

          {/* K3 Status Pill in Center */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 20,
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#0284C7',
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Active' : 'Aktif'}
            </span>
          </div>

          {/* Right Actions: Switch Bahasa + Notification Bell */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Language Switch Button (Segmented IDN | ENG) */}
            <div
              onClick={onToggleLang}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 20,
                padding: '3px 4px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  padding: '3px 7px',
                  borderRadius: 14,
                  fontSize: 10.5,
                  fontWeight: 800,
                  backgroundColor: lang === 'ID' ? '#FFFFFF' : 'transparent',
                  color: lang === 'ID' ? '#0F172A' : '#94A3B8',
                  boxShadow: lang === 'ID' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                IDN
              </span>
              <span
                style={{
                  padding: '3px 7px',
                  borderRadius: 14,
                  fontSize: 10.5,
                  fontWeight: 800,
                  backgroundColor: lang === 'ENG' ? '#FFFFFF' : 'transparent',
                  color: lang === 'ENG' ? '#0F172A' : '#94A3B8',
                  boxShadow: lang === 'ENG' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                ENG
              </span>
            </div>

            {/* Admin Panel Button (Matches Flutter) */}
            {profile?.role === 'admin' && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                type="button"
                title={isEng ? 'OHS Admin Panel' : 'Panel Administrator K3'}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#0F172A',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#38BDF8',
                }}
              >
                <ShieldAlert size={19} />
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={() => alert(isEng ? 'Notification feature coming soon.' : 'Fitur notifikasi akan segera hadir.')}
              type="button"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                color: '#0F172A',
              }}
            >
              <Bell size={18} />
              <div
                style={{
                  position: 'absolute',
                  top: 9,
                  right: 9,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                  border: '1.5px solid #FFFFFF',
                }}
              />
            </button>
          </div>
        </div>

        {/* Middle Hero Text */}
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.4px',
              lineHeight: 1.2,
            }}
          >
            {isEng ? 'Occupational Health & Safety' : 'Keselamatan & Kesehatan Kerja'}
          </h1>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#334155',
              marginTop: 5,
              lineHeight: 1.35,
            }}
          >
            {isEng
              ? 'Integrated Occupational Health & Safety (OHS) Assessment & Monitoring'
              : 'Sistem Integrasi Penilaian, Evaluasi & Monitoring Keselamatan Kesehatan Kerja (K3)'}
          </p>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div style={{ padding: '20px 18px 0 18px' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Select OHS Assessment Module' : 'Pilih Modul Penilaian K3'}
            </h3>
            <p style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
              {isEng
                ? 'Select occupational risk factor to analyze.'
                : 'Pilih faktor risiko lingkungan kerja untuk dianalisis.'}
            </p>
          </div>

          <div
            style={{
              padding: 7,
              backgroundColor: '#E0F2FE',
              borderRadius: 10,
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LayoutGrid size={16} />
          </div>
        </div>

        {/* 3x2 Grid of Modules (Sama persis dengan Gambar 2 di Flutter) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (m.isActive) {
                    onOpenErgonomics();
                  } else {
                    showUnderDevelopment(m.title);
                  }
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 18,
                  padding: '16px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(15, 23, 42, 0.06)',
                  border: m.isActive ? '1.5px solid rgba(245, 158, 11, 0.3)' : '1px solid #F1F5F9',
                  transition: 'transform 0.12s ease',
                  userSelect: 'none',
                }}
              >
                {/* 52px Circular Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: m.circleColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    marginBottom: 10,
                    boxShadow: `0 4px 12px ${m.circleColor}33`,
                  }}
                >
                  <Icon size={26} />
                </div>

                {/* Title */}
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: '#1E293B',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {m.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Bottom Sheet (Drawer Menu) */}
      {showNavSheet && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            className="fade-in"
            style={{
              width: '100%',
              maxWidth: 480,
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '16px 20px 28px 20px',
              boxSizing: 'border-box',
            }}
          >
            {/* Pill drag handle */}
            <div
              style={{
                width: 40,
                height: 4,
                backgroundColor: '#CBD5E1',
                borderRadius: 2,
                margin: '0 auto 16px auto',
              }}
            />

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
              {isEng ? 'Navigation & System Settings' : 'Navigasi & Pengaturan Sistem'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                onClick={() => {
                  setShowNavSheet(false);
                  if (onNavigateToProfile) onNavigateToProfile();
                }}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 10px',
                  borderRadius: 12,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                  }}
                >
                  <Accessibility size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    {isEng ? 'Worker Profile' : 'Profil Pekerja'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    {isEng ? 'View and edit worker identity data' : 'Lihat dan edit data identitas pekerja'}
                  </div>
                </div>
              </button>

              {profile?.role === 'admin' && onOpenAdmin && (
                <button
                  onClick={() => {
                    setShowNavSheet(false);
                    onOpenAdmin();
                  }}
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 10px',
                    borderRadius: 12,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <div
                    style={{
                      padding: 8,
                      borderRadius: 10,
                      backgroundColor: '#0F172A',
                      color: '#38BDF8',
                    }}
                  >
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                      {isEng ? 'OHS Admin Panel' : 'Panel Administrator K3'}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>
                      {isEng ? 'Manage companies, units & master settings' : 'Kelola instansi, unit kerja & master'}
                    </div>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  setShowNavSheet(false);
                  if (onLogout) onLogout();
                }}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 10px',
                  borderRadius: 12,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    padding: 8,
                    borderRadius: 10,
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                  }}
                >
                  <Lock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>
                    {isEng ? 'Sign Out / Logout' : 'Keluar / Logout'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>
                    {isEng ? 'Sign out of current worker session' : 'Keluar dari sesi akun pekerja'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ambient Soft Sky Blue Glows at Bottom Corners */}
      <div
        style={{
          position: 'fixed',
          bottom: -50,
          left: -40,
          width: 190,
          height: 190,
          borderRadius: '50%',
          backgroundColor: 'rgba(186, 230, 253, 0.45)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: -60,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: 'rgba(147, 197, 253, 0.35)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </div>
  );
};
