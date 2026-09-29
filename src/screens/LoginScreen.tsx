import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { User, ArrowRight, ChevronLeft, Mail, Lock, Eye, EyeOff, Globe, ChevronDown } from 'lucide-react';

const GoogleLogoSvg: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const AppleLogoSvg: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 170 170" fill="#0F172A" style={{ display: 'block' }}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.53-9.9-11.75-20.98-15.66-33.24-3.92-12.26-5.88-24.08-5.88-35.47 0-14.36 3.48-26.43 10.44-36.21 6.96-9.78 15.98-14.78 27.06-15 4.89 0 10.33 1.25 16.32 3.75 6 2.5 10.05 3.75 12.16 3.75 1.74 0 5.88-1.25 12.41-3.75 6.53-2.5 12.01-3.64 16.44-3.41 12.28.65 22.07 5.22 29.37 13.72-10.87 6.53-16.19 15.66-15.97 27.39.22 9.13 3.8 16.75 10.76 22.84 6.96 6.09 15.11 9.46 24.46 10.12-2.18 6.53-4.79 13.05-7.83 19.57zm-27.83-118.8c0 7.39-2.72 14.13-8.16 20.23-5.44 6.09-12.18 9.79-20.23 11.09-.22-1.3-.33-2.39-.33-3.26 0-7.18 2.83-14.25 8.49-21.21 5.66-6.96 12.62-10.87 20.89-11.75.11 1.53.34 3.16.34 4.9z"/>
  </svg>
);

