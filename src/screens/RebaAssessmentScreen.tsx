import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Save,
  Info,
  RotateCcw,
  Check,
  RotateCw,
  Compass,
} from 'lucide-react';
import { REBA_STEPS } from '../utils/rebaData';
import { RebaScoringEngine } from '../utils/rebaScoring';

interface RebaAssessmentScreenProps {
  userId: string;
  onBack: () => void;
  onSaved: () => void;
  lang: 'ID' | 'ENG';
}

export const RebaAssessmentScreen: React.FC<RebaAssessmentScreenProps> = ({
  userId,
  onBack,
  onSaved,
  lang,
}) => {
  const isEng = lang === 'ENG';

  // Wizard state:
  // currentStepIndex: 0..7 (Langkah 1..8)
  // currentLayer: 1 = Postur Utama (2-column cards), 2 = Penyesuaian Sudut (List checkboxes)
  // isResultView: true when viewing final report
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentLayer, setCurrentLayer] = useState<1 | 2>(1);
  const [isResultView, setIsResultView] = useState(false);

  // Selected Option Index per step (-1 if unselected): stepKey -> index
  const [selectedPostureIndices, setSelectedPostureIndices] = useState<Record<string, number>>({
    neck: 0,
    trunk: 0,
    legs: 0,
    load: 0,
    upperArm: 0,
    lowerArm: 0,
    wrist: 0,
    coupling_activity: 0,
  });

  // Selected Adjustments: id -> boolean
  const [selectedAdjustments, setSelectedAdjustments] = useState<Record<string, boolean>>({});
  // None-selected state per step: stepKey -> boolean
  const [noneSelectedPerStep, setNoneSelectedPerStep] = useState<Record<string, boolean>>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentStep = REBA_STEPS[currentStepIndex];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectOption = (index: number) => {
    setSelectedPostureIndices((prev) => ({ ...prev, [currentStep.key]: index }));
  };

  const handleToggleAdjustment = (id: string) => {
    setSelectedAdjustments((prev) => {
      const nextVal = !prev[id];
      const updated = { ...prev, [id]: nextVal };
      if (nextVal) {
        // If an adjustment is selected, uncheck "Tidak Ada"
        setNoneSelectedPerStep((n) => ({ ...n, [currentStep.key]: false }));
      }
      return updated;
    });
  };

  const handleSelectNoneAdjustment = () => {
    setNoneSelectedPerStep((prev) => ({ ...prev, [currentStep.key]: true }));
    // Clear all adjustments belonging to current step
    setSelectedAdjustments((prev) => {
      const nextObj = { ...prev };
      currentStep.adjustments.forEach((adj) => {
        nextObj[adj.id] = false;
      });
      return nextObj;
    });
  };

  // Check if adjustments have been explicitly answered
  const isAdjustmentAnswered = () => {
    if (noneSelectedPerStep[currentStep.key]) return true;
    return currentStep.adjustments.some((adj) => selectedAdjustments[adj.id]);
  };

  // Proceed button logic
  const handleProceed = () => {
    const selectedIdx = selectedPostureIndices[currentStep.key];
    if (selectedIdx === undefined || selectedIdx === -1) {
      showToast(
        isEng
          ? 'Please select a posture option first!'
          : 'Silakan pilih salah satu opsi posisi terlebih dahulu!'
      );
      return;
    }

    // If on Layer 1 and this step has an adjustment layer, go to Layer 2
    if (currentLayer === 1 && currentStep.hasAdjustmentLayer) {
      setCurrentLayer(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If on Layer 2 and adjustments not answered
    if (currentLayer === 2 && currentStep.hasAdjustmentLayer && !isAdjustmentAnswered()) {
      showToast(
        isEng
          ? 'Please determine posture condition (select condition or "None")!'
          : 'Silakan tentukan kondisi postur (pilih kondisi atau "Tidak Ada")!'
      );
      return;
    }

    // Move to next step or result
    if (currentStepIndex < REBA_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setCurrentLayer(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsResultView(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (isResultView) {
      setIsResultView(false);
      return;
    }

    if (currentLayer === 2) {
      setCurrentLayer(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setCurrentLayer(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBack();
    }
  };

  // Compute final scores behind the scenes for saving
  const computeScores = () => {
    // Step 1: Neck
    const neckOpt = REBA_STEPS[0].options[selectedPostureIndices.neck ?? 0];
    let neck = neckOpt ? neckOpt.score : 1;
    if (selectedAdjustments['neck_twist']) neck += 1;
    if (selectedAdjustments['neck_side_bend']) neck += 1;

    // Step 2: Trunk
    const trunkOpt = REBA_STEPS[1].options[selectedPostureIndices.trunk ?? 0];
    let trunk = trunkOpt ? trunkOpt.score : 1;
    if (selectedAdjustments['trunk_twist']) trunk += 1;
    if (selectedAdjustments['trunk_side_bend']) trunk += 1;

    // Step 3: Legs
    const legsOpt = REBA_STEPS[2].options[selectedPostureIndices.legs ?? 0];
    let legs = legsOpt ? legsOpt.score : 1;
    if (selectedAdjustments['knee_30_60']) legs += 1;
    if (selectedAdjustments['knee_over_60']) legs += 2;

    // Step 4: Load
    const loadOpt = REBA_STEPS[3].options[selectedPostureIndices.load ?? 0];
    let load = loadOpt ? loadOpt.score : 0;
    if (selectedAdjustments['load_shock']) load += 1;

    // Step 5: Upper Arm
    const upperOpt = REBA_STEPS[4].options[selectedPostureIndices.upperArm ?? 0];
    let upperArm = upperOpt ? upperOpt.score : 1;
    if (selectedAdjustments['arm_shoulder_raised']) upperArm += 1;
    if (selectedAdjustments['arm_abducted']) upperArm += 1;
    if (selectedAdjustments['arm_supported']) upperArm -= 1;
    if (upperArm < 1) upperArm = 1;

    // Step 6: Lower Arm
    const lowerOpt = REBA_STEPS[5].options[selectedPostureIndices.lowerArm ?? 0];
    const lowerArm = lowerOpt ? lowerOpt.score : 1;

    // Step 7: Wrist
    const wristOpt = REBA_STEPS[6].options[selectedPostureIndices.wrist ?? 0];
    let wrist = wristOpt ? wristOpt.score : 1;
    if (selectedAdjustments['wrist_twisted']) wrist += 1;

    // Step 8: Coupling & Activity
    const coupOpt = REBA_STEPS[7].options[selectedPostureIndices.coupling_activity ?? 0];
    const coupling = coupOpt ? coupOpt.score : 0;

    let activity = 0;
    if (selectedAdjustments['act_static']) activity += 1;
    if (selectedAdjustments['act_repetitive']) activity += 1;
    if (selectedAdjustments['act_rapid']) activity += 1;

    const results = RebaScoringEngine.calculateFinalScore(
      neck,
      trunk,
      legs,
      load,
      upperArm,
      lowerArm,
      wrist,
      coupling,
      activity
    );

    return {
      neck,
      trunk,
      legs,
      load,
      upperArm,
      lowerArm,
      wrist,
      coupling,
      activity,
      results,
    };
  };

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    const {
      neck,
      trunk,
      legs,
      load,
      upperArm,
      lowerArm,
      wrist,
      coupling,
      activity,
      results,
    } = computeScores();

    try {
      const recordId = 'reba_' + Date.now();
      const payload = {
        id: recordId,
        user_id: userId,
        assessed_at: new Date().toISOString(),
        neck_score: neck,
        trunk_score: trunk,
        legs_score: legs,
        load_score: load,
        score_a: results.scoreA,
        upper_arm_score: upperArm,
        lower_arm_score: lowerArm,
        wrist_score: wrist,
        coupling_score: coupling,
        score_b: results.scoreB,
        table_c_score: results.tableCScore,
        activity_score: activity,
        final_score: results.finalScore,
        risk_level: results.riskLevel,
        action: results.action,
      };

      const { error } = await supabase.from('reba_assessments').insert(payload);
      if (error) {
        console.error('Supabase REBA insert error:', error);
      }

      setSavedSuccess(true);
      setTimeout(() => {
        onSaved();
      }, 1000);
    } catch (err) {
      console.error('Error saving REBA assessment:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const { results } = computeScores();
  const selectedPostureIndex = selectedPostureIndices[currentStep?.key] ?? -1;

  // ==================== 1. RESULT VIEW (SAMA PERSIS DENGAN FLUTTER MODAL HASIL USER) ====================
  if (isResultView) {
    const isLow = results.finalScore <= 3;
    const isMedium = results.finalScore <= 7;

    return (
      <div
        className="fade-in"
        style={{
          padding: '16px 18px 90px 18px',
          backgroundColor: '#F8FAFC',
          minHeight: '100vh',
          boxSizing: 'border-box',
        }}
      >
        {/* App Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 48,
            marginBottom: 16,
          }}
        >
          <button
            onClick={handleBack}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginLeft: 8 }}>
            {isEng ? 'Assessment Results' : 'Hasil Akhir Penilaian REBA'}
          </span>
        </div>

        {/* User Result Card (Persis Dialog Hasil Akhir REBA di Flutter: Lingkaran Ikon, Tingkat Risiko, Rekomendasi) */}
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '28px 20px',
            borderRadius: 20,
            border: `1.5px solid ${results.color}40`,
            backgroundColor: '#FFFFFF',
            boxShadow: `0 8px 24px ${results.color}1F`,
            marginBottom: 20,
          }}
        >
          {/* Status Icon Circle */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: '50%',
              backgroundColor: `${results.color}1F`,
              border: `2.5px solid ${results.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: results.color,
            }}
          >
            {isLow ? (
              <CheckCircle2 size={40} />
            ) : isMedium ? (
              <AlertTriangle size={40} />
            ) : (
              <AlertCircle size={40} />
            )}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>
            {isEng ? 'REBA Final Assessment Result' : 'Hasil Akhir Penilaian REBA'}
          </h3>

          {/* Risk Badge (Tanpa Skor Angka untuk User) */}
          <div
            style={{
              display: 'inline-block',
              backgroundColor: results.color,
              color: '#FFFFFF',
              padding: '6px 18px',
              borderRadius: 20,
              fontSize: 13.5,
              fontWeight: 800,
              letterSpacing: '0.2px',
              marginBottom: 20,
            }}
          >
            {results.riskLevel}
          </div>

          {/* Rekomendasi Tindakan (Sesuai Flutter Container) */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 14,
              border: '1px solid #E2E8F0',
              padding: 16,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <Info size={22} color={results.color} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                {isEng ? 'Recommendation:' : 'Rekomendasi:'}
              </div>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: '#334155', lineHeight: 1.45 }}>
                {results.action}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleSaveToSupabase}
            className="btn-primary"
            type="button"
            disabled={isSaving || savedSuccess}
            style={{ padding: '15px' }}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 size={18} />
                <span>{isEng ? 'Assessment Saved!' : 'Penilaian Berhasil Disimpan!'}</span>
              </>
            ) : isSaving ? (
              <span>{isEng ? 'Saving Record...' : 'Menyimpan...'}</span>
            ) : (
              <span>{isEng ? 'Complete & Save' : 'Selesai'}</span>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentStepIndex(0);
              setCurrentLayer(1);
              setIsResultView(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="btn-outline"
            type="button"
          >
            <RotateCcw size={16} />
            <span>{isEng ? 'Repeat Assessment' : 'Ulangi Penilaian'}</span>
          </button>
        </div>
      </div>
    );
  }

  // ==================== 2. WIZARD VIEW (PERSIS SCREENSHOT & FLUTTER) ====================
  return (
    <div
      className="fade-in"
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toast Warning */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 700,
            zIndex: 100,
            boxShadow: '0 8px 20px rgba(220, 38, 38, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <AlertCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Bar (Sama Persis Flutter AppBar) */}
      <div
        style={{
          height: 52,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          onClick={handleBack}
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
          <ArrowLeft size={20} />
        </button>

        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#0F172A',
            marginLeft: 8,
            letterSpacing: '-0.2px',
          }}
        >
          Penilaian REBA
        </span>
      </div>

      {/* Progress Subheader (Sama persis baris atas screenshot) */}
      <div
        style={{
          padding: '14px 20px 10px 20px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: '#0284C7',
            }}
          >
            {currentStep.subHeaderTitle}
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#64748B',
            }}
          >
            {currentStep.stepLabel}
          </span>
        </div>

        {/* Thin Blue Progress Bar */}
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
              width: `${(currentStep.step / 8) * 100}%`,
              backgroundColor: '#0284C7',
              borderRadius: 3,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: '20px 18px 90px 18px',
          boxSizing: 'border-box',
        }}
      >
        {/* Layer 1: Pilihan Postur (2-Column Grid Sama Persis Screenshot) */}
        {currentLayer === 1 && (
          <div>
            {/* Pertanyaan Judul (Bold 18px) */}
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.35,
                margin: '0 0 16px 0',
              }}
            >
              {currentStep.questionTitle}
            </h2>

            {/* 2-Column Grid Kartu Postur */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
              }}
            >
              {currentStep.options.map((option, idx) => {
                const isSelected = selectedPostureIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    style={{
                      backgroundColor: isSelected ? option.bgColor : '#FFFFFF',
                      borderRadius: 16,
                      border: isSelected
                        ? `2.5px solid ${option.color}`
                        : '1.2px solid #E2E8F0',
                      boxShadow: isSelected
                        ? `0 4px 14px ${option.color}26`
                        : '0 2px 6px rgba(0, 0, 0, 0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    {/* Header Bar Kartu: Radio Button di Kanan Atas */}
                    <div
                      style={{
                        padding: '10px 10px 4px 10px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.12)',
                        }}
                      >
                        {isSelected ? (
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              backgroundColor: option.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={11} color="#FFFFFF" strokeWidth={3} />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              border: '2px solid #94A3B8',
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Gambar Postur Utuh (Sama Persis Flutter Image.asset) */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 6px 8px 6px',
                      }}
                    >
                      <img
                        src={option.image}
                        alt={option.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          borderRadius: '0 0 14px 14px',
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Layer 2: Penyesuaian Sudut (Persis Lembar 1a / 2a di Flutter) */}
        {currentLayer === 2 && currentStep.hasAdjustmentLayer && (
          <div>
            {/* Pertanyaan Penyesuaian (Bold 18px) */}
            <h2
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.35,
                margin: '0 0 16px 0',
              }}
            >
              {currentStep.adjustmentQuestionTitle}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Opsi 1: Tidak Ada (Poin 0) */}
              <div
                onClick={handleSelectNoneAdjustment}
                style={{
                  backgroundColor: noneSelectedPerStep[currentStep.key] ? '#F0FDF4' : '#FFFFFF',
                  borderRadius: 16,
                  border: noneSelectedPerStep[currentStep.key]
                    ? '2px solid #10B981'
                    : '1.2px solid #E2E8F0',
                  boxShadow: noneSelectedPerStep[currentStep.key]
                    ? '0 4px 12px rgba(16, 185, 129, 0.15)'
                    : '0 2px 6px rgba(0, 0, 0, 0.03)',
                  padding: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: noneSelectedPerStep[currentStep.key] ? '#10B981' : '#F1F5F9',
                    color: noneSelectedPerStep[currentStep.key] ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                    {isEng ? 'None' : 'Tidak ada'}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                    {isEng
                      ? 'Posture straight, no twisting or side bending'
                      : 'Posisi lurus, tidak ada putaran atau miring'}
                  </div>
                </div>

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={!!noneSelectedPerStep[currentStep.key]}
                  onChange={handleSelectNoneAdjustment}
                  style={{
                    width: 20,
                    height: 20,
                    accentColor: '#10B981',
                    cursor: 'pointer',
                  }}
                />
              </div>

              {/* Opsi-opsi Penyesuaian Lainnya */}
              {currentStep.adjustments.map((adj) => {
                const isChecked = !!selectedAdjustments[adj.id];
                return (
                  <div
                    key={adj.id}
                    onClick={() => handleToggleAdjustment(adj.id)}
                    style={{
                      backgroundColor: isChecked ? `${adj.color}0F` : '#FFFFFF',
                      borderRadius: 16,
                      border: isChecked ? `2px solid ${adj.color}` : '1.2px solid #E2E8F0',
                      boxShadow: isChecked
                        ? `0 4px 12px ${adj.color}20`
                        : '0 2px 6px rgba(0, 0, 0, 0.03)',
                      padding: 16,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        backgroundColor: isChecked ? adj.color : '#F1F5F9',
                        color: isChecked ? '#FFFFFF' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <RotateCw size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                        {adj.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        {adj.subtitle}
                      </div>
                    </div>

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAdjustment(adj.id)}
                      style={{
                        width: 20,
                        height: 20,
                        accentColor: adj.color,
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action Bar (Sama Persis Tombol Hitam/Navy di Screenshot) */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 480,
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '14px 20px',
          boxShadow: '0 -4px 14px rgba(0, 0, 0, 0.05)',
          zIndex: 50,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {currentLayer === 2 && (
            <button
              onClick={() => {
                setCurrentLayer(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              type="button"
              style={{
                height: 50,
                padding: '0 16px',
                borderRadius: 12,
                border: '1.5px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <button
            onClick={handleProceed}
            type="button"
            style={{
              flex: 1,
              height: 50,
              backgroundColor: '#0F172A', // Dark Navy/Black persis tombol screenshot
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
            }}
          >
            <span>
              {currentStepIndex === REBA_STEPS.length - 1 &&
              (!currentStep.hasAdjustmentLayer || currentLayer === 2)
                ? isEng
                  ? 'View REBA Final Report'
                  : 'Lihat Hasil Akhir Penilaian REBA'
                : isEng
                ? 'Proceed to Next Step'
                : 'Lanjut Penilaian Berikutnya'}
            </span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
