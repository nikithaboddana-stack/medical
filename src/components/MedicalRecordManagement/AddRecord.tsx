import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FilePlus, ArrowLeft, CheckCircle2, Sparkles, User, Stethoscope, Calendar, FileText } from 'lucide-react';

export const AddRecord: React.FC = () => {
  const { addRecord, patients, doctors, setCurrentPage } = useApp();

  const [formData, setFormData] = useState({
    patient_id: patients[0]?.patient_id || 1,
    doctor_id: doctors[0]?.doctor_id || 101,
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = addRecord({
      patient_id: Number(formData.patient_id),
      doctor_id: Number(formData.doctor_id),
      date: formData.date,
      diagnosis: formData.diagnosis.trim(),
      treatment: formData.treatment.trim()
    });

    if (success) {
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentPage('viewRecord');
      }, 250);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      patient_id: patients[0]?.patient_id || 1,
      doctor_id: doctors[1]?.doctor_id || 102,
      date: new Date().toISOString().split('T')[0],
      diagnosis: 'Acute viral pharyngitis with mild tonsillar exudates and low-grade pyrexia.',
      treatment: 'Amoxicillin-clavulanate 625mg PO BID x 7 days. Paracetamol 650mg PO QID PRN for fever. Warm saline gargles thrice daily. Review in 5 days if symptoms persist.'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('viewRecord')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medical Records</span>
        </button>

        <button
          type="button"
          onClick={handleFillDemo}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Auto-fill Sample Consultation</span>
        </button>
      </div>

      {/* Main Registration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start gap-4 mb-6 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Create New Medical Record
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Record a patient clinical visit, doctor's diagnosis, and treatment plan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Select Patient</span> <span className="text-rose-400">*</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage('addPatient')}
                className="text-[11px] text-blue-400 hover:underline font-normal cursor-pointer"
              >
                + Register New Patient
              </button>
            </label>
            <select
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: Number(e.target.value) })}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.name} (Patient #{p.patient_id} • {p.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                <span>Attending Doctor</span> <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: Number(e.target.value) })}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {doctors.map((d) => (
                  <option key={d.doctor_id} value={d.doctor_id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Consultation Date</span> <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Clinical Diagnosis</span> <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              placeholder="Describe symptoms, test findings, and physician diagnosis..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
              <FilePlus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Prescribed Treatment & Doctor Orders</span> <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              placeholder="List prescribed medicines, dosage instructions, dietary guidance, or follow-up schedule..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentPage('viewRecord')}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Record...' : 'Save Medical Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
