import React from 'react';
import { ArrowLeft, ArrowRight, Accessibility, ClipboardList } from 'lucide-react';

interface ErgonomicsHubScreenProps {
  onBack: () => void;
  onStartReba: () => void;
  onStartNbm: () => void;
  lang: 'ID' | 'ENG';
  onToggleLang?: () => void;
}

export const ErgonomicsHubScreen: React.FC<ErgonomicsHubScreenProps> = ({
  onBack,
  onStartReba,
  onStartNbm,
  lang,
  onToggleLang,
}) => {
  const isEng = lang === 'ENG';

  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* App Bar (Sama persis dengan Flutter AppBar) */}
      <div
        style={{
          height: 56,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#0F172A',
          }}
        >
          <ArrowLeft size={18} />
        </button>

        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px' }}>
          {isEng ? 'Ergonomics Assessment' : 'Penilaian Ergonomi'}
        </span>

        {onToggleLang ? (
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
        ) : (
          <div style={{ width: 30 }} />
        )}
      </div>

      {/* Body Content */}
      <div style={{ padding: '20px 20px 90px 20px' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>
          {isEng ? 'Available Assessment Methods' : 'Metode Penilaian Tersedia'}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card 1: REBA */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1.2px solid #E2E8F0',
              padding: 18,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Badge & Icon Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  padding: '4px 9px',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                }}
              >
                {isEng ? 'OBJECTIVE POSTURE ANALYSIS' : 'ANALISIS POSTUR OBYEKTIF'}
              </div>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Accessibility size={20} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px' }}>
              Rapid Entire Body Assessment (REBA)
            </h3>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginTop: 2, marginBottom: 10 }}>
              {isEng ? 'Whole Body Posture & Load Angle Analysis' : 'Analisis Sudut & Beban Postur Seluruh Tubuh'}
            </div>

            {/* Description */}
            <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.45, marginBottom: 18 }}>
              {isEng
                ? 'International ergonomics standard to measure musculoskeletal disorder risks caused by working postures of neck, trunk, legs, arms, and lifting loads.'
                : 'Metode standar ergonomi internasional untuk mengukur risiko gangguan muskuloskeletal akibat postur kerja leher, punggung, kaki, lengan, dan beban angkat.'}
            </p>

            {/* Full Width Button */}
            <button
              onClick={onStartReba}
              type="button"
              style={{
                width: '100%',
                height: 46,
                borderRadius: 12,
                border: 'none',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'inherit',
                boxShadow: 'none',
              }}
            >
              <span>{isEng ? 'Start REBA Assessment' : 'Mulai Penilaian REBA'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: NBM */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1.2px solid #E2E8F0',
              padding: 18,
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.03)',
            }}
          >
            {/* Badge & Icon Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  color: '#1E3A8A',
                  padding: '4px 9px',
                  borderRadius: 6,
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                }}
              >
                {isEng ? 'SUBJECTIVE COMPLAINT SURVEY' : 'SURVEI KELUHAN SUBYEKTIF'}
              </div>

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: '#DBEAFE',
                  color: '#1E3A8A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ClipboardList size={20} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px' }}>
              Nordic Body Map (NBM)
            </h3>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginTop: 2, marginBottom: 10 }}>
              {isEng ? 'Worker Muscle & Joint Mapping' : 'Pemetaan Keluhan Otot & Sendi Pekerja'}
            </div>

            {/* Description */}
            <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.45, marginBottom: 18 }}>
              {isEng
                ? 'Structured 28 body parts questionnaire to record pain or discomfort levels experienced by workers during routine tasks.'
                : 'Kuesioner terstruktur 28 area tubuh untuk mendata tingkat rasa sakit atau ketidaknyamanan otot dan sendi yang dialami pekerja saat menjalankan aktivitas kerja.'}
            </p>

            {/* Full Width Button */}
            <button
              onClick={onStartNbm}
              type="button"
              style={{
                width: '100%',
                height: 46,
                borderRadius: 12,
                border: 'none',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'inherit',
                boxShadow: 'none',
              }}
            >
              <span>{isEng ? 'Start NBM Survey' : 'Mulai Penilaian NBM'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
