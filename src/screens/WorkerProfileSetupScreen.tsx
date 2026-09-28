import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { ArrowLeft, ArrowRight, Save, Building2, Briefcase, GraduationCap, Calendar, User, ShieldCheck } from 'lucide-react';
import { CompanyItem, DepartmentItem, UserProfile } from '../types';

interface WorkerProfileSetupScreenProps {
  userId: string;
  isInitialSetup?: boolean;
  onComplete: () => void;
  onBack?: () => void;
  lang: 'ID' | 'ENG';
}

export const WorkerProfileSetupScreen: React.FC<WorkerProfileSetupScreenProps> = ({
  userId,
  isInitialSetup = false,
  onComplete,
  onBack,
  lang,
}) => {
  const isEng = lang === 'ENG';

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [birthDate, setBirthDate] = useState('');
  const [education, setEducation] = useState('Sarjana (S1)');
  const [joinDate, setJoinDate] = useState('');
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [userId]);

  const loadInitialData = async () => {
    setIsFetchingData(true);
    try {
      // 1. Fetch user profile from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.company_name) setSelectedCompany(profile.company_name);
        if (profile.department_name) setSelectedDepartment(profile.department_name);
        if (profile.gender) setGender(profile.gender);
        if (profile.birth_date) setBirthDate(profile.birth_date);
        if (profile.education) setEducation(profile.education);
        if (profile.join_date) setJoinDate(profile.join_date);
      }

      // Check local storage for extra worker fields if present and not already set from profile
      const savedGender = localStorage.getItem(`worker_gender_${userId}`);
      if (savedGender && (!profile || !profile.gender)) setGender(savedGender);
      const savedBirth = localStorage.getItem(`worker_birth_${userId}`);
      if (savedBirth && (!profile || !profile.birth_date)) setBirthDate(savedBirth);
      const savedEdu = localStorage.getItem(`worker_edu_${userId}`);
      if (savedEdu && (!profile || !profile.education)) setEducation(savedEdu);
      const savedJoin = localStorage.getItem(`worker_join_${userId}`);
      if (savedJoin && (!profile || !profile.join_date)) setJoinDate(savedJoin);

      // 2. Fetch companies from Supabase
      const { data: compData } = await supabase
        .from('companies')
        .select('id, name, industry')
        .order('name');

      if (compData && compData.length > 0) {
        setCompanies(compData);
        if (!selectedCompany && compData[0]) {
          setSelectedCompany(compData[0].name);
          loadDepartments(compData[0].id);
        }
      } else {
        const defaults = [
          { id: 'pertamina-a', name: 'Pertamina A', industry: 'Minyak & Gas' },
          { id: 'pertamina-b', name: 'Pertamina B', industry: 'Energi & Distribusi' },
        ];
        setCompanies(defaults);
        if (!selectedCompany) {
          setSelectedCompany('Pertamina A');
          setDepartments([
            { id: 'd1', name: 'Operasional Lapangan', company_id: 'pertamina-a' },
            { id: 'd2', name: 'HSE / K3L', company_id: 'pertamina-a' },
            { id: 'd3', name: 'Maintenance & Logistik', company_id: 'pertamina-a' },
          ]);
          setSelectedDepartment('Operasional Lapangan');
        }
      }
    } catch (err) {
      console.error('Error loading worker setup data:', err);
    } finally {
      setIsFetchingData(false);
    }
  };

  const loadDepartments = async (companyId: string) => {
    try {
      const { data: deptData } = await supabase
        .from('departments')
        .select('id, name, company_id')
        .eq('company_id', companyId)
        .order('name');

      if (deptData && deptData.length > 0) {
        setDepartments(deptData);
        setSelectedDepartment(deptData[0].name);
      } else {
        setDepartments([
          { id: 'dept-1', name: 'Operasional Lapangan', company_id: companyId },
          { id: 'dept-2', name: 'K3L / HSE', company_id: companyId },
          { id: 'dept-3', name: 'Gudang & Logistik', company_id: companyId },
        ]);
        setSelectedDepartment('Operasional Lapangan');
      }
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  };

  const handleCompanyChange = (compName: string) => {
    setSelectedCompany(compName);
    const found = companies.find((c) => c.name === compName);
    if (found) {
      loadDepartments(found.id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ text: isEng ? 'Full name is required.' : 'Nama lengkap harus diisi.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // 1. Update profiles table in Supabase
      const updateData: Record<string, any> = {
        full_name: fullName.trim(),
        company_name: selectedCompany,
        department_name: selectedDepartment,
        gender: gender,
        birth_date: birthDate,
        education: education,
        join_date: joinDate,
      };

      let { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      // Fallback if older table schema lacks education or join_date columns
      if (error && (error.message?.includes('education') || error.message?.includes('join_date'))) {
        delete updateData.education;
        delete updateData.join_date;
        const retryRes = await supabase.from('profiles').update(updateData).eq('id', userId);
        error = retryRes.error;
      }

      if (error) throw error;

      // 2. Save worker fields locally and in session
      localStorage.setItem(`worker_gender_${userId}`, gender);
      localStorage.setItem(`worker_birth_${userId}`, birthDate);
      localStorage.setItem(`worker_edu_${userId}`, education);
      localStorage.setItem(`worker_join_${userId}`, joinDate);
      localStorage.setItem(`worker_company_${userId}`, selectedCompany);
      localStorage.setItem(`worker_dept_${userId}`, selectedDepartment);

      setMessage({
        text: isEng ? 'Profile updated successfully.' : 'Profil pekerja berhasil disimpan.',
        type: 'success',
      });

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err: any) {
      console.error('Save profile error:', err);
      setMessage({
        text: err?.message || (isEng ? 'Failed to save profile.' : 'Gagal menyimpan profil pekerja.'),
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#0D5BD7', fontWeight: 700, fontSize: 14 }}>
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
        padding: '24px 22px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {onBack && !isInitialSetup && (
          <button
            onClick={onBack}
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
        )}
        <div style={{ flex: 1, textAlign: isInitialSetup ? 'center' : 'left', marginLeft: onBack ? 8 : 0 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
            {isInitialSetup
              ? isEng
                ? 'Step 2 of 3: Worker Profile'
                : 'Tahap 2 dari 3: Profil Pekerja'
              : isEng
              ? 'Edit Worker Profile'
              : 'Profil Pekerja'}
          </span>
        </div>
      </div>

      {/* Progress pill if initial setup */}
      {isInitialSetup && (
        <div
          style={{
            backgroundColor: '#E0F2FE',
            color: '#0284C7',
            padding: '8px 14px',
            borderRadius: 12,
            fontSize: 12.5,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <ShieldCheck size={18} />
          <span>
            {isEng
              ? 'Mandatory: Set up your company & personal worker profile.'
              : 'Wajib: Lengkapi profil instansi & identitas pekerja Anda.'}
          </span>
        </div>
      )}

      {/* Feedback Alert */}
      {message && (
        <div
          style={{
            backgroundColor: message.type === 'error' ? '#FEF2F2' : '#F0FDF4',
            border: `1px solid ${message.type === 'error' ? '#FCA5A5' : '#86EFAC'}`,
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 20,
            fontSize: 13,
            fontWeight: 600,
            color: message.type === 'error' ? '#DC2626' : '#16A34A',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Full Name */}
        <div>
          <label className="input-label">{isEng ? 'Full Name' : 'Nama Lengkap Pekerja'}</label>
          <input
            type="text"
            className="input-field"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label className="input-label">{isEng ? 'Gender' : 'Jenis Kelamin'}</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['Laki-laki', 'Perempuan'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                style={{
                  padding: '12px',
                  borderRadius: 12,
                  border: gender === g ? '2px solid #0D5BD7' : '1.5px solid #E2E8F0',
                  backgroundColor: gender === g ? '#EBF3FE' : '#FFFFFF',
                  color: gender === g ? '#0D5BD7' : '#334155',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="input-label">{isEng ? 'Birth Date' : 'Tanggal Lahir'}</label>
          <input
            type="date"
            className="input-field"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        {/* Education Level */}
        <div>
          <label className="input-label">{isEng ? 'Last Education' : 'Pendidikan Terakhir'}</label>
          <select
            className="input-field"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {['SMA / SMK', 'Diploma (D3)', 'Sarjana (S1)', 'Magister (S2)', 'Doktor (S3)'].map((edu) => (
              <option key={edu} value={edu}>
                {edu}
              </option>
            ))}
          </select>
        </div>

        {/* Company Dropdown */}
        <div>
          <label className="input-label">{isEng ? 'Company / Institution' : 'Instansi / Perusahaan'}</label>
          <select
            className="input-field"
            value={selectedCompany}
            onChange={(e) => handleCompanyChange(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {c.industry ? `(${c.industry})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Department Dropdown */}
        <div>
          <label className="input-label">{isEng ? 'Department / Work Unit' : 'Departemen / Unit Kerja'}</label>
          <select
            className="input-field"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={{ cursor: 'pointer' }}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Join Date */}
        <div>
          <label className="input-label">{isEng ? 'Work Start Date' : 'Mulai Bekerja di Perusahaan'}</label>
          <input
            type="date"
            className="input-field"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: 14 }}>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? (
              <span>{isEng ? 'Saving...' : 'Menyimpan...'}</span>
            ) : isInitialSetup ? (
              <>
                <span>{isEng ? 'Next: Health Record' : 'Lanjut: Catatan Kesehatan'}</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEng ? 'Save Changes' : 'Simpan Perubahan'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
