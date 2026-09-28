import React, { useState } from 'react';
import { History, Calendar, Accessibility, FileText, ChevronRight, X, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { RebaAssessmentRecord, NbmAssessmentRecord } from '../types';

interface AssessmentHistoryScreenProps {
  rebaRecords: RebaAssessmentRecord[];
  nbmRecords: NbmAssessmentRecord[];
  onStartNew: () => void;
  lang: 'ID' | 'ENG';
}

export const AssessmentHistoryScreen: React.FC<AssessmentHistoryScreenProps> = ({
  rebaRecords,
  nbmRecords,
  onStartNew,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const [filter, setFilter] = useState<'Semua' | 'REBA' | 'NBM' | 'Tinggi'>('Semua');
  const [selectedRecord, setSelectedRecord] = useState<{
    type: 'REBA' | 'NBM';
    data: any;
  } | null>(null);

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

  const getRiskColor = (level: string) => {
    if (level.includes('Sangat Tinggi')) return { fg: '#DC2626', bg: '#FEF2F2' };
    if (level.includes('Tinggi')) return { fg: '#EA580C', bg: '#FFF7ED' };
    if (level.includes('Sedang')) return { fg: '#F59E0B', bg: '#FFFBEB' };
    if (level.includes('Rendah')) return { fg: '#10B981', bg: '#F0FDF4' };
    return { fg: '#0284C7', bg: '#F0F9FF' };
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(isEng ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

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
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.4px' }}>
          {isEng ? 'Assessment History' : 'Riwayat Penilaian'}
        </h2>
        <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
          {isEng
            ? 'Track your ergonomic and body discomfort records over time'
            : 'Pantau rekam jejak evaluasi postur dan keluhan fisik Anda'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['Semua', 'REBA', 'NBM', 'Tinggi'] as const).map((tab) => {
          const isSelected = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              type="button"
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: isSelected ? '1.5px solid #0D5BD7' : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#EBF3FE' : '#FFFFFF',
                color: isSelected ? '#0D5BD7' : '#475569',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {tab === 'Tinggi' ? (isEng ? 'High Risk' : 'Risiko Tinggi') : tab}
            </button>
          );
        })}
      </div>

      {/* Records List or Empty State */}
      {filteredItems.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '36px 20px',
            textAlign: 'center',
            borderRadius: 18,
            border: '1.5px dashed #CBD5E1',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#0D5BD7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <History size={28} />
          </div>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            {isEng ? 'No Assessments Found' : 'Belum Ada Riwayat Penilaian'}
          </h4>
          <p style={{ fontSize: 12.5, color: '#64748B', maxWidth: 280, margin: '0 auto 18px', lineHeight: 1.4 }}>
            {isEng
              ? 'Start your first ergonomic assessment to record workplace posture risks.'
              : 'Mulai penilaian ergonomi pertama Anda untuk merekam evaluasi postur kerja.'}
          </p>
          <button
            onClick={onStartNew}
            className="btn-primary"
            type="button"
            style={{ width: 'auto', padding: '10px 20px', margin: '0 auto', fontSize: 13 }}
          >
            <Sparkles size={16} />
            <span>{isEng ? 'Start New Assessment' : 'Mulai Penilaian Baru'}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredItems.map((item, idx) => {
            const riskColor = getRiskColor(item.data.risk_level);
            const isReba = item.type === 'REBA';
            const rebaData = item.data as RebaAssessmentRecord;
            const nbmData = item.data as NbmAssessmentRecord;

            return (
              <div
                key={item.data.id || idx}
                onClick={() => setSelectedRecord(item)}
                className="card"
                style={{
                  padding: 14,
                  borderRadius: 20,
                  cursor: 'pointer',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.15s ease',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Modern Squircle Badge - Sesuai Flutter (Icon untuk User, Tanpa Angka Skor) */}
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 16,
                      backgroundColor: riskColor.bg,
                      border: `1.5px solid ${riskColor.fg}55`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isReba ? (
                      rebaData.final_score <= 3 ? (
                        <CheckCircle2 size={22} color={riskColor.fg} />
                      ) : rebaData.final_score <= 7 ? (
                        <ShieldAlert size={22} color={riskColor.fg} />
                      ) : (
                        <ShieldAlert size={22} color={riskColor.fg} />
                      )
                    ) : nbmData.total_score <= 49 ? (
                      <CheckCircle2 size={22} color={riskColor.fg} />
                    ) : nbmData.total_score <= 70 ? (
                      <ShieldAlert size={22} color={riskColor.fg} />
                    ) : (
                      <ShieldAlert size={22} color={riskColor.fg} />
                    )}
                    <span
                      style={{
                        fontSize: 8.5,
                        fontWeight: 800,
                        color: riskColor.fg,
                        letterSpacing: '0.4px',
                        marginTop: 2,
                      }}
                    >
                      {isReba ? 'REBA' : 'NBM'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#64748B',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 120,
                        }}
                      >
                        {item.data.id}
                      </span>
                      <span style={{ fontSize: 10, color: '#94A3B8' }}>•</span>
                      <span style={{ fontSize: 10.5, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {formatDate(item.date)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          color: riskColor.fg,
                          backgroundColor: `${riskColor.fg}14`,
                          padding: '2px 8px',
                          borderRadius: 8,
                          display: 'inline-block',
                        }}
                      >
                        {item.data.risk_level}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 11.5,
                        color: '#475569',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.data.action}
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <ChevronRight size={16} color="#CBD5E1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal - Sesuai Flutter (User Mode: Tidak Ada Skor Angka, Panduan Pekerja) */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            zIndex: 100,
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 22,
              maxWidth: 420,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                  {selectedRecord.type === 'REBA' ? 'Detail Penilaian REBA' : 'Detail Kuesioner NBM'}
                </h3>
                <span style={{ fontSize: 11, color: '#64748B' }}>
                  {selectedRecord.data.id} • {formatDate(selectedRecord.data.assessed_at)}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 6,
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Risk Summary Banner - User Mode (Icon, NO Number) */}
            <div
              style={{
                backgroundColor: getRiskColor(selectedRecord.data.risk_level).bg,
                borderRadius: 16,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 16,
                border: `1px solid ${getRiskColor(selectedRecord.data.risk_level).fg}44`,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: `${getRiskColor(selectedRecord.data.risk_level).fg}20`,
                  color: getRiskColor(selectedRecord.data.risk_level).fg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {selectedRecord.data.risk_level?.includes('Rendah') ? (
                  <CheckCircle2 size={28} />
                ) : (
                  <ShieldAlert size={28} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: getRiskColor(selectedRecord.data.risk_level).fg,
                  }}
                >
                  {selectedRecord.data.risk_level}
                </div>
                <div style={{ fontSize: 12, color: '#334155', marginTop: 4, lineHeight: 1.35 }}>
                  {selectedRecord.data.action}
                </div>
              </div>
            </div>

            {/* If REBA: Panduan & Tindak Lanjut Pekerja (Sesuai Flutter line 1047-1104) */}
            {selectedRecord.type === 'REBA' && (
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 18,
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Accessibility size={18} color="#0284C7" />
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                    Status Postur & Risiko Ergonomi
                  </span>
                </div>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.45, margin: '0 0 12px 0' }}>
                  Hasil evaluasi postur kerja Anda menunjukkan kategori{' '}
                  <strong>{selectedRecord.data.risk_level}</strong>. Untuk menjaga kesehatan dan kenyamanan bekerja:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      title: 'Pertahankan Postur Alami',
                      desc: 'Hindari posisi menunduk atau membungkuk terlalu lama saat beraktivitas.',
                    },
                    {
                      title: 'Istirahat & Peregangan Teratur',
                      desc: 'Lakukan peregangan otot ringan tiap 1 - 2 jam kerja agar otot tidak tegang.',
                    },
                    {
                      title: 'Konsultasi Tim K3 / Kesehatan',
                      desc: 'Laporkan jika Anda merasakan pegal atau nyeri berkelanjutan pada bagian tubuh.',
                    },
                  ].map((tip, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 10,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{tip.title}</div>
                      <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2, lineHeight: 1.35 }}>
                        {tip.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If NBM: Keluhan Utama & Rekap Area (Sesuai Flutter line 1204-1230) */}
            {selectedRecord.type === 'NBM' && (
              <div style={{ marginBottom: 18 }}>
                {selectedRecord.data.scores && (
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                      <div
                        style={{
                          flex: 1,
                          backgroundColor: '#FEF2F2',
                          borderRadius: 12,
                          padding: '10px 8px',
                          textAlign: 'center',
                          border: '1px solid #FCA5A5',
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626' }}>
                          {Object.values(selectedRecord.data.scores).filter((v) => v === 4).length} Area
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginTop: 2 }}>
                          Sangat Sakit
                        </div>
                      </div>

                      <div
                        style={{
                          flex: 1,
                          backgroundColor: '#FFF7ED',
                          borderRadius: 12,
                          padding: '10px 8px',
                          textAlign: 'center',
                          border: '1px solid #FDBA74',
                        }}
                      >
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#EA580C' }}>
                          {Object.values(selectedRecord.data.scores).filter((v) => v === 3).length} Area
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginTop: 2 }}>
                          Sakit / Nyeri
                        </div>
                      </div>
                    </div>

                    {/* Keluhan Utama (Area dengan skor >= 3) */}
                    {Object.entries(selectedRecord.data.scores).some(([_, v]) => Number(v) >= 3) && (
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: 14,
                          padding: 14,
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8 }}>
                          Bagian Tubuh dengan Keluhan Utama:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {Object.entries(selectedRecord.data.scores)
                            .filter(([_, v]) => Number(v) >= 3)
                            .map(([key, val]) => (
                              <span
                                key={key}
                                style={{
                                  fontSize: 11,
                                  fontWeight: 700,
                                  color: Number(val) === 4 ? '#DC2626' : '#EA580C',
                                  backgroundColor: Number(val) === 4 ? '#FEF2F2' : '#FFF7ED',
                                  border: `1px solid ${Number(val) === 4 ? '#FCA5A5' : '#FDBA74'}`,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                }}
                              >
                                Area #{Number(key) + 1} ({Number(val) === 4 ? 'Sangat Sakit' : 'Sakit'})
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setSelectedRecord(null)}
              className="btn-primary"
              type="button"
              style={{ width: '100%', padding: 12, fontSize: 13 }}
            >
              {isEng ? 'Close' : 'Tutup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
