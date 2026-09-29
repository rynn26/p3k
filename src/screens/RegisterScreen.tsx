import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { ChevronLeft, Eye, EyeOff, User, Mail, Lock, RotateCcw, MailCheck, ShieldAlert } from 'lucide-react';

interface RegisterScreenProps {
  onBackToLogin: () => void;
  lang: 'ID' | 'ENG';
  onToggleLang?: () => void;
  onRegisterSuccess?: (userId: string) => void;
}

const GoogleLogoSvg: React.FC<{ size?: number }> = ({ size = 20 }) => (
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

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBackToLogin,
  lang,
  onToggleLang,
  onRegisterSuccess,
}) => {
  const isEng = lang === 'ENG';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 25;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const strength = calculatePasswordStrength(password);

  const getStrengthMeta = () => {
    if (strength === 0) return { label: '', color: '#E2E8F0' };
    if (strength <= 25) return { label: isEng ? 'Weak (Min. 6 characters)' : 'Lemah (Min. 6 karakter)', color: '#EF4444' };
    if (strength <= 50) return { label: isEng ? 'Fair' : 'Cukup', color: '#F59E0B' };
    if (strength <= 75) return { label: isEng ? 'Strong' : 'Kuat', color: '#0284C7' };
    return { label: isEng ? 'Very Strong' : 'Sangat Kuat', color: '#10B981' };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg(
        isEng
          ? 'Please agree to Terms of Service & Privacy Policy.'
          : 'Harap setujui Syarat & Ketentuan serta Kebijakan Privasi.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(isEng ? 'Passwords do not match.' : 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(isEng ? 'Password must be at least 6 characters.' : 'Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'user',
          },
        },
      });

      if (error) throw error;

      if (data?.user?.id) {
        setRegisteredUserId(data.user.id);
      }
      setShowSuccessDialog(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      let friendly = err?.message || (isEng ? 'Failed to register.' : 'Gagal melakukan pendaftaran.');
      if (friendly.includes('User already registered') || friendly.includes('already registered')) {
        friendly = isEng ? 'Email is already registered. Please sign in.' : 'Email sudah terdaftar. Silakan masuk.';
      }
      setErrorMsg(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    alert(isEng ? 'Google Sign up will be available soon.' : 'Pendaftaran dengan Google akan segera tersedia.');
  };

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
          onClick={onBackToLogin}
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
            if (onToggleLang && ((targetEng && !isEng) || (!targetEng && isEng))) {
              onToggleLang();
            }
          }}
        />
      </div>

      {/* Judul Layar (Buat Akun Baru) */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          {isEng ? 'Create New Account' : 'Buat Akun Baru'}
        </h2>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#DC2626',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <ShieldAlert size={18} color="#DC2626" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Full Name */}
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
            {isEng ? 'Full Name ' : 'Nama Lengkap '}
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={isEng ? 'e.g. John Doe, S.T.' : 'Contoh: Budi Santoso, S.T.'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
            <User
              size={20}
              color="#64748B"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

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
            Email <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder={isEng ? 'name@company.com' : 'nama@perusahaan.com'}
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
            {isEng ? 'Password ' : 'Kata Sandi '}
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={isEng ? 'At least 6 characters' : 'Minimal 6 karakter'}
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
              onClick={() => setShowPassword(!showPassword)}
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
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  height: 4,
                  backgroundColor: '#E2E8F0',
                  borderRadius: 4,
                  overflow: 'hidden',
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${strength}%`,
                    backgroundColor: getStrengthMeta().color,
                    transition: 'all 0.3s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: getStrengthMeta().color }}>
                {getStrengthMeta().label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
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
            {isEng ? 'Confirm Password ' : 'Konfirmasi Kata Sandi '}
            <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={isEng ? 'Re-enter password' : 'Ulangi kata sandi'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <RotateCcw
              size={19}
              color="#64748B"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Terms & Conditions Checkbox */}
        <div style={{ marginTop: -2 }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 12,
              color: '#475569',
              lineHeight: 1.35,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{
                accentColor: '#0F172A',
                width: 17,
                height: 17,
                borderRadius: 4,
                marginTop: 1,
                cursor: 'pointer',
              }}
            />
            <span>
              {isEng ? 'I agree to ' : 'Saya menyetujui '}
              <span style={{ color: '#0284C7', fontWeight: 700 }}>
                {isEng ? 'Terms & Conditions' : 'Syarat & Ketentuan'}
              </span>
              {isEng ? ' and ' : ' serta '}
              <span style={{ color: '#0284C7', fontWeight: 700 }}>
                {isEng ? 'Privacy Policy' : 'Kebijakan Privasi'}
              </span>
              .
            </span>
          </label>
        </div>

        {/* Register Submit Button (Dark Navy #0F172A) */}
        <div style={{ marginTop: 6 }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: 50,
              borderRadius: 14,
              border: 'none',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '0.3px',
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
              <span>{isEng ? 'Creating Account...' : 'Memproses Pendaftaran...'}</span>
            ) : (
              <span>{isEng ? 'Create Account' : 'Daftar Sekarang'}</span>
            )}
          </button>
        </div>
      </form>

      {/* OR Divider */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
        <span
          style={{
            padding: '0 14px',
            fontSize: 11,
            fontWeight: 700,
            color: '#94A3B8',
            letterSpacing: '1.0px',
          }}
        >
          {isEng ? 'OR' : 'ATAU'}
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
      </div>

      {/* Continue with Google Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        style={{
          width: '100%',
          height: 50,
          borderRadius: 14,
          border: '1.2px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow: 'none',
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
        <GoogleLogoSvg size={20} />
        <span>{isEng ? 'Sign up with Google' : 'Daftar dengan Google'}</span>
      </button>

      {/* Already have an account? Sign In */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
          {isEng ? 'Already have an account? ' : 'Sudah memiliki akun? '}
        </span>
        <button
          type="button"
          onClick={onBackToLogin}
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
          {isEng ? 'Sign In' : 'Masuk'}
        </button>
      </div>

      {/* Footer Version 1.0 */}
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.5px' }}>
          Version 1.0
        </span>
      </div>

      {/* Success Dialog Modal - SAMA PERSIS DENGAN FLUTTER */}
      {showSuccessDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 100,
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ECEEF5',
              borderRadius: 24,
              padding: '24px 22px',
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.28)',
              boxSizing: 'border-box',
            }}
          >
            {/* Header: Icon in rounded square & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MailCheck size={24} color="#0284C7" strokeWidth={2.3} />
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  letterSpacing: '-0.2px',
                }}
              >
                {isEng ? 'Email Notification' : 'Notifikasi ke Email'}
              </h3>
            </div>

            {/* Paragraph 1 */}
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.45,
                color: '#334155',
                margin: '0 0 14px 0',
                textAlign: 'left',
              }}
            >
              {isEng
                ? 'Account registered successfully! Account credentials have been forwarded:'
                : 'Pendaftaran akun berhasil! Notifikasi kredensial akun telah diteruskan:'}
            </p>

            {/* Credential Box (Pure White with Crisp Border) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
                padding: '13px 15px',
                marginBottom: 14,
                textAlign: 'left',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              }}
            >
              {/* Email Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <Mail size={16} color="#0284C7" strokeWidth={2} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0F172A',
                    wordBreak: 'break-all',
                  }}
                >
                  Email: {email}
                </span>
              </div>

              {/* Password Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Lock size={16} color="#0284C7" strokeWidth={2} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: '#64748B',
                  }}
                >
                  {isEng ? 'Password: Securely encrypted' : 'Password: Terenkripsi aman'}
                </span>
              </div>
            </div>

            {/* Paragraph 2 */}
            <p
              style={{
                fontSize: 12,
                color: '#64748B',
                lineHeight: 1.45,
                margin: '0 0 18px 0',
                textAlign: 'left',
              }}
            >
              {isEng
                ? 'Confirmation and login details have been sent to your email. Please proceed to complete your profile.'
                : 'Konfirmasi dan detail login akun telah dikirimkan ke email Anda. Silakan lanjutkan pengisian profil.'}
            </p>

            {/* Continue Button */}
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                if (registeredUserId && onRegisterSuccess) {
                  onRegisterSuccess(registeredUserId);
                } else {
                  onBackToLogin();
                }
              }}
              style={{
                width: '100%',
                height: 48,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 14,
                border: 'none',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                transition: 'background-color 0.15s ease',
              }}
              type="button"
            >
              {isEng ? 'Continue' : 'Lanjutkan'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
