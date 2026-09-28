// REBA Scoring Engine matching lib/utils/reba_scoring.dart exactly

export class RebaScoringEngine {
  // Table A Matrix: [Trunk 1..5][Neck 1..3][Legs 1..4]
  static readonly tableA: number[][][] = [
    // Trunk 1
    [
      [1, 2, 3, 4], // Neck 1: 0°-20° (neutral)
      [1, 2, 3, 4], // Neck 2: >20° flexion
      [3, 3, 5, 6], // Neck 3: extension/extreme
    ],
    // Trunk 2
    [
      [1, 2, 4, 5],
      [3, 4, 5, 6],
      [4, 5, 6, 7],
    ],
    // Trunk 3
    [
      [2, 4, 5, 6],
      [4, 5, 6, 7],
      [5, 6, 7, 8],
    ],
    // Trunk 4
    [
      [3, 5, 6, 7],
      [5, 6, 7, 8],
      [6, 7, 8, 9],
    ],
    // Trunk 5
    [
      [4, 6, 7, 8],
      [6, 7, 8, 9],
      [7, 8, 9, 9],
    ],
  ];

  static getTableAScore(neck: number, trunk: number, legs: number): number {
    const t = Math.min(Math.max(trunk, 1), 5) - 1;
    const n = Math.min(Math.max(neck, 1), 3) - 1;
    const l = Math.min(Math.max(legs, 1), 4) - 1;
    return this.tableA[t][n][l];
  }

  // Table B Matrix: [Upper Arm 1..6][Lower Arm 1..2][Wrist 1..3]
  static readonly tableB: number[][][] = [
    // Upper Arm 1
    [
      [1, 2, 2],
      [1, 2, 3],
    ],
    // Upper Arm 2
    [
      [1, 2, 3],
      [2, 3, 4],
    ],
    // Upper Arm 3
    [
      [3, 4, 5],
      [4, 5, 5],
    ],
    // Upper Arm 4
    [
      [4, 5, 5],
      [5, 6, 7],
    ],
    // Upper Arm 5
    [
      [6, 7, 8],
      [7, 8, 8],
    ],
    // Upper Arm 6
    [
      [7, 8, 8],
      [8, 9, 9],
    ],
  ];

  static getTableBScore(upperArm: number, lowerArm: number, wrist: number): number {
    const u = Math.min(Math.max(upperArm, 1), 6) - 1;
    const l = Math.min(Math.max(lowerArm, 1), 2) - 1;
    const w = Math.min(Math.max(wrist, 1), 3) - 1;
    return this.tableB[u][l][w];
  }

  // Table C Matrix: [Score A: 1..12][Score B: 1..12] -> Final Table C Score
  static readonly tableC: number[][] = [
    // Score A = 1
    [1, 1, 1, 2, 3, 3, 4, 5, 6, 7, 7, 7],
    // Score A = 2
    [1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8],
    // Score A = 3
    [2, 3, 3, 3, 4, 5, 6, 7, 7, 8, 8, 8],
    // Score A = 4
    [3, 4, 4, 4, 5, 6, 7, 8, 8, 9, 9, 9],
    // Score A = 5
    [4, 4, 4, 5, 6, 7, 8, 8, 9, 9, 9, 9],
    // Score A = 6
    [6, 6, 6, 7, 8, 8, 9, 9, 10, 10, 10, 10],
    // Score A = 7
    [7, 7, 7, 8, 9, 9, 9, 10, 10, 11, 11, 11],
    // Score A = 8
    [8, 8, 8, 9, 10, 10, 10, 10, 10, 11, 11, 11],
    // Score A = 9
    [9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12],
    // Score A = 10
    [10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12],
    // Score A = 11
    [11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12],
    // Score A = 12
    [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  ];

  static getTableCScore(scoreA: number, scoreB: number): number {
    const a = Math.min(Math.max(scoreA, 1), 12) - 1;
    const b = Math.min(Math.max(scoreB, 1), 12) - 1;
    return this.tableC[a][b];
  }

  static calculateFinalScore(
    neck: number,
    trunk: number,
    legs: number,
    load: number,
    upperArm: number,
    lowerArm: number,
    wrist: number,
    coupling: number,
    activity: number
  ): {
    scoreA: number;
    scoreB: number;
    tableCScore: number;
    finalScore: number;
    riskLevel: string;
    action: string;
    color: string;
  } {
    const postureA = this.getTableAScore(neck, trunk, legs);
    const scoreA = postureA + load;

    const postureB = this.getTableBScore(upperArm, lowerArm, wrist);
    const scoreB = postureB + coupling;

    const tableCScore = this.getTableCScore(scoreA, scoreB);
    const finalScore = tableCScore + activity;

    let riskLevel = '';
    let action = '';
    let color = '';

    if (finalScore <= 1) {
      riskLevel = 'Diabaikan (Negligible)';
      action = 'Tidak perlu tindakan.';
      color = '#0EA5E9';
    } else if (finalScore <= 3) {
      riskLevel = 'Rendah (Low)';
      action = 'Mungkin perlu tindakan perbaikan.';
      color = '#10B981';
    } else if (finalScore <= 7) {
      riskLevel = 'Sedang (Medium)';
      action = 'Perlu tindakan perbaikan dalam waktu dekat.';
      color = '#F59E0B';
    } else if (finalScore <= 10) {
      riskLevel = 'Tinggi (High)';
      action = 'Perlu tindakan perbaikan segera.';
      color = '#EA580C';
    } else {
      riskLevel = 'Sangat Tinggi (Very High)';
      action = 'Perlu tindakan perbaikan menyeluruh sekarang juga.';
      color = '#DC2626';
    }

    return {
      scoreA,
      scoreB,
      tableCScore,
      finalScore,
      riskLevel,
      action,
      color,
    };
  }
}