const LanguageSegmentedSwitch: React.FC<{
  isEng: boolean;
  onSelect: (isEng: boolean) => void;
}> = ({ isEng, onSelect }) => (
  <div
    style={{
      height: 32,
      padding: 2,
      backgroundColor: '#F1F5F9',
      borderRadius: 20,
      border: '1px solid #E2E8F0',
      display: 'inline-flex',
      alignItems: 'center',
    }}
  >
    <button
      type="button"
      onClick={() => onSelect(false)}
      style={{
        padding: '4px 10px',
        borderRadius: 16,
        border: 'none',
        backgroundColor: !isEng ? '#FFFFFF' : 'transparent',
        boxShadow: !isEng ? '0 1px 4px rgba(0, 0, 0, 0.06)' : 'none',
        color: !isEng ? '#0F172A' : '#64748B',
        fontSize: 11,
        fontWeight: !isEng ? 800 : 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.18s ease',
      }}
    >
      IDN
    </button>
    <button
      type="button"
      onClick={() => onSelect(true)}
      style={{
        padding: '4px 10px',
        borderRadius: 16,
        border: 'none',
        backgroundColor: isEng ? '#FFFFFF' : 'transparent',
        boxShadow: isEng ? '0 1px 4px rgba(0, 0, 0, 0.06)' : 'none',
        color: isEng ? '#0F172A' : '#64748B',
        fontSize: 11,
        fontWeight: isEng ? 800 : 600,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.18s ease',
      }}
    >
      ENG
    </button>
  </div>
);

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

  // ==================== TAHAP 1: WELCOME SCREEN (SAMA PERSIS DENGAN FLUTTER & MOCKUP) ====================
  if (currentStep === 1) {
    return (
      <div
        className="fade-in"
        style={{
          width: '100%',
          minHeight: '100vh',
          backgroundImage: 'url(/images/login_bg_clean_2x.png), linear-gradient(180deg, #E2F0FE 0%, #F1F7FE 50%, #E7F3FD 100%)',
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Interactive Foreground Overlay */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100vh',
            padding: '16px 24px calc(env(safe-area-inset-bottom, 0px) + 16px) 24px',
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Top Bar: Language Dropdown Pill at Top-Right */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <button
              onClick={onToggleLang}
              type="button"
              title={isEng ? 'Switch to Indonesian' : 'Ganti ke Bahasa Indonesia'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1.2px solid rgba(188, 227, 253, 0.9)',
                borderRadius: 22,
                padding: '7px 14px',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(2, 132, 199, 0.12)',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <Globe size={18} color="#0284C7" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '0.3px',
                }}
              >
                {lang === 'ENG' ? 'EN' : 'ID'}
              </span>
              <ChevronDown size={18} color="#0284C7" />
            </button>
          </div>

          {/* Spacer pushed down */}
          <div style={{ flex: 1 }} />

          {/* Bottom Actions: Blue Pill Login Button & Version Footer (Diposisikan lebih ke bawah) */}
          <div style={{ width: '100%' }}>
            {/* Blue Pill Login Button */}
            <button
              onClick={() => setCurrentStep(2)}
              type="button"
              style={{
                width: '100%',
                height: 52,
                borderRadius: 26,
                border: 'none',
                background: 'linear-gradient(to right, #0072FF, #00C6FF)',
                boxShadow: '0 7px 18px rgba(0, 114, 255, 0.38)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1.5px)';
                e.currentTarget.style.boxShadow = '0 9px 22px rgba(0, 114, 255, 0.46)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 7px 18px rgba(0, 114, 255, 0.38)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(1px)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1.5px)';
              }}
            >
              <User size={24} color="#FFFFFF" strokeWidth={2.2} />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.3px',
                }}
              >
                Login
              </span>
              <ArrowRight size={22} color="#FFFFFF" strokeWidth={2.4} />
            </button>

            {/* Footer: Version 1.0 & © 2026 */}
            <div style={{ textAlign: 'center', marginTop: 10 }}>
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
                  fontSize: 10.5,
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
        padding: '16px 24px 24px 24px',
        boxSizing: 'border-box',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      {/* Top Header Row: Tombol Kembali (ChevronLeft) & Switch Bahasa (Segmented IDN/ENG) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button
          onClick={() => {
            setCurrentStep(1);
            setErrorMsg(null);
          }}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#0F172A',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <LanguageSegmentedSwitch
          isEng={isEng}
          onSelect={(targetEng) => {
            if ((targetEng && !isEng) || (!targetEng && isEng)) {
              onToggleLang();
            }
          }}
        />
      </div>

      {/* Centered Brand Logo */}
      <div style={{ textAlign: 'center', marginTop: 4, marginBottom: 18 }}>
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
      <div style={{ marginBottom: 28 }}>
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
      <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                padding: '15px 16px 15px 44px',
                fontSize: 14.5,
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <Mail
              size={20}
              color="#64748B"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
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
                padding: '15px 44px 15px 44px',
                fontSize: 14.5,
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <Lock
              size={20}
              color="#64748B"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
            />
            <button
              type="button"
              onClick={() => setObscurePassword(!obscurePassword)}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {obscurePassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: -6 }}>
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
                cursor: 'pointer',
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
              padding: 0,
            }}
          >
            {isEng ? 'Forgot Password?' : 'Lupa kata sandi?'}
          </button>
        </div>

        {/* Tombol Sign In */}
        <div style={{ marginTop: 6 }}>
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
              transition: 'background-color 0.15s ease',
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
      <div style={{ marginTop: 20, textAlign: 'center' }}>
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
            padding: 0,
          }}
        >
          {isEng ? 'Register now' : 'Daftar sekarang'}
        </button>
      </div>

      {/* Divider OR */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 18px 0' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
        <span
          style={{
            padding: '0 12px',
            fontSize: 11,
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '0.8px',
          }}
        >
          {isEng ? 'OR SIGN IN WITH' : 'ATAU MASUK VIA'}
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
      </div>

      {/* Tombol OAuth: Google & iOS (Apple) */}
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Google */}
        <button
          type="button"
          onClick={() => alert(isEng ? 'Google Login will be available soon.' : 'Login Google akan segera tersedia.')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '13px 0',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <GoogleLogoSvg size={18} />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: '#1E293B',
            }}
          >
            Google
          </span>
        </button>

        {/* iOS (Apple) */}
        <button
          type="button"
          onClick={() => alert(isEng ? 'Apple Login will be available soon.' : 'Login Apple akan segera tersedia.')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: '13px 0',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <AppleLogoSvg size={22} />
          <span
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: '#1E293B',
            }}
          >
            Apple (iOS)
          </span>
        </button>
      </div>
    </div>
  );
};
