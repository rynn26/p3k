export interface UserProfile {
  id: string;
  email?: string;
  full_name: string;
  employee_id?: string;
  role: 'user' | 'admin';
  company_name?: string;
  department_name?: string;
  job_role?: string;
  gender?: string;
  birth_date?: string;
  education?: string;
  join_date?: string;
  created_at?: string;
}

export interface WorkerProfileData {
  gender?: string;
  birth_date?: string;
  education?: string;
  join_date?: string;
  company_name?: string;
  department_name?: string;
}

export interface HealthRecordData {
  weight_kg: number;
  height_cm: number;
  bmi?: number;
  bmi_category?: string;
  exercise_frequency: string;
  smoking_habit: string;
  comorbidities?: string[];
  comorbidity?: string;
}

export interface RebaAssessmentRecord {
  id: string;
  user_id: string;
  assessed_at: string;
  neck_score: number;
  trunk_score: number;
  legs_score: number;
  load_score: number;
  score_a: number;
  upper_arm_score: number;
  lower_arm_score: number;
  wrist_score: number;
  coupling_score: number;
  score_b: number;
  table_c_score: number;
  activity_score: number;
  final_score: number;
  risk_level: string;
  action: string;
  created_at?: string;
}

export interface NbmAssessmentRecord {
  id: string;
  user_id: string;
  assessed_at: string;
  total_score: number;
  risk_level: string;
  action: string;
  scores: Record<number, number>;
  created_at?: string;
}

export interface CompanyItem {
  id: string;
  name: string;
  industry?: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  company_id: string;
  company_name?: string;
}
