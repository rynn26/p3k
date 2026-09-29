import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

// 1. Fisika: Inti atom + 3 orbit elips
export const PhysicsAtomIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Inti atom */}
    <circle cx="20" cy="20" r="4.8" fill={color} />
    {/* Orbit 1 (horizontal) */}
    <ellipse cx="20" cy="20" rx="17.6" ry="6.4" stroke={color} strokeWidth="2.2" />
    {/* Orbit 2 (rotated 60 deg) */}
    <ellipse
      cx="20"
      cy="20"
      rx="17.6"
      ry="6.4"
      stroke={color}
      strokeWidth="2.2"
      transform="rotate(60 20 20)"
    />
    {/* Orbit 3 (rotated 120 deg) */}
    <ellipse
      cx="20"
      cy="20"
      rx="17.6"
      ry="6.4"
      stroke={color}
      strokeWidth="2.2"
      transform="rotate(120 20 20)"
    />
  </svg>
);

// 2. Kimia: Labu Erlenmeyer + efek cairan & gelembung
export const ChemistryFlaskIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Bibir atas */}
    <line x1="15" y1="6.5" x2="25" y2="6.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    {/* Badan labu */}
    <path
      d="M17 6.5V15.5L8 31.5C7.5 32.5 8 34.5 11 34.5H29C32 34.5 32.5 32.5 32 31.5L23 15.5V6.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Cairan */}
    <path
      d="M10.8 26.5L9.2 31.5C9 32.3 9.8 33.2 11.2 33.2H28.8C30.2 33.2 31 32.3 30.8 31.5L29.2 26.5C26.5 28 24 25.5 20 27C16 28.5 13.5 25 10.8 26.5Z"
      fill={color}
      fillOpacity="0.4"
    />
    {/* Gelembung */}
    <circle cx="18" cy="22" r="1.5" fill={color} />
    <circle cx="23" cy="20" r="1" fill={color} />
  </svg>
);

// 3. Biologi: Batang & 2 Daun Organik
export const BiologyLeafIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Batang utama melengkung */}
    <path
      d="M12 34.5C14 26 21 16 32 7.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Daun kanan atas */}
    <path
      d="M19 19C28 14 32 7 32 7C32.8 16 24.8 21.6 19 19Z"
      fill={color}
    />
    {/* Daun kiri bawah */}
    <path
      d="M14.4 25.6C8 22 8.8 15.2 8.8 15.2C15.2 16 17.6 22 14.4 25.6Z"
      fill={color}
    />
  </svg>
);

// 4. Ergonomi: Orang Duduk Bekerja di Meja (Sama Persis Flutter ErgonomicsSittingPainter)
export const ErgonomicsSittingIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Kepala pekerja */}
    <circle cx="16.8" cy="10.4" r="3.2" fill={color} />
    {/* Tubuh orang duduk (leher -> punggung -> pinggul -> paha -> betis) */}
    <path
      d="M16.8 14.4L15.2 20.8H22.4V31.2"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Tangan menjangkau meja */}
    <path
      d="M15.6 16.8L20.8 18.8H26"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Kursi ergonomis */}
    <path
      d="M12 16V22.4H19.2M12 22.4V31.2"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Meja kerja */}
    <path
      d="M24 19.2H32.8M31.2 19.2V31.2"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 5. Stres: Siluet Kepala Menghadap Kiri + Petir Beban Pikiran
export const StressHeadIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Siluet kepala */}
    <path
      d="M16.8 33.6V28.8C15.2 26 12.8 24.8 12.8 21.6L11.2 19.2L13.6 17.6V14.4C14.4 7.2 21.6 7.2 21.6 7.2C30.4 7.2 30.4 17.6 30.4 17.6C29.6 24 26.4 28.8 26.4 33.6"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Petir 1 */}
    <path
      d="M19.2 12L17.6 16.8H20L18.4 21.6"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Petir 2 */}
    <path
      d="M24 12L22.4 16.8H24.8L23.2 21.6"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 6. SMK3: Perisai Keselamatan + Palang Medis di Tengah
export const Smk3ShieldIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    {/* Perisai outline */}
    <path
      d="M20 6.5L31.2 9.6C32 21.6 20 33.6 20 33.6C20 33.6 8 21.6 8.8 9.6L20 6.5Z"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Palang Medis Vertikal */}
    <rect x="17.6" y="12.5" width="4.8" height="12.8" rx="1.5" fill={color} />
    {/* Palang Medis Horizontal */}
    <rect x="13.6" y="16.5" width="12.8" height="4.8" rx="1.5" fill={color} />
  </svg>
);
