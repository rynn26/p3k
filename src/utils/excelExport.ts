import * as XLSX from 'xlsx';
import { CompanyItem, DepartmentItem, UserProfile } from '../types';

export interface ExportExcelParams {
  companies: CompanyItem[];
  departments: DepartmentItem[];
  workers: UserProfile[];
  rebaAssessments: any[];
  nbmAssessments: any[];
  lang?: 'ID' | 'ENG';
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return dateStr;
  }
}

function calculateAge(birthDateStr?: string | null): string {
  if (!birthDateStr) return '-';
  try {
    const birth = new Date(birthDateStr);
    if (isNaN(birth.getTime())) return '-';
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} Thn`;
  } catch {
    return '-';
  }
}

/**
 * Format data pekerja ke bentuk baris Excel
 */
export function formatWorkersForExcel(workers: UserProfile[], isEng: boolean = false) {
  return workers.map((w, idx) => ({
    [isEng ? 'No' : 'No']: idx + 1,
    [isEng ? 'Full Name' : 'Nama Lengkap']: w.full_name || '-',
    [isEng ? 'Employee ID / NIK' : 'NIK / ID Pekerja']: w.employee_id || '-',
    [isEng ? 'Company / Institution' : 'Instansi / Perusahaan']: w.company_name || '-',
    [isEng ? 'Department / Unit' : 'Departemen / Unit Kerja']: w.department_name || '-',
    [isEng ? 'Job Position' : 'Jabatan / Posisi']: w.job_role || '-',
    [isEng ? 'System Role' : 'Peran Sistem']: w.role === 'admin' ? 'Administrator' : 'Pekerja (User)',
    [isEng ? 'Gender' : 'Jenis Kelamin']: w.gender === 'male' || w.gender === 'Laki-laki' ? 'Laki-laki' : (w.gender === 'female' || w.gender === 'Perempuan' ? 'Perempuan' : (w.gender || '-')),
    [isEng ? 'Age' : 'Usia']: calculateAge(w.birth_date),
    [isEng ? 'Birth Date' : 'Tanggal Lahir']: w.birth_date ? formatDate(w.birth_date).split(' ')[0] : '-',
    [isEng ? 'Education' : 'Pendidikan']: w.education || '-',
    [isEng ? 'Join Date' : 'Masa Kerja / Tgl Masuk']: w.join_date ? formatDate(w.join_date).split(' ')[0] : '-',
    [isEng ? 'Email' : 'Email']: w.email || '-',
    [isEng ? 'Registered At' : 'Tanggal Terdaftar']: formatDate(w.created_at),
  }));
}

/**
 * Format data asesmen REBA ke bentuk baris Excel
 */
export function formatRebaForExcel(
  rebaList: any[],
  workers: UserProfile[],
  isEng: boolean = false
) {
  const workerMap: Record<string, UserProfile> = {};
  workers.forEach((w) => {
    workerMap[w.id] = w;
  });

  return rebaList.map((r, idx) => {
    const prof = r.profiles || workerMap[r.user_id] || {};
    const workerName = prof.full_name || r.user_name || r.worker_name || 'Pekerja';
    const compName = prof.company_name || r.company_name || '-';
    const deptName = prof.department_name || r.department_name || '-';

    return {
      [isEng ? 'No' : 'No']: idx + 1,
      [isEng ? 'Assessment ID' : 'ID Asesmen']: r.id || `REBA-${idx + 1}`,
      [isEng ? 'Assessment Date' : 'Tanggal Asesmen']: formatDate(r.assessed_at || r.created_at),
      [isEng ? 'Worker Name' : 'Nama Pekerja']: workerName,
      [isEng ? 'Company' : 'Perusahaan / Instansi']: compName,
      [isEng ? 'Department' : 'Departemen / Unit Kerja']: deptName,
      [isEng ? 'Final REBA Score' : 'Skor Akhir REBA']: r.final_score ?? r.score ?? '-',
      [isEng ? 'Risk Level' : 'Tingkat Risiko']: r.risk_level || '-',
      [isEng ? 'Action Recommendation' : 'Tindakan Perbaikan']: r.action || '-',
      [isEng ? 'Neck Score' : 'Skor Leher']: r.neck_score ?? '-',
      [isEng ? 'Trunk Score' : 'Skor Punggung']: r.trunk_score ?? '-',
      [isEng ? 'Legs Score' : 'Skor Kaki']: r.legs_score ?? '-',
      [isEng ? 'Load Score' : 'Skor Beban']: r.load_score ?? '-',
      [isEng ? 'Score A' : 'Skor Postur A']: r.score_a ?? '-',
      [isEng ? 'Upper Arm Score' : 'Skor Lengan Atas']: r.upper_arm_score ?? '-',
      [isEng ? 'Lower Arm Score' : 'Skor Lengan Bawah']: r.lower_arm_score ?? '-',
      [isEng ? 'Wrist Score' : 'Skor Pergelangan']: r.wrist_score ?? '-',
      [isEng ? 'Coupling Score' : 'Skor Kopling']: r.coupling_score ?? '-',
      [isEng ? 'Score B' : 'Skor Postur B']: r.score_b ?? '-',
      [isEng ? 'Table C Score' : 'Skor Tabel C']: r.table_c_score ?? '-',
      [isEng ? 'Activity Score' : 'Skor Aktivitas']: r.activity_score ?? '-',
    };
  });
}

/**
 * Format data asesmen NBM ke bentuk baris Excel
 */
export function formatNbmForExcel(
  nbmList: any[],
  workers: UserProfile[],
  isEng: boolean = false
) {
  const workerMap: Record<string, UserProfile> = {};
  workers.forEach((w) => {
    workerMap[w.id] = w;
  });

  return nbmList.map((n, idx) => {
    const prof = n.profiles || workerMap[n.user_id] || {};
    const workerName = prof.full_name || n.user_name || n.worker_name || 'Pekerja';
    const compName = prof.company_name || n.company_name || '-';
    const deptName = prof.department_name || n.department_name || '-';

    // Rincian skor bagian tubuh (jika ada)
    const scores = n.scores || {};
    const vals = Object.values(scores) as number[];
    const countTidak = vals.filter((v) => v === 1).length;
    const countAgak = vals.filter((v) => v === 2).length;
    const countSakit = vals.filter((v) => v === 3).length;
    const countSangat = vals.filter((v) => v === 4).length;

    return {
      [isEng ? 'No' : 'No']: idx + 1,
      [isEng ? 'Assessment ID' : 'ID Asesmen']: n.id || `NBM-${idx + 1}`,
      [isEng ? 'Assessment Date' : 'Tanggal Asesmen']: formatDate(n.assessed_at || n.created_at),
      [isEng ? 'Worker Name' : 'Nama Pekerja']: workerName,
      [isEng ? 'Company' : 'Perusahaan / Instansi']: compName,
      [isEng ? 'Department' : 'Departemen / Unit Kerja']: deptName,
      [isEng ? 'Total NBM Score' : 'Total Skor NBM']: n.total_score ?? '-',
      [isEng ? 'Risk Level' : 'Tingkat Risiko']: n.risk_level || '-',
      [isEng ? 'Action Recommendation' : 'Tindakan Perbaikan']: n.action || '-',
      [isEng ? 'No Pain Count' : 'Jumlah Tidak Sakit']: countTidak || '-',
      [isEng ? 'Mild Pain Count' : 'Jumlah Agak Sakit']: countAgak || '-',
      [isEng ? 'Painful Count' : 'Jumlah Sakit']: countSakit || '-',
      [isEng ? 'Severe Pain Count' : 'Jumlah Sangat Sakit']: countSangat || '-',
    };
  });
}

/**
 * Format data Instansi & Departemen ke bentuk baris Excel
 */
export function formatCompaniesForExcel(
  companies: CompanyItem[],
  departments: DepartmentItem[],
  isEng: boolean = false
) {
  return companies.map((c, idx) => {
    const matchedDepts = departments
      .filter((d) => d.company_id === c.id || d.company_name === c.name)
      .map((d) => d.name)
      .join(', ');

    return {
      [isEng ? 'No' : 'No']: idx + 1,
      [isEng ? 'Company Name' : 'Nama Instansi / Perusahaan']: c.name,
      [isEng ? 'Industry Sector' : 'Bidang Industri']: c.industry || '-',
      [isEng ? 'Address' : 'Alamat']: c.address || '-',
      [isEng ? 'Contact Person (PIC)' : 'PIC / Penanggung Jawab']: c.contact_person || '-',
      [isEng ? 'Phone' : 'No. Telepon']: c.phone || '-',
      [isEng ? 'Email' : 'Email']: c.email || '-',
      [isEng ? 'Status' : 'Status']: c.is_active ? 'Aktif' : 'Nonaktif',
      [isEng ? 'Departments' : 'Daftar Unit Kerja / Departemen']: matchedDepts || '-',
      [isEng ? 'Created Date' : 'Tanggal Ditambahkan']: formatDate(c.created_at),
    };
  });
}

/**
 * Export Semua Data ke satu file Excel multi-sheet (.xlsx)
 */
export function exportAllDataToExcel(params: ExportExcelParams) {
  const isEng = params.lang === 'ENG';
  const wb = XLSX.utils.book_new();

  // 1. Sheet Data Pekerja
  const workersData = formatWorkersForExcel(params.workers, isEng);
  const wsWorkers = XLSX.utils.json_to_sheet(workersData.length > 0 ? workersData : [{ Info: 'Tidak ada data pekerja' }]);
  XLSX.utils.book_append_sheet(wb, wsWorkers, isEng ? 'Workers Data' : 'Data Pekerja');

  // 2. Sheet Asesmen REBA
  const rebaData = formatRebaForExcel(params.rebaAssessments, params.workers, isEng);
  const wsReba = XLSX.utils.json_to_sheet(rebaData.length > 0 ? rebaData : [{ Info: 'Tidak ada data asesmen REBA' }]);
  XLSX.utils.book_append_sheet(wb, wsReba, isEng ? 'REBA Assessments' : 'Asesmen REBA');

  // 3. Sheet Asesmen NBM
  const nbmData = formatNbmForExcel(params.nbmAssessments, params.workers, isEng);
  const wsNbm = XLSX.utils.json_to_sheet(nbmData.length > 0 ? nbmData : [{ Info: 'Tidak ada data asesmen NBM' }]);
  XLSX.utils.book_append_sheet(wb, wsNbm, isEng ? 'NBM Assessments' : 'Asesmen NBM');

  // 4. Sheet Instansi & Unit Kerja
  const compData = formatCompaniesForExcel(params.companies, params.departments, isEng);
  const wsComp = XLSX.utils.json_to_sheet(compData.length > 0 ? compData : [{ Info: 'Tidak ada data instansi' }]);
  XLSX.utils.book_append_sheet(wb, wsComp, isEng ? 'Companies & Depts' : 'Instansi & Unit');

  // File naming with current timestamp
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateSuffix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
  const fileName = `HERU_K3_Master_Data_${dateSuffix}.xlsx`;

  XLSX.writeFile(wb, fileName);
}

/**
 * Export data spesifik berdasarkan jenis (workers / reba / nbm / companies)
 */
export function exportSingleCategoryToExcel(
  category: 'workers' | 'reba' | 'nbm' | 'companies',
  params: ExportExcelParams
) {
  const isEng = params.lang === 'ENG';
  const wb = XLSX.utils.book_new();
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateSuffix = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;

  let fileName = '';

  switch (category) {
    case 'workers': {
      const data = formatWorkersForExcel(params.workers, isEng);
      const ws = XLSX.utils.json_to_sheet(data.length > 0 ? data : [{ Info: 'Tidak ada data' }]);
      XLSX.utils.book_append_sheet(wb, ws, isEng ? 'Workers Data' : 'Data Pekerja');
      fileName = `HERU_Data_Pekerja_${dateSuffix}.xlsx`;
      break;
    }
    case 'reba': {
      const data = formatRebaForExcel(params.rebaAssessments, params.workers, isEng);
      const ws = XLSX.utils.json_to_sheet(data.length > 0 ? data : [{ Info: 'Tidak ada data' }]);
      XLSX.utils.book_append_sheet(wb, ws, isEng ? 'REBA Assessments' : 'Asesmen REBA');
      fileName = `HERU_Asesmen_REBA_${dateSuffix}.xlsx`;
      break;
    }
    case 'nbm': {
      const data = formatNbmForExcel(params.nbmAssessments, params.workers, isEng);
      const ws = XLSX.utils.json_to_sheet(data.length > 0 ? data : [{ Info: 'Tidak ada data' }]);
      XLSX.utils.book_append_sheet(wb, ws, isEng ? 'NBM Assessments' : 'Asesmen NBM');
      fileName = `HERU_Asesmen_NBM_${dateSuffix}.xlsx`;
      break;
    }
    case 'companies': {
      const data = formatCompaniesForExcel(params.companies, params.departments, isEng);
      const ws = XLSX.utils.json_to_sheet(data.length > 0 ? data : [{ Info: 'Tidak ada data' }]);
      XLSX.utils.book_append_sheet(wb, ws, isEng ? 'Companies & Depts' : 'Instansi & Unit');
      fileName = `HERU_Instansi_Unit_${dateSuffix}.xlsx`;
      break;
    }
  }

  XLSX.writeFile(wb, fileName);
}
