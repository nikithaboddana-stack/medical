/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { HomeDashboard } from './components/HomeDashboard';
import { ViewPatient } from './components/PatientManagement/ViewPatient';
import { AddPatient } from './components/PatientManagement/AddPatient';
import { UpdatePatientModal } from './components/PatientManagement/UpdatePatientModal';
import { ViewRecord } from './components/MedicalRecordManagement/ViewRecord';
import { AddRecord } from './components/MedicalRecordManagement/AddRecord';
import { UpdateRecordModal } from './components/MedicalRecordManagement/UpdateRecordModal';
import { DoctorDirectory } from './components/DoctorDirectory';
import { DatabaseViewer } from './components/DatabaseViewer';
import { ServletCodeViewer } from './components/ServletCodeViewer';
import { ServletConsoleDrawer } from './components/ServletConsoleDrawer';
import { Patient, MedicalRecord } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPage, setCurrentPage, notification, setNotification, patients, records } = useApp();
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleEditRecord = (record: MedicalRecord) => {
    setEditingRecord(record);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-slide-left">
          <div
            className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                : 'bg-blue-950/90 border-blue-500/40 text-blue-200'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
            <div className="text-xs flex-1 font-medium leading-relaxed">
              {notification.message}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentPage === 'login' && <LoginView />}
        {currentPage === 'home' && <HomeDashboard />}
        {currentPage === 'viewPatient' && (
          <ViewPatient onEditPatient={handleEditPatient} />
        )}
        {currentPage === 'addPatient' && <AddPatient />}
        {currentPage === 'viewRecord' && (
          <ViewRecord onEditRecord={handleEditRecord} />
        )}
        {currentPage === 'addRecord' && <AddRecord />}
        {currentPage === 'doctors' && <DoctorDirectory />}
        {currentPage === 'database' && <DatabaseViewer />}
        {currentPage === 'code' && <ServletCodeViewer />}
      </main>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <UpdatePatientModal
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
        />
      )}

      {/* Edit Record Modal */}
      {editingRecord && (
        <UpdateRecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* Live Activity Console Drawer (optional) */}
      <ServletConsoleDrawer
        isOpen={consoleOpen}
        onClose={() => setConsoleOpen(false)}
      />

      {/* Hospital Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">MediCare Health System</span>
            <span>•</span>
            <span className="text-slate-500">Patient & Medical Records Management Portal</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Activity Logs
            </button>
            <button
              onClick={() => setCurrentPage('code')}
              className="text-blue-400 hover:text-blue-300 cursor-pointer"
            >
              Lab Source Code
            </button>
            <button
              onClick={() => setCurrentPage('database')}
              className="text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              Database Tables
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
