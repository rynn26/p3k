import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ArrowLeft, ArrowRight, HeartPulse, Save, ShieldCheck, Activity, Cigarette } from 'lucide-react';

interface HealthRecordSetupScreenProps {
  userId: string;
  isInitialSetup?: boolean;
  onComplete: () => void;
  onBack?: () => void;
  lang: 'ID' | 'ENG';
}

export const HealthRecordSetupScreen: React.FC<HealthRecordSetupScreenProps> = ({
  userId,
  isInitialSetup = false,
  onComplete,
  onBack,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [exercise, setExercise] = useState('1 - 2 kali seminggu');
  const [smoking, setSmoking] = useState('Tidak merokok');
  const [comorbidities, setComorbidities] = useState<string[]>(['Tidak ada']);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const exerciseOptions = [
    'Tidak pernah',
    '1 - 2 kali seminggu',
    '3 - 4 kali seminggu',
    'Setiap hari (> 5 kali)',
  ];

  const smokingOptions = [
    'Tidak merokok',
    'Jarang (< 5 batang/hari)',
    'Sedang (5 - 12 batang/hari)',
    'Aktif berat (> 12 batang/hari)',
    'Mantan perokok',
  ];

  const comorbidityOptions = [
    'Tidak ada',
    'Hipertensi (Darah Tinggi)',
    'Diabetes Melitus',
    'Asma / Gangguan Pernapasan',
    'Nyeri Punggung / Muskuloskeletal',
    'Asam Urat / Kolesterol Tinggi',
    'Penyakit Jantung / Kardiovaskular',
    'Lainnya',
  ];

  useEffect(() => {
    loadHealthRecord();
  }, [userId]);

  const loadHealthRecord = async () => {
    if (isInitialSetup) {
      setIsFetchingData(false);
      return;
    }

    setIsFetchingData(true);
    try {
      const { data } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        if (data.weight_kg) setWeight(String(data.weight_kg));
        if (data.height_cm) setHeight(String(data.height_cm));
        if (data.exercise_frequency) setExercise(data.exercise_frequency);
        if (data.smoking_habit) setSmoking(data.smoking_habit);
        if (data.comorbidities && Array.isArray(data.comorbidities)) {
          setComorbidities(data.comorbidities);
        }
      } else {
        // Fallback to local storage if any
        const savedW = localStorage.getItem(`hr_weight_${userId}`);
        if (savedW) setWeight(savedW);
        const savedH = localStorage.getItem(`hr_height_${userId}`);
        if (savedH) setHeight(savedH);
      }
    } catch (err) {
      console.error('Error fetching health record:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  // Real-time BMI calculation
  const wNum = parseFloat(weight);
  const hNum = parseFloat(height);
  let bmi: number | null = null;
  let bmiCategory = '';
  let bmiColor = '#64748B';

  if (!isNaN(wNum) && !isNaN(hNum) && wNum > 0 && hNum > 0) {
    const hMeter = hNum / 100;
    bmi = parseFloat((wNum / (hMeter * hMeter)).toFixed(1));

    if (bmi < 18.5) {
      bmiCategory = isEng ? 'Underweight' : 'Kurus (Underweight)';
      bmiColor = '#0284C7';
    } else if (bmi <= 24.9) {
      bmiCategory = isEng ? 'Normal / Ideal' : 'Normal (Ideal)';
      bmiColor = '#10B981';
    } else if (bmi <= 29.9) {
      bmiCategory = isEng ? 'Overweight' : 'Kelebihan Berat (Overweight)';
      bmiColor = '#F59E0B';
    } else {
      bmiCategory = isEng ? 'Obesity' : 'Obesitas';
      bmiColor = '#DC2626';
    }
  }

  const toggleComorbidity = (item: string) => {
    if (item === 'Tidak ada') {
      setComorbidities(['Tidak ada']);
      return;
    }

    const withoutNone = comorbidities.filter((c) => c !== 'Tidak ada');
    if (withoutNone.includes(item)) {
      const remaining = withoutNone.filter((c) => c !== item);
      setComorbidities(remaining.length === 0 ? ['Tidak ada'] : remaining);
    } else {
      setComorbidities([...withoutNone, item]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wNum || !hNum || wNum <= 0 || hNum <= 0) {
      setMessage({
        text: isEng
          ? 'Please enter valid weight and height.'
          : 'Harap masukkan berat badan dan tinggi badan yang valid.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const payload = {
        user_id: userId,
        weight_kg: wNum,
        height_cm: hNum,
        exercise_frequency: exercise,
        smoking_habit: smoking,
        comorbidities: comorbidities,
      };

      const { error } = await supabase.from('health_records').upsert(payload);
      if (error) throw error;

      localStorage.setItem(`hr_weight_${userId}`, String(wNum));
      localStorage.setItem(`hr_height_${userId}`, String(hNum));
      localStorage.setItem(`hr_exercise_${userId}`, exercise);
      localStorage.setItem(`hr_smoking_${userId}`, smoking);
      localStorage.setItem(`hr_comorbidities_${userId}`, JSON.stringify(comorbidities));

      setMessage({
        text: isEng ? 'Health record saved successfully.' : 'Catatan kesehatan berhasil disimpan.',
        type: 'success',
      });

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err: any) {
      console.error('Save health record error:', err);
      setMessage({
        text: err?.message || (isEng ? 'Failed to save health record.' : 'Gagal menyimpan catatan kesehatan.'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#0D5BD7', fontWeight: 700, fontSize: 14 }}>
          {isEng ? 'Loading health record...' : 'Memuat data kesehatan...'}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 22px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {onBack && !isInitialSetup && (
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
        )}
        <div style={{ flex: 1, textAlign: isInitialSetup ? 'center' : 'left', marginLeft: onBack ? 8 : 0 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
            {isInitialSetup
              ? isEng
                ? 'Step 3 of 3: Health Record'
                : 'Tahap 3 dari 3: Catatan Kesehatan'
              : isEng
              ? 'Physical Health Record'
              : 'Catatan Kesehatan Fisik'}
          </span>
        </div>
      </div>

      {/* Progress pill if initial setup */}
      {isInitialSetup && (
        <div
          style={{
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            padding: '8px 14px',
            borderRadius: 12,
            fontSize: 12.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <HeartPulse size={18} />
          <span>
            {isEng
              ? 'Final Step: Physical health baseline for ergonomic assessment.'
              : 'Tahap Akhir: Baseline kesehatan fisik untuk evaluasi ergonomi.'}
          </span>
        </div>
      )}

      {/* Feedback Alert */}
      {message && (
        <div
          style={{
            backgroundColor: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${message.type === 'error' ? '#FCA5A5' : '#86EFAC'}`,
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 600,
            color: message.type === 'error' ? '#DC2626' : '#16A34A',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Weight & Height inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label className="input-label">{isEng ? 'Weight (kg)' : 'Berat Badan (kg)'}</label>
            <input
              type="number"
              step="0.5"
              className="input-field"
              placeholder="Contoh: 68"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="input-label">{isEng ? 'Height (cm)' : 'Tinggi Badan (cm)'}</label>
            <input
              type="number"
              step="1"
              className="input-field"
              placeholder="Contoh: 172"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Live BMI Status Card */}
        {bmi !== null && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: 14,
              border: `1.5px solid ${bmiColor}33`,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Indeks Massa Tubuh (BMI)</span>
              <div style={{ fontSize: 20, fontWeight: 800, color: bmiColor }}>{bmi} kg/m²</div>
            </div>
            <div
              style={{
                backgroundColor: `${bmiColor}1A`,
                color: bmiColor,
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {bmiCategory}
            </div>
          </div>
        )}

        {/* Exercise Frequency */}
        <div>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={15} color="#0D5BD7" />
            <span>{isEng ? 'Exercise Habit' : 'Frekuensi Olahraga Mingguan'}</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {exerciseOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setExercise(opt)}
                style={{
                  padding: '10px',
                  borderRadius: 10,
                  border: exercise === opt ? '2px solid #0D5BD7' : '1.5px solid #E2E8F0',
                  backgroundColor: exercise === opt ? '#EBF3FE' : '#FFFFFF',
                  color: exercise === opt ? '#0D5BD7' : '#334155',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'center',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Smoking Habit */}
        <div>
          <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Cigarette size={15} color="#0D5BD7" />
            <span>{isEng ? 'Smoking Habit' : 'Kebiasaan Merokok'}</span>
          </label>
          <select
            className="input-field"
            value={smoking}
            onChange={(e) => setSmoking(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {smokingOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Comorbidities Multi-choice */}
        <div>
          <label className="input-label">{isEng ? 'Pre-existing Conditions' : 'Riwayat Penyakit Penyerta'}</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {comorbidityOptions.map((item) => {
              const isSelected = comorbidities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleComorbidity(item)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 20,
                    border: isSelected ? '1.5px solid #0D5BD7' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#EBF3FE' : '#FFFFFF',
                    color: isSelected ? '#0D5BD7' : '#475569',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 14 }}>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span>{isEng ? 'Saving...' : 'Menyimpan...'}</span>
            ) : isInitialSetup ? (
              <>
                <span>{isEng ? 'Finish & Open Dashboard' : 'Selesai & Buka Beranda'}</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEng ? 'Save Health Record' : 'Simpan Catatan Kesehatan'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
