import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import {
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Calendar,
  Users,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Store,
  ShieldAlert,
} from 'lucide-react';
import { CompanyItem, DepartmentItem } from '../types';

interface WorkerProfileSetupScreenProps {
  userId: string;
  isInitialSetup?: boolean;
  onComplete: () => void;
  onBack?: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
  lang?: 'ID' | 'ENG';
}

export const WorkerProfileSetupScreen: React.FC<WorkerProfileSetupScreenProps> = ({
  userId,
  isInitialSetup = false,
  onComplete,
  onBack,
  onOpenAdmin,
  onLogout,
  lang = 'ID',
}) => {
  const isEng = lang === 'ENG';

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [education, setEducation] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const genderOptions = ['Laki-laki', 'Perempuan'];
  const educationOptions = [
    'SMA / SMK',
    'Diploma (D3)',
    'Sarjana (S1)',
    'Magister (S2)',
    'Doktor (S3)',
  ];

  useEffect(() => {
    loadInitialData();
  }, [userId]);

  const loadInitialData = async () => {
    setIsFetchingData(true);
    try {
      // Dapatkan active user ID dari props atau session Supabase
      let currentUid: string | null = userId;
      if (!currentUid) {
        const { data: authData } = await supabase.auth.getUser();
        currentUid = authData?.user?.id || null;
      }

      if (!currentUid) {
        setIsFetchingData(false);
        return;
      }

      // 1. Ambil data profil user langsung dari tabel 'profiles' di Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUid)
        .maybeSingle();

      if (profile) {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.company_name) setSelectedCompany(profile.company_name);
        if (profile.department_name) setSelectedDepartment(profile.department_name);
        if (profile.gender) setGender(profile.gender);
        if (profile.birth_date) setBirthDate(profile.birth_date);
        if (profile.education) setEducation(profile.education);
        if (profile.join_date) setJoinDate(profile.join_date);
        if (profile.role === 'admin') setIsAdmin(true);
      }

      // Fallback local storage jika baru saja mendaftar
      const savedGender = localStorage.getItem(`worker_gender_${currentUid}`);
      if (savedGender && (!profile || !profile.gender)) setGender(savedGender);
      const savedBirth = localStorage.getItem(`worker_birth_${currentUid}`);
      if (savedBirth && (!profile || !profile.birth_date)) setBirthDate(savedBirth);
      const savedEdu = localStorage.getItem(`worker_edu_${currentUid}`);
      if (savedEdu && (!profile || !profile.education)) setEducation(savedEdu);
      const savedJoin = localStorage.getItem(`worker_join_${currentUid}`);
      if (savedJoin && (!profile || !profile.join_date)) setJoinDate(savedJoin);

      // 2. Ambil master data instansi langsung dari tabel 'companies' di Supabase
      const { data: compData } = await supabase
        .from('companies')
        .select('id, name, industry')
        .eq('is_active', true)
        .order('name');

      const companyList = compData || [];
      setCompanies(companyList);

      const activeCompName = profile?.company_name || selectedCompany;
      if (activeCompName) {
        const found = companyList.find(
          (c) => c.name.toLowerCase() === activeCompName.toLowerCase()
        );
        if (found) {
          loadDepartments(found.id, found.name);
        }
      }
    } catch (err) {
      console.error('Error loading worker setup data from Supabase:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  const loadDepartments = async (companyId: string, companyName: string) => {
    try {
      // Ambil daftar departemen langsung dari tabel 'departments' di Supabase
      let query = supabase.from('departments').select('id, name, company_id, company_name');
      if (companyId) {
        query = query.or(`company_id.eq.${companyId},company_name.ilike.%${companyName}%`);
      } else {
        query = query.ilike('company_name', `%${companyName}%`);
      }
      const { data: deptData } = await query.order('name');
      setDepartments(deptData || []);
    } catch (err) {
      console.error('Error loading departments from Supabase:', err);
      setDepartments([]);
    }
  };

  const handleCompanyChange = (compName: string) => {
    setSelectedCompany(compName);
    setSelectedDepartment('');
    const found = companies.find((c) => c.name === compName);
    if (found) {
      loadDepartments(found.id, found.name);
    }
  };

  const formatIndoDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${day} ${months[monthIdx] || parts[1]} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ text: isEng ? 'Name is required.' : 'Nama pekerja wajib diisi.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      let currentUid = userId;
      if (!currentUid) {
        const { data: authData } = await supabase.auth.getUser();
        currentUid = authData?.user?.id || '';
      }

      // Validasi anti-duplikasi pekerja (sama persis dengan checkWorkerExists di Flutter)
      if (selectedCompany && selectedDepartment) {
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, company_name, department_name');

        if (allProfiles && allProfiles.length > 0) {
          const fName = fullName.trim().toLowerCase();
          const cName = selectedCompany.trim().toLowerCase();
          const dName = selectedDepartment.trim().toLowerCase();

          const isDuplicate = allProfiles.some((row: any) => {
            if (currentUid && row.id === currentUid) return false;
            const rName = (row.full_name || '').trim().toLowerCase();
            const rComp = (row.company_name || '').trim().toLowerCase();
            const rDept = (row.department_name || '').trim().toLowerCase();
            return rName === fName && rComp === cName && rDept === dName;
          });

          if (isDuplicate) {
            setMessage({
              text: isEng
                ? `Worker named "${fullName}" at company "${selectedCompany}" (${selectedDepartment}) is already registered.`
                : `Pekerja dengan nama "${fullName}" di instansi "${selectedCompany}" (${selectedDepartment}) sudah terdaftar. Tidak dapat menyimpan data yang sama.`,
              type: 'error',
            });
            setIsLoading(false);
            return;
          }
        }
      }

      // 1. Simpan pembaruan data ke tabel 'profiles' di Supabase
      const updateData: Record<string, any> = {
        full_name: fullName.trim(),
        company_name: selectedCompany.trim(),
        department_name: selectedDepartment.trim(),
        gender: gender || 'Laki-laki',
        birth_date: birthDate || null,
        education: education || 'Sarjana (S1)',
        join_date: joinDate || null,
      };

      let { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', currentUid);

      if (error && (error.message?.includes('education') || error.message?.includes('join_date'))) {
        delete updateData.education;
        delete updateData.join_date;
        const retryRes = await supabase.from('profiles').update(updateData).eq('id', currentUid);
        error = retryRes.error;
      }

      if (error) throw error;

      // 2. Update user metadata di Supabase Auth
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      // 3. Simpan ke cache lokal perangkat
      if (gender) localStorage.setItem(`worker_gender_${currentUid}`, gender);
      if (birthDate) localStorage.setItem(`worker_birth_${currentUid}`, birthDate);
      if (education) localStorage.setItem(`worker_edu_${currentUid}`, education);
      if (joinDate) localStorage.setItem(`worker_join_${currentUid}`, joinDate);
      if (selectedCompany) localStorage.setItem(`worker_company_${currentUid}`, selectedCompany);
      if (selectedDepartment) localStorage.setItem(`worker_dept_${currentUid}`, selectedDepartment);

      setMessage({
        text: isEng ? 'Profile updated successfully.' : 'Profil pekerja berhasil disimpan ke database!',
        type: 'success',
      });

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err: any) {
      console.error('Save profile error to Supabase:', err);
      setMessage({
        text: err?.message || (isEng ? 'Failed to save profile.' : 'Gagal menyimpan profil pekerja ke Supabase.'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExit = () => {
    if (onLogout) {
      onLogout();
    } else if (onBack) {
      onBack();
    }
  };

  if (isFetchingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#4F46E5', fontWeight: 700, fontSize: 14 }}>
          {isEng ? 'Loading profile...' : 'Memuat data profil...'}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      {/* Top AppBar matching Flutter */}
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={handleExit}
          type="button"
          title={isInitialSetup ? 'Keluar Akun' : 'Kembali'}
          style={{
            background: 'none',
            border: 'none',
            padding: 8,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isInitialSetup ? '#64748B' : '#0F172A',
          }}
        >
          {isInitialSetup ? <LogOut size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.2px',
            }}
          >
            {isEng ? 'Edit Worker Profile' : 'Edit Profil Pekerja'}
          </h1>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#64748B',
              margin: '2px 0 0 0',
            }}
          >
            {isEng ? 'Update worker identity data' : 'Perbarui data identitas pekerja'}
          </p>
        </div>

        {(isAdmin || onOpenAdmin) ? (
          <button
            type="button"
            onClick={onOpenAdmin}
            title={isEng ? 'OHS Admin Panel' : 'Panel Administrator'}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <ShieldAlert size={18} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
      </div>

      {/* Form Content */}
      <div style={{ padding: '18px 20px 32px 20px' }}>
        {/* Feedback Alert */}
        {message && (
          <div
            style={{
              backgroundColor: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
              border: `1px solid ${message.type === 'error' ? '#FCA5A5' : '#86EFAC'}`,
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 13,
              fontWeight: 600,
              color: message.type === 'error' ? '#DC2626' : '#16A34A',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Field: Nama * */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              {isEng ? 'Name' : 'Nama'} <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
            </div>
            <div
              style={{
                height: 48,
                borderRadius: 12,
                border: '1.2px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  backgroundColor: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    color: '#4F46E5',
                    fontWeight: 900,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  T
                </span>
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={isEng ? 'Enter full name' : 'Text'}
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  paddingLeft: 12,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Row 1: Jenis Kelamin & Tanggal Lahir */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Jenis Kelamin */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                {isEng ? 'Gender' : 'Jenis Kelamin'}{' '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </div>
              <div
                style={{
                  height: 48,
                  borderRadius: 12,
                  border: '1.2px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Users size={16} color="#2563EB" />
                </div>
                <span
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: gender ? '#1E293B' : '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {gender || (isEng ? 'Select gender...' : 'Pilih jenis kel...')}
                </span>
                <ChevronDown size={18} color="#1E293B" style={{ flexShrink: 0 }} />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">{isEng ? 'Select gender...' : 'Pilih jenis kel...'}</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                {isEng ? 'Birth Date' : 'Tanggal Lahir'}{' '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </div>
              <div
                style={{
                  height: 48,
                  borderRadius: 12,
                  border: '1.2px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: '#F3E8FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={16} color="#9333EA" />
                </div>
                <span
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: birthDate ? '#1E293B' : '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {birthDate ? formatIndoDate(birthDate) : isEng ? 'Select date' : 'Pilih tanggal'}
                </span>
                <Calendar size={17} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Pendidikan Terakhir & Tanggal Masuk */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Pendidikan Terakhir */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                {isEng ? 'Last Education' : 'Pendidikan Terakhir'}{' '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </div>
              <div
                style={{
                  height: 48,
                  borderRadius: 12,
                  border: '1.2px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <GraduationCap size={16} color="#16A34A" />
                </div>
                <span
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: education ? '#1E293B' : '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {education || (isEng ? 'Select edu...' : 'Pilih pendid...')}
                </span>
                <ChevronDown size={18} color="#1E293B" style={{ flexShrink: 0 }} />
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">{isEng ? 'Select edu...' : 'Pilih pendid...'}</option>
                  {educationOptions.map((edu) => (
                    <option key={edu} value={edu}>
                      {edu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tanggal Masuk */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                {isEng ? 'Entry Date' : 'Tanggal Masuk'}{' '}
                <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
              </div>
              <div
                style={{
                  height: 48,
                  borderRadius: 12,
                  border: '1.2px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    backgroundColor: '#E0F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={16} color="#0284C7" />
                </div>
                <span
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    color: joinDate ? '#1E293B' : '#64748B',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {joinDate ? formatIndoDate(joinDate) : isEng ? 'Select date' : 'Pilih tanggal'}
                </span>
                <Calendar size={17} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Row 3 (Full Width): Asal Instansi */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              {isEng ? 'Company / Institution' : 'Asal Instansi'}{' '}
              <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
            </div>
            <div
              style={{
                height: 48,
                borderRadius: 12,
                border: '1.2px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#FFEDD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Building2 size={16} color="#EA580C" />
              </div>
              <span
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: selectedCompany ? '#1E293B' : '#64748B',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedCompany || (isEng ? 'Select company...' : 'Pilih instansi...')}
              </span>
              <ChevronDown size={18} color="#1E293B" style={{ flexShrink: 0 }} />
              <select
                value={selectedCompany}
                onChange={(e) => handleCompanyChange(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              >
                <option value="">{isEng ? 'Select company...' : 'Pilih instansi...'}</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 (Full Width): Departemen / Unit */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
              {isEng ? 'Department / Unit' : 'Departemen / Unit'}{' '}
              <span style={{ color: '#DC2626', fontWeight: 700 }}>*</span>
            </div>
            <div
              style={{
                height: 48,
                borderRadius: 12,
                border: '1.2px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#FCE7F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Users size={16} color="#DB2777" />
              </div>
              <span
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: selectedDepartment ? '#1E293B' : '#64748B',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedDepartment ||
                  (!selectedCompany
                    ? isEng
                      ? 'Select company first'
                      : 'Pilih instansi terlebih dahulu'
                    : isEng
                    ? 'Select department / unit...'
                    : 'Pilih departemen / unit...')}
              </span>
              <ChevronDown size={18} color="#1E293B" style={{ flexShrink: 0 }} />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={!selectedCompany}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: selectedCompany ? 'pointer' : 'not-allowed',
                }}
              >
                <option value="">
                  {!selectedCompany
                    ? isEng
                      ? 'Select company first'
                      : 'Pilih instansi terlebih dahulu'
                    : isEng
                    ? 'Select department / unit...'
                    : 'Pilih departemen / unit...'}
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card: Instansi belum terdaftar? (Sama persis Flutter Screenshot 2) */}
            {(isAdmin || onOpenAdmin) && (
              <div
                onClick={() => {
                  if (onOpenAdmin) onOpenAdmin();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F1F5F9',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  marginTop: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Store size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0F172A' }}>
                      Instansi belum terdaftar?
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748B' }}>
                      Klik untuk input instansi baru di Panel Admin
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} color="#0D5BD7" />
              </div>
            )}
          </div>

          {/* Button: SIMPAN */}
          <div style={{ marginTop: 12 }}>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(to right, #2563EB, #6366F1, #8B5CF6)',
                boxShadow: '0 5px 14px rgba(79, 70, 229, 0.35)',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.15s ease',
              }}
            >
              {isLoading ? (
                <span>{isEng ? 'SAVING...' : 'MENYIMPAN...'}</span>
              ) : (
                <span>{isEng ? 'SAVE' : 'SIMPAN'}</span>
              )}
            </button>
          </div>

          {/* Card: Panel Administrator K3 (Sama persis Flutter Screenshot 2) */}
          {(isAdmin || onOpenAdmin) && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                border: '1.2px solid #E2E8F0',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: '#0F172A',
                    color: '#38BDF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>
                    Panel Administrator K3
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B', maxWidth: 190, lineHeight: 1.3 }}>
                    Kelola master instansi, departemen, dan data pekerja
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenAdmin) onOpenAdmin();
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: 10,
                  border: '1.2px solid #0284C7',
                  backgroundColor: '#FFFFFF',
                  color: '#0284C7',
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Buka Admin
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
