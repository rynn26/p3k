import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { ArrowLeft, ArrowRight, Eye, EyeOff, User, Mail, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RegisterScreenProps {
  onBackToLogin: () => void;
  lang: 'ID' | 'ENG';
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBackToLogin, lang }) => {
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
    if (strength <= 25) return { label: isEng ? 'Weak (Min. 6 chars)' : 'Lemah (Min. 6 karakter)', color: '#EF4444' };
    if (strength <= 50) return { label: isEng ? 'Fair' : 'Cukup', color: '#F59E0B' };
    if (strength <= 75) return { label: isEng ? 'Strong' : 'Kuat', color: '#0284C7' };
    return { label: isEng ? 'Very Strong' : 'Sangat Kuat', color: '#10B981' };
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg(
        isEng
          ? 'Please agree to the Terms of Service & Privacy Policy.'
          : 'Harap setujui Syarat Layanan & Kebijakan Privasi.'
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

      setShowSuccessDialog(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMsg(err?.message || (isEng ? 'Failed to register.' : 'Gagal melakukan pendaftaran.'));
    } finally {
      setIsLoading(false);
    }
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
        padding: '24px 22px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <button
          onClick={onBackToLogin}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#0F172A',
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginLeft: 8 }}>
          {isEng ? 'Create Account' : 'Daftar Akun Baru'}
        </span>
      </div>

      {/* Header Info */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
          {isEng ? 'Worker Registration' : 'Registrasi Pekerja K3L'}
        </h2>
        <p style={{ fontSize: 13.5, color: '#64748B', marginTop: 4, fontWeight: 500 }}>
          {isEng
            ? 'Fill in your details to start monitoring your ergonomic health'
            : 'Lengkapi identitas Anda untuk mulai memantau ergonomi dan kesehatan'}
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 20,
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
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Full Name */}
        <div>
          <label className="input-label">{isEng ? 'Full Name' : 'Nama Lengkap Pekerja'}</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input-field"
              placeholder={isEng ? 'John Doe' : 'Budi Santoso'}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ paddingLeft: 40 }}
            />
            <User
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="input-label">{isEng ? 'Work Email' : 'Email Kerja'}</label>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              className="input-field"
              placeholder={isEng ? 'name@company.com' : 'nama@perusahaan.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: 40 }}
            />
            <Mail
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="input-label">{isEng ? 'Password' : 'Kata Sandi'}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: 40, paddingRight: 40 }}
            />
            <Lock
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: 4,
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Strength Bar */}
          {password.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div
                style={{
                  height: 4,
                  backgroundColor: '#E2E8F0',
                  borderRadius: 2,
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
              <span style={{ fontSize: 11.5, fontWeight: 700, color: getStrengthMeta().color }}>
                {getStrengthMeta().label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="input-label">{isEng ? 'Confirm Password' : 'Ulangi Kata Sandi'}</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ paddingLeft: 40, paddingRight: 40 }}
            />
            <Lock
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: 4,
              }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Agree terms */}
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            fontSize: 12.5,
            color: '#475569',
            marginTop: 4,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ accentColor: '#0D5BD7', width: 16, height: 16, marginTop: 2 }}
          />
          <span>
            {isEng
              ? 'I agree to the Terms of Service & Privacy Policy of HERU Industrial Safety.'
              : 'Saya menyetujui Ketentuan Layanan & Kebijakan Privasi Standar Keselamatan Industri HERU.'}
          </span>
        </label>

        {/* Submit */}
        <div style={{ marginTop: 12 }}>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span>{isEng ? 'Creating Account...' : 'Memproses Pendaftaran...'}</span>
            ) : (
              <>
                <span>{isEng ? 'Complete Registration' : 'Daftar Sekarang'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Back link */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 13.5, color: '#64748B' }}>
          {isEng ? 'Already have an account?' : 'Sudah memiliki akun?'}{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#0D5BD7',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {isEng ? 'Sign In' : 'Masuk di sini'}
          </button>
        </p>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            className="fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              maxWidth: 380,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#F0FDF4',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              {isEng ? 'Registration Successful!' : 'Pendaftaran Berhasil!'}
            </h3>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.45, marginBottom: 20 }}>
              {isEng
                ? 'Your account has been created. Please sign in to complete your worker profile and health record.'
                : 'Akun pekerja Anda telah berhasil dibuat. Silakan masuk untuk melengkapi profil pekerja & catatan kesehatan.'}
            </p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                onBackToLogin();
              }}
              className="btn-primary"
              type="button"
            >
              {isEng ? 'Proceed to Sign In' : 'Lanjut ke Halaman Masuk'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
