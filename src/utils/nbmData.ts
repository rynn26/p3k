export interface NbmBodyPart {
  id: number;
  name: string;
  nameEn: string;
  region: string;
  regionEn: string;
}

export const NBM_BODY_PARTS: NbmBodyPart[] = [
  { id: 0, name: 'Leher bagian atas', nameEn: 'Upper Neck', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders' },
  { id: 1, name: 'Leher bagian bawah', nameEn: 'Lower Neck', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders' },
  { id: 2, name: 'Bahu kiri', nameEn: 'Left Shoulder', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders' },
  { id: 3, name: 'Bahu kanan', nameEn: 'Right Shoulder', region: 'Leher & Bahu', regionEn: 'Neck & Shoulders' },
  { id: 4, name: 'Lengan atas kiri', nameEn: 'Left Upper Arm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 5, name: 'Punggung', nameEn: 'Upper Back', region: 'Punggung & Badan', regionEn: 'Back & Torso' },
  { id: 6, name: 'Lengan atas kanan', nameEn: 'Right Upper Arm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 7, name: 'Pinggang', nameEn: 'Waist / Lower Back', region: 'Punggung & Badan', regionEn: 'Back & Torso' },
  { id: 8, name: 'Bokong', nameEn: 'Buttocks', region: 'Punggung & Badan', regionEn: 'Back & Torso' },
  { id: 9, name: 'Pantat', nameEn: 'Bottom', region: 'Punggung & Badan', regionEn: 'Back & Torso' },
  { id: 10, name: 'Siku kiri', nameEn: 'Left Elbow', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 11, name: 'Siku kanan', nameEn: 'Right Elbow', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 12, name: 'Lengan bawah kiri', nameEn: 'Left Forearm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 13, name: 'Lengan bawah kanan', nameEn: 'Right Forearm', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 14, name: 'Pergelangan tangan kiri', nameEn: 'Left Wrist', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 15, name: 'Pergelangan tangan kanan', nameEn: 'Right Wrist', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 16, name: 'Tangan kiri', nameEn: 'Left Hand', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 17, name: 'Tangan kanan', nameEn: 'Right Hand', region: 'Lengan & Tangan', regionEn: 'Arms & Hands' },
  { id: 18, name: 'Paha kiri', nameEn: 'Left Thigh', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 19, name: 'Paha kanan', nameEn: 'Right Thigh', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 20, name: 'Lutut kiri', nameEn: 'Left Knee', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 21, name: 'Lutut kanan', nameEn: 'Right Knee', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 22, name: 'Betis kiri', nameEn: 'Left Calf', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 23, name: 'Betis kanan', nameEn: 'Right Calf', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 24, name: 'Pergelangan kaki kiri', nameEn: 'Left Ankle', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 25, name: 'Pergelangan kaki kanan', nameEn: 'Right Ankle', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 26, name: 'Kaki kiri', nameEn: 'Left Foot', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
  { id: 27, name: 'Kaki kanan', nameEn: 'Right Foot', region: 'Kaki & Tungkai', regionEn: 'Legs & Feet' },
];

export const NBM_REGIONS = ['Semua', 'Leher & Bahu', 'Punggung & Badan', 'Lengan & Tangan', 'Kaki & Tungkai'];

export const NBM_OPTIONS = [
  { value: 1, label: 'Tidak Sakit', labelEn: 'No Pain', desc: 'Normal / nyaman', descEn: 'Normal / comfortable', color: '#10B981', bg: '#F0FDF4' },
  { value: 2, label: 'Agak Sakit', labelEn: 'Mild Pain', desc: 'Rasa pegal ringan', descEn: 'Slight stiffness', color: '#F59E0B', bg: '#FFFBEB' },
  { value: 3, label: 'Sakit', labelEn: 'Painful', desc: 'Nyeri mengganggu', descEn: 'Disruptive ache', color: '#EA580C', bg: '#FFF7ED' },
  { value: 4, label: 'Sangat Sakit', labelEn: 'Severe Pain', desc: 'Nyeri berat / kram', descEn: 'Severe pain / cramp', color: '#DC2626', bg: '#FEF2F2' },
];

export function calculateNbmScore(scores: Record<number, number>, isEng: boolean = false): {
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
    riskLevel = isEng ? 'Low' : 'Rendah (Low)';
    action = isEng
      ? 'Low risk level. Corrective action is not required at this time.'
      : 'Tingkat risiko rendah. Tindakan perbaikan belum diperlukan saat ini.';
    color = '#10B981';
  } else if (totalScore <= 70) {
    riskLevel = isEng ? 'Medium' : 'Sedang (Medium)';
    action = isEng
      ? 'Medium risk level. Corrective action may be needed in the future.'
      : 'Tingkat risiko sedang. Mungkin diperlukan tindakan perbaikan di masa mendatang.';
    color = '#F59E0B';
  } else if (totalScore <= 90) {
    riskLevel = isEng ? 'High' : 'Tinggi (High)';
    action = isEng
      ? 'High risk level. Prompt corrective action required.'
      : 'Tingkat risiko tinggi. Diperlukan tindakan perbaikan segera.';
    color = '#EA580C';
  } else {
    riskLevel = isEng ? 'Very High' : 'Sangat Tinggi (Very High)';
    action = isEng
      ? 'Very high risk level. Comprehensive corrective action required right now.'
      : 'Tingkat risiko sangat tinggi. Diperlukan tindakan perbaikan menyeluruh saat ini juga.';
    color = '#DC2626';
  }

  return { totalScore, riskLevel, action, color, answeredCount };
}
