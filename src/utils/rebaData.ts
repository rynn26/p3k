export interface RebaStepOption {
  score: number;
  title: string;
  titleEn?: string;
  angleRange: string;
  angleRangeEn?: string;
  image: string;
  color: string;
  bgColor: string;
}

export interface RebaAdjustmentOption {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  color: string;
  points: number;
}

export interface RebaStepConfig {
  step: number;
  key: string;
  stepLabel: string;
  stepLabelEn?: string;
  subHeaderTitle: string;
  subHeaderTitleEn?: string;
  questionTitle: string;
  questionTitleEn?: string;
  group: 'A' | 'B';
  options: RebaStepOption[];
  hasAdjustmentLayer: boolean;
  adjustmentQuestionTitle?: string;
  adjustmentQuestionTitleEn?: string;
  adjustments: RebaAdjustmentOption[];
}

export const REBA_STEPS: RebaStepConfig[] = [
  // STEP 1: LEHER (NECK)
  {
    step: 1,
    key: 'neck',
    stepLabel: 'Langkah 1',
    stepLabelEn: 'Step 1',
    subHeaderTitle: 'Posisi Leher',
    subHeaderTitleEn: 'Neck Posture',
    questionTitle: 'Pilihlah Posisi Leher Anda Pada saat Bekerja.',
    questionTitleEn: 'Choose your neck posture during work.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah posisi leher Anda berputar atau miring ke samping?',
    adjustmentQuestionTitleEn: 'Does your neck twist or tilt to the side?',
    options: [
      {
        score: 1,
        title: 'Posisi Netral (0° - 20°)',
        titleEn: 'Neutral Posture (0° - 20°)',
        angleRange: '0° - 20°',
        angleRangeEn: '0° - 20°',
        image: '/images/lehernetral.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Menunduk Sedang (> 20°)',
        titleEn: 'Moderate Flexion (> 20°)',
        angleRange: '> 20°',
        angleRangeEn: '> 20°',
        image: '/images/lehermenunduk.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Menunduk Ekstrem (> 45°)',
        titleEn: 'Extreme Flexion (> 45°)',
        angleRange: '> 45°',
        angleRangeEn: '> 45°',
        image: '/images/menundukekstreme.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'neck_twist',
        title: 'Leher berputar / menoleh',
        titleEn: 'Neck is twisted / turned',
        subtitle: 'Kepala menoleh ke arah kiri atau kanan saat bekerja',
        subtitleEn: 'Head turns to left or right during work',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'neck_side_bend',
        title: 'Leher miring ke samping',
        titleEn: 'Neck is side-bending / tilted',
        subtitle: 'Kepala menekuk miring ke arah bahu kiri atau kanan',
        subtitleEn: 'Head tilts towards left or right shoulder',
        color: '#0284C7',
        points: 1,
      },
    ],
  },

  // STEP 2: PUNGGUNG (TRUNK)
  {
    step: 2,
    key: 'trunk',
    stepLabel: 'Langkah 2',
    stepLabelEn: 'Step 2',
    subHeaderTitle: 'Posisi Punggung',
    subHeaderTitleEn: 'Trunk Posture',
    questionTitle: 'Pilihlah Posisi Batang Tubuh / Punggung Anda Pada saat Bekerja.',
    questionTitleEn: 'Choose your trunk / back posture during work.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah posisi batang tubuh Anda berputar atau miring ke samping?',
    adjustmentQuestionTitleEn: 'Does your trunk twist or bend to the side?',
    options: [
      {
        score: 1,
        title: 'Tegak Lurus (0°)',
        titleEn: 'Upright / Neutral (0°)',
        angleRange: '0°',
        angleRangeEn: '0°',
        image: '/images/posisitegak.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Ekstensi Ringan (0° - 20°)',
        titleEn: 'Slight Extension (0° - 20°)',
        angleRange: '0° - 20°',
        angleRangeEn: '0° - 20°',
        image: '/images/sedikitekstensi.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 3,
        title: 'Fleksi Ringan (0° - 20°)',
        titleEn: 'Slight Flexion (0° - 20°)',
        angleRange: '0° - 20°',
        angleRangeEn: '0° - 20°',
        image: '/images/sedikitfleksi.png',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        score: 4,
        title: 'Fleksi Sedang (20° - 60°)',
        titleEn: 'Moderate Flexion (20° - 60°)',
        angleRange: '20° - 60°',
        angleRangeEn: '20° - 60°',
        image: '/images/fleksibesar.png',
        color: '#EA580C',
        bgColor: '#FFF7ED',
      },
      {
        score: 5,
        title: 'Fleksi Ekstrem (> 60°)',
        titleEn: 'Extreme Flexion (> 60°)',
        angleRange: '> 60°',
        angleRangeEn: '> 60°',
        image: '/images/sangatfleksi.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'trunk_twist',
        title: 'Batang tubuh terpuntir / berputar',
        titleEn: 'Trunk is twisted',
        subtitle: 'Pinggang atau tubuh berputar ke kiri/kanan saat bekerja',
        subtitleEn: 'Waist or torso rotates to left/right during work',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'trunk_side_bend',
        title: 'Batang tubuh miring ke samping',
        titleEn: 'Trunk is side-bending',
        subtitle: 'Tubuh condong miring ke arah samping kiri atau kanan',
        subtitleEn: 'Torso leans or tilts to left or right',
        color: '#0284C7',
        points: 1,
      },
    ],
  },

  // STEP 3: KAKI (LEGS)
  {
    step: 3,
    key: 'legs',
    stepLabel: 'Langkah 3',
    stepLabelEn: 'Step 3',
    subHeaderTitle: 'Penopang Kaki',
    subHeaderTitleEn: 'Leg Support',
    questionTitle: 'Pilihlah Posisi Penopang Kaki Anda Pada saat Bekerja.',
    questionTitleEn: 'Choose your leg support posture during work.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah lutut Anda menekuk saat melakukan aktivitas kerja?',
    adjustmentQuestionTitleEn: 'Do your knees bend during work activities?',
    options: [
      {
        score: 1,
        title: 'Menopang Seimbang (Kedua Kaki)',
        titleEn: 'Bilateral Weight Bearing (Both Legs)',
        angleRange: 'Kedua kaki kokoh / duduk',
        angleRangeEn: 'Both feet firm / sitting',
        image: '/images/tungkaimenopang.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Menopang Tidak Seimbang / Satu Kaki',
        titleEn: 'Unilateral Weight Bearing / One Leg',
        angleRange: 'Satu kaki / tidak stabil',
        angleRangeEn: 'One leg / unstable posture',
        image: '/images/tungkaitidakseimbang.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'knee_30_60',
        title: 'Lutut menekuk antara 30° - 60°',
        titleEn: 'Knee flexion between 30° - 60°',
        subtitle: 'Lutut ditekuk dalam posisi setengah jongkok ringan',
        subtitleEn: 'Knees bent in a slight semi-squat position',
        color: '#F59E0B',
        points: 1,
      },
      {
        id: 'knee_over_60',
        title: 'Lutut menekuk ekstrem > 60°',
        titleEn: 'Extreme knee flexion > 60°',
        subtitle: 'Posisi jongkok penuh atau lutut menekuk sangat dalam',
        subtitleEn: 'Deep squat or knee flexion > 60° (not sitting)',
        color: '#DC2626',
        points: 2,
      },
    ],
  },

  // STEP 4: BEBAN / TENAGA (LOAD/FORCE)
  {
    step: 4,
    key: 'load',
    stepLabel: 'Langkah 4',
    stepLabelEn: 'Step 4',
    subHeaderTitle: 'Beban Angkat',
    subHeaderTitleEn: 'Load / Force',
    questionTitle: 'Pilihlah Beban / Tenaga yang Diberikan saat Bekerja.',
    questionTitleEn: 'Choose the load weight or force exerted during work.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah beban diberikan secara mendadak atau timbul sentakan cepat?',
    adjustmentQuestionTitleEn: 'Is the load applied with shock or rapid build-up of force?',
    options: [
      {
        score: 0,
        title: 'Beban Ringan (< 5 kg)',
        titleEn: 'Light Load (< 5 kg)',
        angleRange: '< 5 kg',
        angleRangeEn: '< 5 kg',
        image: '/images/beban.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 1,
        title: 'Beban Sedang (5 - 10 kg)',
        titleEn: 'Medium Load (5 - 10 kg)',
        angleRange: '5 - 10 kg',
        angleRangeEn: '5 - 10 kg',
        image: '/images/bebasnn.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Beban Berat (> 10 kg)',
        titleEn: 'Heavy Load (> 10 kg)',
        angleRange: '> 10 kg',
        angleRangeEn: '> 10 kg',
        image: '/images/bebanmax.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'load_shock',
        title: 'Beban sentakan mendadak / dinamik',
        titleEn: 'Shock or rapid build-up of force',
        subtitle: 'Gaya timbul tiba-tiba dan mendadak saat mengangkat objek',
        subtitleEn: 'Sudden dynamic force or unexpected jerk during lifting',
        color: '#EA580C',
        points: 1,
      },
    ],
  },

  // STEP 5: LENGAN ATAS (UPPER ARM)
  {
    step: 5,
    key: 'upperArm',
    stepLabel: 'Langkah 5',
    stepLabelEn: 'Step 5',
    subHeaderTitle: 'Lengan Atas',
    subHeaderTitleEn: 'Upper Arm Posture',
    questionTitle: 'Pilihlah Posisi Lengan Atas Anda Pada saat Bekerja.',
    questionTitleEn: 'Choose your upper arm posture during work.',
    group: 'B',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah ada kondisi penyesuaian pada posisi lengan atas Anda?',
    adjustmentQuestionTitleEn: 'Are there any adjustment conditions for your upper arm position?',
    options: [
      {
        score: 1,
        title: 'Posisi Netral (-20° s/d 20°)',
        titleEn: 'Neutral Posture (-20° to 20°)',
        angleRange: '-20° s/d 20°',
        angleRangeEn: '-20° to 20°',
        image: '/images/trhhhl.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Ekstensi ke Belakang (> 20°)',
        titleEn: 'Extension (> 20°)',
        angleRange: '> 20° ke belakang',
        angleRangeEn: '> 20° backwards',
        image: '/images/gagagaga.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Fleksi Sedang (20° - 45°)',
        titleEn: 'Moderate Flexion (20° - 45°)',
        angleRange: '20° - 45° ke depan',
        angleRangeEn: '20° - 45° forwards',
        image: '/images/asasasas.png',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        score: 3,
        title: 'Fleksi Tinggi (45° - 90°)',
        titleEn: 'High Flexion (45° - 90°)',
        angleRange: '45° - 90° setinggi bahu',
        angleRangeEn: '45° - 90° shoulder height',
        image: '/images/sdsdsdsd.png',
        color: '#EA580C',
        bgColor: '#FFF7ED',
      },
      {
        score: 4,
        title: 'Fleksi Ekstrem (> 90°)',
        titleEn: 'Extreme Flexion (> 90°)',
        angleRange: '> 90° di atas bahu',
        angleRangeEn: '> 90° overhead',
        image: '/images/adsd.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'arm_shoulder_raised',
        title: 'Bahu terangkat ke atas',
        titleEn: 'Shoulder raised / elevated',
        subtitle: 'Bahu terangkat saat menjangkau atau mengangkat beban',
        subtitleEn: 'Shoulder is elevated during reach or lifting task',
        color: '#EA580C',
        points: 1,
      },
      {
        id: 'arm_abducted',
        title: 'Lengan menjauh dari tubuh (abduksi)',
        titleEn: 'Upper arm abducted / away from body',
        subtitle: 'Lengan direntangkan ke samping menjauh dari sumbu tubuh',
        subtitleEn: 'Upper arm extends outward sideways from the torso',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'arm_supported',
        title: 'Lengan mendapat penopang / bersandar',
        titleEn: 'Arm supported / leaning',
        subtitle: 'Lengan bertumpu pada meja atau sandaran kursi kerja',
        subtitleEn: 'Arm rests on a desk support or chair armrest',
        color: '#10B981',
        points: -1,
      },
    ],
  },

  // STEP 6: LENGAN BAWAH (LOWER ARM)
  {
    step: 6,
    key: 'lowerArm',
    stepLabel: 'Langkah 6',
    stepLabelEn: 'Step 6',
    subHeaderTitle: 'Lengan Bawah',
    subHeaderTitleEn: 'Lower Arm Posture',
    questionTitle: 'Pilihlah Posisi Sudut Tekukan Siku / Lengan Bawah Anda.',
    questionTitleEn: 'Choose your lower arm (elbow bend angle) posture.',
    group: 'B',
    hasAdjustmentLayer: false,
    options: [
      {
        score: 1,
        title: 'Fleksi Netral (60° - 100°)',
        titleEn: 'Neutral Flexion (60° - 100°)',
        angleRange: '60° - 100°',
        angleRangeEn: '60° - 100°',
        image: '/images/gsgsgs.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Lengan Terbuka / Lurus (< 60°)',
        titleEn: 'Arm Extended / Straight (< 60°)',
        angleRange: '< 60°',
        angleRangeEn: '< 60°',
        image: '/images/sdsd.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Fleksi Tinggi (> 100°)',
        titleEn: 'High Flexion (> 100°)',
        angleRange: '> 100°',
        angleRangeEn: '> 100°',
        image: '/images/dsdsdsdds.png',
        color: '#2563EB',
        bgColor: '#EFF6FF',
      },
    ],
    adjustments: [],
  },

  // STEP 7: PERGELANGAN TANGAN (WRIST)
  {
    step: 7,
    key: 'wrist',
    stepLabel: 'Langkah 7',
    stepLabelEn: 'Step 7',
    subHeaderTitle: 'Pergelangan Tangan',
    subHeaderTitleEn: 'Wrist Posture',
    questionTitle: 'Pilihlah Posisi Sudut Tekukan Pergelangan Tangan Anda.',
    questionTitleEn: 'Choose your wrist flexion or extension posture.',
    group: 'B',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah pergelangan tangan Anda menyimpang atau berputar dari garis tengah?',
    adjustmentQuestionTitleEn: 'Is your wrist deviated from midline or twisted?',
    options: [
      {
        score: 1,
        title: 'Posisi Lurus / Netral (0° - 15°)',
        titleEn: 'Straight / Neutral Position (0° - 15°)',
        angleRange: '0° - 15°',
        angleRangeEn: '0° - 15°',
        image: '/images/gsgsgsgsgsgsggsgs.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Tekuk ke Atas (> 15°)',
        titleEn: 'Bent Upwards (> 15°)',
        angleRange: '> 15° ke atas',
        angleRangeEn: '> 15° extension',
        image: '/images/jshjhsjhs.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Tekuk ke Bawah (> 15°)',
        titleEn: 'Bent Downwards (> 15°)',
        angleRange: '> 15° ke bawah',
        angleRangeEn: '> 15° flexion',
        image: '/images/hsjdhjshd.png',
        color: '#EF4444',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'wrist_twisted',
        title: 'Pergelangan menyimpang atau terpuntir',
        titleEn: 'Wrist deviated or twisted',
        subtitle: 'Pergelangan menyimpang ke samping (radial/ulnar) atau berputar',
        subtitleEn: 'Wrist is bent away from midline or twisted sideways',
        color: '#EA580C',
        points: 1,
      },
    ],
  },

  // STEP 8: KOPLING & AKTIVITAS TAMBAHAN
  {
    step: 8,
    key: 'coupling_activity',
    stepLabel: 'Langkah 8',
    stepLabelEn: 'Step 8',
    subHeaderTitle: 'Kopling Beban',
    subHeaderTitleEn: 'Coupling Quality',
    questionTitle: 'Pilihlah Kualitas Pegangan / Kopling Tangan pada Beban.',
    questionTitleEn: 'Choose the hand grip / coupling quality on the load.',
    group: 'B',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Skor Aktivitas Kerja Tambahan',
    adjustmentQuestionTitleEn: 'Additional Work Activity Score',
    options: [
      {
        score: 0,
        title: 'Good / Sangat Baik',
        titleEn: 'Good',
        angleRange: 'Pegangan pas dan genggaman nyaman',
        angleRangeEn: 'Well-fitting handle and comfortable grip',
        image: '/images/trhhhl.png',
        color: '#059669',
        bgColor: '#F0FDF4',
      },
      {
        score: 1,
        title: 'Fair / Cukup Baik',
        titleEn: 'Fair',
        angleRange: 'Pegangan dapat diterima namun tidak ideal',
        angleRangeEn: 'Acceptable hand hold though not ideal',
        image: '/images/sdsd.png',
        color: '#2563EB',
        bgColor: '#EFF6FF',
      },
      {
        score: 2,
        title: 'Poor / Kurang Baik',
        titleEn: 'Poor',
        angleRange: 'Genggaman tidak nyaman atau posisi janggal',
        angleRangeEn: 'Hand hold not acceptable though possible',
        image: '/images/bebasnn.png',
        color: '#D97706',
        bgColor: '#FFFBEB',
      },
      {
        score: 3,
        title: 'Unacceptable / Tidak Dapat Diterima',
        titleEn: 'Unacceptable',
        angleRange: 'Tanpa pegangan, canggung, berbahaya diangkat',
        angleRangeEn: 'No handles, awkward, unsafe to hold',
        image: '/images/bebanmax.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'act_static',
        title: 'Postur Statis > 1 Menit',
        titleEn: 'Static Posture > 1 Minute',
        subtitle: '1 atau lebih bagian tubuh ditahan dalam posisi tetap > 1 menit',
        subtitleEn: '1 or more body parts held in a fixed position > 1 min',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'act_repetitive',
        title: 'Gerakan Repetitif (> 4x / Menit)',
        titleEn: 'Repetitive Action (> 4x / Minute)',
        subtitle: 'Aksi gerakan kecil diulang terus-menerus lebih dari 4 kali per menit',
        subtitleEn: 'Small actions repeated > 4 times per min (excluding walking)',
        color: '#0284C7',
        points: 1,
      },
      {
        id: 'act_rapid',
        title: 'Perubahan Postur Cepat / Dasar Tidak Stabil',
        titleEn: 'Rapid Large Posture Change / Unstable Base',
        subtitle: 'Aksi kerja menyebabkan perubahan postur besar dan mendadak atau pijakan goyah',
        subtitleEn: 'Action causes sudden large rapid posture changes or unstable base',
        color: '#EA580C',
        points: 1,
      },
    ],
  },
];
