import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  FileText, 
  Stethoscope, 
  UserPlus, 
  FilePlus, 
  ArrowRight, 
  Calendar,
  Search,
  Activity,
  Heart,
  Clock,
  Eye
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { sessionUser, patients, records, doctors, setCurrentPage, setEditRecordId } = useApp();

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayDate}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hospital Management Dashboard
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Hello, <strong>Staff Member {sessionUser?.rollNumber}</strong>. You can register patients, record clinical consultations, and manage medical records from here.
            </p>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('addPatient')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
            <button
              onClick={() => setCurrentPage('addRecord')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>New Medical Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Patients */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 transition-all group shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-900">
              Patients
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white">
              {patients.length}
            </div>
            <div className="text-xs font-medium text-slate-400">
              Total Registered Patients
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentPage('viewPatient')}
              className="font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Patients</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage('addPatient')}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Medical Records */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all group shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-900">
              Consultations
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white">
              {records.length}
            </div>
            <div className="text-xs font-medium text-slate-400">
              Clinical Medical Records
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentPage('viewRecord')}
              className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Browse Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage('addRecord')}
              className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Doctors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all group shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900">
              Specialists
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white">
              {doctors.length}
            </div>
            <div className="text-xs font-medium text-slate-400">
              Attending Physicians
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentPage('doctors')}
              className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Physician Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-emerald-400/80 font-medium text-[11px]">
              Active On Call
            </span>
          </div>
        </div>
      </div>

      {/* 4 Feature Hub Cards */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Hospital Operations Hub</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentPage('addPatient')}
            className="p-5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Register Patient</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add a new patient with personal details, contact info, and home address.
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('viewPatient')}
            className="p-5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Patient Directory</h3>
            <p className="text-xs text-slate-400 mt-1">
              Search patients, edit profile details, review records, or delete files.
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('addRecord')}
            className="p-5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FilePlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Record Medical Visit</h3>
            <p className="text-xs text-slate-400 mt-1">
              Record diagnosis, doctor consultation, and prescription treatment plans.
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('viewRecord')}
            className="p-5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Medical Records</h3>
            <p className="text-xs text-slate-400 mt-1">
              Review history, print prescriptions, and update clinical notes.
            </p>
          </button>
        </div>
      </div>

      {/* Recent Medical Consultations Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Recent Medical Consultations</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest recorded patient encounters and prescribed treatments
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('viewRecord')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records ({records.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Attending Doctor</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Clinical Diagnosis</th>
                  <th className="py-3.5 px-4">Treatment Plan</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {records.slice(0, 5).map((rec) => {
                  const patient = patients.find(p => p.patient_id === rec.patient_id);
                  const doctor = doctors.find(d => d.doctor_id === rec.doctor_id);

                  return (
                    <tr key={rec.record_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs">
                            {patient ? patient.name.charAt(0) : 'P'}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">
                              {patient ? patient.name : `Patient #${rec.patient_id}`}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {patient?.gender} • {patient?.phone_number}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200 block">
                          {doctor ? doctor.name : `Doctor #${rec.doctor_id}`}
                        </span>
                        <span className="text-[11px] text-emerald-400">
                          {doctor?.specialization}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {rec.date}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-200">
                        {rec.diagnosis}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                        {rec.treatment}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setEditRecordId(rec.record_id);
                            setCurrentPage('viewRecord');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors font-medium text-xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Sheet</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
