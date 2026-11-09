import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Doctor, MedicalRecord, SessionUser, ServletLog, ActivePage } from '../types';
import { initialPatients, initialDoctors, initialMedicalRecords } from '../data/initialData';

interface AppContextType {
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  patients: Patient[];
  doctors: Doctor[];
  records: MedicalRecord[];
  sessionUser: SessionUser | null;
  logs: ServletLog[];
  notification: { type: 'success' | 'error' | 'info'; message: string } | null;
  setNotification: (notif: { type: 'success' | 'error' | 'info'; message: string } | null) => void;
  login: (rollNumber: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addPatient: (data: Omit<Patient, 'patient_id'>) => boolean;
  updatePatient: (id: number, data: Partial<Patient>) => boolean;
  deletePatient: (id: number) => { success: boolean; error?: string };
  addRecord: (data: Omit<MedicalRecord, 'record_id'>) => boolean;
  updateRecord: (id: number, data: Partial<MedicalRecord>) => boolean;
  deleteRecord: (id: number) => boolean;
  addDoctor: (data: Omit<Doctor, 'doctor_id'>) => boolean;
  resetDatabase: () => void;
  editPatientId: number | null;
  setEditPatientId: (id: number | null) => void;
  editRecordId: number | null;
  setEditRecordId: (id: number | null) => void;
  clearLogs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('med_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('med_doctors');
    return saved ? JSON.parse(saved) : initialDoctors;
  });

