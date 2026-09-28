export interface NbmBodyPart {
  id: number;
  name: string;
  region: string;
}

export const NBM_BODY_PARTS: NbmBodyPart[] = [
  { id: 0, name: 'Leher bagian atas', region: 'Leher & Bahu' },
  { id: 1, name: 'Leher bagian bawah', region: 'Leher & Bahu' },
  { id: 2, name: 'Bahu kiri', region: 'Leher & Bahu' },
  { id: 3, name: 'Bahu kanan', region: 'Leher & Bahu' },
  { id: 4, name: 'Lengan atas kiri', region: 'Lengan & Tangan' },
  { id: 5, name: 'Punggung', region: 'Punggung & Badan' },
  { id: 6, name: 'Lengan atas kanan', region: 'Lengan & Tangan' },
  { id: 7, name: 'Pinggang', region: 'Punggung & Badan' },
  { id: 8, name: 'Bokong', region: 'Punggung & Badan' },
  { id: 9, name: 'Pantat', region: 'Punggung & Badan' },
  { id: 10, name: 'Siku kiri', region: 'Lengan & Tangan' },
  { id: 11, name: 'Siku kanan', region: 'Lengan & Tangan' },
  { id: 12, name: 'Lengan bawah kiri', region: 'Lengan & Tangan' },
  { id: 13, name: 'Lengan bawah kanan', region: 'Lengan & Tangan' },
  { id: 14, name: 'Pergelangan tangan kiri', region: 'Lengan & Tangan' },
  { id: 15, name: 'Pergelangan tangan kanan', region: 'Lengan & Tangan' },
  { id: 16, name: 'Tangan kiri', region: 'Lengan & Tangan' },
  { id: 17, name: 'Tangan kanan', region: 'Lengan & Tangan' },
  { id: 18, name: 'Paha kiri', region: 'Kaki & Tungkai' },
  { id: 19, name: 'Paha kanan', region: 'Kaki & Tungkai' },
  { id: 20, name: 'Lutut kiri', region: 'Kaki & Tungkai' },
  { id: 21, name: 'Lutut kanan', region: 'Kaki & Tungkai' },
  { id: 22, name: 'Betis kiri', region: 'Kaki & Tungkai' },
  { id: 23, name: 'Betis kanan', region: 'Kaki & Tungkai' },
  { id: 24, name: 'Pergelangan kaki kiri', region: 'Kaki & Tungkai' },
  { id: 25, name: 'Pergelangan kaki kanan', region: 'Kaki & Tungkai' },
  { id: 26, name: 'Kaki kiri', region: 'Kaki & Tungkai' },
  { id: 27, name: 'Kaki kanan', region: 'Kaki & Tungkai' },
];

export const NBM_REGIONS = ['Semua', 'Leher & Bahu', 'Lengan & Tangan', 'Punggung & Badan', 'Kaki & Tungkai'];

export const NBM_OPTIONS = [
  { value: 1, label: 'Tidak Sakit', desc: 'Normal / nyaman', color: '#10B981', bg: '#F0FDF4' },
  { value: 2, label: 'Agak Sakit', desc: 'Rasa pegal ringan', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 3, label: 'Sakit', desc: 'Nyeri mengganggu', color: '#EA580C', bg: '#FFF7ED' },
  { value: 4, label: 'Sangat Sakit', desc: 'Nyeri berat / kram', color: '#DC2626', bg: '#FEF2F2' },
];

export function calculateNbmScore(scores: Record<number, number>): {
  totalScore: number;
  riskLevel: string;
  action: string;
  color: string;
  answeredCount: number;
} {
  const answeredKeys = Object.keys(scores).map(Number);
  const answeredCount = answeredKeys.length;
  let totalScore = 0;
  for (const key of answeredKeys) {
    totalScore += scores[key] || 0;
  }

  let riskLevel = '';
  let action = '';
  let color = '';

  if (totalScore <= 49) {
    riskLevel = 'Rendah (Low)';
    action = 'Tingkat risiko rendah. Tindakan perbaikan belum diperlukan saat ini.';
    color = '#10B981';
  } else if (totalScore <= 70) {
    riskLevel = 'Sedang (Medium)';
    action = 'Tingkat risiko sedang. Mungkin diperlukan tindakan perbaikan di masa mendatang.';
    color = '#F59E0B';
  } else if (totalScore <= 90) {
    riskLevel = 'Tinggi (High)';
    action = 'Tingkat risiko tinggi. Diperlukan tindakan perbaikan segera.';
    color = '#EA580C';
  } else {
    riskLevel = 'Sangat Tinggi (Very High)';
    action = 'Tingkat risiko sangat tinggi. Diperlukan tindakan perbaikan menyeluruh saat ini juga.';
    color = '#DC2626';
  }

  return { totalScore, riskLevel, action, color, answeredCount };
}
