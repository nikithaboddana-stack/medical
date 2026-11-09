import { Patient, Doctor, MedicalRecord } from '../types';

export const initialDoctors: Doctor[] = [
  {
    doctor_id: 101,
    name: 'Dr. Sarah Mitchell',
    specialization: 'Cardiology',
    department: 'Cardiac Care',
    email: 'sarah.mitchell@hospital.org',
    phone_number: '+1 (555) 234-5678'
  },
  {
    doctor_id: 102,
    name: 'Dr. Rajesh Rao',
    specialization: 'Neurology',
    department: 'Neurosciences',
    email: 'rajesh.rao@hospital.org',
    phone_number: '+1 (555) 345-6789'
  },
  {
    doctor_id: 103,
    name: 'Dr. Elena Rostova',
    specialization: 'Pulmonology',
    department: 'Respiratory Medicine',
    email: 'elena.rostova@hospital.org',
    phone_number: '+1 (555) 456-7890'
  },
  {
    doctor_id: 104,
    name: 'Dr. Marcus Vance',
    specialization: 'Orthopedics',
    department: 'Musculoskeletal Clinic',
    email: 'marcus.vance@hospital.org',
    phone_number: '+1 (555) 567-8901'
  },
  {
    doctor_id: 105,
    name: 'Dr. Priya Sharma',
    specialization: 'General Medicine & Diabetology',
    department: 'Internal Medicine',
    email: 'priya.sharma@hospital.org',
    phone_number: '+1 (555) 678-9012'
  }
];

export const initialPatients: Patient[] = [
  {
    patient_id: 1,
    name: 'Eleanor Vance',
    date_of_birth: '1984-06-14',
    gender: 'Female',
    email: 'eleanor.vance@example.com',
    phone_number: '+1 (555) 912-4411',
    address: '742 Evergreen Terrace, Springfield, OR',
    created_at: '2026-01-10'
  },
  {
    patient_id: 2,
    name: 'Alexander Chen',
    date_of_birth: '1992-11-23',
    gender: 'Male',
    email: 'alex.chen@example.com',
    phone_number: '+1 (555) 883-2019',
    address: '1088 Pine Crest Way, Seattle, WA',
    created_at: '2026-01-15'
  },
  {
    patient_id: 3,
    name: 'Fatima Al-Mansoor',
    date_of_birth: '1976-03-08',
    gender: 'Female',
    email: 'fatima.mansoor@example.com',
    phone_number: '+1 (555) 741-8520',
    address: '450 Oakridge Blvd, Dallas, TX',
    created_at: '2026-02-01'
  },
  {
    patient_id: 4,
    name: 'Devon K. Miller',
    date_of_birth: '2001-08-30',
    gender: 'Other',
    email: 'devon.miller@example.com',
    phone_number: '+1 (555) 632-1984',
    address: '22 Elm Street, Apt 4B, Chicago, IL',
    created_at: '2026-02-12'
  },
  {
    patient_id: 5,
    name: 'Liam Gallagher',
    date_of_birth: '1968-12-05',
    gender: 'Male',
    email: 'liam.gallagher@example.com',
    phone_number: '+1 (555) 412-9980',
    address: '15 Highfield Road, Boston, MA',
    created_at: '2026-02-20'
  }
];

export const initialMedicalRecords: MedicalRecord[] = [
  {
    record_id: 1,
    patient_id: 1,
    doctor_id: 101,
    date: '2026-02-14',
    diagnosis: 'Stage 1 Essential Hypertension with mild palpitations and stress-induced tachycardia.',
    treatment: 'Prescribed Amlodipine 5mg OD, daily BP charting at 8 AM and 8 PM, reduced sodium diet, stress reduction techniques. Review in 3 weeks.',
    created_at: '2026-02-14'
  },
  {
    record_id: 2,
    patient_id: 2,
    doctor_id: 104,
    date: '2026-02-18',
    diagnosis: 'Acute lateral ankle sprain (Grade II ATFL tear) sustained during athletics.',
    treatment: 'RICE protocol (Rest, Ice, Compression, Elevation). Air-cast ankle stirrup brace for 14 days. Ibuprofen 400mg TID with meals. Physical therapy referral.',
    created_at: '2026-02-18'
  },
  {
    record_id: 3,
    patient_id: 3,
    doctor_id: 105,
    date: '2026-02-22',
    diagnosis: 'Type 2 Diabetes Mellitus with HbA1c 7.9% and mild hyperlipidemia.',
    treatment: 'Metformin 500mg BD postprandial, Atorvastatin 10mg HS. Dietary consult for diabetic meal plan. Follow-up fasting blood sugar in 4 weeks.',
    created_at: '2026-02-22'
  },
  {
    record_id: 4,
    patient_id: 4,
    doctor_id: 103,
    date: '2026-02-28',
    diagnosis: 'Moderate persistent bronchial asthma with nocturnal wheezing exacerbated by viral URI.',
    treatment: 'Fluticasone/Salmeterol 250/50 mcg 1 puff BD, Albuterol sulfate inhaler 2 puffs PRN every 4-6 hours. Peak flow meter monitoring.',
    created_at: '2026-02-28'
  },
  {
    record_id: 5,
    patient_id: 5,
    doctor_id: 102,
    date: '2026-03-02',
    diagnosis: 'Chronic migraine with aura, unilateral frontotemporal throbbing headache with photophobia.',
    treatment: 'Sumatriptan 50mg PO at onset of aura. Propranolol 40mg OD for prophylaxis. Headache trigger diary maintenance and adequate hydration.',
    created_at: '2026-03-02'
  }
];