  const [records, setRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem('med_records');
    return saved ? JSON.parse(saved) : initialMedicalRecords;
  });

  const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => {
    const saved = localStorage.getItem('med_session');
    return saved ? JSON.parse(saved) : {
      rollNumber: '21B91A0501',
      loginTime: new Date().toLocaleTimeString(),
      sessionId: 'JSESSIONID-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      cookieExpiry: '24 hours'
    };
  });

  const [currentPage, setCurrentPage] = useState<ActivePage>(() => {
    return sessionUser ? 'home' : 'login';
  });

  const [logs, setLogs] = useState<ServletLog[]>(() => {
    return [
      {
        id: 'log-init',
        timestamp: new Date().toLocaleTimeString(),
        servlet: 'LoginServlet',
        method: 'POST',
        urlPattern: '/LoginServlet',
        action: 'User Authentication & Session Initialization',
        sqlQuery: 'SELECT * FROM Users WHERE roll_number = ?',
        status: 200,
        details: 'Active session initialized for Roll No: 21B91A0501.'
      }
    ];
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [editPatientId, setEditPatientId] = useState<number | null>(null);
  const [editRecordId, setEditRecordId] = useState<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('med_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('med_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('med_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (sessionUser) {
      localStorage.setItem('med_session', JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem('med_session');
    }
  }, [sessionUser]);

  // Auto clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addLog = (log: Omit<ServletLog, 'id' | 'timestamp'>) => {
    const newLog: ServletLog = {
      ...log,
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const login = (rollNumber: string, password: string) => {
    const cleanRoll = rollNumber.trim().toUpperCase();
    const cleanPass = password.trim();

    // Lab requirement: Validate the credentials: username and password is your roll number
    if (cleanRoll && cleanRoll.toLowerCase() === cleanPass.toLowerCase()) {
      const user: SessionUser = {
        rollNumber: cleanRoll,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sessionId: 'JSESSIONID-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        cookieExpiry: 'Session Cookie'
      };
      setSessionUser(user);
      addLog({
        servlet: 'LoginServlet',
        method: 'POST',
        urlPattern: '/LoginServlet',
        action: 'Authentication Successful',
        sqlQuery: `-- Verified Roll No == Password: '${cleanRoll}'`,
        status: 302,
        details: `Session initialized for user ${cleanRoll}.`
      });
      setNotification({
        type: 'success',
        message: `Welcome, Staff Member ${cleanRoll}! You are now logged in.`
      });
      setCurrentPage('home');
      return { success: true };
    } else {
      addLog({
        servlet: 'LoginServlet',
        method: 'POST',
        urlPattern: '/LoginServlet',
        action: 'Authentication Failed',
        status: 401,
        details: `Credentials failed for ${rollNumber}.`
      });
      setNotification({
        type: 'error',
        message: 'Invalid login! Please make sure your password matches your Roll Number / Staff ID.'
      });
      return {
        success: false,
        error: 'Invalid credentials! Password must match your Roll Number / Staff ID.'
      };
    }
  };

  const logout = () => {
    const currentRoll = sessionUser?.rollNumber || 'Staff';
    setSessionUser(null);
    addLog({
      servlet: 'LoginServlet',
      method: 'GET',
      urlPattern: '/LoginServlet?action=logout',
      action: 'Session Invalidation',
      status: 302,
      details: `User logged out: ${currentRoll}.`
    });
    setNotification({
      type: 'info',
      message: 'You have signed out successfully.'
    });
    setCurrentPage('login');
  };

  const addPatient = (data: Omit<Patient, 'patient_id'>) => {
    const nextId = patients.length > 0 ? Math.max(...patients.map(p => p.patient_id)) + 1 : 1;
    const newPatient: Patient = {
      ...data,
      patient_id: nextId,
      created_at: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPatient, ...prev]);

    const sql = `INSERT INTO Patient (name, date_of_birth, gender, email, phone_number, address) ` +
      `VALUES ('${data.name.replace(/'/g, "''")}', '${data.date_of_birth}', '${data.gender}', '${data.email}', '${data.phone_number}', '${data.address.replace(/'/g, "''")}');`;

    addLog({
      servlet: 'AddPatientServlet',
      method: 'POST',
      urlPattern: '/AddPatientServlet',
      action: `Insert Patient Record (#${nextId})`,
      sqlQuery: sql,
      status: 302,
      details: `Created patient record #${nextId}.`
    });

    setNotification({
      type: 'success',
      message: `Patient "${data.name}" has been registered successfully (ID #${nextId}).`
    });
    return true;
  };

  const updatePatient = (id: number, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.patient_id === id ? { ...p, ...data } : p));

    const sql = `UPDATE Patient SET name = '${data.name}', date_of_birth = '${data.date_of_birth}', gender = '${data.gender}', email = '${data.email}', phone_number = '${data.phone_number}', address = '${data.address}' WHERE patient_id = ${id};`;

    addLog({
      servlet: 'UpdatePatientServlet',
      method: 'POST',
      urlPattern: '/UpdatePatientServlet',
      action: `Update Patient Record (#${id})`,
      sqlQuery: sql,
      status: 302,
      details: `Updated patient #${id}.`
    });

    setNotification({
      type: 'success',
      message: `Patient #${id} details updated successfully.`
    });
    return true;
  };

  const deletePatient = (id: number) => {
    // Foreign key check: Does MedicalRecord reference this patient?
    const linkedRecords = records.filter(r => r.patient_id === id);
    if (linkedRecords.length > 0) {
      addLog({
        servlet: 'DeletePatientServlet',
        method: 'GET',
        urlPattern: `/DeletePatientServlet?id=${id}`,
        action: `FK Constraint Violation (patient_id = ${id})`,
        sqlQuery: `DELETE FROM Patient WHERE patient_id = ${id};`,
        status: 500,
        details: `Cannot delete patient with linked medical records.`
      });
      setNotification({
        type: 'error',
        message: `Cannot delete Patient #${id}: There are ${linkedRecords.length} medical consultation record(s) linked to this patient. Please delete those records first.`
      });
      return {
        success: false,
        error: `Cannot delete patient: ${linkedRecords.length} medical record(s) are linked to this patient.`
      };
    }

    setPatients(prev => prev.filter(p => p.patient_id !== id));

    addLog({
      servlet: 'DeletePatientServlet',
      method: 'GET',
      urlPattern: `/DeletePatientServlet?id=${id}`,
      action: `Delete Patient Record (#${id})`,
      sqlQuery: `DELETE FROM Patient WHERE patient_id = ${id};`,
      status: 302,
      details: `Deleted patient #${id}.`
    });

    setNotification({
      type: 'success',
      message: `Patient #${id} deleted successfully.`
    });
    return { success: true };
  };

  const addRecord = (data: Omit<MedicalRecord, 'record_id'>) => {
    const nextId = records.length > 0 ? Math.max(...records.map(r => r.record_id)) + 1 : 1;
    const newRecord: MedicalRecord = {
      ...data,
      record_id: nextId,
      created_at: new Date().toISOString().split('T')[0]
    };
    setRecords(prev => [newRecord, ...prev]);

    const sql = `INSERT INTO MedicalRecord (patient_id, doctor_id, date, diagnosis, treatment) ` +
      `VALUES (${data.patient_id}, ${data.doctor_id}, '${data.date}', '${data.diagnosis.replace(/'/g, "''")}', '${data.treatment.replace(/'/g, "''")}');`;

    addLog({
      servlet: 'AddRecordServlet',
      method: 'POST',
      urlPattern: '/AddRecordServlet',
      action: `Insert Medical Record (#${nextId})`,
      sqlQuery: sql,
      status: 302,
      details: `Created medical record #${nextId}.`
    });

    setNotification({
      type: 'success',
      message: `New medical record #${nextId} created successfully!`
    });
    return true;
  };

  const updateRecord = (id: number, data: Partial<MedicalRecord>) => {
    setRecords(prev => prev.map(r => r.record_id === id ? { ...r, ...data } : r));

    const sql = `UPDATE MedicalRecord SET patient_id = ${data.patient_id}, doctor_id = ${data.doctor_id}, date = '${data.date}', diagnosis = '${data.diagnosis}', treatment = '${data.treatment}' WHERE record_id = ${id};`;

    addLog({
      servlet: 'UpdateRecordServlet',
      method: 'POST',
      urlPattern: '/UpdateRecordServlet',
      action: `Update Medical Record (#${id})`,
      sqlQuery: sql,
      status: 302,
      details: `Updated medical record #${id}.`
    });

    setNotification({
      type: 'success',
      message: `Medical record #${id} updated successfully.`
    });
    return true;
  };

  const deleteRecord = (id: number) => {
    setRecords(prev => prev.filter(r => r.record_id !== id));

    addLog({
      servlet: 'DeleteRecordServlet',
      method: 'GET',
      urlPattern: `/DeleteRecordServlet?id=${id}`,
      action: `Delete Medical Record (#${id})`,
      sqlQuery: `DELETE FROM MedicalRecord WHERE record_id = ${id};`,
      status: 302,
      details: `Deleted medical record #${id}.`
    });

    setNotification({
      type: 'success',
      message: `Medical record #${id} deleted successfully.`
    });
    return true;
  };

  const addDoctor = (data: Omit<Doctor, 'doctor_id'>) => {
    const nextId = doctors.length > 0 ? Math.max(...doctors.map(d => d.doctor_id)) + 1 : 101;
    const newDoc: Doctor = { ...data, doctor_id: nextId };
    setDoctors(prev => [...prev, newDoc]);
    setNotification({
      type: 'success',
      message: `Dr. ${data.name.replace('Dr. ', '')} added to staff directory.`
    });
    return true;
  };

  const resetDatabase = () => {
    setPatients(initialPatients);
    setDoctors(initialDoctors);
    setRecords(initialMedicalRecords);
    localStorage.removeItem('med_patients');
    localStorage.removeItem('med_doctors');
    localStorage.removeItem('med_records');
    addLog({
      servlet: 'SystemAdmin',
      method: 'POST',
      urlPattern: '/Admin/ResetDatabase',
      action: 'Database Truncate & Reseed',
      sqlQuery: `TRUNCATE TABLE MedicalRecord; TRUNCATE TABLE Patient; TRUNCATE TABLE Doctor;`,
      status: 200,
      details: 'Reset data.'
    });
    setNotification({
      type: 'info',
      message: 'Sample patient and medical records restored.'
    });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        patients,
        doctors,
        records,
        sessionUser,
        logs,
        notification,
        setNotification,
        login,
        logout,
        addPatient,
        updatePatient,
        deletePatient,
        addRecord,
        updateRecord,
        deleteRecord,
        addDoctor,
        resetDatabase,
        editPatientId,
        setEditPatientId,
        editRecordId,
        setEditRecordId,
        clearLogs
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
