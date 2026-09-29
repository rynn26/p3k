import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import {
  ChevronLeft,
  ChevronDown,
  Info,
  Check,
  Activity,
  Cigarette,
  Shield,
  ArrowUpDown,
  Scale,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface HealthRecordSetupScreenProps {
  userId: string;
  isInitialSetup?: boolean;
  onComplete: () => void;
  onBack?: () => void;
  lang?: 'ID' | 'ENG';
}

export const HealthRecordSetupScreen: React.FC<HealthRecordSetupScreenProps> = ({
  userId,
  isInitialSetup = false,
  onComplete,
  onBack,
  lang = 'ID',
}) => {
  const isEng = lang === 'ENG';

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [exercise, setExercise] = useState('');
  const [smoking, setSmoking] = useState('');
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
    // Untuk alur pendaftaran baru (isInitialSetup):
    // input awal BB dan TB kosong dan siap diisi
    if (isInitialSetup) {
      setIsFetchingData(false);
      return;
    }

    setIsFetchingData(true);
    try {
      let currentUid: string | null = userId;
      if (!currentUid) {
        const { data: authData } = await supabase.auth.getUser();
        currentUid = authData?.user?.id || null;
      }

      if (currentUid) {
        // 1. Coba fetch data terbaru dari tabel health_records di Supabase
        const { data: record } = await supabase
          .from('health_records')
          .select('*')
          .eq('user_id', currentUid)
          .maybeSingle();

        if (record) {
          if (record.weight_kg) setWeight(String(record.weight_kg));
          if (record.height_cm) setHeight(String(record.height_cm));
          if (record.exercise_frequency) setExercise(record.exercise_frequency);
          if (record.smoking_habit) setSmoking(record.smoking_habit);

          const comorbVal = record.comorbidity || record.comorbidities;
          if (comorbVal) {
            if (Array.isArray(comorbVal)) {
              setComorbidities(comorbVal.length > 0 ? comorbVal : ['Tidak ada']);
            } else if (typeof comorbVal === 'string') {
              const parsed = comorbVal
                .split(',')
                .map((c: string) => c.trim())
                .filter(Boolean);
              setComorbidities(parsed.length > 0 ? parsed : ['Tidak ada']);
            }
          }
        } else {
          // 2. Fallback baca data lokal
          const savedW = localStorage.getItem(`hr_weight_${currentUid}`);
          if (savedW) setWeight(savedW);
          const savedH = localStorage.getItem(`hr_height_${currentUid}`);
          if (savedH) setHeight(savedH);
          const savedEx = localStorage.getItem(`hr_exercise_${currentUid}`);
          if (savedEx) setExercise(savedEx);
          const savedSm = localStorage.getItem(`hr_smoking_${currentUid}`);
          if (savedSm) setSmoking(savedSm);
          const savedCom = localStorage.getItem(`hr_comorbidities_${currentUid}`);
          if (savedCom) {
            try {
              const parsed = JSON.parse(savedCom);
              if (Array.isArray(parsed) && parsed.length > 0) setComorbidities(parsed);
            } catch (_) {}
          }
        }
      }
    } catch (err) {
      console.error('Error fetching health record from Supabase:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  // Real-time calculations matching Flutter Broca & WHO standards
  const wNum = parseFloat(weight);
  const hNum = parseFloat(height);
  const hasValidInputs = !isNaN(wNum) && !isNaN(hNum) && wNum > 0 && hNum > 0;

  let bmi: number | null = null;
  let idealWeight: number | null = null;
  let idealRange = '-';
  let bmiCategory = '';
  let bmiColor = '#64748B';

  if (hasValidInputs) {
    const hMeter = hNum / 100;
    bmi = parseFloat((wNum / (hMeter * hMeter)).toFixed(1));

    if (hNum > 100) {
      idealWeight = parseFloat(((hNum - 100) * 0.9).toFixed(1));
      const minW = (18.5 * hMeter * hMeter).toFixed(1);
      const maxW = (22.9 * hMeter * hMeter).toFixed(1);
      idealRange = `${minW} - ${maxW} kg`;
    }

    if (bmi < 18.5) {
      bmiCategory = isEng ? 'Underweight' : 'Berat Kurang (Underweight)';
      bmiColor = '#3B82F6';
    } else if (bmi < 23.0) {
      bmiCategory = isEng ? 'Normal / Ideal' : 'Normal / Ideal';
      bmiColor = '#10B981';
    } else if (bmi < 25.0) {
      bmiCategory = isEng ? 'Overweight' : 'Kelebihan Berat (Overweight)';
      bmiColor = '#F59E0B';
    } else {
      bmiCategory = isEng ? 'Obesity' : 'Obesitas';
      bmiColor = '#EF4444';
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
    if (!hasValidInputs) {
      setMessage({
        text: isEng
          ? 'Please enter valid weight and height.'
          : 'Harap masukkan berat badan dan tinggi badan yang valid.',
        type: 'error',
      });
      return;
    }

    if (!exercise) {
      setMessage({
        text: isEng ? 'Please select exercise habit.' : 'Harap pilih kebiasaan olahraga.',
        type: 'error',
      });
      return;
    }

    if (!smoking) {
      setMessage({
        text: isEng ? 'Please select smoking habit.' : 'Harap pilih kebiasaan merokok.',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      let currentUid: string | null = userId;
      if (!currentUid) {
        const { data: authData } = await supabase.auth.getUser();
        currentUid = authData?.user?.id || null;
      }

      if (!currentUid) throw new Error('User session not found');

      const comorbidityStr = comorbidities.join(', ');
      const calculatedBmi = bmi ?? parseFloat((wNum / Math.pow(hNum / 100, 2)).toFixed(2));
      const calculatedIdeal = idealWeight ?? parseFloat(((hNum - 100) * 0.9).toFixed(1));

      // Simpan catatan kesehatan ke tabel 'health_records' di Supabase
      const payload: Record<string, any> = {
        user_id: currentUid,
        weight_kg: wNum,
        height_cm: hNum,
        bmi: calculatedBmi,
        ideal_weight_kg: calculatedIdeal,
        exercise_frequency: exercise,
        smoking_habit: smoking,
        comorbidity: comorbidityStr,
        recorded_at: new Date().toISOString(),
      };

      let { error } = await supabase
        .from('health_records')
        .upsert(payload, { onConflict: 'user_id' });

      // Fallback jika kolom ideal_weight_kg belum terpasang di schema tertentu
      if (error && error.message?.includes('ideal_weight_kg')) {
        delete payload.ideal_weight_kg;
        const retryRes = await supabase
          .from('health_records')
          .upsert(payload, { onConflict: 'user_id' });
        error = retryRes.error;
      }

      if (error) throw error;

      // Simpan lokal persis seperti SharedPreferences di Flutter
      localStorage.setItem(`hr_weight_${currentUid}`, String(wNum));
      localStorage.setItem(`hr_height_${currentUid}`, String(hNum));
      localStorage.setItem(`hr_exercise_${currentUid}`, exercise);
      localStorage.setItem(`hr_smoking_${currentUid}`, smoking);
      localStorage.setItem(`hr_comorbidities_${currentUid}`, JSON.stringify(comorbidities));

      setMessage({
        text: isEng
          ? 'Registration complete! Health record saved successfully.'
          : 'Pendaftaran selesai! Catatan kesehatan Anda berhasil disimpan.',
        type: 'success',
      });

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err: any) {
      console.error('Save health record error to Supabase:', err);
      setMessage({
        text: err?.message || (isEng ? 'Failed to save health record.' : 'Gagal menyimpan catatan kesehatan ke database.'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#4F46E5', fontWeight: 700, fontSize: 14 }}>
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
        boxSizing: 'border-box',
        maxWidth: 420,
        margin: '0 auto',
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
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          type="button"
          title={isEng ? 'Back' : 'Kembali'}
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {isEng ? 'Health Record' : 'Catatan Kesehatan'}
          </h1>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#64748B',
              margin: '2px 0 0 0',
            }}
          >
            {isEng ? 'Complete Physical Health Data' : 'Lengkapi Data Kesehatan Fisik'}
          </p>
        </div>

        <div style={{ width: 36 }} />
      </div>

      {/* Main Content */}
      <div style={{ padding: '18px 20px 32px 20px' }}>
        {/* Feedback Alert */}
        {message && (
          <div
            style={{
              backgroundColor: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
              border: `1px solid ${message.type === 'error' ? '#FCA5A5' : '#86EFAC'}`,
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 13,
              fontWeight: 600,
              color: message.type === 'error' ? '#DC2626' : '#16A34A',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* SECTION 1: Informasi Fisik Pekerja */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Activity size={18} color="#2563EB" />
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                {isEng ? 'Worker Physical Information' : 'Informasi Fisik Pekerja'}
              </span>
            </div>

            {/* Grid 2 Kolom: Berat Badan & Tinggi Badan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Berat Badan */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  {isEng ? 'Weight' : 'Berat Badan'} <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
                </div>
                <div
                  style={{
                    height: 48,
                    borderRadius: 12,
                    border: '1.2px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Scale size={18} color="#4F46E5" style={{ flexShrink: 0 }} />
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={isEng ? 'e.g. 65' : 'Contoh: 65'}
                    required
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      paddingLeft: 10,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: '#0F172A',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginLeft: 4 }}>
                    kg
                  </span>
                </div>
              </div>

              {/* Tinggi Badan */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  {isEng ? 'Height' : 'Tinggi Badan'} <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
                </div>
                <div
                  style={{
                    height: 48,
                    borderRadius: 12,
                    border: '1.2px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                  }}
                >
                  <ArrowUpDown size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                  <input
                    type="number"
                    step="1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={isEng ? 'e.g. 170' : 'Contoh: 170'}
                    required
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      paddingLeft: 10,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: '#0F172A',
                      backgroundColor: 'transparent',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginLeft: 4 }}>
                    cm
                  </span>
                </div>
              </div>
            </div>

            {/* Live Indicator Card IMT & Berat Badan Ideal */}
            <div style={{ marginTop: 12 }}>
              {!hasValidInputs ? (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: 12,
                    border: '1px solid #E2E8F0',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Info size={18} color="#64748B" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500, lineHeight: 1.45 }}>
                    {isEng
                      ? 'Automatic calculation of BMI & Ideal Weight will appear once weight & height are entered.'
                      : 'Kalkulasi otomatis IMT & Berat Badan Ideal akan tampil saat berat & tinggi badan diisi.'}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#F1F5F9',
                    borderRadius: 14,
                    border: '1px solid #CBD5E1',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                        Indeks Massa Tubuh (IMT)
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{bmi}</span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: bmiColor,
                            backgroundColor: `${bmiColor}1A`,
                            padding: '2px 8px',
                            borderRadius: 8,
                          }}
                        >
                          {bmiCategory}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                        Berat Badan Ideal
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0284C7', marginTop: 2 }}>
                        {idealWeight} kg
                      </div>
                      <div style={{ fontSize: 10, color: '#64748B' }}>Normal: {idealRange}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Kebiasaan Olahraga dalam seminggu */}
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Activity size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                {isEng ? 'Weekly Exercise Habit ' : 'Kebiasaan Olah raga dalam seminggu '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </span>
            </div>

            <div
              style={{
                height: 48,
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                boxSizing: 'border-box',
              }}
            >
              <Activity size={18} color="#0284C7" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: exercise ? '#0F172A' : '#64748B',
                }}
              >
                {exercise || (isEng ? 'Select exercise frequency' : 'Pilih frekuensi olahraga')}
              </span>
              <ChevronDown size={18} color="#1E293B" style={{ flexShrink: 0 }} />
              <select
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              >
                <option value="">{isEng ? 'Select exercise frequency' : 'Pilih frekuensi olahraga'}</option>
                {exerciseOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 3: Kebiasaan Merokok dalam seminggu */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Cigarette size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                {isEng ? 'Weekly Smoking Habit ' : 'Kebiasaan Merokok dalam seminggu '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </span>
            </div>

            <div
              style={{
                height: 48,
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                boxSizing: 'border-box',
              }}
            >
              <Cigarette size={18} color="#D97706" style={{ flexShrink: 0 }} />
              <span
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: smoking ? '#0F172A' : '#64748B',
                }}
              >
                {smoking || (isEng ? 'Select smoking habit' : 'Pilih kebiasaan merokok')}
              </span>
              <ChevronDown size={18} color="#1E293B" style={{ flexShrink: 0 }} />
              <select
                value={smoking}
                onChange={(e) => setSmoking(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              >
                <option value="">{isEng ? 'Select smoking habit' : 'Pilih kebiasaan merokok'}</option>
                {smokingOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 4: Penyakit Penyerta (Multi-Select) */}
          <div
            style={{
              backgroundColor: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: 14,
              padding: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#6366F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                {isEng
                  ? 'Pre-existing Conditions (Multi-select) '
                  : 'Penyakit penyerta (Dapat memilih lebih dari satu) '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {comorbidityOptions.map((opt) => {
                const isSelected = comorbidities.includes(opt);
                const isNone = opt === 'Tidak ada';

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleComorbidity(opt)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 10,
                      border: isSelected
                        ? isNone
                          ? '1.4px solid #14B8A6'
                          : '1.4px solid #6366F1'
                        : '1px solid #CBD5E1',
                      backgroundColor: isSelected
                        ? isNone
                          ? '#E0F2FE'
                          : '#EEF2FF'
                        : '#FFFFFF',
                      color: isSelected
                        ? isNone
                          ? '#0284C7'
                          : '#4338CA'
                        : '#334155',
                      fontSize: 12,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSelected && <Check size={14} color={isNone ? '#0284C7' : '#4338CA'} strokeWidth={2.5} />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Button: SIMPAN */}
          <div style={{ marginTop: 10 }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(to right, #2563EB, #6366F1, #8B5CF6)',
                boxShadow: '0 5px 14px rgba(79, 70, 229, 0.35)',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.15s ease',
              }}
            >
              {isLoading ? (
                <span>{isEng ? 'SAVING...' : 'MENYIMPAN...'}</span>
              ) : (
                <span>{isEng ? 'SAVE' : 'SIMPAN'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
