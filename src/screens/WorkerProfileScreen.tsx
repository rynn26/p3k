import React from 'react';
import {
  IdCard,
  Pencil,
  Activity,
  ChevronRight,
  User,
  Users,
  Cake,
  GraduationCap,
  Calendar,
  Building2,
  Briefcase,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile } from '../types';

interface WorkerProfileScreenProps {
  userId: string;
  profile: UserProfile | null;
  onEditProfile: () => void;
  onOpenHealthRecord: () => void;
  onOpenAdmin?: () => void;
  onLogout: () => void;
  lang: 'ID' | 'ENG';
  onToggleLang?: () => void;
}

export const WorkerProfileScreen: React.FC<WorkerProfileScreenProps> = ({
  userId,
  profile,
  onEditProfile,
  onOpenHealthRecord,
  onOpenAdmin,
  onLogout,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const fullName = profile?.full_name || (isEng ? 'Worker' : 'Pekerja K3');
  const companyName = profile?.company_name || '-';
  const departmentName = profile?.department_name || '-';
  const gender = profile?.gender || '-';
  const birthDate = profile?.birth_date || '-';
  const education = profile?.education || '-';
  const joinDate = profile?.join_date || '-';

  // ID generator matching Flutter hash
  const workerId = `K3-${(Math.abs(fullName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)) % 9000 + 1000)}`;

  const formatDateDisplay = (val: string) => {
    if (!val || val === '-') return '-';
    if (val.includes('/')) return val;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return val;
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        paddingBottom: 90,
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* 1. TOP HERO WAVE BANNER (WONDR STYLE) */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(to bottom right, #E0F2FE, #BAE6FD)',
          padding: '24px 20px 32px 20px',
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                color: '#0F172A',
              }}
            >
              <IdCard size={22} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#0F172A',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {isEng ? 'Worker Data' : 'Data Pekerja'}
              </h1>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  margin: '3px 0 0 0',
                }}
              >
                {isEng ? 'Identity & OHS Status' : 'Identitas & Status K3'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {profile?.role === 'admin' && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                type="button"
                title={isEng ? 'OHS Admin Panel' : 'Panel Administrator'}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#0F172A',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#38BDF8',
                }}
              >
                <ShieldAlert size={18} />
              </button>
            )}

            <button
              onClick={onEditProfile}
              type="button"
              title={isEng ? 'Edit Profile' : 'Edit Profil'}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
              }}
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
        {/* 2. KARTU IDENTITAS K3 */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            border: '1px solid #E2E8F0',
            padding: 20,
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
          }}
        >
          {/* Top Meta Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  color: '#0284C7',
                }}
              >
                KARTU IDENTITAS K3
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 20,
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                fontSize: 10.5,
                fontWeight: 800,
              }}
            >
              <CheckCircle2 size={13} color="#059669" />
              <span>Terverifikasi K3</span>
            </div>
          </div>

          {/* Main Identity Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
            {/* Avatar Circle */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: 'linear-gradient(to bottom right, #BAE6FD, #0284C7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 900,
                color: '#0F172A',
                boxShadow: '0 3px 10px rgba(2, 132, 199, 0.2)',
                flexShrink: 0,
              }}
            >
              {fullName.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.2px',
                  lineHeight: 1.2,
                }}
              >
                {fullName}
              </h2>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#0284C7',
                  marginTop: 3,
                }}
              >
                {departmentName}
              </div>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: '#64748B',
                  marginTop: 2,
                }}
              >
                {companyName}
              </div>
            </div>
          </div>

          <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '16px 0 12px 0' }} />

          {/* Bottom ID info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: '#64748B',
              }}
            >
              ID: {workerId}
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 9px',
                borderRadius: 12,
                backgroundColor: '#ECFDF5',
                color: '#059669',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                }}
              />
              <span>Status: Aktif</span>
            </div>
          </div>
        </div>

        {/* 3. CATATAN KESEHATAN PEKERJA (Card 2) */}
        <div
          onClick={onOpenHealthRecord}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 22,
            border: '1px solid #E2E8F0',
            padding: 16,
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.12s ease',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: '#E0F2FE',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Activity size={24} />
          </div>

          <div style={{ flex: 1, marginLeft: 14, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Worker Health Record' : 'Catatan Kesehatan Pekerja'}
            </div>
            <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500, marginTop: 3 }}>
              {isEng
                ? 'Physical, BMI, workout habits, and health history.'
                : 'Fisik, IMT, pola olahraga, dan riwayat kesehatan.'}
            </div>
          </div>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              marginLeft: 8,
            }}
          >
            <ChevronRight size={20} />
          </div>
        </div>

        {/* 4. INFORMASI LENGKAP PEKERJA (Card 3) */}
        <div>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: 10,
            }}
          >
            {isEng ? 'Full Worker Information' : 'Informasi Lengkap Pekerja'}
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Row 1: Nama Lengkap */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Full Name' : 'Nama Lengkap'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {fullName}
                </div>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '0 16px' }} />

            {/* Row 2: Jenis Kelamin */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#DBEAFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Gender' : 'Jenis Kelamin'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {gender}
                </div>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '0 16px' }} />

            {/* Row 3: Tanggal Lahir */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Cake size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Birth Date' : 'Tanggal Lahir'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {formatDateDisplay(birthDate)}
                </div>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '0 16px' }} />

            {/* Row 4: Pendidikan Terakhir */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#D1FAE5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <GraduationCap size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Last Education' : 'Pendidikan Terakhir'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {education}
                </div>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '0 16px' }} />

            {/* Row 5: Tanggal Masuk */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Calendar size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Join Date' : 'Tanggal Masuk'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {formatDateDisplay(joinDate)}
                </div>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '0 16px' }} />

            {/* Row 6: Asal Instansi */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Company / Institution' : 'Asal Instansi'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {companyName}
                </div>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#F1F5F9', margin: '0 16px' }} />

            {/* Row 7: Departemen / Unit */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 14 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Briefcase size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                  {isEng ? 'Department / Unit' : 'Departemen / Unit'}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {departmentName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
