import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { ArrowLeft, ArrowRight, CheckCircle2, Save, RotateCcw, AlertCircle, FileText } from 'lucide-react';
import { NBM_BODY_PARTS, NBM_REGIONS, NBM_OPTIONS, calculateNbmScore } from '../utils/nbmData';

interface NbmAssessmentScreenProps {
  userId: string;
  onBack: () => void;
  onSaved: () => void;
  lang: 'ID' | 'ENG';
}

export const NbmAssessmentScreen: React.FC<NbmAssessmentScreenProps> = ({
  userId,
  onBack,
  onSaved,
  lang,
}) => {
  const isEng = lang === 'ENG';

  // scores: bodyPartId -> score (1..4)
  const [scores, setScores] = useState<Record<number, number>>({});
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const filteredParts =
    selectedRegion === 'Semua'
      ? NBM_BODY_PARTS
      : NBM_BODY_PARTS.filter((bp) => bp.region === selectedRegion);

  const answeredCount = Object.keys(scores).length;
  const isAllAnswered = answeredCount === NBM_BODY_PARTS.length;

  const handleSelectScore = (partId: number, value: number) => {
    setScores((prev) => ({ ...prev, [partId]: value }));
    setValidationError(null);
  };

  const handleSubmit = () => {
    if (!isAllAnswered) {
      const remaining = NBM_BODY_PARTS.length - answeredCount;
      setValidationError(
        isEng
          ? `Please complete all body parts. ${remaining} question(s) remaining.`
          : `Harap lengkapi semua area tubuh. Masih ada ${remaining} area yang belum dinilai.`
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowResultModal(true);
  };

  const handleSaveToSupabase = async () => {
    const result = calculateNbmScore(scores);
    setIsSaving(true);

    try {
      const recordId = 'nbm_' + Date.now();
      const payload = {
        id: recordId,
        user_id: userId,
        assessed_at: new Date().toISOString(),
        total_score: result.totalScore,
        risk_level: result.riskLevel,
        action: result.action,
        scores: scores,
      };

      const { error } = await supabase.from('nbm_assessments').insert(payload);
      if (error) {
        console.error('Supabase NBM insert error:', error);
      }

      setShowResultModal(false);
      onSaved();
    } catch (err) {
      console.error('Error saving NBM survey:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const result = calculateNbmScore(scores);

  return (
    <div
      className="fade-in"
      style={{
        padding: '20px 18px 90px 18px',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={onBack}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#0F172A',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ marginLeft: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
            {isEng ? 'Nordic Body Map (NBM)' : 'Survei Nordic Body Map'}
          </span>
          <div style={{ fontSize: 11.5, color: '#64748B', fontWeight: 600 }}>
            {isEng ? '28 Body Discomfort Areas' : '28 Area Keluhan Otot Tubuh'}
          </div>
        </div>
      </div>

      {/* Progress pill */}
      <div
        className="card"
        style={{
          padding: '12px 16px',
          marginBottom: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
            {isEng ? 'Survey Progress' : 'Kelengkapan Survei'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0D5BD7' }}>
            {answeredCount} / {NBM_BODY_PARTS.length}
          </span>
        </div>
        <div
          style={{
            height: 6,
            backgroundColor: '#E2E8F0',
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(answeredCount / NBM_BODY_PARTS.length) * 100}%`,
              backgroundColor: isAllAnswered ? '#10B981' : '#0D5BD7',
              transition: 'all 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Validation Error banner */}
      {validationError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#DC2626',
            fontSize: 12.5,
            fontWeight: 700,
          }}
        >
          <AlertCircle size={18} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Region Filter Chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 10,
          marginBottom: 14,
        }}
      >
        {NBM_REGIONS.map((region) => {
          const isSelected = selectedRegion === region;
          return (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
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
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
              }}
            >
              {region}
            </button>
          );
        })}
      </div>

      {/* Body Parts Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {filteredParts.map((bp) => {
          const currentVal = scores[bp.id];
          return (
            <div
              key={bp.id}
              className="card"
              style={{
                padding: 14,
                borderRadius: 14,
                border: currentVal ? '1px solid #CBD5E1' : '1.5px solid #FCA5A5',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                    No. {bp.id + 1} • {bp.region}
                  </span>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                    {bp.name}
                  </h4>
                </div>

                {currentVal && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: NBM_OPTIONS[currentVal - 1]?.color,
                      backgroundColor: NBM_OPTIONS[currentVal - 1]?.bg,
                      padding: '3px 8px',
                      borderRadius: 10,
                    }}
                  >
                    {NBM_OPTIONS[currentVal - 1]?.label}
                  </span>
                )}
              </div>

              {/* 4 Choices Rating Grid - Labels Only, Sesuai Flutter (NO Numbers) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {NBM_OPTIONS.map((opt) => {
                  const isOptSelected = currentVal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectScore(bp.id, opt.value)}
                      type="button"
                      style={{
                        padding: '10px 4px',
                        borderRadius: 10,
                        border: isOptSelected ? `1.5px solid ${opt.color}` : '1px solid #E2E8F0',
                        backgroundColor: isOptSelected ? opt.color : '#FFFFFF',
                        color: isOptSelected ? '#FFFFFF' : opt.color,
                        fontWeight: isOptSelected ? 800 : 600,
                        fontSize: 10,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 42,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ lineHeight: 1.2 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} className="btn-primary" type="button" style={{ padding: '14px' }}>
        <span>{isEng ? 'Complete Assessment' : 'Selesai melakukan penilaian'}</span>
        <ArrowRight size={18} />
      </button>

      {/* Result Modal - User Mode (No Numeric Score, Icon + Kategori Risiko Sesuai Flutter) */}
      {showResultModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
              borderRadius: 22,
              padding: 24,
              maxWidth: 420,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                backgroundColor: `${result.color}1A`,
                color: result.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                border: `2px solid ${result.color}40`,
              }}
            >
              {result.totalScore <= 49 ? (
                <CheckCircle2 size={36} />
              ) : result.totalScore <= 70 ? (
                <AlertCircle size={36} />
              ) : (
                <AlertCircle size={36} />
              )}
            </div>

            <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>HASIL SURVEI NBM</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: result.color, margin: '6px 0 12px 0' }}>
              {result.riskLevel}
            </div>

            {/* Rincian Area Keluhan (Hitungan Area, Bukan Angka Skor) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 6,
                marginBottom: 16,
              }}
            >
              {[
                { label: 'Tidak Sakit', count: Object.values(scores).filter((v) => v === 1).length, color: '#10B981', bg: '#F0FDF4' },
                { label: 'Agak Sakit', count: Object.values(scores).filter((v) => v === 2).length, color: '#F59E0B', bg: '#FFFBEB' },
                { label: 'Sakit', count: Object.values(scores).filter((v) => v === 3).length, color: '#EA580C', bg: '#FFF7ED' },
                { label: 'Sangat Sakit', count: Object.values(scores).filter((v) => v === 4).length, color: '#DC2626', bg: '#FEF2F2' },
              ].map((c) => (
                <div
                  key={c.label}
                  style={{
                    backgroundColor: c.bg,
                    borderRadius: 10,
                    padding: '8px 4px',
                    border: `1px solid ${c.color}33`,
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800, color: c.color }}>{c.count}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#475569', marginTop: 2, lineHeight: 1.1 }}>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: 14,
                padding: '14px 16px',
                textAlign: 'left',
                marginBottom: 20,
                border: '1px solid #E2E8F0',
              }}
            >
              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 4 }}>
                {isEng ? 'Recommendation:' : 'Rekomendasi Tindakan:'}
              </span>
              <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.45, margin: 0 }}>
                {result.action}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowResultModal(false)}
                type="button"
                className="btn-outline"
                style={{ flex: 1, padding: 12, fontSize: 13 }}
              >
                {isEng ? 'Review Survey' : 'Tinjau Kembali'}
              </button>
              <button
                onClick={handleSaveToSupabase}
                disabled={isSaving}
                type="button"
                className="btn-primary"
                style={{ flex: 1, padding: 12, fontSize: 13 }}
              >
                {isSaving ? (
                  <span>{isEng ? 'Saving...' : 'Menyimpan...'}</span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEng ? 'Save Result' : 'Simpan Hasil'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
