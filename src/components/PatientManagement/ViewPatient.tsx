import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  AlertTriangle,
  X,
  PlusCircle,
  Stethoscope
} from 'lucide-react';

interface ViewPatientProps {
  onEditPatient: (patient: Patient) => void;
}

export const ViewPatient: React.FC<ViewPatientProps> = ({ onEditPatient }) => {
  const { patients, records, doctors, deletePatient, setCurrentPage, setEditRecordId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female' | 'Other'>('All');
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [selectedPatientForRecords, setSelectedPatientForRecords] = useState<Patient | null>(null);

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone_number.includes(searchTerm) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toString().includes(searchTerm);

    const matchesGender = genderFilter === 'All' || p.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.patient_id);
      setPatientToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            Patient Directory
          </h1>
          <p className="text-slate-400 text-xs">
            Browse, search, edit, and manage all registered patient files and medical records.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('addPatient')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, phone, email, or address..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gender Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-medium">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {(['All', 'Male', 'Female', 'Other'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => setGenderFilter(gender)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                genderFilter === gender
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Tabular View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Patient ID</th>
                <th className="py-3.5 px-4 font-semibold">Full Name</th>
                <th className="py-3.5 px-4 font-semibold">Date of Birth</th>
                <th className="py-3.5 px-4 font-semibold">Gender</th>
                <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                <th className="py-3.5 px-4 font-semibold">Residential Address</th>
                <th className="py-3.5 px-4 font-semibold text-center">Medical Records</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-medium">No patient records found.</p>
                      <button
                        onClick={() => setCurrentPage('addPatient')}
                        className="text-xs text-blue-400 hover:underline cursor-pointer"
                      >
                        Register the first patient
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const patientRecords = records.filter(r => r.patient_id === patient.patient_id);
                  return (
                    <tr 
                      key={patient.patient_id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        #{patient.patient_id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-500/20">
                            {patient.name.charAt(0)}
                          </div>
                          <span>{patient.name}</span>
                        </div>
                      </td>

                      {/* DOB */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{patient.date_of_birth}</span>
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          patient.gender === 'Female'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : patient.gender === 'Male'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}>
                          {patient.gender}
                        </span>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[170px]">{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{patient.phone_number}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        <div className="flex items-center gap-1.5" title={patient.address}>
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{patient.address}</span>
                        </div>
                      </td>

                      {/* Medical Records Link */}
                      <td className="py-3.5 px-4 text-center">
                        {patientRecords.length > 0 ? (
                          <button
                            onClick={() => setSelectedPatientForRecords(patient)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold cursor-pointer"
                            title="Click to view all medical records for this patient"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{patientRecords.length} Record{patientRecords.length > 1 ? 's' : ''}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentPage('addRecord')}
                            className="text-[11px] text-slate-500 hover:text-indigo-400 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>Add Record</span>
                          </button>
                        )}
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditPatient(patient)}
                            className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Edit Patient Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setPatientToDelete(patient)}
                            className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredPatients.length} of {patients.length} registered patients</span>
          <span className="text-slate-500">Live Hospital Records Directory</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-bold text-white">
                Delete Patient File?
              </h2>
              <p className="text-xs text-slate-300">
                Are you sure you want to permanently delete patient <strong>"{patientToDelete.name}"</strong> (Patient #{patientToDelete.patient_id})?
              </p>
            </div>

            {/* Check if patient has linked medical records */}
            {records.some(r => r.patient_id === patientToDelete.patient_id) && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
                <strong>Attention:</strong>
                <p>
                  This patient currently has medical consultation records on file. To protect patient medical history, remove those medical records first before deleting the patient file.
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPatientToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Linked Medical Records Modal */}
      {selectedPatientForRecords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Medical Consultations for {selectedPatientForRecords.name}
                </h3>
                <span className="text-xs text-slate-400">
                  Patient #{selectedPatientForRecords.patient_id} • {selectedPatientForRecords.gender} • {selectedPatientForRecords.phone_number}
                </span>
              </div>
              <button
                onClick={() => setSelectedPatientForRecords(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {records
                .filter(r => r.patient_id === selectedPatientForRecords.patient_id)
                .map((rec) => {
                  const doctor = doctors.find(d => d.doctor_id === rec.doctor_id);
                  return (
                    <div key={rec.record_id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-400">Consultation #{rec.record_id}</span>
                        <span className="text-slate-400">{rec.date}</span>
                      </div>
                      {doctor && (
                        <div className="flex items-center gap-1.5 text-emerald-400">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>{doctor.name} ({doctor.specialization})</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 font-semibold">Diagnosis: </span>
                        <span className="text-slate-200">{rec.diagnosis}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Treatment & Prescription: </span>
                        <span className="text-slate-300">{rec.treatment}</span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSelectedPatientForRecords(null);
                  setCurrentPage('viewRecord');
                }}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
              >
                Go to All Medical Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
