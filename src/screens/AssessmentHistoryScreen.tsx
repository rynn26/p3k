import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  History,
  RotateCcw,
  BarChart3,
  ClipboardList,
  PersonStanding,
  Accessibility,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { RebaAssessmentRecord, NbmAssessmentRecord } from '../types';

interface AssessmentHistoryScreenProps {
  rebaRecords: RebaAssessmentRecord[];
  nbmRecords: NbmAssessmentRecord[];
  onStartNew?: () => void;
  onStartReba?: () => void;
  onStartNbm?: () => void;
  onRefresh?: () => void;
  lang: 'ID' | 'ENG';
}

export const AssessmentHistoryScreen: React.FC<AssessmentHistoryScreenProps> = ({
  rebaRecords,
  nbmRecords,
  onStartNew,
  onStartReba,
  onStartNbm,
  onRefresh,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const [filter, setFilter] = useState<'Semua' | 'REBA' | 'NBM' | 'Tinggi'>('Semua');
  const [selectedRecord, setSelectedRecord] = useState<{
    type: 'REBA' | 'NBM';
    data: any;
  } | null>(null);
  const [showNewDialog, setShowNewDialog] = useState(false);

  // Combine & sort by date descending
  type CombinedItem =
    | { type: 'REBA'; date: string; data: RebaAssessmentRecord }
    | { type: 'NBM'; date: string; data: NbmAssessmentRecord };

  const allItems: CombinedItem[] = [
    ...rebaRecords.map((r) => ({ type: 'REBA' as const, date: r.assessed_at, data: r })),
    ...nbmRecords.map((n) => ({ type: 'NBM' as const, date: n.assessed_at, data: n })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredItems = allItems.filter((item) => {
    if (filter === 'Semua') return true;
    if (filter === 'REBA') return item.type === 'REBA';
    if (filter === 'NBM') return item.type === 'NBM';
    if (filter === 'Tinggi') {
      return item.data.risk_level?.includes('Tinggi');
    }
    return true;
  });

  const totalCount = allItems.length;
  const rebaCount = rebaRecords.length;
  const nbmCount = nbmRecords.length;
  const highRiskCount = allItems.filter((i) => i.data.risk_level?.includes('Tinggi')).length;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${day} ${month} ${year} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return dateStr;
    }
  };

  const getRebaBadgeColors = (score: number) => {
    if (score <= 1) return { fg: '#0EA5E9', bg: '#F0F9FF' };
    if (score <= 3) return { fg: '#10B981', bg: '#F0FDF4' };
    if (score <= 7) return { fg: '#F59E0B', bg: '#FFFBEB' };
    if (score <= 10) return { fg: '#EA580C', bg: '#FFF7ED' };
    return { fg: '#DC2626', bg: '#FEF2F2' };
  };

  const getNbmBadgeColors = (score: number) => {
    if (score <= 49) return { fg: '#10B981', bg: '#F0FDF4' };
    if (score <= 70) return { fg: '#F59E0B', bg: '#FFFBEB' };
    if (score <= 90) return { fg: '#EA580C', bg: '#FFF7ED' };
    return { fg: '#DC2626', bg: '#FEF2F2' };
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
              <History size={22} />
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
                {isEng ? 'Assessment History' : 'Riwayat Asesmen'}
              </h1>
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#475569',
                  margin: '3px 0 0 0',
                }}
              >
                {totalCount} {isEng ? 'saved posture assessments' : 'evaluasi postur tersimpan'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onRefresh && onRefresh()}
            type="button"
            title={isEng ? 'Reload Data' : 'Muat Ulang Data'}
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

      {/* 2. SUMMARY STATS CARD (WONDR SQUIRCLE) */}
      <div
        style={{
          margin: '14px 16px',
          padding: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
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
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 0.8,
                color: '#0F172A',
              }}
            >
              {isEng ? 'DATA SUMMARY' : 'RINGKASAN DATA'}
            </span>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: 20,
              backgroundColor: '#F1F5F9',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#475569',
            }}
          >
            {totalCount} Total Data
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {/* Stat 1: Total */}
          <div
            style={{
              backgroundColor: '#F1F5F9',
              borderRadius: 16,
              padding: '10px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ClipboardList size={16} color="#0F172A" />
            <span style={{ fontSize: 17, fontWeight: 900, color: '#0F172A', marginTop: 4 }}>
              {totalCount}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(15, 23, 42, 0.75)', marginTop: 2 }}>
              Total
            </span>
          </div>

          {/* Stat 2: REBA */}
          <div
            style={{
              backgroundColor: '#E0F2FE',
              borderRadius: 16,
              padding: '10px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PersonStanding size={16} color="#0284C7" />
            <span style={{ fontSize: 17, fontWeight: 900, color: '#0284C7', marginTop: 4 }}>
              {rebaCount}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#0284C7', marginTop: 2 }}>
              REBA
            </span>
          </div>

          {/* Stat 3: NBM */}
          <div
            style={{
              backgroundColor: '#DBEAFE',
              borderRadius: 16,
              padding: '10px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Accessibility size={16} color="#1E3A8A" />
            <span style={{ fontSize: 17, fontWeight: 900, color: '#1E3A8A', marginTop: 4 }}>
              {nbmCount}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1E3A8A', marginTop: 2 }}>
              NBM
            </span>
          </div>

          {/* Stat 4: Risiko */}
          <div
            style={{
              backgroundColor: '#FFE4E6',
              borderRadius: 16,
              padding: '10px 4px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <AlertTriangle size={16} color="#E11D48" />
            <span style={{ fontSize: 17, fontWeight: 900, color: '#E11D48', marginTop: 4 }}>
              {highRiskCount}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#E11D48', marginTop: 2 }}>
              Risiko
            </span>
          </div>
        </div>
      </div>

      {/* 3. FILTER ROW */}
      <div style={{ padding: '0 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
          Filter:
        </span>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[
            { id: 'Semua', label: 'Semua' },
            { id: 'REBA', label: 'REBA' },
            { id: 'NBM', label: 'NBM' },
            { id: 'Tinggi', label: 'Risiko Tinggi' },
          ].map((item) => {
            const isSelected = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 20,
                  backgroundColor: isSelected ? '#0284C7' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#475569',
                  border: isSelected ? '1.2px solid #0284C7' : '1.2px solid #E2E8F0',
                  boxShadow: isSelected ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none',
                  fontSize: 12,
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#BAE6FD',
                    }}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. RECORDS LIST */}
      <div style={{ padding: '0 16px 110px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px dashed #CBD5E1',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#E0F2FE',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <History size={26} />
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
              {isEng ? 'No Assessments Found' : 'Belum Ada Riwayat Penilaian'}
            </h4>
            <p style={{ fontSize: 12, color: '#64748B', maxWidth: 280, margin: '0 auto 16px auto', lineHeight: 1.4 }}>
              {isEng
                ? 'Start your first ergonomic assessment to record workplace posture risks.'
                : 'Mulai penilaian ergonomi pertama Anda untuk merekam evaluasi postur kerja.'}
            </p>
            <button
              onClick={() => setShowNewDialog(true)}
              type="button"
              style={{
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                borderRadius: 12,
                border: 'none',
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {isEng ? 'Start Assessment' : 'Mulai Penilaian'}
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isReba = item.type === 'REBA';
            const rData = item.data;
            const score = isReba ? (rData as RebaAssessmentRecord).final_score || 0 : (rData as NbmAssessmentRecord).total_score || 0;
            const riskColors = isReba ? getRebaBadgeColors(score) : getNbmBadgeColors(score);

            // Icon for squircle
            let BadgeIcon = ShieldCheck;
            if (isReba) {
              BadgeIcon = AlertCircle;
            } else if (score > 70) {
              BadgeIcon = AlertTriangle;
            } else if (score > 49) {
              BadgeIcon = AlertTriangle;
            }

            return (
              <div
                key={rData.id || idx}
                onClick={() => setSelectedRecord(item)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid #E2E8F0',
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'transform 0.12s ease',
                }}
              >
                {/* Modern squircle badge */}
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 16,
                    backgroundColor: riskColors.bg,
                    border: `1.5px solid ${riskColors.fg}66`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    gap: 2,
                  }}
                >
                  <BadgeIcon size={20} color={riskColors.fg} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 900,
                      color: riskColors.fg,
                      letterSpacing: 0.4,
                    }}
                  >
                    {item.type}
                  </span>
                </div>

                {/* Middle Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: '#0F172A',
                      }}
                    >
                      {rData.id || `${item.type}-${idx}`}
                    </span>
                    <span style={{ fontSize: 10.5, color: '#64748B', fontWeight: 500 }}>
                      {formatDate(item.date)}
                    </span>
                  </div>

                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: riskColors.fg,
                        backgroundColor: riskColors.bg,
                        padding: '2px 8px',
                        borderRadius: 10,
                        border: `1px solid ${riskColors.fg}33`,
                      }}
                    >
                      {rData.risk_level || 'Normal'}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 11,
                      color: '#64748B',
                      margin: '4px 0 0 0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {rData.action || 'Evaluasi postur kerja'}
                  </p>
                </div>

                {/* Right Arrow */}
                <ChevronRight size={18} color="#94A3B8" />
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (+ Penilaian Baru) */}
      <button
        onClick={() => setShowNewDialog(true)}
        type="button"
        style={{
          position: 'fixed',
          bottom: 80,
          right: 'calc(50% - 220px)',
          backgroundColor: '#0284C7',
          color: '#FFFFFF',
          borderRadius: 24,
          padding: '12px 20px',
          border: 'none',
          boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
          zIndex: 45,
          transition: 'transform 0.15s ease',
        }}
      >
        <Plus size={20} />
        <span>{isEng ? 'New Assessment' : 'Penilaian Baru'}</span>
      </button>

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

      {/* Dialog: Pilih Penilaian Baru */}
      {showNewDialog && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setShowNewDialog(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 999999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 22,
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ fontSize: 16.5, fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
              {isEng ? 'New Ergonomic Assessment' : 'Pilih Modul Penilaian'}
            </h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px 0' }}>
              {isEng ? 'Select assessment method to perform:' : 'Pilih metode penilaian yang ingin dilakukan:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setShowNewDialog(false);
                  if (onStartReba) onStartReba();
                  else if (onStartNew) onStartNew();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 14,
                  backgroundColor: '#F0F9FF',
                  border: '1.2px solid #BAE6FD',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonStanding size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                    Penilaian REBA
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Rapid Entire Body Assessment (Postur Kerja)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowNewDialog(false);
                  if (onStartNbm) onStartNbm();
                  else if (onStartNew) onStartNew();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 14,
                  backgroundColor: '#F0FDF4',
                  border: '1.2px solid #A7F3D0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Accessibility size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                    Penilaian NBM
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>
                    Nordic Body Map (Survei 28 Keluhan Otot)
                  </div>
                </div>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                type="button"
                onClick={() => setShowNewDialog(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  padding: '6px 12px',
                }}
              >
                {isEng ? 'Cancel' : 'Batal'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Detail Rekaman */}
      {selectedRecord && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setSelectedRecord(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 999999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 22,
              maxWidth: 380,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#0284C7',
                    backgroundColor: '#E0F2FE',
                    padding: '2px 8px',
                    borderRadius: 10,
                  }}
                >
                  {selectedRecord.type} Assessment
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', margin: '4px 0 0 0' }}>
                  {selectedRecord.data.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 4,
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: 11.5, color: '#64748B', marginBottom: 16 }}>
              {formatDate(selectedRecord.data.assessed_at)}
            </div>

            {/* Score & Risk */}
            <div
              style={{
                padding: 14,
                borderRadius: 16,
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Tingkat Risiko</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                  {selectedRecord.data.risk_level || 'Normal'}
                </div>
              </div>

              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 900, lineHeight: 1 }}>
                  {selectedRecord.type === 'REBA'
                    ? selectedRecord.data.final_score
                    : selectedRecord.data.total_score}
                </span>
                <span style={{ fontSize: 8, fontWeight: 800 }}>SKOR</span>
              </div>
            </div>

            {/* Rekomendasi Tindakan */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                Rekomendasi Tindakan
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: '#475569',
                  lineHeight: 1.45,
                  backgroundColor: '#F8FAFC',
                  padding: 12,
                  borderRadius: 12,
                  margin: 0,
                  border: '1px solid #E2E8F0',
                }}
              >
                {selectedRecord.data.action || 'Tidak diperlukan tindakan perbaikan saat ini.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRecord(null)}
              style={{
                width: '100%',
                height: 42,
                borderRadius: 12,
                border: 'none',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Tutup
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
