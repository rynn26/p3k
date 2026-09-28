export interface RebaStepOption {
  score: number;
  title: string;
  angleRange: string;
  image: string;
  color: string;
  bgColor: string;
}

export interface RebaAdjustmentOption {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  points: number;
}

export interface RebaStepConfig {
  step: number;
  key: string;
  stepLabel: string;
  subHeaderTitle: string;
  questionTitle: string;
  group: 'A' | 'B';
  options: RebaStepOption[];
  hasAdjustmentLayer: boolean;
  adjustmentQuestionTitle?: string;
  adjustments: RebaAdjustmentOption[];
}

export const REBA_STEPS: RebaStepConfig[] = [
  // STEP 1: LEHER (NECK)
  {
    step: 1,
    key: 'neck',
    stepLabel: 'Langkah 1',
    subHeaderTitle: 'Posisi Leher',
    questionTitle: 'Pilihlah Posisi Leher Anda Pada saat Bekerja.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah posisi leher Anda berputar atau miring ke samping?',
    options: [
      {
        score: 1,
        title: 'Posisi Netral (0° - 20°)',
        angleRange: '0° - 20°',
        image: '/images/lehernetral.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Menunduk Sedang (> 20°)',
        angleRange: '> 20°',
        image: '/images/lehermenunduk.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Menunduk Ekstrem (> 45°)',
        angleRange: '> 45°',
        image: '/images/menundukekstreme.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'neck_twist',
        title: 'Leher berputar / menoleh',
        subtitle: 'Kepala menoleh ke arah kiri atau kanan saat bekerja',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'neck_side_bend',
        title: 'Leher miring ke samping',
        subtitle: 'Kepala menekuk miring ke arah bahu kiri atau kanan',
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
    subHeaderTitle: 'Posisi Punggung',
    questionTitle: 'Pilihlah Posisi Batang Tubuh / Punggung Anda Pada saat Bekerja.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah posisi batang tubuh Anda berputar atau miring ke samping?',
    options: [
      {
        score: 1,
        title: 'Tegak Lurus (0°)',
        angleRange: '0°',
        image: '/images/posisitegak.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Ekstensi Ringan (0° - 20°)',
        angleRange: '0° - 20°',
        image: '/images/sedikitekstensi.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 3,
        title: 'Fleksi Ringan (0° - 20°)',
        angleRange: '0° - 20°',
        image: '/images/sedikitfleksi.png',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        score: 4,
        title: 'Fleksi Sedang (20° - 60°)',
        angleRange: '20° - 60°',
        image: '/images/fleksibesar.png',
        color: '#EA580C',
        bgColor: '#FFF7ED',
      },
      {
        score: 5,
        title: 'Fleksi Ekstrem (> 60°)',
        angleRange: '> 60°',
        image: '/images/sangatfleksi.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'trunk_twist',
        title: 'Batang tubuh terpuntir / berputar',
        subtitle: 'Pinggang atau tubuh berputar ke kiri/kanan saat bekerja',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'trunk_side_bend',
        title: 'Batang tubuh miring ke samping',
        subtitle: 'Tubuh condong miring ke arah samping kiri atau kanan',
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
    subHeaderTitle: 'Penopang Kaki',
    questionTitle: 'Pilihlah Posisi Penopang Kaki Anda Pada saat Bekerja.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah lutut Anda menekuk saat melakukan aktivitas kerja?',
    options: [
      {
        score: 1,
        title: 'Menopang Seimbang (Kedua Kaki)',
        angleRange: 'Kedua kaki kokoh / duduk',
        image: '/images/tungkaimenopang.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Menopang Tidak Seimbang / Satu Kaki',
        angleRange: 'Satu kaki / tidak stabil',
        image: '/images/tungkaitidakseimbang.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'knee_30_60',
        title: 'Lutut menekuk antara 30° - 60°',
        subtitle: 'Lutut ditekuk dalam posisi setengah jongkok ringan',
        color: '#F59E0B',
        points: 1,
      },
      {
        id: 'knee_over_60',
        title: 'Lutut menekuk ekstrem > 60°',
        subtitle: 'Posisi jongkok penuh atau lutut menekuk sangat dalam',
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
    subHeaderTitle: 'Beban Angkat',
    questionTitle: 'Pilihlah Beban / Tenaga yang Diberikan saat Bekerja.',
    group: 'A',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah beban diberikan secara mendadak atau timbul sentakan cepat?',
    options: [
      {
        score: 0,
        title: 'Beban Ringan (< 5 kg)',
        angleRange: '< 5 kg',
        image: '/images/beban.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 1,
        title: 'Beban Sedang (5 - 10 kg)',
        angleRange: '5 - 10 kg',
        image: '/images/bebasnn.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Beban Berat (> 10 kg)',
        angleRange: '> 10 kg',
        image: '/images/bebanmax.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'load_shock',
        title: 'Beban sentakan mendadak / dinamik',
        subtitle: 'Gaya timbul tiba-tiba dan mendadak saat mengangkat objek',
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
    subHeaderTitle: 'Lengan Atas',
    questionTitle: 'Pilihlah Posisi Lengan Atas Anda Pada saat Bekerja.',
    group: 'B',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah ada kondisi penyesuaian pada posisi lengan atas Anda?',
    options: [
      {
        score: 1,
        title: 'Posisi Netral (-20° s/d 20°)',
        angleRange: '-20° s/d 20°',
        image: '/images/trhhhl.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Ekstensi ke Belakang (> 20°)',
        angleRange: '> 20° ke belakang',
        image: '/images/gagagaga.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Fleksi Sedang (20° - 45°)',
        angleRange: '20° - 45° ke depan',
        image: '/images/asasasas.png',
        color: '#3B82F6',
        bgColor: '#EFF6FF',
      },
      {
        score: 3,
        title: 'Fleksi Tinggi (45° - 90°)',
        angleRange: '45° - 90° setinggi bahu',
        image: '/images/sdsdsdsd.png',
        color: '#EA580C',
        bgColor: '#FFF7ED',
      },
      {
        score: 4,
        title: 'Fleksi Ekstrem (> 90°)',
        angleRange: '> 90° di atas bahu',
        image: '/images/adsd.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'arm_shoulder_raised',
        title: 'Bahu terangkat ke atas',
        subtitle: 'Bahu terangkat saat menjangkau atau mengangkat beban',
        color: '#EA580C',
        points: 1,
      },
      {
        id: 'arm_abducted',
        title: 'Lengan menjauh dari tubuh (abduksi)',
        subtitle: 'Lengan direntangkan ke samping menjauh dari sumbu tubuh',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'arm_supported',
        title: 'Lengan mendapat penopang / bersandar',
        subtitle: 'Lengan bertumpu pada meja atau sandaran kursi kerja',
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
    subHeaderTitle: 'Lengan Bawah',
    questionTitle: 'Pilihlah Posisi Sudut Tekukan Siku / Lengan Bawah Anda.',
    group: 'B',
    hasAdjustmentLayer: false,
    options: [
      {
        score: 1,
        title: 'Fleksi Netral (60° - 100°)',
        angleRange: '60° - 100°',
        image: '/images/gsgsgs.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Lengan Terbuka / Lurus (< 60°)',
        angleRange: '< 60°',
        image: '/images/sdsd.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Fleksi Tinggi (> 100°)',
        angleRange: '> 100°',
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
    subHeaderTitle: 'Pergelangan Tangan',
    questionTitle: 'Pilihlah Posisi Sudut Tekukan Pergelangan Tangan Anda.',
    group: 'B',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Apakah pergelangan tangan Anda menyimpang atau berputar dari garis tengah?',
    options: [
      {
        score: 1,
        title: 'Posisi Lurus / Netral (0° - 15°)',
        angleRange: '0° - 15°',
        image: '/images/gsgsgsgsgsgsggsgs.png',
        color: '#10B981',
        bgColor: '#F0FDF4',
      },
      {
        score: 2,
        title: 'Tekuk ke Atas (> 15°)',
        angleRange: '> 15° ke atas',
        image: '/images/jshjhsjhs.png',
        color: '#F59E0B',
        bgColor: '#FFFBEB',
      },
      {
        score: 2,
        title: 'Tekuk ke Bawah (> 15°)',
        angleRange: '> 15° ke bawah',
        image: '/images/hsjdhjshd.png',
        color: '#EF4444',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'wrist_twisted',
        title: 'Pergelangan menyimpang atau terpuntir',
        subtitle: 'Pergelangan menyimpang ke samping (radial/ulnar) atau berputar',
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
    subHeaderTitle: 'Kopling Beban',
    questionTitle: 'Pilihlah Kualitas Pegangan / Kopling Tangan pada Beban.',
    group: 'B',
    hasAdjustmentLayer: true,
    adjustmentQuestionTitle: 'Skor Aktivitas Kerja Tambahan',
    options: [
      {
        score: 0,
        title: 'Good / Sangat Baik',
        angleRange: 'Pegangan pas dan genggaman nyaman',
        image: '/images/trhhhl.png',
        color: '#059669',
        bgColor: '#F0FDF4',
      },
      {
        score: 1,
        title: 'Fair / Cukup Baik',
        angleRange: 'Pegangan dapat diterima namun tidak ideal',
        image: '/images/sdsd.png',
        color: '#2563EB',
        bgColor: '#EFF6FF',
      },
      {
        score: 2,
        title: 'Poor / Kurang Baik',
        angleRange: 'Genggaman tidak nyaman atau posisi janggal',
        image: '/images/bebasnn.png',
        color: '#D97706',
        bgColor: '#FFFBEB',
      },
      {
        score: 3,
        title: 'Unacceptable / Tidak Dapat Diterima',
        angleRange: 'Tanpa pegangan, canggung, berbahaya diangkat',
        image: '/images/bebanmax.png',
        color: '#DC2626',
        bgColor: '#FEF2F2',
      },
    ],
    adjustments: [
      {
        id: 'act_static',
        title: 'Postur Statis > 1 Menit',
        subtitle: '1 atau lebih bagian tubuh ditahan dalam posisi tetap > 1 menit',
        color: '#4F46E5',
        points: 1,
      },
      {
        id: 'act_repetitive',
        title: 'Gerakan Repetitif (> 4x / Menit)',
        subtitle: 'Aksi gerakan kecil diulang terus-menerus lebih dari 4 kali per menit',
        color: '#0284C7',
        points: 1,
      },
      {
        id: 'act_rapid',
        title: 'Perubahan Postur Cepat / Dasar Tidak Stabil',
        subtitle: 'Aksi kerja menyebabkan perubahan postur besar dan mendadak atau pijakan goyah',
        color: '#EA580C',
        points: 1,
      },
    ],
  },
];
