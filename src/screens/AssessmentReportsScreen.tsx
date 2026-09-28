import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Activity, UserCheck } from 'lucide-react';
import { RebaAssessmentRecord, NbmAssessmentRecord } from '../types';

interface AssessmentReportsScreenProps {
  rebaRecords: RebaAssessmentRecord[];
  nbmRecords: NbmAssessmentRecord[];
  lang: 'ID' | 'ENG';
}

export const AssessmentReportsScreen: React.FC<AssessmentReportsScreenProps> = ({
  rebaRecords,
  nbmRecords,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const totalAssessments = rebaRecords.length + nbmRecords.length;

  const avgReba =
    rebaRecords.length > 0
      ? (rebaRecords.reduce((acc, r) => acc + r.final_score, 0) / rebaRecords.length).toFixed(1)
      : '0';

  const avgRebaNum = parseFloat(avgReba);

  const highRiskCount =
    rebaRecords.filter((r) => r.final_score > 10).length +
    nbmRecords.filter((n) => n.total_score > 90).length;

  const mediumRiskCount =
    rebaRecords.filter((r) => r.final_score >= 4 && r.final_score <= 10).length +
    nbmRecords.filter((n) => n.total_score >= 50 && n.total_score <= 90).length;

  const lowRiskCount =
    rebaRecords.filter((r) => r.final_score < 4).length +
    nbmRecords.filter((n) => n.total_score < 50).length;

  const getOverallRisk = () => {
    if (avgRebaNum > 10) return { label: 'Risiko Sangat Tinggi', color: '#DC2626', bg: '#FEF2F2', action: 'Tingkat Aksi Level 4' };
    if (avgRebaNum > 7) return { label: 'Risiko Tinggi', color: '#EA580C', bg: '#FFF7ED', action: 'Tingkat Aksi Level 3' };
    if (avgRebaNum > 3) return { label: 'Risiko Sedang', color: '#F59E0B', bg: '#FFFBEB', action: 'Tingkat Aksi Level 2' };
    if (avgRebaNum > 0) return { label: 'Risiko Rendah', color: '#10B981', bg: '#F0FDF4', action: 'Tingkat Aksi Level 1' };
    return { label: 'Belum Ada Data', color: '#64748B', bg: '#F1F5F9', action: 'Lakukan evaluasi pertama' };
  };

  const overall = getOverallRisk();

  // Average body parts score from REBA
  const avgPart = (key: keyof RebaAssessmentRecord) => {
    if (rebaRecords.length === 0) return 0;
    const sum = rebaRecords.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
    return (sum / rebaRecords.length).toFixed(1);
  };

  const bodyParts = [
    { name: 'Leher (Neck)', val: avgPart('neck_score'), max: 3 },
    { name: 'Punggung (Trunk)', val: avgPart('trunk_score'), max: 5 },
    { name: 'Kaki (Legs)', val: avgPart('legs_score'), max: 4 },
    { name: 'Lengan Atas (Upper Arm)', val: avgPart('upper_arm_score'), max: 6 },
    { name: 'Lengan Bawah (Lower Arm)', val: avgPart('lower_arm_score'), max: 2 },
    { name: 'Pergelangan (Wrist)', val: avgPart('wrist_score'), max: 3 },
  ];

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
          {isEng ? 'Assessment Analytics' : 'Laporan Analisis K3'}
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
          {isEng
            ? 'Aggregated ergonomic telemetry and occupational health summary'
            : 'Ringkasan telemetri risiko ergonomi & kesehatan postur pekerja'}
        </p>
      </div>

      {/* Hero Overview Card */}
      <div
        className="card"
        style={{
          padding: 20,
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          marginBottom: 18,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: '#EFF6FF',
                color: '#0D5BD7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={20} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Posture Risk Level' : 'Tingkat Risiko Postur'}
            </span>
          </div>

          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: overall.color,
              backgroundColor: overall.bg,
              padding: '4px 10px',
              borderRadius: 12,
            }}
          >
            {overall.label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
          <div>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Tingkat Aksi K3</span>
            <div style={{ fontSize: 16, fontWeight: 800, color: overall.color, marginTop: 4 }}>
              {overall.action}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Total Asesmen</span>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
              {totalAssessments} <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>sesi</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: '#F8FAFC',
            fontSize: 12,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ShieldCheck size={16} color="#0D5BD7" />
          <span>Status Ergonomi: <strong>{overall.label}</strong></span>
        </div>
      </div>

      {/* Risk Distribution Bars */}
      <div className="card" style={{ padding: 18, borderRadius: 18, marginBottom: 18 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
          {isEng ? 'Risk Distribution Breakdown' : 'Distribusi Tingkat Risiko'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* High */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: '#DC2626' }}>Risiko Tinggi &amp; Sangat Tinggi</span>
              <span style={{ color: '#0F172A' }}>{highRiskCount} sesi</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${totalAssessments > 0 ? (highRiskCount / totalAssessments) * 100 : 0}%`,
                  backgroundColor: '#DC2626',
                }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: '#F59E0B' }}>Risiko Sedang</span>
              <span style={{ color: '#0F172A' }}>{mediumRiskCount} sesi</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${totalAssessments > 0 ? (mediumRiskCount / totalAssessments) * 100 : 0}%`,
                  backgroundColor: '#F59E0B',
                }}
              />
            </div>
          </div>

          {/* Low */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: '#10B981' }}>Risiko Rendah / Diabaikan</span>
              <span style={{ color: '#0F172A' }}>{lowRiskCount} sesi</span>
            </div>
            <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${totalAssessments > 0 ? (lowRiskCount / totalAssessments) * 100 : 0}%`,
                  backgroundColor: '#10B981',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body Part Telemetry */}
      <div className="card" style={{ padding: 18, borderRadius: 18 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
          {isEng ? 'Body Segments Exposure (REBA)' : 'Paparan Segmen Tubuh (REBA)'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bodyParts.map((bp) => {
            const num = parseFloat(bp.val.toString());
            const isHigh = num > (bp.max * 0.6);
            return (
              <div
                key={bp.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: 12,
                  backgroundColor: '#F8FAFC',
                  fontSize: 12.5,
                  border: '1px solid #E2E8F0',
                }}
              >
                <span style={{ fontWeight: 700, color: '#334155' }}>{bp.name}</span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 11,
                    color: isHigh ? '#EA580C' : '#10B981',
                    backgroundColor: isHigh ? '#FFF7ED' : '#F0FDF4',
                    padding: '3px 8px',
                    borderRadius: 8,
                    border: `1px solid ${isHigh ? '#FDBA74' : '#BBF7D0'}`,
                  }}
                >
                  {isHigh ? 'Perlu Perhatian' : 'Kondisi Aman'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
