import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../services/supabase';
import {
  ChevronLeft,
  Info,
  Send,
  CheckCircle2,
  X,
  User,
  Hand,
  Footprints,
  PersonStanding,
} from 'lucide-react';

interface NbmAssessmentScreenProps {
  userId: string;
  onBack: () => void;
  onSaved: () => void;
  lang?: 'ID' | 'ENG';
  onToggleLang?: () => void;
}

interface BodyPart {
  id: number;
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
  iconType: 'person' | 'hand' | 'leg';
}

const BODY_PARTS: BodyPart[] = [
  { id: 0, name: 'Leher bagian atas', nameEn: 'Upper Neck', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders', iconType: 'person' },
  { id: 1, name: 'Leher bagian bawah', nameEn: 'Lower Neck', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders', iconType: 'person' },
  { id: 2, name: 'Bahu kiri', nameEn: 'Left Shoulder', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders', iconType: 'person' },
  { id: 3, name: 'Bahu kanan', nameEn: 'Right Shoulder', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders', iconType: 'person' },
  { id: 4, name: 'Lengan atas kiri', nameEn: 'Left Upper Arm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 5, name: 'Punggung', nameEn: 'Upper Back', region: 'Punggung & Badan', regionEn: 'Back & Torso', iconType: 'person' },
  { id: 6, name: 'Lengan atas kanan', nameEn: 'Right Upper Arm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 7, name: 'Pinggang', nameEn: 'Waist / Lower Back', region: 'Punggung & Badan', regionEn: 'Back & Torso', iconType: 'person' },
  { id: 8, name: 'Bokong', nameEn: 'Buttocks', region: 'Punggung & Badan', regionEn: 'Back & Torso', iconType: 'person' },
  { id: 9, name: 'Pantat', nameEn: 'Bottom', region: 'Punggung & Badan', regionEn: 'Back & Torso', iconType: 'person' },
  { id: 10, name: 'Siku kiri', nameEn: 'Left Elbow', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 11, name: 'Siku kanan', nameEn: 'Right Elbow', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 12, name: 'Lengan bawah kiri', nameEn: 'Left Forearm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 13, name: 'Lengan bawah kanan', nameEn: 'Right Forearm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 14, name: 'Pergelangan tangan kiri', nameEn: 'Left Wrist', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 15, name: 'Pergelangan tangan kanan', nameEn: 'Right Wrist', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 16, name: 'Tangan kiri', nameEn: 'Left Hand', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 17, name: 'Tangan kanan', nameEn: 'Right Hand', region: 'Lengan & Tangan', regionEn: 'Arms & Hands', iconType: 'hand' },
  { id: 18, name: 'Paha kiri', nameEn: 'Left Thigh', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 19, name: 'Paha kanan', nameEn: 'Right Thigh', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 20, name: 'Lutut kiri', nameEn: 'Left Knee', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 21, name: 'Lutut kanan', nameEn: 'Right Knee', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 22, name: 'Betis kiri', nameEn: 'Left Calf', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 23, name: 'Betis kanan', nameEn: 'Right Calf', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 24, name: 'Pergelangan kaki kiri', nameEn: 'Left Ankle', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 25, name: 'Pergelangan kaki kanan', nameEn: 'Right Ankle', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 26, name: 'Kaki kiri', nameEn: 'Left Foot', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
  { id: 27, name: 'Kaki kanan', nameEn: 'Right Foot', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet', iconType: 'leg' },
];

const REGIONS = [
  { id: 'all', name: 'Semua', nameEn: 'All' },
  { id: 'neck', name: 'Leher & Bahu', nameEn: 'Neck & Shoulders' },
  { id: 'back', name: 'Punggung & Badan', nameEn: 'Back & Torso' },
  { id: 'arms', name: 'Lengan & Tangan', nameEn: 'Arms & Hands' },
  { id: 'legs', name: 'Kaki & Tungkai', nameEn: 'Legs & Feet' },
];

const SCORE_OPTIONS = [
  { score: 1, label: 'Tidak Sakit', labelEn: 'No Pain', color: '#10B981' },
  { score: 2, label: 'Agak Sakit', labelEn: 'Mild Pain', color: '#F59E0B' },
  { score: 3, label: 'Sakit', labelEn: 'Painful', color: '#EA580C' },
  { score: 4, label: 'Sangat Sakit', labelEn: 'Severe Pain', color: '#DC2626' },
];

export const NbmAssessmentScreen: React.FC<NbmAssessmentScreenProps> = ({
  userId,
  onBack,
  onSaved,
  lang = 'ID',
  onToggleLang,
}) => {
  const isEng = lang === 'ENG';

  const [scores, setScores] = useState<Record<number, number | null>>({});
  const [selectedRegionId, setSelectedRegionId] = useState('all');
  const [highlightedCardId, setHighlightedCardId] = useState<number | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const answeredCount = Object.values(scores).filter((v) => v !== null && v !== undefined).length;
  const isAllAnswered = answeredCount === BODY_PARTS.length;

  const totalScore = Object.values(scores).reduce<number>((sum, val) => sum + (val || 0), 0);

  const calculateRisk = (score: number) => {
    if (score <= 49) {
      return {
        level: isEng ? 'Low' : 'Rendah',
        desc: isEng
          ? 'Low risk of musculoskeletal complaints. No specific improvement required yet.'
          : 'Tingkat risiko keluhan otot rendah. Belum diperlukan tindakan perbaikan khusus.',
        color: '#10B981',
        bgColor: '#F0FDF4',
        borderColor: '#86EFAC',
        action: isEng
          ? 'Maintain ergonomic postures and perform routine stretches.'
          : 'Pertahankan postur kerja ergonomis dan lakukan peregangan rutin.',
      };
    } else if (score <= 70) {
      return {
        level: isEng ? 'Medium' : 'Sedang',
        desc: isEng
          ? 'Medium risk of musculoskeletal complaints. Improvement action may be required later.'
          : 'Tingkat risiko keluhan otot sedang. Mungkin diperlukan tindakan perbaikan di kemudian hari.',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        borderColor: '#FCD34D',
        action: isEng
          ? 'Evaluate workstations and schedule periodic rest breaks.'
          : 'Evaluasi stasiun kerja dan atur waktu istirahat secara berkala.',
      };
    } else if (score <= 90) {
      return {
        level: isEng ? 'High' : 'Tinggi',
        desc: isEng
          ? 'High risk of musculoskeletal complaints. Immediate improvement required!'
          : 'Tingkat risiko keluhan otot tinggi. Diperlukan tindakan perbaikan segera!',
        color: '#EA580C',
        bgColor: '#FFF7ED',
        borderColor: '#FDBA74',
        action: isEng
          ? 'Thoroughly investigate workstation and correct awkward postures immediately.'
          : 'Investigasi menyeluruh stasiun kerja dan perbaiki postur janggal segera.',
      };
    } else {
      return {
        level: isEng ? 'Very High' : 'Sangat Tinggi',
        desc: isEng
          ? 'Very high risk of musculoskeletal complaints. Action needed right now!'
          : 'Tingkat risiko keluhan otot sangat tinggi. Diperlukan tindakan perbaikan saat ini juga!',
        color: '#DC2626',
        bgColor: '#FEF2F2',
        borderColor: '#FCA5A5',
        action: isEng
          ? 'Stop high-risk activities and conduct ergonomic redesign immediately!'
          : 'Hentikan aktivitas berisiko tinggi dan lakukan redesain ergonomi segera!',
      };
    }
  };

  const risk = calculateRisk(totalScore);

  const countTidakSakit = Object.values(scores).filter((v) => v === 1).length;
  const countAgakSakit = Object.values(scores).filter((v) => v === 2).length;
  const countSakit = Object.values(scores).filter((v) => v === 3).length;
  const countSangatSakit = Object.values(scores).filter((v) => v === 4).length;

  const painfulParts = BODY_PARTS.filter((bp) => {
    const s = scores[bp.id];
    return s !== null && s !== undefined && s >= 3;
  });

  const filteredParts =
    selectedRegionId === 'all'
      ? BODY_PARTS
      : BODY_PARTS.filter((bp) => {
          if (selectedRegionId === 'neck') return bp.region === 'Leher & Bahu';
          if (selectedRegionId === 'back') return bp.region === 'Punggung & Badan';
          if (selectedRegionId === 'arms') return bp.region === 'Lengan & Tangan';
          if (selectedRegionId === 'legs') return bp.region === 'Kaki & Tungkai';
          return true;
        });

  const scrollToFirstUnanswered = () => {
    const unanswered = BODY_PARTS.find((bp) => scores[bp.id] === null || scores[bp.id] === undefined);
    if (unanswered) {
      if (selectedRegionId !== 'all') {
        setSelectedRegionId('all');
      }

      setHighlightedCardId(unanswered.id);

      setTimeout(() => {
        const el = cardRefs.current[unanswered.id];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      const partName = isEng ? unanswered.nameEn : unanswered.name;
      setToastMessage(
        isEng
          ? `Directing to unanswered area: ${partName}`
          : `Mengarahkan ke bagian yang belum diisi: ${partName}`
      );
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleSelectScore = (partId: number, score: number) => {
    setScores((prev) => ({ ...prev, [partId]: score }));
    if (highlightedCardId === partId) {
      setHighlightedCardId(null);
    }
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      let currentUid: string | null = userId;
      if (!currentUid) {
        const { data: authData } = await supabase.auth.getUser();
        currentUid = authData?.user?.id || null;
      }

      if (!currentUid) throw new Error('User not authenticated');

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const recordId = `NBM-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      const cleanScores: Record<string, number> = {};
      BODY_PARTS.forEach((bp) => {
        cleanScores[bp.id.toString()] = scores[bp.id] || 1;
      });

      const payload = {
        id: recordId,
        user_id: currentUid,
        assessed_at: now.toISOString(),
        total_score: totalScore,
        risk_level: risk.level,
        action: risk.action,
        scores: cleanScores,
      };

      const { error } = await supabase.from('nbm_assessments').upsert(payload);
      if (error) {
        console.error('Supabase NBM save error:', error);
      }

      setShowResultModal(false);
      onSaved();
    } catch (err) {
      console.error('Error saving NBM assessment:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'hand':
        return <Hand size={18} color="#0284C7" />;
      case 'leg':
        return <Footprints size={18} color="#0284C7" />;
      default:
        return <PersonStanding size={20} color="#0284C7" />;
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        maxWidth: 420,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Top AppBar matching Flutter */}
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
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
          <ChevronLeft size={20} />
        </button>

        <div style={{ flex: 1, paddingLeft: 6, minWidth: 0 }}>
          <h1
            style={{
              fontSize: 13.5,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isEng
              ? 'Musculoskeletal Disorders Assessment'
              : 'Penilaian Keluhan Musculoskeletal ...'}
          </h1>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#0284C7',
              margin: '2px 0 0 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isEng ? 'using Nordic Body Map (NBM)' : 'menggunakan Nordic Body Map (NBM)'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 800,
                color: '#0F172A',
                cursor: 'pointer',
              }}
            >
              <span>🌐</span>
              <span>{isEng ? 'ENG' : 'IDN'}</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowGuideModal(true);
            }}
            type="button"
            title={isEng ? 'NBM Score Guide' : 'Panduan Skor NBM'}
            aria-label="Panduan Skor NBM"
            style={{
              background: 'none',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284C7',
              borderRadius: 8,
              position: 'relative',
              zIndex: 30,
            }}
          >
            <Info size={22} />
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '10px 16px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 6,
          }}
        >
          {isEng ? 'Survey Progress' : 'Progress Pengisian'}
        </div>
        <div
          style={{
            width: '100%',
            height: 6,
            backgroundColor: '#E2E8F0',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(answeredCount / BODY_PARTS.length) * 100}%`,
              backgroundColor: isAllAnswered ? '#10B981' : '#0284C7',
              transition: 'width 0.25s ease',
            }}
          />
        </div>
      </div>

      {/* Region Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          padding: '10px 16px',
          whiteSpace: 'nowrap',
          backgroundColor: '#F8FAFC',
          scrollbarWidth: 'none',
        }}
      >
        {REGIONS.map((region) => {
          const isSelected = selectedRegionId === region.id;
          return (
            <button
              key={region.id}
              onClick={() => setSelectedRegionId(region.id)}
              type="button"
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: isSelected ? '1px solid #0284C7' : '1px solid #E2E8F0',
                backgroundColor: isSelected ? '#0284C7' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#475569',
                fontSize: 11.5,
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: isSelected ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {isEng ? region.nameEn : region.name}
            </button>
          );
        })}
      </div>

      {/* Toast Alert Banner if redirected */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
            zIndex: 30,
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Body Parts Cards List */}
      <div style={{ padding: '8px 16px 100px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredParts.map((bp) => {
          const currentScore = scores[bp.id];
          const isHighlighted = highlightedCardId === bp.id;

          return (
            <div
              key={bp.id}
              ref={(el) => {
                cardRefs.current[bp.id] = el;
              }}
              style={{
                backgroundColor: isHighlighted ? '#F0F9FF' : '#FFFFFF',
                borderRadius: 16,
                padding: 14,
                border: isHighlighted
                  ? '2px solid #0284C7'
                  : currentScore !== null && currentScore !== undefined && currentScore > 1
                  ? '1.2px solid #BAE6FD'
                  : '1px solid #F1F5F9',
                boxShadow: isHighlighted
                  ? '0 4px 12px rgba(2, 132, 199, 0.18)'
                  : '0 2px 6px rgba(0,0,0,0.025)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Header: Icon + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {renderIcon(bp.iconType)}
                <span
                  style={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: '#0F172A',
                  }}
                >
                  {isEng ? bp.nameEn : bp.name}
                </span>
              </div>

              {/* 4 Likert Buttons in 1 row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
                {SCORE_OPTIONS.map((opt) => {
                  const isSelected = currentScore === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectScore(bp.id, opt.score)}
                      style={{
                        padding: '9px 2px',
                        borderRadius: 10,
                        border: isSelected ? `1.5px solid ${opt.color}` : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? opt.color : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : opt.color,
                        fontSize: 10,
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isEng ? opt.labelEn : opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 420,
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 16px 16px',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
          boxSizing: 'border-box',
          zIndex: 25,
        }}
      >
        <button
          type="button"
          onClick={isAllAnswered ? () => setShowResultModal(true) : scrollToFirstUnanswered}
          style={{
            width: '100%',
            height: 48,
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            borderRadius: 14,
            border: 'none',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
            transition: 'background-color 0.15s ease',
          }}
        >
          {isAllAnswered ? (
            <CheckCircle2 size={18} />
          ) : (
            <Send size={18} fill="currentColor" />
          )}
          <span>
            {isEng ? 'Complete assessment' : 'Selesai melakukan penilaian'}
          </span>
        </button>
      </div>

      {/* Guide Dialog Modal - Rendered via createPortal to guarantee it appears on top */}
      {showGuideModal && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setShowGuideModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 999999,
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: '24px 22px 18px 22px',
              maxWidth: 350,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Header with rounded icon box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Info size={22} color="#0284C7" strokeWidth={2.2} />
              </div>
              <h3 style={{ fontSize: 16.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {isEng ? 'NBM Score Guide' : 'Panduan Skor NBM'}
              </h3>
            </div>

            {/* Skala Tingkat Keluhan */}
            <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
              {isEng ? 'Complaint Severity Scale:' : 'Skala Tingkat Keluhan:'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
              {[
                { title: isEng ? 'Point 1' : 'Poin 1', desc: isEng ? 'No Pain' : 'Tidak Sakit', color: '#059669', bg: '#D1FAE5' },
                { title: isEng ? 'Point 2' : 'Poin 2', desc: isEng ? 'Mild Pain' : 'Agak Sakit', color: '#D97706', bg: '#FEF3C7' },
                { title: isEng ? 'Point 3' : 'Poin 3', desc: isEng ? 'Painful' : 'Sakit', color: '#EA580C', bg: '#FFEDD5' },
                { title: isEng ? 'Point 4' : 'Poin 4', desc: isEng ? 'Severe Pain' : 'Sangat Sakit', color: '#DC2626', bg: '#FEE2E2' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: item.color,
                      backgroundColor: item.bg,
                      padding: '3px 8px',
                      borderRadius: 5,
                      minWidth: 42,
                      textAlign: 'center',
                    }}
                  >
                    {item.title}
                  </span>
                  <span style={{ fontSize: 12.5, color: '#334155', fontWeight: 500 }}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#E2E8F0', margin: '8px 0 14px 0' }} />

            {/* Klasifikasi Tingkat Risiko NBM */}
            <div style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
              {isEng ? 'NBM Risk Classification:' : 'Klasifikasi Tingkat Risiko NBM:'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
              {[
                { range: '28 – 49', desc: isEng ? 'Low (No action needed yet)' : 'Rendah (Belum perlu tindakan)', color: '#059669', bg: '#D1FAE5' },
                { range: '50 – 70', desc: isEng ? 'Medium (Improvement may be needed)' : 'Sedang (Mungkin perlu perbaikan)', color: '#D97706', bg: '#FEF3C7' },
                { range: '71 – 90', desc: isEng ? 'High (Immediate improvement required)' : 'Tinggi (Tindakan perbaikan segera)', color: '#EA580C', bg: '#FFEDD5' },
                { range: '91 – 112', desc: isEng ? 'Very High (Action required right now)' : 'Sangat Tinggi (Tindakan saat ini juga)', color: '#DC2626', bg: '#FEE2E2' },
              ].map((item) => (
                <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 800,
                      color: item.color,
                      backgroundColor: item.bg,
                      padding: '3px 8px',
                      borderRadius: 5,
                      minWidth: 54,
                      textAlign: 'center',
                    }}
                  >
                    {item.range}
                  </span>
                  <span style={{ fontSize: 11.5, color: '#334155', fontWeight: 500 }}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* TextButton Tutup at bottom right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284C7',
                  fontWeight: 800,
                  fontSize: 14.5,
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontFamily: 'inherit',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F9FF')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {isEng ? 'Close' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Result Bottom Sheet Modal (Matches Flutter NBM Result Modal) */}
      {showResultModal && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              maxWidth: 420,
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Sheet Handle */}
            <div
              style={{
                width: 44,
                height: 4,
                backgroundColor: '#CBD5E1',
                borderRadius: 10,
                margin: '12px auto 8px auto',
              }}
            />

            {/* Modal Header */}
            <div
              style={{
                padding: '8px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {isEng ? 'NBM Assessment Result' : 'Hasil Penilaian NBM'}
                </h3>
                <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0 0' }}>
                  {isEng
                    ? 'Musculoskeletal Disorders assessment using NBM'
                    : 'Penilaian Keluhan Musculoskeletal Disorders menggunakan Nordic Body Map (NBM)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowResultModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 20 }}>
              {/* Main Score & Risk Banner */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  backgroundColor: risk.bgColor,
                  border: `1px solid ${risk.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: risk.color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{totalScore}</span>
                  <span style={{ fontSize: 9, fontWeight: 800 }}>NBM</span>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: risk.color }}>
                    {isEng ? `Risk Level: ${risk.level}` : `Tingkat Risiko: ${risk.level}`}
                  </div>
                  <p style={{ fontSize: 11.5, color: '#334155', margin: '4px 0 0 0', lineHeight: 1.35 }}>
                    {risk.desc}
                  </p>
                </div>
              </div>

              {/* Severity Count Box */}
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                {isEng ? 'Answer Breakdown (28 Body Parts)' : 'Rincian Jawaban 28 Bagian Tubuh'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 18 }}>
                {[
                  { label: isEng ? 'No Pain' : 'Tidak Sakit', count: countTidakSakit, color: '#10B981' },
                  { label: isEng ? 'Mild Pain' : 'Agak Sakit', count: countAgakSakit, color: '#F59E0B' },
                  { label: isEng ? 'Painful' : 'Sakit', count: countSakit, color: '#EA580C' },
                  { label: isEng ? 'Severe Pain' : 'Sangat Sakit', count: countSangatSakit, color: '#DC2626' },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 10,
                      backgroundColor: `${s.color}14`,
                      border: `1px solid ${s.color}33`,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#475569', marginTop: 2 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Painful Areas Highlight */}
              {painfulParts.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#DC2626', marginBottom: 8 }}>
                    {isEng
                      ? `Main Complaint Areas (${painfulParts.length} Areas)`
                      : `Bagian Tubuh dengan Keluhan Utama (${painfulParts.length} Area)`}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {painfulParts.map((bp) => {
                      const partScore = scores[bp.id];
                      const isSevere = partScore === 4;
                      return (
                        <div
                          key={bp.id}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            backgroundColor: isSevere ? '#FEF2F2' : '#FFF7ED',
                            border: isSevere ? '1px solid #FCA5A5' : '1px solid #FDBA74',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: isSevere ? '#DC2626' : '#EA580C',
                            }}
                          >
                            {isEng ? bp.nameEn : bp.name}
                          </span>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              color: '#FFFFFF',
                              backgroundColor: isSevere ? '#DC2626' : '#EA580C',
                              padding: '1px 5px',
                              borderRadius: 4,
                            }}
                          >
                            {isSevere ? (isEng ? 'Severe Pain' : 'Sangat Sakit') : (isEng ? 'Painful' : 'Sakit')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Standard Table Rentang Skor NBM */}
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
                {isEng
                  ? 'Standard NBM Score Range & Improvement Actions'
                  : 'Tabel Standar Rentang Skor NBM & Tindakan Perbaikan'}
              </div>
              <div
                style={{
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    range: '28 – 49',
                    level: isEng ? 'Low' : 'Rendah',
                    action: isEng
                      ? 'Maintain ergonomic postures and perform routine stretches.'
                      : 'Pertahankan postur kerja ergonomis dan lakukan peregangan rutin.',
                    color: '#10B981',
                    isCurrent: totalScore >= 28 && totalScore <= 49,
                  },
                  {
                    range: '50 – 70',
                    level: isEng ? 'Medium' : 'Sedang',
                    action: isEng
                      ? 'Evaluate workstations and schedule periodic rest breaks.'
                      : 'Evaluasi stasiun kerja dan atur waktu istirahat secara berkala.',
                    color: '#F59E0B',
                    isCurrent: totalScore >= 50 && totalScore <= 70,
                  },
                  {
                    range: '71 – 90',
                    level: isEng ? 'High' : 'Tinggi',
                    action: isEng
                      ? 'Thoroughly investigate workstation and correct awkward postures immediately.'
                      : 'Investigasi menyeluruh stasiun kerja dan perbaiki postur janggal segera.',
                    color: '#EA580C',
                    isCurrent: totalScore >= 71 && totalScore <= 90,
                  },
                  {
                    range: '91 – 112',
                    level: isEng ? 'Very High' : 'Sangat Tinggi',
                    action: isEng
                      ? 'Stop high-risk activities and conduct ergonomic redesign immediately!'
                      : 'Hentikan aktivitas berisiko tinggi dan lakukan redesain ergonomi segera!',
                    color: '#DC2626',
                    isCurrent: totalScore >= 91,
                  },
                ].map((row, idx) => (
                  <div
                    key={row.range}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: row.isCurrent ? `${row.color}14` : '#FFFFFF',
                      borderBottom: idx < 3 ? '1px solid #E2E8F0' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: row.color,
                        minWidth: 55,
                      }}
                    >
                      {row.range}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#FFFFFF',
                        backgroundColor: row.color,
                        padding: '2px 6px',
                        borderRadius: 6,
                        minWidth: 70,
                        textAlign: 'center',
                      }}
                    >
                      {row.level}
                    </span>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: '#475569',
                        lineHeight: 1.3,
                        flex: 1,
                      }}
                    >
                      {row.action}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowResultModal(false)}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isEng ? 'Review Survey' : 'Tinjau Kembali'}
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveToDatabase}
                  style={{
                    height: 44,
                    borderRadius: 12,
                    border: 'none',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isSaving ? (
                    <span>{isEng ? 'Saving...' : 'Menyimpan...'}</span>
                  ) : (
                    <span>{isEng ? 'Save & Finish' : 'Simpan & Selesai'}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
