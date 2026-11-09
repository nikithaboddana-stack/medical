import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicalRecord } from '../../types';
import { 
  FileText, 
  FilePlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  User, 
  Stethoscope, 
  Calendar, 
  Printer, 
  AlertTriangle,
  X,
  Eye,
  FileCheck2,
  Building2
} from 'lucide-react';

interface ViewRecordProps {
  onEditRecord: (record: MedicalRecord) => void;
}

export const ViewRecord: React.FC<ViewRecordProps> = ({ onEditRecord }) => {
  const { records, patients, doctors, deleteRecord, setCurrentPage, editRecordId, setEditRecordId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<string>('All');
  const [recordToDelete, setRecordToDelete] = useState<MedicalRecord | null>(null);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<MedicalRecord | null>(() => {
    if (editRecordId) {
      return records.find(r => r.record_id === editRecordId) || null;
    }
    return null;
  });

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const patient = patients.find(p => p.patient_id === rec.patient_id);
    const doctor = doctors.find(d => d.doctor_id === rec.doctor_id);

    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      rec.record_id.toString().includes(term) ||
      rec.diagnosis.toLowerCase().includes(term) ||
      rec.treatment.toLowerCase().includes(term) ||
      rec.date.includes(term) ||
      (patient && patient.name.toLowerCase().includes(term)) ||
      (doctor && doctor.name.toLowerCase().includes(term));

    const matchesDoctor = doctorFilter === 'All' || rec.doctor_id.toString() === doctorFilter;

    return matchesSearch && matchesDoctor;
  });

  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      deleteRecord(recordToDelete.record_id);
      setRecordToDelete(null);
    }
  };

  const handlePrintRecord = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-indigo-400" />
            Clinical Medical Records
          </h1>
          <p className="text-slate-400 text-xs">
            Review patient consultations, physician diagnoses, treatment orders, and clinical history.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('addRecord')}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          <span>New Medical Record</span>
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
            placeholder="Search diagnosis, treatment, patient name, or doctor..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Doctor Dropdown Filter */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Doctor:</span>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900">All Specialists</option>
            {doctors.map(d => (
              <option key={d.doctor_id} value={d.doctor_id.toString()} className="bg-slate-900">
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabular View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Record #</th>
                <th className="py-3.5 px-4 font-semibold">Date of Visit</th>
                <th className="py-3.5 px-4 font-semibold">Patient</th>
                <th className="py-3.5 px-4 font-semibold">Attending Doctor</th>
                <th className="py-3.5 px-4 font-semibold">Diagnosis</th>
                <th className="py-3.5 px-4 font-semibold">Treatment & Prescription</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-medium">No medical records match your search.</p>
                      <button
                        onClick={() => setCurrentPage('addRecord')}
                        className="text-xs text-indigo-400 hover:underline cursor-pointer"
                      >
                        Create a new medical record
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const patient = patients.find(p => p.patient_id === rec.patient_id);
                  const doctor = doctors.find(d => d.doctor_id === rec.doctor_id);

                  return (
                    <tr 
                      key={rec.record_id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Record ID */}
                      <td className="py-3.5 px-4 font-semibold text-indigo-400">
                        #{rec.record_id}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{rec.date}</span>
                        </div>
                      </td>

                      {/* Patient Details */}
                      <td className="py-3.5 px-4">
                        {patient ? (
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <User className="w-3 h-3 text-blue-400" />
                              <span>{patient.name}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              Patient #{patient.patient_id} • {patient.gender}
                            </span>
                          </div>
                        ) : (
                          <span className="text-rose-400">Patient ID: #{rec.patient_id}</span>
                        )}
                      </td>

                      {/* Doctor Details */}
                      <td className="py-3.5 px-4">
                        {doctor ? (
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <Stethoscope className="w-3 h-3 text-emerald-400" />
                              <span>{doctor.name}</span>
                            </div>
                            <span className="text-[11px] text-emerald-400/90 font-medium">
                              {doctor.specialization}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Doctor #{rec.doctor_id}</span>
                        )}
                      </td>

                      {/* Diagnosis */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-200" title={rec.diagnosis}>
                          {rec.diagnosis}
                        </p>
                      </td>

                      {/* Treatment */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-slate-300" title={rec.treatment}>
                          {rec.treatment}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedRecordForDetail(rec)}
                            className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="View Full Encounter & Prescription"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditRecord(rec)}
                            className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRecordToDelete(rec)}
                            className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Delete Record"
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

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredRecords.length} of {records.length} clinical records</span>
          <span className="text-slate-500">Live Hospital Records Directory</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-bold text-white">
                Delete Medical Record?
              </h2>
              <p className="text-xs text-slate-300">
                Are you sure you want to permanently delete Medical Record <strong>#{recordToDelete.record_id}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRecordToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Prescription Sheet & Detail Modal */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Clinical Encounter & Prescription Sheet
                  </h3>
                  <span className="text-xs text-indigo-300 font-medium">
                    Record #{selectedRecordForDetail.record_id} • Consultation Date: {selectedRecordForDetail.date}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedRecordForDetail(null);
                  setEditRecordId(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            {(() => {
              const patient = patients.find(p => p.patient_id === selectedRecordForDetail.patient_id);
              const doctor = doctors.find(d => d.doctor_id === selectedRecordForDetail.doctor_id);

              return (
                <div className="space-y-5 text-xs">
                  {/* Two columns: Patient & Doctor */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Patient block */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block">
                        Patient Details
                      </span>
                      {patient ? (
                        <div className="space-y-1 text-slate-300">
                          <div className="font-bold text-white text-sm">{patient.name}</div>
                          <div>Patient ID: <span className="text-blue-300 font-semibold">#{patient.patient_id}</span></div>
                          <div>Gender / DOB: {patient.gender} • {patient.date_of_birth}</div>
                          <div>Phone: {patient.phone_number}</div>
                          <div>Address: {patient.address}</div>
                        </div>
                      ) : (
                        <span className="text-rose-400">Patient not found</span>
                      )}
                    </div>

                    {/* Doctor block */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                        Attending Physician
                      </span>
                      {doctor ? (
                        <div className="space-y-1 text-slate-300">
                          <div className="font-bold text-white text-sm">{doctor.name}</div>
                          <div className="text-emerald-400 font-medium">{doctor.specialization}</div>
                          <div>Department: {doctor.department}</div>
                          <div>Email: {doctor.email}</div>
                          <div>Phone: {doctor.phone_number}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Doctor not found</span>
                      )}
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                      Clinical Diagnosis
                    </span>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {selectedRecordForDetail.diagnosis}
                    </p>
                  </div>

                  {/* Treatment Plan */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold block">
                      Prescribed Treatment & Doctor's Orders
                    </span>
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                      {selectedRecordForDetail.treatment}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Modal actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                onClick={handlePrintRecord}
                className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Prescription</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const rec = selectedRecordForDetail;
                    setSelectedRecordForDetail(null);
                    setEditRecordId(null);
                    onEditRecord(rec);
                  }}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Edit Record
                </button>
                <button
                  onClick={() => {
                    setSelectedRecordForDetail(null);
                    setEditRecordId(null);
                  }}
                  className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
