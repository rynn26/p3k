import React, { useState } from 'react';
import { User, HeartPulse, Building2, Briefcase, GraduationCap, Calendar, LogOut, Globe, ChevronRight, ShieldCheck, Mail } from 'lucide-react';
import { UserProfile } from '../types';

interface WorkerProfileScreenProps {
  userId: string;
  profile: UserProfile | null;
  onEditProfile: () => void;
  onOpenHealthRecord: () => void;
  onLogout: () => void;
  lang: 'ID' | 'ENG';
  onToggleLang: () => void;
}

export const WorkerProfileScreen: React.FC<WorkerProfileScreenProps> = ({
  userId,
  profile,
  onEditProfile,
  onOpenHealthRecord,
  onLogout,
  lang,
  onToggleLang,
}) => {
  const isEng = lang === 'ENG';

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const gender = localStorage.getItem(`worker_gender_${userId}`) || 'Laki-laki';
  const birthDate = localStorage.getItem(`worker_birth_${userId}`) || '-';
  const education = localStorage.getItem(`worker_edu_${userId}`) || 'Sarjana (S1)';
  const joinDate = localStorage.getItem(`worker_join_${userId}`) || '-';

  return (
    <div
      className="fade-in"
      style={{
        padding: '20px 18px 90px 18px',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px' }}>
          {isEng ? 'Worker Profile' : 'Profil Pekerja'}
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
          {isEng ? 'Manage personal identity and health metrics' : 'Kelola identitas personal & rekam kesehatan kerja'}
        </p>
      </div>

      {/* Profile Identity Card */}
      <div
        className="card"
        style={{
          padding: 20,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          marginBottom: 16,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              backgroundColor: '#EFF6FF',
              color: '#0D5BD7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(13, 91, 215, 0.15)',
            }}
          >
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'P'}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px' }}>
              {profile?.full_name || 'Pekerja K3'}
            </h3>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Mail size={13} />
              <span>{profile?.email || 'worker@company.com'}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#0284C7',
                  backgroundColor: '#E0F2FE',
                  padding: '3px 8px',
                  borderRadius: 10,
                }}
              >
                Pekerja Aktif K3L
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <button
          onClick={onEditProfile}
          type="button"
          className="card"
          style={{
            padding: 14,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            textAlign: 'left',
            border: '1.5px solid #E2E8F0',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: '#EBF3FE',
              color: '#0D5BD7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Edit Profile' : 'Edit Profil'}
            </div>
            <span style={{ fontSize: 11, color: '#64748B' }}>Identitas pekerja</span>
          </div>
        </button>

        <button
          onClick={onOpenHealthRecord}
          type="button"
          className="card"
          style={{
            padding: 14,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            textAlign: 'left',
            border: '1.5px solid #E2E8F0',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: '#F0FDF4',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartPulse size={18} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Health Record' : 'Catatan Sehat'}
            </div>
            <span style={{ fontSize: 11, color: '#64748B' }}>Fisik &amp; BMI</span>
          </div>
        </button>
      </div>

      {/* Details List */}
      <div className="card" style={{ padding: 18, borderRadius: 18, marginBottom: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
          {isEng ? 'Personal & Employment Details' : 'Rincian Data Pekerja'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Jenis Kelamin</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{gender}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Tanggal Lahir</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{birthDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Pendidikan Terakhir</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{education}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Instansi / Perusahaan</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{profile?.company_name || 'Pertamina A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Departemen</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{profile?.department_name || 'Operasional'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#64748B' }}>Mulai Bekerja</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>{joinDate}</span>
          </div>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="card" style={{ padding: 14, borderRadius: 18, marginBottom: 24 }}>
        <button
          onClick={onToggleLang}
          type="button"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Globe size={18} color="#0D5BD7" />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
              {isEng ? 'Language / Bahasa' : 'Bahasa Aplikasi'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#0D5BD7' }}>{lang}</span>
            <ChevronRight size={16} color="#94A3B8" />
          </div>
        </button>

        <div style={{ height: 1, backgroundColor: '#E2E8F0', margin: '6px 0' }} />

        <button
          onClick={() => setShowLogoutConfirm(true)}
          type="button"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogOut size={18} color="#DC2626" />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#DC2626' }}>
              {isEng ? 'Sign Out of Account' : 'Keluar dari Akun'}
            </span>
          </div>
          <ChevronRight size={16} color="#DC2626" />
        </button>
      </div>

      {/* App Version Info */}
      <div style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
        HERU Industrial Safety App • v1.0.0
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              maxWidth: 360,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <LogOut size={26} />
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
              {isEng ? 'Sign Out Confirmation' : 'Konfirmasi Keluar'}
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.4, marginBottom: 20 }}>
              {isEng
                ? 'Are you sure you want to sign out of your worker session?'
                : 'Apakah Anda yakin ingin keluar dari sesi akun pekerja ini?'}
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn-outline"
                type="button"
                style={{ flex: 1 }}
              >
                {isEng ? 'Cancel' : 'Batal'}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="btn-primary"
                type="button"
                style={{ flex: 1, backgroundColor: '#DC2626', boxShadow: 'none' }}
              >
                {isEng ? 'Sign Out' : 'Keluar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
