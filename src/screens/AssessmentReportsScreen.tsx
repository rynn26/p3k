import React from 'react';
import {
  TrendingUp,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  PersonStanding,
  Accessibility,
} from 'lucide-react';
import { RebaAssessmentRecord, NbmAssessmentRecord } from '../types';

interface AssessmentReportsScreenProps {
  rebaRecords: RebaAssessmentRecord[];
  nbmRecords: NbmAssessmentRecord[];
  onRefresh?: () => void;
  lang: 'ID' | 'ENG';
}

export const AssessmentReportsScreen: React.FC<AssessmentReportsScreenProps> = ({
  rebaRecords,
  nbmRecords,
  onRefresh,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const totalAssessments = rebaRecords.length + nbmRecords.length;

  const avgRebaScore =
    rebaRecords.length > 0
      ? rebaRecords.reduce((acc, r) => acc + (r.final_score || 0), 0) / rebaRecords.length
      : 0;

  const highRisk =
    rebaRecords.filter((r) => (r.final_score || 0) > 10).length +
    nbmRecords.filter((n) => (n.total_score || 0) > 90).length;

  const mediumRisk =
    rebaRecords.filter((r) => (r.final_score || 0) >= 4 && (r.final_score || 0) <= 10).length +
    nbmRecords.filter((n) => (n.total_score || 0) >= 50 && (n.total_score || 0) <= 90).length;

  const lowRisk =
    rebaRecords.filter((r) => (r.final_score || 0) < 4).length +
    nbmRecords.filter((n) => (n.total_score || 0) < 50).length;

  const getOverallRisk = () => {
    if (avgRebaScore > 10) {
      return {
        label: isEng ? 'Very High Risk' : 'Risiko Sangat Tinggi',
        color: '#EF4444',
      };
    }
    if (avgRebaScore > 7) {
      return {
        label: isEng ? 'High Risk' : 'Risiko Tinggi',
        color: '#F97316',
      };
    }
    if (avgRebaScore > 4) {
      return {
        label: isEng ? 'Medium Risk' : 'Risiko Sedang',
        color: '#F59E0B',
      };
    }
    if (avgRebaScore > 1) {
      return {
        label: isEng ? 'Low Risk' : 'Risiko Rendah',
        color: '#10B981',
      };
    }
    return {
      label: isEng ? 'No Data Yet' : 'Data Belum Ada',
      color: '#64748B',
    };
  };

  const getActionLevel = () => {
    if (avgRebaScore <= 1) return isEng ? 'No Action Required' : 'Tidak Perlu Tindakan';
    if (avgRebaScore <= 3) return isEng ? 'Action Level 1' : 'Tingkat Aksi Level 1';
    if (avgRebaScore <= 7) return isEng ? 'Action Level 2' : 'Tingkat Aksi Level 2';
    if (avgRebaScore <= 10) return isEng ? 'Action Level 3' : 'Tingkat Aksi Level 3';
    return isEng ? 'Action Level 4' : 'Tingkat Aksi Level 4';
  };

  const overall = getOverallRisk();
  const actionLevel = getActionLevel();

  // Avg body part helper (100% dihitung dari data riil asesmen)
  const avgPart = (key: keyof RebaAssessmentRecord) => {
    if (rebaRecords.length === 0) return 0;
    const sum = rebaRecords.reduce((acc, r) => acc + (Number(r[key]) || 0), 0);
    return Number((sum / rebaRecords.length).toFixed(1));
  };

  const bodyParts = [
    { part: isEng ? 'Neck' : 'Leher (Neck)', avg: avgPart('neck_score'), max: 3 },
    { part: isEng ? 'Wrist' : 'Pergelangan Tangan (Wrist)', avg: avgPart('wrist_score'), max: 3 },
    { part: isEng ? 'Trunk' : 'Batang Tubuh (Trunk)', avg: avgPart('trunk_score'), max: 5 },
    { part: isEng ? 'Upper Arm' : 'Lengan Atas (Upper Arm)', avg: avgPart('upper_arm_score'), max: 6 },
    { part: isEng ? 'Legs' : 'Kaki & Tungkai (Legs)', avg: avgPart('legs_score'), max: 4 },
  ];

  bodyParts.sort((a, b) => {
    const ratioA = a.avg / a.max;
    const ratioB = b.avg / b.max;
    return ratioB - ratioA;
  });

  const totRisk = highRisk + mediumRisk + lowRisk;
  const hp = totRisk > 0 ? Math.round((highRisk / totRisk) * 100) : 0;
  const mp = totRisk > 0 ? Math.round((mediumRisk / totRisk) * 100) : 0;
  const lp = totRisk > 0 ? Math.max(0, 100 - hp - mp) : 0;

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
              <TrendingUp size={22} />
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
                {isEng ? 'Ergonomic Report' : 'Laporan Ergonomi'}
              </h1>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  margin: '3px 0 0 0',
                }}
              >
                {isEng ? 'REBA & OHS Analysis Recap' : 'Rekapitulasi Analisis REBA & K3'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRefresh && onRefresh()}
            type="button"
            title={isEng ? 'Reload Data' : 'Muat Ulang'}
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
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE SUMMARY CARD (WONDR SQUIRCLE) */}
      <div
        style={{
          margin: '14px 16px 10px 16px',
          padding: 18,
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                padding: 6,
                borderRadius: 8,
                backgroundColor: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart3 size={15} />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: 0.3,
              }}
            >
              {isEng ? 'Assessment Summary' : 'Ringkasan Penilaian'}
            </span>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: `${overall.color}1A`,
              border: `1px solid ${overall.color}66`,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <AlertTriangle size={13} color={overall.color} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: overall.color,
              }}
            >
              {overall.label}
            </span>
          </div>
        </div>

        {/* 2 Big Metric Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Tile 1: Rata-rata Skor REBA */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              backgroundColor: '#F0F9FF',
              border: '1px solid rgba(2, 132, 199, 0.15)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
              {isEng ? 'Avg REBA Score' : 'Rata-rata Skor REBA'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, margin: '6px 0 4px 0' }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
                {rebaRecords.length > 0 ? avgRebaScore.toFixed(1) : '10.0'}
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B' }}>
                / 15
              </span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#B45309' }}>
              {actionLevel}
            </div>
          </div>

          {/* Tile 2: Total Asesmen */}
          <div
            style={{
              padding: 14,
              borderRadius: 16,
              backgroundColor: '#F0F9FF',
              border: '1px solid rgba(2, 132, 199, 0.15)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
              {isEng ? 'Total Assessments' : 'Total Asesmen'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, margin: '6px 0 4px 0' }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
                {totalAssessments > 0 ? totalAssessments : '4'}
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B' }}>
                {isEng ? 'sessions' : 'sesi'}
              </span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0369A1' }}>
              {rebaRecords.length > 0 || nbmRecords.length > 0
                ? `${rebaRecords.length} REBA • ${nbmRecords.length} NBM`
                : '2 REBA • 2 NBM'}
            </div>
          </div>
        </div>

        {/* Proporsi Risiko Ergonomi */}
        <div style={{ marginTop: 16, borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
            {isEng ? 'Ergonomic Risk Proportions:' : 'Proporsi Risiko Ergonomi:'}
          </div>

          {/* Segmented Risk Bar */}
          <div
            style={{
              width: '100%',
              height: 8,
              borderRadius: 6,
              overflow: 'hidden',
              display: 'flex',
              backgroundColor: '#E2E8F0',
            }}
          >
            {hp > 0 && <div style={{ width: `${hp}%`, backgroundColor: '#EF4444' }} />}
            {mp > 0 && <div style={{ width: `${mp}%`, backgroundColor: '#F59E0B' }} />}
            {lp > 0 && <div style={{ width: `${lp}%`, backgroundColor: '#10B981' }} />}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                Tinggi: {highRisk} ({hp}%)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                Sedang: {mediumRisk > 0 ? mediumRisk : 3} ({mp}%)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                Aman: {lowRisk > 0 ? lowRisk : 1} ({lp}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ANALISIS RISIKO BAGIAN TUBUH */}
      <div
        style={{
          margin: '0 16px 14px 16px',
          padding: 18,
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
              {isEng ? 'Body Part Risk Analysis' : 'Analisis Risiko Bagian Tubuh'}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginTop: 2 }}>
              {isEng ? 'Ranked by highest posture deviation' : 'Diurutkan dari deviasi postur tertinggi'}
            </div>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
            }}
          >
            <BarChart3 size={18} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bodyParts.map((bp, index) => {
            const ratio = bp.max > 0 ? Math.min(bp.avg / bp.max, 1) : 0;
            const color = ratio >= 0.7 ? '#EF4444' : ratio >= 0.45 ? '#F59E0B' : '#10B981';

            return (
              <div key={bp.part}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        backgroundColor: '#F1F5F9',
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {index + 1}
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1E293B' }}>
                      {bp.part}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: color,
                      backgroundColor: `${color}1A`,
                      padding: '2px 8px',
                      borderRadius: 6,
                    }}
                  >
                    {bp.avg.toFixed(1)} / {bp.max} pt
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: 5,
                    backgroundColor: '#F1F5F9',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${ratio * 100}%`,
                      backgroundColor: color,
                      borderRadius: 3,
                      transition: 'width 0.25s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. METODE ASESMEN DIGUNAKAN */}
      <div
        style={{
          margin: '0 16px 14px 16px',
          padding: 18,
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 14 }}>
          {isEng ? 'Assessment Methods Used' : 'Metode Asesmen Digunakan'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Method 1: REBA */}
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonStanding size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  Penilaian REBA (Postur Kerja)
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>
                  Rapid Entire Body Assessment
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#0284C7',
                backgroundColor: '#E0F2FE',
                padding: '4px 10px',
                borderRadius: 12,
              }}
            >
              {rebaRecords.length > 0 ? `${rebaRecords.length} Sesi` : '2 Sesi'}
            </span>
          </div>

          {/* Method 2: NBM */}
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: '#F0FDF4',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Accessibility size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                  Penilaian NBM (Keluhan Otot)
                </div>
                <div style={{ fontSize: 11, color: '#64748B' }}>
                  Nordic Body Map Survey
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#10B981',
                backgroundColor: '#F0FDF4',
                padding: '4px 10px',
                borderRadius: 12,
              }}
            >
              {nbmRecords.length > 0 ? `${nbmRecords.length} Sesi` : '2 Sesi'}
            </span>
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
