import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { User, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userId: string) => void;
  onNavigateToRegister: () => void;
  lang: 'ID' | 'ENG';
  onToggleLang: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  lang,
  onToggleLang,
}) => {
  const isEng = lang === 'ENG';

  // Step 1: Welcome Gate Screen, Step 2: Input Form Screen
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg(isEng ? 'Email and password are required.' : 'Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLoginSuccess(data.user.id);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      let friendly = isEng ? 'Failed to sign in. Please try again.' : 'Gagal masuk. Silakan coba kembali.';
      const raw = err?.message || '';
      if (raw.includes('Invalid login credentials') || raw.includes('invalid_credentials')) {
        friendly = isEng
          ? 'Incorrect email or password. Please check your credentials.'
          : 'Email atau kata sandi tidak cocok. Silakan periksa kembali.';
      } else if (raw.includes('Email not confirmed')) {
        friendly = isEng
          ? 'Email is not confirmed yet. Please verify your inbox.'
          : 'Email belum dikonfirmasi. Periksa kotak masuk email Anda.';
      }
      setErrorMsg(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== TAHAP 1: WELCOME SCREEN (SAMA PERSIS DENGAN FLUTTER) ====================
  if (currentStep === 1) {
    return (
      <div
        className="fade-in"
        style={{
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #E2F0FE 0%, #F1F7FE 50%, #E7F3FD 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Background Waves & Organic Leaf SVG Decoration matching Flutter K3BackgroundDecorationPainter */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
        >
          {/* Top-left Wave 1 */}
          <path
            d="M0,0 L180,0 C140,64 48,72 0,112 Z"
            fill="rgba(186, 230, 253, 0.55)"
          />
          {/* Top-left Wave 2 */}
          <path
            d="M0,0 L120,0 C88,48 32,56 0,80 Z"
            fill="rgba(224, 242, 254, 0.8)"
          />
          {/* Bottom Wave 1 */}
          <path
            d="M0,680 C100,656 180,704 400,664 L400,800 L0,800 Z"
            fill="rgba(147, 197, 253, 0.25)"
          />
          {/* Bottom Wave 2 */}
          <path
            d="M0,704 C140,736 260,672 400,696 L400,800 L0,800 Z"
            fill="rgba(96, 165, 250, 0.18)"
          />
          {/* Bottom Left Leaf 1 */}
          <path
            d="M0,752 Q32,728 48,704 Q40,760 0,792 Z"
            fill="rgba(56, 189, 248, 0.70)"
          />
          {/* Bottom Left Leaf 2 */}
          <path
            d="M0,712 Q28,688 36,664 Q28,720 0,752 Z"
            fill="rgba(56, 189, 248, 0.70)"
          />
          {/* Bottom Right Leaf */}
          <path
            d="M400,752 Q368,728 352,704 Q360,760 400,792 Z"
            fill="rgba(2, 132, 199, 0.65)"
          />
        </svg>

        {/* Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100vh',
            padding: '20px 22px',
            boxSizing: 'border-box',
          }}
        >
          {/* Top Bar: Language Switcher at Top-Right & Centered Logo (height 160px) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: 6 }}>
              <button
                onClick={onToggleLang}
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(13, 91, 215, 0.15)',
                  borderRadius: 20,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: '#0F172A',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                }}
              >
                <Globe size={14} color="#0D5BD7" />
                <span>{lang}</span>
              </button>
            </div>

            {/* Brand Logo Centered */}
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <img
                src="/images/logo.png"
                alt="HERU Brand Logo"
                style={{
                  height: 140,
                  maxHeight: '18vh',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Hero Illustration: Female OHS Officer & Healthcare Facility (assets/images/sasas.png) */}
          <div style={{ margin: '14px 0', textAlign: 'center' }}>
            <div
              style={{
                width: '100%',
                borderRadius: 18,
                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
                aspectRatio: '1702 / 924',
                backgroundColor: 'rgba(186, 230, 253, 0.4)',
                transform: 'scale(1.02)',
              }}
            >
              <img
                src="/images/sasas.png"
                alt="OHS Officer Hero"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  // Fallback to k3_hero_banner if sasas.png fails
                  (e.target as HTMLImageElement).src = '/images/k3_hero_banner.jpg';
                }}
              />
            </div>
          </div>

          {/* Bottom Actions: Blue Gradient Pill Login Button & Version Footer */}
          <div>
            {/* Blue Gradient Pill Login Button */}
            <button
              onClick={() => setCurrentStep(2)}
              type="button"
              style={{
                width: '100%',
                height: 52,
                borderRadius: 26,
                border: 'none',
                background: 'linear-gradient(to right, #0072FF, #00C6FF)',
                boxShadow: '0 6px 16px rgba(0, 114, 255, 0.35)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 22px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <User size={24} color="#FFFFFF" />
              <span
                style={{
                  fontSize: 16.5,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.3px',
                }}
              >
                Login
              </span>
              <ArrowRight size={22} color="#FFFFFF" />
            </button>

            {/* Footer: Version 1.0 & © 2026 */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: '#64748B',
                  letterSpacing: '0.3px',
                }}
              >
                Version 1.0
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#94A3B8',
                  marginTop: 2,
                }}
              >
                © 2026
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== TAHAP 2: INPUT FORM SCREEN (SAMA PERSIS DENGAN FLUTTER) ====================
  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header Row: Tombol Kembali & Switch Bahasa */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={() => {
            setCurrentStep(1);
            setErrorMsg(null);
          }}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#0F172A',
          }}
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={onToggleLang}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 16,
            padding: '4px 10px',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            color: '#0F172A',
            fontFamily: 'inherit',
          }}
        >
          <Globe size={13} color="#0D5BD7" />
          <span>{lang}</span>
        </button>
      </div>

      {/* Centered Brand Logo */}
      <div style={{ textAlign: 'center', margin: '8px 0 16px 0' }}>
        <img
          src="/images/logo.png"
          alt="HERU Logo"
          style={{ height: 72, objectFit: 'contain' }}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Title & Subtitle */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          {isEng ? 'Sign In to Account' : 'Masuk ke Akun'}
        </h2>
        <p style={{ fontSize: 12.5, fontWeight: 500, color: '#64748B', marginTop: 4 }}>
          {isEng
            ? 'Enter your email and password to continue.'
            : 'Masukkan email dan kata sandi Anda untuk melanjutkan.'}
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 16,
            color: '#DC2626',
            fontSize: 12.5,
            fontWeight: 600,
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Email */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: 8,
            }}
          >
            {isEng ? 'Email Address' : 'Email'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder={isEng ? 'name@email.com' : 'nama@email.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '14px 14px 14px 42px',
                fontSize: 14.5,
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <Mail
              size={18}
              color="#64748B"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: 8,
            }}
          >
            {isEng ? 'Password' : 'Kata Sandi'}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={obscurePassword ? 'password' : 'text'}
              placeholder={isEng ? 'Enter password' : 'Masukkan kata sandi'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 12,
                padding: '14px 42px 14px 42px',
                fontSize: 14.5,
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <Lock
              size={18}
              color="#64748B"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <button
              type="button"
              onClick={() => setObscurePassword(!obscurePassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                padding: 4,
              }}
            >
              {obscurePassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                accentColor: '#0F172A',
                width: 17,
                height: 17,
                borderRadius: 4,
              }}
            />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>
              {isEng ? 'Remember Me' : 'Ingat Saya'}
            </span>
          </label>

          <button
            type="button"
            onClick={() =>
              alert(
                isEng
                  ? 'Please contact administrator if you forgot your password.'
                  : 'Silakan hubungi administrator jika Anda lupa kata sandi.'
              )
            }
            style={{
              background: 'none',
              border: 'none',
              color: '#0284C7',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isEng ? 'Forgot Password?' : 'Lupa kata sandi?'}
          </button>
        </div>

        {/* Tombol Sign In (Elevated button, Color(0xFF0284C7), height 50, borderRadius 12) */}
        <div style={{ marginTop: 12 }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              fontSize: 15.5,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
            }}
          >
            {isLoading ? (
              <span>{isEng ? 'Signing In...' : 'Memproses...'}</span>
            ) : (
              <span>{isEng ? 'Sign In' : 'Masuk'}</span>
            )}
          </button>
        </div>
      </form>

      {/* Daftar Sekarang Footer */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
          {isEng ? "Don't have an account? " : 'Belum punya akun? '}
        </span>
        <button
          type="button"
          onClick={onNavigateToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284C7',
            fontSize: 13,
            fontWeight: 800,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isEng ? 'Register now' : 'Daftar sekarang'}
        </button>
      </div>
    </div>
  );
};
