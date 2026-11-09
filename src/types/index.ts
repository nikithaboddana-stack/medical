export interface Patient {
  patient_id: number;
  name: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone_number: string;
  address: string;
  created_at?: string;
}

export interface Doctor {
  doctor_id: number;
  name: string;
  specialization: string;
  department: string;
  email: string;
  phone_number: string;
}

export interface MedicalRecord {
  record_id: number;
  patient_id: number;
  doctor_id: number;
  date: string; // YYYY-MM-DD
  diagnosis: string;
  treatment: string;
  created_at?: string;
}

export interface SessionUser {
  rollNumber: string;
  loginTime: string;
  sessionId: string;
  cookieExpiry: string;
}

export interface ServletLog {
  id: string;
  timestamp: string;
  servlet: string; // e.g. LoginServlet, AddPatientServlet, ViewRecordServlet
  method: 'GET' | 'POST';
  urlPattern: string;
  action: string;
  sqlQuery?: string;
  status: 200 | 302 | 400 | 401 | 500;
  details: string;
}

export type ActivePage = 
  | 'login'
  | 'home'
  | 'viewPatient'
  | 'addPatient'
  | 'updatePatient'
  | 'viewRecord'
  | 'addRecord'
  | 'updateRecord'
  | 'doctors'
  | 'database'
  | 'code';
