import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { CompanyItem, DepartmentItem, UserProfile } from '../types';
import { formatSmartTitle } from '../utils/textFormatter';
import {
  ArrowLeft,
  Building2,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  LogOut,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  BarChart3,
  Contact,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Phone,
  Mail,
  Info,
  Save,
  FileText,
  User,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { exportAllDataToExcel, exportSingleCategoryToExcel } from '../utils/excelExport';

interface AdminManagementScreenProps {
  onBackToHome: () => void;
  onLogout: () => void;
  lang?: 'ID' | 'ENG';
  initialTabIndex?: number;
}

export const AdminManagementScreen: React.FC<AdminManagementScreenProps> = ({
  onBackToHome,
  onLogout,
  lang = 'ID',
  initialTabIndex = 0,
}) => {
  const isEng = lang === 'ENG';

  // Tabs: 0: Instansi, 1: Unit Kerja, 2: Pekerja, 3: Asesmen & Rumus, 4: Master K3
  const [activeTab, setActiveTab] = useState<number>(initialTabIndex);

  // Data states
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [workers, setWorkers] = useState<UserProfile[]>([]);
  const [rebaAssessments, setRebaAssessments] = useState<any[]>([]);
  const [nbmAssessments, setNbmAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search states
  const [companySearch, setCompanySearch] = useState<string>('');
  const [deptSearch, setDeptSearch] = useState<string>('');
  const [workerSearch, setWorkerSearch] = useState<string>('');
  const [filterWorkerCompany, setFilterWorkerCompany] = useState<string>('Semua');

  // Modals state
  const [showCompanyModal, setShowCompanyModal] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);

  const [showDeptModal, setShowDeptModal] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'company' | 'dept' | 'worker';
    id: string;
    name: string;
  } | null>(null);

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleExportAll = () => {
    try {
      exportAllDataToExcel({
        companies,
        departments,
        workers,
        rebaAssessments,
        nbmAssessments,
        lang,
      });
      setToastMsg(isEng ? 'Master Excel data exported successfully!' : 'Seluruh data berhasil diekspor ke Excel!');
      setShowExportModal(false);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setToastMsg(isEng ? 'Failed to export Excel data' : 'Gagal mengekspor data ke Excel');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleExportCategory = (category: 'workers' | 'reba' | 'nbm' | 'companies') => {
    try {
      exportSingleCategoryToExcel(category, {
        companies,
        departments,
        workers,
        rebaAssessments,
        nbmAssessments,
        lang,
      });
      setToastMsg(isEng ? 'Data exported to Excel successfully!' : 'Data berhasil diekspor ke Excel!');
      setShowExportModal(false);
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setToastMsg(isEng ? 'Failed to export Excel data' : 'Gagal mengekspor data ke Excel');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // Form states for Company
  const [compName, setCompName] = useState<string>('');
  const [compIndustry, setCompIndustry] = useState<string>('');
  const [compAddress, setCompAddress] = useState<string>('');
  const [compPic, setCompPic] = useState<string>('');
  const [compPhone, setCompPhone] = useState<string>('');
  const [compEmail, setCompEmail] = useState<string>('');
  const [compIsActive, setCompIsActive] = useState<boolean>(true);
  const [compFormError, setCompFormError] = useState<string | null>(null);

  // Form states for Department
  const [deptName, setDeptName] = useState<string>('');
  const [deptCompanyName, setDeptCompanyName] = useState<string>('');
  const [deptOfficer, setDeptOfficer] = useState<string>('');
  const [deptFormError, setDeptFormError] = useState<string | null>(null);

  // States for Tab 3: Asesmen & Rumus
  const [assessmentFilter, setAssessmentFilter] = useState<'Semua' | 'REBA' | 'NBM' | 'Risiko Tinggi'>('Semua');
  const [selectedAssessmentModal, setSelectedAssessmentModal] = useState<any | null>(null);

  // States for Tab 4: Master K3 / Main Company (Persis Screenshot 4 Flutter)
  const [mainCompName, setMainCompName] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_name') || 'PT. Sumber Energi Nusantara (Persero)';
  });
  const [mainCompTagline, setMainCompTagline] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_tagline') || 'Keselamatan & Kesehatan Kerja Adalah Prioritas Utama';
  });
  const [mainCompPic, setMainCompPic] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_pic') || 'Ir. Bambang Hariyanto, M.K.K.K';
  });
  const [mainCompNoIzin, setMainCompNoIzin] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_no_izin') || 'KEP-782/K3-BINW/X/2024';
  });
  const [mainCompEmail, setMainCompEmail] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_email') || 'hse@sumberenerginusantara.co.id';
  });
  const [mainCompPhone, setMainCompPhone] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_phone') || '(021) 587-9921';
  });
  const [mainCompAddress, setMainCompAddress] = useState<string>(() => {
    return localStorage.getItem('heru_main_comp_address') || 'Kawasan Industri Terpadu Blok A4, Jakarta';
  });

  const handleSaveMainCompany = () => {
    localStorage.setItem('heru_main_comp_name', mainCompName);
    localStorage.setItem('heru_main_comp_tagline', mainCompTagline);
    localStorage.setItem('heru_main_comp_pic', mainCompPic);
    localStorage.setItem('heru_main_comp_no_izin', mainCompNoIzin);
    localStorage.setItem('heru_main_comp_email', mainCompEmail);
    localStorage.setItem('heru_main_comp_phone', mainCompPhone);
    localStorage.setItem('heru_main_comp_address', mainCompAddress);
    showToast(isEng ? 'Main company profile updated successfully' : 'Profil instansi induk berhasil diperbarui');
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const loadAllAdminData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Instansi (Companies) langsung dari Supabase
      const { data: compData, error: compErr } = await supabase
        .from('companies')
        .select('*')
        .order('name', { ascending: true });

      if (compErr) {
        console.error('Error fetching companies:', compErr);
      } else if (compData) {
        setCompanies(compData);
      }

      // 2. Fetch Unit Kerja (Departments) langsung dari Supabase
      const { data: deptData, error: deptErr } = await supabase
        .from('departments')
        .select('*')
        .order('company_name', { ascending: true })
        .order('name', { ascending: true });

      if (deptErr) {
        console.error('Error fetching departments:', deptErr);
      } else if (deptData) {
        setDepartments(deptData);
      }

      // 3. Fetch Profil Pekerja (Workers) langsung dari Supabase
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profErr) {
        console.error('Error fetching profiles:', profErr);
      } else if (profData) {
        setWorkers(profData);
      }

      // 4. Fetch SEMUA data asesmen REBA dari database Supabase
      const { data: rebaData, error: rebaErr } = await supabase
        .from('reba_assessments')
        .select('*')
        .order('assessed_at', { ascending: false });

      if (rebaErr) {
        console.error('Error fetching REBA assessments:', rebaErr);
      } else if (rebaData) {
        setRebaAssessments(rebaData);
      }

      // 5. Fetch SEMUA data asesmen NBM dari database Supabase
      const { data: nbmData, error: nbmErr } = await supabase
        .from('nbm_assessments')
        .select('*')
        .order('assessed_at', { ascending: false });

      if (nbmErr) {
        console.error('Error fetching NBM assessments:', nbmErr);
      } else if (nbmData) {
        setNbmAssessments(nbmData);
      }
    } catch (e) {
      console.error('loadAllAdminData error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== COMPANY HANDLERS ====================
  const handleOpenCompanyForm = (company?: CompanyItem) => {
    if (company) {
      setEditingCompany(company);
      setCompName(company.name);
      setCompIndustry(company.industry || '');
      setCompAddress(company.address || '');
      setCompPic(company.contact_person || '');
      setCompPhone(company.phone || '');
      setCompEmail(company.email || '');
      setCompIsActive(company.is_active ?? true);
    } else {
      setEditingCompany(null);
      setCompName('');
      setCompIndustry('');
      setCompAddress('');
      setCompPic('');
      setCompPhone('');
      setCompEmail('');
      setCompIsActive(true);
    }
    setCompFormError(null);
    setShowCompanyModal(true);
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatSmartTitle(compName.trim());
    if (!formatted) {
      setCompFormError(isEng ? 'Company name is required' : 'Nama instansi wajib diisi');
      return;
    }
    if (!compIndustry.trim()) {
      setCompFormError(isEng ? 'Industry sector is required' : 'Sektor industri wajib diisi');
      return;
    }

    const duplicate = companies.some(
      (c) =>
        c.name.trim().toLowerCase() === formatted.toLowerCase() &&
        (!editingCompany || c.id !== editingCompany.id)
    );
    if (duplicate) {
      setCompFormError(
        isEng
          ? `Company "${formatted}" is already registered!`
          : `Nama instansi "${formatted}" sudah terdaftar, gunakan nama lain!`
      );
      return;
    }

    try {
      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update({
            name: formatted,
            industry: compIndustry.trim(),
            address: compAddress.trim(),
            contact_person: compPic.trim(),
            phone: compPhone.trim(),
            email: compEmail.trim(),
            is_active: compIsActive,
          })
          .eq('id', editingCompany.id);

        if (error) throw error;
        showToast(isEng ? 'Company updated successfully!' : 'Instansi berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('companies').insert({
          name: formatted,
          industry: compIndustry.trim(),
          address: compAddress.trim(),
          contact_person: compPic.trim(),
          phone: compPhone.trim(),
          email: compEmail.trim(),
          is_active: compIsActive,
        });

        if (error) throw error;
        showToast(isEng ? 'New company added successfully!' : 'Instansi baru berhasil ditambahkan!');
      }

      setShowCompanyModal(false);
      loadAllAdminData();
    } catch (err: any) {
      console.error('Save company error:', err);
      setCompFormError(err.message || 'Gagal menyimpan instansi ke database');
    }
  };

  const handleToggleCompanyStatus = async (company: CompanyItem) => {
    const newStatus = !(company.is_active ?? true);
    // Optimistic UI update
    setCompanies((prev) =>
      prev.map((c) => (c.id === company.id ? { ...c, is_active: newStatus } : c))
    );

    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: newStatus })
        .eq('id', company.id);

      if (error) throw error;
      showToast(
        newStatus
          ? `Instansi ${company.name} diaktifkan`
          : `Instansi ${company.name} dinonaktifkan`
      );
    } catch (err) {
      console.error('Toggle status error:', err);
      // Revert if failed
      loadAllAdminData();
    }
  };

  // ==================== DEPARTMENT HANDLERS ====================
  const handleOpenDeptForm = (dept?: DepartmentItem) => {
    const defaultComp =
      dept?.company_name || (companies.length > 0 ? companies[0].name : '');
    if (dept) {
      setEditingDept(dept);
      setDeptName(dept.name);
      setDeptCompanyName(dept.company_name || defaultComp);
      setDeptOfficer(dept.k3_officer || '');
    } else {
      setEditingDept(null);
      setDeptName('');
      setDeptCompanyName(defaultComp);
      setDeptOfficer('');
    }
    setDeptFormError(null);
    setShowDeptModal(true);
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatSmartTitle(deptName.trim());
    if (!formatted) {
      setDeptFormError(isEng ? 'Department name is required' : 'Nama departemen wajib diisi');
      return;
    }
    if (!deptCompanyName.trim()) {
      setDeptFormError(isEng ? 'Please select a parent company' : 'Pilih instansi induk');
      return;
    }

    const matchedComp = companies.find((c) => c.name === deptCompanyName);
    const companyId = matchedComp ? matchedComp.id : null;

    try {
      if (editingDept) {
        const { error } = await supabase
          .from('departments')
          .update({
            name: formatted,
            company_id: companyId,
            company_name: deptCompanyName.trim(),
            k3_officer: deptOfficer.trim(),
          })
          .eq('id', editingDept.id);

        if (error) throw error;
        showToast(isEng ? 'Department updated successfully!' : 'Departemen berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('departments').insert({
          name: formatted,
          company_id: companyId,
          company_name: deptCompanyName.trim(),
          k3_officer: deptOfficer.trim(),
        });

        if (error) throw error;
        showToast(isEng ? 'Department added successfully!' : 'Departemen baru berhasil ditambahkan!');
      }

      setShowDeptModal(false);
      loadAllAdminData();
    } catch (err: any) {
      console.error('Save department error:', err);
      setDeptFormError(err.message || 'Gagal menyimpan departemen ke database');
    }
  };

  // ==================== DELETE HANDLERS ====================
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'company') {
        const { error } = await supabase
          .from('companies')
          .delete()
          .eq('id', deleteTarget.id);
        if (error) throw error;
        showToast(`Instansi ${deleteTarget.name} berhasil dihapus`);
      } else if (deleteTarget.type === 'dept') {
        const { error } = await supabase
          .from('departments')
          .delete()
          .eq('id', deleteTarget.id);
        if (error) throw error;
        showToast(`Departemen ${deleteTarget.name} berhasil dihapus`);
      }
      setDeleteTarget(null);
      loadAllAdminData();
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast('Gagal menghapus data: ' + (err.message || 'Terjadi kesalahan'));
    }
  };

  // Filtered lists
  const filteredCompanies = companies.filter((c) => {
    const q = companySearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  const filteredDepts = departments.filter((d) => {
    const q = deptSearch.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      (d.company_name && d.company_name.toLowerCase().includes(q)) ||
      (d.k3_officer && d.k3_officer.toLowerCase().includes(q))
    );
  });

  const uniqueCompanyNames = Array.from(
    new Set(companies.filter((c) => c.is_active !== false).map((c) => c.name))
  );

  // Combine REBA and NBM assessments for Tab 3 (Sama Persis Flutter)
  const combinedAssessments = React.useMemo(() => {
    const list: Array<{
      id: string;
      type: 'REBA' | 'NBM';
      score: number;
      riskLevel: string;
      action: string;
      workerName: string;
      companyName: string;
      deptName: string;
      date: Date;
      raw: any;
    }> = [];

    // Lookup map untuk pencarian profil pekerja secepat O(1)
    const workerMap = new Map<string, UserProfile>();
    workers.forEach((w) => {
      if (w.id) workerMap.set(w.id, w);
    });

    // 1. Map data REBA dari database Supabase
    rebaAssessments.forEach((r) => {
      const matched = workerMap.get(r.user_id);
      const workerName = (r.profiles?.full_name || matched?.full_name || '').trim();
      const compName = (r.profiles?.company_name || matched?.company_name || '').trim();
      const deptName = (r.profiles?.department_name || matched?.department_name || '').trim();

      list.push({
        id: r.id,
        type: 'REBA',
        score: r.final_score ?? 0,
        riskLevel: r.risk_level || 'Sedang',
        action: r.action || 'Investigasi menyeluruh stasiun kerja dan postur',
        workerName: workerName.length > 0 ? workerName : 'Pekerja K3',
        companyName: compName.length > 0 ? compName : '-',
        deptName: deptName.length > 0 ? deptName : '-',
        date: r.assessed_at ? new Date(r.assessed_at) : new Date(),
        raw: r,
      });
    });

    // 2. Map data NBM dari database Supabase
    nbmAssessments.forEach((n) => {
      const matched = workerMap.get(n.user_id);
      const workerName = (n.profiles?.full_name || matched?.full_name || '').trim();
      const compName = (n.profiles?.company_name || matched?.company_name || '').trim();
      const deptName = (n.profiles?.department_name || matched?.department_name || '').trim();

      list.push({
        id: n.id,
        type: 'NBM',
        score: n.total_score ?? 0,
        riskLevel: n.risk_level || 'Sedang',
        action: n.action || 'Pertahankan postur kerja ergonomis dan lakukan peregangan rutin.',
        workerName: workerName.length > 0 ? workerName : 'Pekerja K3',
        companyName: compName.length > 0 ? compName : '-',
        deptName: deptName.length > 0 ? deptName : '-',
        date: n.assessed_at ? new Date(n.assessed_at) : new Date(),
        raw: n,
      });
    });

    // Urutkan tanggal terbaru (sama persis dengan Flutter)
    list.sort((a, b) => b.date.getTime() - a.date.getTime());
    return list;
  }, [rebaAssessments, nbmAssessments, workers]);

  // Statistik 100% dinamis dari database Supabase (REBA >= 8 atau NBM >= 71)
  const totalRebaCount = rebaAssessments.length;
  const totalNbmCount = nbmAssessments.length;
  const totalHighRiskCount = combinedAssessments.filter((a) =>
    a.type === 'REBA' ? a.score >= 8 : a.score >= 71
  ).length;

  const filteredAssessments = combinedAssessments.filter((item) => {
    if (assessmentFilter === 'REBA') return item.type === 'REBA';
    if (assessmentFilter === 'NBM') return item.type === 'NBM';
    if (assessmentFilter === 'Risiko Tinggi') {
      return item.type === 'REBA' ? item.score >= 8 : item.score >= 71;
    }
    return true;
  });

  return (
    <div
      className="fade-in"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Toast Alert */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: 12,
            fontSize: 12.5,
            fontWeight: 700,
            zIndex: 1000,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} color="#10B981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ==================== 1. APP BAR ==================== */}
      <header
        style={{
          width: '100%',
          height: 64,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Back to Worker View Button */}
          <button
            onClick={onBackToHome}
            type="button"
            title="Kembali ke Beranda"
            style={{
              width: 38,
              height: 38,
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
            <ArrowLeft size={18} />
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 16.5,
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: -0.3,
                }}
              >
                Panel Administrator
              </span>
              <span
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: 8.5,
                  fontWeight: 800,
                  padding: '2px 5px',
                  borderRadius: 5,
                  letterSpacing: 0.5,
                }}
              >
                K3
              </span>
            </div>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 500,
                color: '#64748B',
                margin: '1px 0 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 220,
              }}
            >
              Kelola instansi, unit kerja &amp; master profil
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Export Excel Button */}
          <button
            onClick={() => setShowExportModal(true)}
            type="button"
            title={isEng ? 'Export Data to Excel' : 'Export Data ke Excel'}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 10,
              backgroundColor: '#107C41',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(16, 124, 65, 0.28)',
              transition: 'all 0.15s ease',
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Export Excel</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            type="button"
            title="Panduan Administrator"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <HelpCircle size={18} />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            type="button"
            title="Keluar (Logout)"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#DC2626',
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          paddingBottom: 40,
        }}
      >
        {/* ==================== 2. KPI STATS BANNER ==================== */}
        <div style={{ padding: '14px 16px 10px 16px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              padding: '14px',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
            }}
          >
            {/* Banner Top Row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                  }}
                />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: 0.8,
                    color: '#64748B',
                  }}
                >
                  RINGKASAN DATA MASTER
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  loadAllAdminData();
                  showToast('Menyinkronkan data langsung dari Supabase...');
                }}
                disabled={isLoading}
                title="Sinkronkan data dari database Supabase"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                  fontSize: 9.5,
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <RefreshCw
                  size={10}
                  style={{
                    animation: isLoading ? 'spin 1s linear infinite' : 'none',
                  }}
                />
                <span>{isLoading ? 'Menyinkron...' : 'Tersinkron'}</span>
              </button>
            </div>

            {/* 3 Metric Columns */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Instansi */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 7,
                    backgroundColor: '#EFF6FF',
                    borderRadius: 9,
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                    {companies.length}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#64748B', marginTop: 2 }}>
                    Instansi
                  </div>
                </div>
              </div>

              <div style={{ height: 32, width: 1, backgroundColor: '#E2E8F0' }} />

              {/* Unit Kerja */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 7,
                    backgroundColor: '#F0FDF4',
                    borderRadius: 9,
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Users size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                    {departments.length}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#64748B', marginTop: 2 }}>
                    Unit Kerja
                  </div>
                </div>
              </div>

              <div style={{ height: 32, width: 1, backgroundColor: '#E2E8F0' }} />

              {/* Pekerja */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: 7,
                    backgroundColor: '#FFFBEB',
                    borderRadius: 9,
                    color: '#D97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Contact size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                    {workers.length}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#64748B', marginTop: 2 }}>
                    Pekerja
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== 3. MODERN TAB BAR ==================== */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            overflowX: 'auto',
            display: 'flex',
            padding: '0 8px',
          }}
        >
          {[
            { id: 0, label: 'Instansi', icon: Building2 },
            { id: 1, label: 'Unit Kerja', icon: Users },
            { id: 2, label: 'Pekerja', icon: Contact },
            { id: 3, label: 'Asesmen & Rumus', icon: BarChart3 },
            { id: 4, label: 'Master K3', icon: SlidersHorizontal },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  padding: '10px 14px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isSel ? '3px solid #0F172A' : '3px solid transparent',
                  color: isSel ? '#0F172A' : '#64748B',
                  fontWeight: isSel ? 800 : 600,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minWidth: 76,
                  transition: 'all 0.15s ease',
                }}
              >
                <IconComp size={18} color={isSel ? '#0F172A' : '#64748B'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== 4. TAB CONTENTS ==================== */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* ==================== TAB 0: INSTANSI ==================== */}
          {activeTab === 0 && (
            <>
              {/* Banner Info */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: 8,
                    backgroundColor: '#F1F5F9',
                    borderRadius: 10,
                    color: '#0F172A',
                  }}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                    Pengaturan Instansi Profil
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginTop: 2, lineHeight: 1.35 }}>
                    Setiap instansi yang ditambahkan di sini akan langsung muncul di formulir Profil Pekerja.
                  </div>
                </div>
              </div>

              {/* Search Bar & Add Button */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Search size={16} color="#94A3B8" />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Cari instansi atau sektor..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: 12.5,
                      fontWeight: 600,
                      width: '100%',
                      backgroundColor: 'transparent',
                    }}
                  />
                  {companySearch && (
                    <button
                      onClick={() => setCompanySearch('')}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} color="#94A3B8" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleOpenCompanyForm()}
                  type="button"
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 14px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Plus size={16} />
                  <span>Tambah</span>
                </button>
              </div>

              {/* Company Cards List */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B', fontSize: 13 }}>
                  Memuat data instansi...
                </div>
              ) : filteredCompanies.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px dashed #CBD5E1',
                    padding: '36px 20px',
                    textAlign: 'center',
                  }}
                >
                  <Building2 size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    Tidak Ada Instansi Ditemukan
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>
                    Tambahkan instansi baru menggunakan tombol "Tambah" di atas.
                  </div>
                </div>
              ) : (
                filteredCompanies.map((company) => {
                  const isActive = company.is_active ?? true;
                  return (
                    <div
                      key={company.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        border: isActive ? '1.2px solid #E2E8F0' : '1.2px solid #F1F5F9',
                        padding: 14,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {/* Initials Avatar */}
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              backgroundColor: isActive ? '#F1F5F9' : '#F8FAFC',
                              border: isActive ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              fontWeight: 800,
                              color: isActive ? '#0F172A' : '#94A3B8',
                            }}
                          >
                            {company.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: 14.5,
                                fontWeight: 800,
                                color: isActive ? '#0F172A' : '#94A3B8',
                              }}
                            >
                              {company.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                              {company.industry && (
                                <span
                                  style={{
                                    backgroundColor: '#F1F5F9',
                                    color: '#475569',
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    padding: '2px 7px',
                                    borderRadius: 6,
                                  }}
                                >
                                  {company.industry}
                                </span>
                              )}
                              <span
                                style={{
                                  backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2',
                                  color: isActive ? '#16A34A' : '#DC2626',
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: 6,
                                }}
                              >
                                {isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Switch */}
                        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => handleToggleCompanyStatus(company)}
                            style={{ display: 'none' }}
                          />
                          <div
                            style={{
                              width: 38,
                              height: 22,
                              backgroundColor: isActive ? '#0F172A' : '#CBD5E1',
                              borderRadius: 12,
                              position: 'relative',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                backgroundColor: '#FFFFFF',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: 2,
                                left: isActive ? 18 : 2,
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              }}
                            />
                          </div>
                        </label>
                      </div>

                      {/* Extra Info: Address / PIC */}
                      {(company.address || company.contact_person) && (
                        <div
                          style={{
                            borderTop: '1px solid #F1F5F9',
                            paddingTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                          }}
                        >
                          {company.address && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B' }}>
                              <MapPin size={13} color="#94A3B8" />
                              <span>{company.address}</span>
                            </div>
                          )}
                          {company.contact_person && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748B' }}>
                              <UserCheck size={13} color="#94A3B8" />
                              <span>
                                PIC K3: {company.contact_person}{' '}
                                {company.phone ? `(${company.phone})` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Action Row */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: 12,
                          borderTop: '1px solid #F8FAFC',
                          paddingTop: 4,
                        }}
                      >
                        <button
                          onClick={() => handleOpenCompanyForm(company)}
                          type="button"
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#0F172A',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                            padding: '4px 6px',
                          }}
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'company',
                              id: company.id,
                              name: company.name,
                            })
                          }
                          type="button"
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            cursor: 'pointer',
                            padding: '4px 6px',
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* ==================== TAB 1: UNIT KERJA / DEPARTEMEN ==================== */}
          {activeTab === 1 && (
            <>
              {/* Banner Info */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: 8,
                    backgroundColor: '#F1F5F9',
                    borderRadius: 10,
                    color: '#0F172A',
                  }}
                >
                  <Users size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                    Master Unit &amp; Departemen
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginTop: 2, lineHeight: 1.35 }}>
                    Daftar departemen ini akan tersinkronisasi langsung pada pilihan dropdown Unit Kerja di Profil Pekerja.
                  </div>
                </div>
              </div>

              {/* Search Bar & Add Button */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: 12,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Search size={16} color="#94A3B8" />
                  <input
                    type="text"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    placeholder="Cari departemen atau instansi..."
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: 12.5,
                      fontWeight: 600,
                      width: '100%',
                      backgroundColor: 'transparent',
                    }}
                  />
                  {deptSearch && (
                    <button
                      onClick={() => setDeptSearch('')}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={14} color="#94A3B8" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleOpenDeptForm()}
                  type="button"
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 14px',
                    fontSize: 12.5,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Plus size={16} />
                  <span>Tambah</span>
                </button>
              </div>

              {/* Departments Cards List */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B', fontSize: 13 }}>
                  Memuat data departemen...
                </div>
              ) : filteredDepts.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px dashed #CBD5E1',
                    padding: '36px 20px',
                    textAlign: 'center',
                  }}
                >
                  <Layers size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    Tidak Ada Departemen
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>
                    Gunakan tombol "Tambah" untuk menambahkan unit atau departemen baru.
                  </div>
                </div>
              ) : (
                filteredDepts.map((dept) => (
                  <div
                    key={dept.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 16,
                      border: '1.2px solid #E2E8F0',
                      padding: 14,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0F172A',
                          }}
                        >
                          <Layers size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                            {dept.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <Building2 size={13} color="#64748B" />
                            <span style={{ fontSize: 11.5, fontWeight: 600, color: '#475569' }}>
                              {dept.company_name || 'Instansi Terdaftar'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => handleOpenDeptForm(dept)}
                          type="button"
                          title="Edit Departemen"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#1E293B',
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: 'dept',
                              id: dept.id,
                              name: dept.name,
                            })
                          }
                          type="button"
                          title="Hapus Departemen"
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#EF4444',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {dept.k3_officer && (
                      <div
                        style={{
                          backgroundColor: '#F0F9FF',
                          borderRadius: 8,
                          border: '1px solid #BAE6FD',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <CheckCircle2 size={14} color="#0284C7" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0369A1' }}>
                          PIC K3: {dept.k3_officer}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}

          {/* ==================== TAB 2: PEKERJA (TAHAP 2 STEP PREVIEW) ==================== */}
          {activeTab === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div style={{ padding: 8, backgroundColor: '#EFF6FF', borderRadius: 10, color: '#2563EB' }}>
                  <Contact size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                    Direktori Pekerja Terdaftar ({workers.length} Pekerja)
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginTop: 2, lineHeight: 1.35 }}>
                    Data pekerja yang terhubung dengan akun Supabase dan formulir identitas K3.
                  </div>
                </div>
              </div>

              {/* Search workers */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 12,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <input
                  type="text"
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  placeholder="Cari nama pekerja, divisi, atau instansi..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: 12.5,
                    fontWeight: 600,
                    width: '100%',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>

              {/* Workers list */}
              {workers
                .filter((w) => {
                  const q = workerSearch.toLowerCase();
                  return (
                    (w.full_name && w.full_name.toLowerCase().includes(q)) ||
                    (w.company_name && w.company_name.toLowerCase().includes(q)) ||
                    (w.department_name && w.department_name.toLowerCase().includes(q))
                  );
                })
                .map((worker) => (
                  <div
                    key={worker.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 16,
                      border: '1.2px solid #E2E8F0',
                      padding: 14,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            backgroundColor: worker.gender === 'Perempuan' ? '#FCE7F3' : '#DBEAFE',
                            color: worker.gender === 'Perempuan' ? '#DB2777' : '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 14,
                          }}
                        >
                          {worker.full_name ? worker.full_name.charAt(0).toUpperCase() : 'W'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                              {worker.full_name || 'Pengguna Baru'}
                            </span>
                            <CheckCircle2 size={14} color="#10B981" />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 500, color: '#64748B' }}>
                            {worker.job_role || (worker.role === 'admin' ? 'HSE Administrator' : 'Operator')}
                          </span>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 6,
                          backgroundColor: worker.role === 'admin' ? '#0F172A' : '#EFF6FF',
                          color: worker.role === 'admin' ? '#FFFFFF' : '#2563EB',
                        }}
                      >
                        {worker.role === 'admin' ? 'ADMIN' : 'PEKERJA'}
                      </span>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: 10,
                        border: '1px solid #E2E8F0',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 600 }}>Instansi</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>
                          {worker.company_name || '-'}
                        </div>
                      </div>
                      <div style={{ width: 1, height: 24, backgroundColor: '#E2E8F0' }} />
                      <div>
                        <div style={{ fontSize: 9.5, color: '#94A3B8', fontWeight: 600 }}>Unit Kerja</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>
                          {worker.department_name || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ==================== TAB 3: ASESMEN & RUMUS (SAMA PERSIS SCREENSHOT 3) ==================== */}
          {activeTab === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Header Info Card */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: 8,
                    backgroundColor: '#F1F5F9',
                    borderRadius: 12,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                    Hasil Asesmen &amp; Rumus Ergonomi
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#64748B', marginTop: 3, lineHeight: 1.4 }}>
                    Pantau seluruh hasil penilaian REBA dan NBM yang diisi para pekerja. Ketuk kartu asesmen untuk melihat rincian rumus perhitungan dan tindakan K3.
                  </div>
                </div>
              </div>

              {/* 3 KPI Stats Row (Sama Persis Flutter) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#E0F2FE',
                    borderRadius: 12,
                    padding: '10px 6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#0284C7' }}>
                    {totalRebaCount}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#0369A1', marginTop: 2 }}>
                    Total REBA
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#F3E8FF',
                    borderRadius: 12,
                    padding: '10px 6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#7C3AED' }}>
                    {totalNbmCount}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6D28D9', marginTop: 2 }}>
                    Total NBM
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#FEE2E2',
                    borderRadius: 12,
                    padding: '10px 6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#DC2626' }}>
                    {totalHighRiskCount}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#B91C1C', marginTop: 2 }}>
                    Risiko Tinggi
                  </div>
                </div>
              </div>

              {/* Filter Chips (Semua, REBA, NBM, Risiko Tinggi) */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
                {(['Semua', 'REBA', 'NBM', 'Risiko Tinggi'] as const).map((filter) => {
                  const isSel = assessmentFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setAssessmentFilter(filter)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        backgroundColor: isSel ? '#0F172A' : '#FFFFFF',
                        color: isSel ? '#FFFFFF' : '#475569',
                        border: isSel ? '1px solid #0F172A' : '1px solid #CBD5E1',
                        fontSize: 11.5,
                        fontWeight: isSel ? 800 : 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              {/* Assessment Cards List */}
              {filteredAssessments.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 16,
                    border: '1px dashed #CBD5E1',
                    padding: '36px 20px',
                    textAlign: 'center',
                    color: '#64748B',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                    Belum Ada Data Asesmen
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 4 }}>
                    Belum ada data pengisian REBA atau NBM pekerja yang tersimpan.
                  </div>
                </div>
              ) : (
                filteredAssessments.map((item) => {
                  const isReba = item.type === 'REBA';
                  const isHigh = item.riskLevel.toLowerCase().includes('tinggi');
                  const scoreColor = isHigh ? '#EA580C' : isReba ? '#0284C7' : '#7C3AED';
                  const scoreBg = isHigh ? '#FFF7ED' : isReba ? '#F0F9FF' : '#FAF5FF';
                  const scoreBorder = isHigh ? '#FDBA74' : isReba ? '#BAE6FD' : '#E9D5FF';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAssessmentModal(item)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 16,
                        border: '1.2px solid #E2E8F0',
                        padding: 14,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        {/* Squircle Badge (Sama Persis Flutter) */}
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: scoreBg,
                            border: `1.5px solid ${scoreBorder}`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: 16, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                            {item.score}
                          </span>
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: scoreColor, marginTop: 1 }}>
                            {item.type}
                          </span>
                        </div>

                        {/* Middle Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                              <div
                                style={{
                                  padding: 2.5,
                                  borderRadius: 4,
                                  backgroundColor: isReba ? '#E0F2FE' : '#F3E8FF',
                                  color: isReba ? '#0284C7' : '#7C3AED',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <User size={12} />
                              </div>
                              <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                                {item.workerName}
                              </span>
                            </div>
                            <span style={{ fontSize: 10, color: '#94A3B8' }}>
                              {item.date.toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: 10.5,
                              color: '#64748B',
                              fontWeight: 500,
                              marginTop: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.companyName} • {item.deptName}
                          </div>

                          <div style={{ marginTop: 4 }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 7px',
                                borderRadius: 6,
                                backgroundColor: isHigh ? '#FFEDD5' : '#E0F2FE',
                                color: isHigh ? '#C2410C' : '#0284C7',
                                fontSize: 10.5,
                                fontWeight: 800,
                              }}
                            >
                              {item.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: 8,
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10.5,
                            color: '#475569',
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {item.action}
                        </span>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: isReba ? '#0284C7' : '#7C3AED',
                            fontWeight: 700,
                            fontSize: 10.5,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <span>{isReba ? 'Lihat Rumus' : 'Lihat Hasil'}</span>
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ==================== TAB 4: MASTER K3 SETTINGS (SAMA PERSIS SCREENSHOT 4) ==================== */}
          {activeTab === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Header Banner */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: 8,
                    backgroundColor: '#F1F5F9',
                    borderRadius: 12,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SlidersHorizontal size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                    Pengaturan Profil Instansi Induk
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#64748B', marginTop: 3, lineHeight: 1.4 }}>
                    Konfigurasi instansi induk yang memegang lisensi sistem HERU K3 serta master data pilihan profil.
                  </div>
                </div>
              </div>

              {/* Main Company Profile Card (Identitas Instansi Induk) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  border: '1.2px solid #E2E8F0',
                  padding: 16,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A' }}>
                  Identitas Instansi Induk (Main Company)
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    Nama Perusahaan Induk
                  </label>
                  <input
                    type="text"
                    value={mainCompName}
                    onChange={(e) => setMainCompName(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '10px 12px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: '#0F172A',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    Slogan / Kebijakan K3
                  </label>
                  <input
                    type="text"
                    value={mainCompTagline}
                    onChange={(e) => setMainCompTagline(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '10px 12px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: '#0F172A',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                      Ketua / PIC K3
                    </label>
                    <input
                      type="text"
                      value={mainCompPic}
                      onChange={(e) => setMainCompPic(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                      No. Lisensi K3
                    </label>
                    <input
                      type="text"
                      value={mainCompNoIzin}
                      onChange={(e) => setMainCompNoIzin(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                      Email K3
                    </label>
                    <input
                      type="email"
                      value={mainCompEmail}
                      onChange={(e) => setMainCompEmail(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                      Telepon Darurat
                    </label>
                    <input
                      type="text"
                      value={mainCompPhone}
                      onChange={(e) => setMainCompPhone(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        padding: '10px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#0F172A',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#334155', marginBottom: 5 }}>
                    Alamat Kantor Pusat
                  </label>
                  <textarea
                    rows={2}
                    value={mainCompAddress}
                    onChange={(e) => setMainCompAddress(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '10px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#0F172A',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveMainCompany}
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 12,
                    padding: '13px',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    marginTop: 6,
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
                  }}
                >
                  <Save size={16} />
                  <span>Simpan Profil Instansi Induk</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== 5. MODAL: ADD/EDIT COMPANY ==================== */}
      {showCompanyModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCompanyModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: 520,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '16px 20px 24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            {/* Modal Handle */}
            <div
              style={{
                width: 40,
                height: 4,
                backgroundColor: '#CBD5E1',
                borderRadius: 2,
                margin: '0 auto 16px',
              }}
            />

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: -0.3 }}>
                  {editingCompany ? 'Edit Data Instansi' : 'Tambah Instansi Baru'}
                </h3>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '2px 0 0 0' }}>
                  Kelola identitas instansi mitra &amp; kontak PIC K3
                </p>
              </div>
              <button
                onClick={() => setShowCompanyModal(false)}
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '14px 0' }} />

            {/* Error Message */}
            {compFormError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>{compFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Nama Instansi / Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  onBlur={() => setCompName(formatSmartTitle(compName))}
                  placeholder="Contoh: PT. Adhi Reksa Persada"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Sektor Industri *
                </label>
                <input
                  type="text"
                  required
                  value={compIndustry}
                  onChange={(e) => setCompIndustry(e.target.value)}
                  placeholder="Contoh: Manufaktur / Logistik / Migas"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Alamat Kantor / Pabrik
                </label>
                <input
                  type="text"
                  value={compAddress}
                  onChange={(e) => setCompAddress(e.target.value)}
                  placeholder="Alamat lengkap instansi operasional"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Nama PIC K3
                  </label>
                  <input
                    type="text"
                    value={compPic}
                    onChange={(e) => setCompPic(e.target.value)}
                    placeholder="Nama koordinator"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 10,
                      border: '1.2px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: 13,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    No. Kontak / WA
                  </label>
                  <input
                    type="text"
                    value={compPhone}
                    onChange={(e) => setCompPhone(e.target.value)}
                    placeholder="0812-xxxx"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: 10,
                      border: '1.2px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: 13,
                      fontWeight: 600,
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Email Instansi / K3
                </label>
                <input
                  type="email"
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  placeholder="k3@perusahaan.com"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Status Switch Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 4,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                    Status Aktif di Profil
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B' }}>
                    Tampilkan instansi ini di formulir profil pekerja
                  </div>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={compIsActive}
                    onChange={(e) => setCompIsActive(e.target.checked)}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      width: 38,
                      height: 22,
                      backgroundColor: compIsActive ? '#0F172A' : '#CBD5E1',
                      borderRadius: 12,
                      position: 'relative',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: 2,
                        left: compIsActive ? 18 : 2,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    />
                  </div>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCompanyModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: 12,
                    backgroundColor: '#0F172A',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  }}
                >
                  {editingCompany ? 'Simpan Perubahan' : 'Tambah Instansi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 6. MODAL: ADD/EDIT DEPARTMENT ==================== */}
      {showDeptModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeptModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: 520,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '16px 20px 24px 20px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box',
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                backgroundColor: '#CBD5E1',
                borderRadius: 2,
                margin: '0 auto 16px',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: -0.3 }}>
                  {editingDept ? 'Edit Unit / Departemen' : 'Tambah Unit / Departemen'}
                </h3>
                <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', margin: '2px 0 0 0' }}>
                  Tautkan unit kerja dengan instansi induk K3
                </p>
              </div>
              <button
                onClick={() => setShowDeptModal(false)}
                type="button"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: '14px 0' }} />

            {deptFormError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: '#DC2626',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={16} />
                <span>{deptFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDepartment} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Nama Unit / Departemen *
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  onBlur={() => setDeptName(formatSmartTitle(deptName))}
                  placeholder="Misal: Divisi Fabrikasi & Workshop"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Pilih Instansi Induk *
                </label>
                <select
                  required
                  value={deptCompanyName}
                  onChange={(e) => setDeptCompanyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  {uniqueCompanyNames.map((cName) => (
                    <option key={cName} value={cName}>
                      {cName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Penanggung Jawab / PIC K3
                </label>
                <input
                  type="text"
                  value={deptOfficer}
                  onChange={(e) => setDeptOfficer(e.target.value)}
                  placeholder="Nama PIC K3 divisi ini"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1.2px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: 13,
                    fontWeight: 600,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 12,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: '#64748B',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: 12,
                    backgroundColor: '#0F172A',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  }}
                >
                  {editingDept ? 'Simpan Perubahan' : 'Tambah Departemen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== 7. MODAL: DELETE CONFIRMATION ==================== */}
      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: 400,
              borderRadius: 20,
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              Hapus Data {deleteTarget.type === 'company' ? 'Instansi' : 'Departemen'}?
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              Apakah Anda yakin ingin menghapus "{deleteTarget.name}"? Data yang dihapus tidak dapat
              dikembalikan.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 10,
                  backgroundColor: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 8. MODAL: LOGOUT CONFIRMATION ==================== */}
      {showLogoutModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: 380,
              borderRadius: 20,
              padding: '24px 20px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <LogOut size={22} />
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              Konfirmasi Keluar
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              Apakah Anda yakin ingin logout dari akun Administrator K3?
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  onLogout();
                }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: 10,
                  backgroundColor: '#DC2626',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 9. MODAL: ADMIN HELP GUIDE ==================== */}
      {showHelpModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowHelpModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: 440,
              borderRadius: 20,
              padding: '24px 20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Panduan Administrator K3
                  </h4>
                  <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0 0' }}>
                    Sistem Manajemen Ergonomi HERU
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12.5, color: '#334155' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>1. Sinkronisasi Instansi</div>
                Setiap nama perusahaan yang ditambahkan akan langsung tersedia pada pilihan pendaftaran dan profil pekerja.
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>2. Unit Kerja &amp; PIC K3</div>
                Departemen dapat ditautkan ke instansi induk beserta PIC K3 untuk koordinasi inspeksi ergonomi.
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>3. Validasi Rumus Ergonomi</div>
                Admin dapat memeriksa log penilaian postur REBA &amp; keluhan muskuloskeletal NBM setiap pekerja secara objektif.
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 12,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                marginTop: 18,
                cursor: 'pointer',
              }}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ==================== 8. MODAL: RINCIAN RUMUS ASESMEN (SESUAI FLUTTER) ==================== */}
      {selectedAssessmentModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAssessmentModal(null);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: 520,
              maxHeight: '88vh',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '16px 20px 24px 20px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
              overflowY: 'auto',
            }}
          >
            {/* Drag Pill */}
            <div
              style={{
                width: 44,
                height: 4,
                backgroundColor: '#CBD5E1',
                borderRadius: 10,
                margin: '0 auto 12px auto',
              }}
            />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>
                    Rincian Rumus {selectedAssessmentModal.type}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 4,
                      backgroundColor: selectedAssessmentModal.type === 'REBA' ? '#E0F2FE' : '#F3E8FF',
                      color: selectedAssessmentModal.type === 'REBA' ? '#0284C7' : '#7C3AED',
                    }}
                  >
                    Khusus Admin K3
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3 }}>
                  Pekerja: <strong style={{ color: '#1E293B' }}>{selectedAssessmentModal.workerName}</strong> • {selectedAssessmentModal.companyName} ({selectedAssessmentModal.deptName})
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAssessmentModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 4,
                  cursor: 'pointer',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Score & Risk Banner */}
            <div
              style={{
                backgroundColor: selectedAssessmentModal.riskLevel.toLowerCase().includes('tinggi') ? '#FFF7ED' : '#F0F9FF',
                border: `1.5px solid ${selectedAssessmentModal.riskLevel.toLowerCase().includes('tinggi') ? '#FDBA74' : '#BAE6FD'}`,
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                  Total Skor Akhir
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: selectedAssessmentModal.riskLevel.toLowerCase().includes('tinggi') ? '#EA580C' : '#0284C7',
                  }}
                >
                  {selectedAssessmentModal.score} Poin
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 8,
                    backgroundColor: selectedAssessmentModal.riskLevel.toLowerCase().includes('tinggi') ? '#EA580C' : '#0284C7',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {selectedAssessmentModal.riskLevel}
                </span>
                <div style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>
                  Tingkat Bahaya Ergonomi
                </div>
              </div>
            </div>

            {/* Formula Breakdown Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
                Logika Perhitungan Rumus:
              </div>

              {selectedAssessmentModal.type === 'REBA' ? (
                <>
                  {/* Nilai Rill Parameter REBA */}
                  {selectedAssessmentModal.raw && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
                      <div style={{ backgroundColor: '#F0F9FF', borderRadius: 10, border: '1px solid #BAE6FD', padding: '10px 12px' }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: '#0284C7', marginBottom: 4 }}>
                          GRUP A (Skor: {selectedAssessmentModal.raw.score_a ?? '-'})
                        </div>
                        <div style={{ fontSize: 10, color: '#334155', lineHeight: 1.5 }}>
                          • Leher: <strong>{selectedAssessmentModal.raw.neck_score ?? '-'}</strong><br />
                          • Punggung: <strong>{selectedAssessmentModal.raw.trunk_score ?? '-'}</strong><br />
                          • Kaki: <strong>{selectedAssessmentModal.raw.legs_score ?? '-'}</strong><br />
                          • Beban: <strong>{selectedAssessmentModal.raw.load_score ?? '-'}</strong>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#FAF5FF', borderRadius: 10, border: '1px solid #E9D5FF', padding: '10px 12px' }}>
                        <div style={{ fontSize: 10.5, fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>
                          GRUP B (Skor: {selectedAssessmentModal.raw.score_b ?? '-'})
                        </div>
                        <div style={{ fontSize: 10, color: '#334155', lineHeight: 1.5 }}>
                          • Lengan Atas: <strong>{selectedAssessmentModal.raw.upper_arm_score ?? '-'}</strong><br />
                          • Lengan Bawah: <strong>{selectedAssessmentModal.raw.lower_arm_score ?? '-'}</strong><br />
                          • Pergelangan: <strong>{selectedAssessmentModal.raw.wrist_score ?? '-'}</strong><br />
                          • Kopling: <strong>{selectedAssessmentModal.raw.coupling_score ?? '-'}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: 12, fontSize: 11.5 }}>
                    <div style={{ fontWeight: 800, color: '#0284C7', marginBottom: 4 }}>1. Grup A (Batang Tubuh &amp; Kaki)</div>
                    Skor Punggung + Leher + Kaki dimasukkan ke Tabel A, ditambah Skor Beban/Beban Angkat = <strong>Skor A ({selectedAssessmentModal.raw?.score_a ?? '-'})</strong>.
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: 12, fontSize: 11.5 }}>
                    <div style={{ fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>2. Grup B (Lengan &amp; Pergelangan)</div>
                    Skor Lengan Atas + Lengan Bawah + Pergelangan dimasukkan ke Tabel B, ditambah Skor Kopling Pegangan = <strong>Skor B ({selectedAssessmentModal.raw?.score_b ?? '-'})</strong>.
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: 12, fontSize: 11.5 }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>3. Tabel C &amp; Skor Aktivitas</div>
                    Tabel C: <strong>{selectedAssessmentModal.raw?.table_c_score ?? '-'}</strong> + Skor Aktivitas: <strong>{selectedAssessmentModal.raw?.activity_score ?? '-'}</strong> = Skor Akhir: <strong>{selectedAssessmentModal.score}</strong>.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: 12, fontSize: 11.5 }}>
                    <div style={{ fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>Survei Keluhan NBM (Nordic Body Map)</div>
                    Kuesioner 28 bagian otot skeletal tubuh pekerja dengan skala Likert 4 tingkat (0 = Normal, 1 = Agak Sakit, 2 = Sakit, 3 = Sangat Sakit). Total akumulasi skor: <strong>{selectedAssessmentModal.score}</strong>.
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: 12, fontSize: 11.5 }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Kategori Risiko NBM</div>
                    Skor total akumulasi: 0–20 (Rendah), 21–50 (Sedang), 51–80 (Tinggi), 81–112 (Sangat Tinggi).
                  </div>
                </>
              )}

              {/* Action Box */}
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  borderRadius: 10,
                  border: '1px solid #CBD5E1',
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                  Tindakan &amp; Rekomendasi K3:
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginTop: 3 }}>
                  {selectedAssessmentModal.action}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <button
              type="button"
              onClick={() => setSelectedAssessmentModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: 12,
                padding: '12px',
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}

      {/* ==================== EXPORT EXCEL MODAL ==================== */}
      {showExportModal && (
        <div
          onClick={() => setShowExportModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              maxWidth: 460,
              width: '100%',
              padding: '24px 20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}
          >
            {/* Header Modal */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: '#E8F5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#107C41',
                  }}
                >
                  <FileSpreadsheet size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {isEng ? 'Export Data to Excel (.xlsx)' : 'Export Data ke Excel (.xlsx)'}
                  </h3>
                  <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0 0' }}>
                    {isEng ? 'Select which data report you want to download' : 'Pilih format laporan spreadsheet yang ingin diunduh'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Export Option Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {/* Option 1: Master All Data */}
              <button
                type="button"
                onClick={handleExportAll}
                style={{
                  padding: '14px',
                  borderRadius: 14,
                  border: '2px solid #107C41',
                  backgroundColor: '#F0FDF4',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: '#107C41' }}>
                      {isEng ? '📊 All Data (Master Multi-Sheet)' : '📊 Semua Data (Master Multi-Sheet)'}
                    </span>
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        backgroundColor: '#107C41',
                        color: '#FFFFFF',
                        padding: '1px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {isEng ? 'RECOMMENDED' : 'LENGKAP'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.35 }}>
                    {isEng
                      ? 'Single workbook with 4 sheets: Workers, REBA, NBM, and Companies & Units'
                      : '1 file Excel berisi 4 Sheet lengkap: Pekerja, Asesmen REBA, NBM, serta Instansi & Unit'}
                  </div>
                </div>
                <ChevronRight size={18} color="#107C41" />
              </button>

              {/* Option 2: Workers Only */}
              <button
                type="button"
                onClick={() => handleExportCategory('workers')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                    {isEng ? '👷 Workers Data Only' : '👷 Data Pekerja Saja'}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B' }}>
                    {isEng
                      ? `Profiles, employee IDs, departments, age, and contact details (${workers.length} workers)`
                      : `Profil, NIK, jabatan, departemen, usia, dan data diri (${workers.length} pekerja)`}
                  </div>
                </div>
                <ChevronRight size={18} color="#64748B" />
              </button>

              {/* Option 3: REBA Only */}
              <button
                type="button"
                onClick={() => handleExportCategory('reba')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                    {isEng ? '📋 REBA Assessments Only' : '📋 Hasil Asesmen REBA Saja'}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B' }}>
                    {isEng
                      ? `Detailed posture scores, Risk Levels & Action recommendations (${rebaAssessments.length} records)`
                      : `Skor postur A/B/C, skor akhir, tingkat risiko & rekomendasi tindakan (${rebaAssessments.length} asesmen)`}
                  </div>
                </div>
                <ChevronRight size={18} color="#64748B" />
              </button>

              {/* Option 4: NBM Only */}
              <button
                type="button"
                onClick={() => handleExportCategory('nbm')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                    {isEng ? '🩺 NBM Survey Assessments Only' : '🩺 Hasil Asesmen NBM Saja'}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B' }}>
                    {isEng
                      ? `Musculoskeletal pain symptoms, total score & risk classification (${nbmAssessments.length} records)`
                      : `Survei 28 keluhan otot rangka, total skor & klasifikasi risiko (${nbmAssessments.length} asesmen)`}
                  </div>
                </div>
                <ChevronRight size={18} color="#64748B" />
              </button>

              {/* Option 5: Companies & Units */}
              <button
                type="button"
                onClick={() => handleExportCategory('companies')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>
                    {isEng ? '🏢 Companies & Departments' : '🏢 Data Instansi & Unit Kerja'}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748B' }}>
                    {isEng
                      ? `Company directory, PIC, contact information & registered units (${companies.length} companies)`
                      : `Direktori perusahaan, PIC K3, kontak & unit departemen (${companies.length} instansi)`}
                  </div>
                </div>
                <ChevronRight size={18} color="#64748B" />
              </button>
            </div>

            {/* Footer Close */}
            <button
              type="button"
              onClick={() => setShowExportModal(false)}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#475569',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isEng ? 'Cancel' : 'Batal'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
