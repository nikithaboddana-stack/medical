import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Play, Download, RotateCcw, Table, KeyRound, Sparkles } from 'lucide-react';

export const DatabaseViewer: React.FC = () => {
  const { patients, records, doctors, resetDatabase } = useApp();
  const [activeTab, setActiveTab] = useState<'tables' | 'query' | 'schema'>('tables');
  const [selectedTable, setSelectedTable] = useState<'Patient' | 'MedicalRecord' | 'Doctor'>('MedicalRecord');
  
  const [queryInput, setQueryInput] = useState(
    'SELECT m.record_id, p.name AS patient_name, d.name AS doctor_name, m.date, m.diagnosis\nFROM MedicalRecord m\nJOIN Patient p ON m.patient_id = p.patient_id\nJOIN Doctor d ON m.doctor_id = d.doctor_id;'
  );
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const handleRunQuery = () => {
    // Generate simulated joined data based on query pattern
    const lower = queryInput.toLowerCase();
    if (lower.includes('join')) {
      const joined = records.map(m => {
        const p = patients.find(pat => pat.patient_id === m.patient_id);
        const d = doctors.find(doc => doc.doctor_id === m.doctor_id);
        return {
          record_id: m.record_id,
          patient_name: p ? p.name : 'Unknown',
          doctor_name: d ? d.name : 'Unknown',
          date: m.date,
          diagnosis: m.diagnosis
        };
      });
      setQueryResult(joined);
    } else if (lower.includes('patient')) {
      setQueryResult(patients);
    } else if (lower.includes('doctor')) {
      setQueryResult(doctors);
    } else {
      setQueryResult(records);
    }
  };

  const handleExportSQL = () => {
    let sqlContent = `-- MySQL Database Export: Lab Exercise MedicalRecordDB & PatientDB\n`;
    sqlContent += `-- Generated: ${new Date().toISOString()}\n\n`;

    sqlContent += `CREATE DATABASE IF NOT EXISTS PatientDB;\nUSE PatientDB;\n\n`;
    sqlContent += `DROP TABLE IF EXISTS Patient;\n`;
    sqlContent += `CREATE TABLE Patient (\n  patient_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(255) NOT NULL,\n  date_of_birth DATE,\n  gender VARCHAR(10),\n  email VARCHAR(255),\n  phone_number VARCHAR(20),\n  address TEXT\n);\n\n`;

    patients.forEach(p => {
      sqlContent += `INSERT INTO Patient (patient_id, name, date_of_birth, gender, email, phone_number, address) VALUES (${p.patient_id}, '${p.name.replace(/'/g, "''")}', '${p.date_of_birth}', '${p.gender}', '${p.email}', '${p.phone_number}', '${p.address.replace(/'/g, "''")}');\n`;
    });

    sqlContent += `\nCREATE DATABASE IF NOT EXISTS MedicalRecordDB;\nUSE MedicalRecordDB;\n\n`;
    sqlContent += `DROP TABLE IF EXISTS Doctor;\n`;
    sqlContent += `CREATE TABLE Doctor (\n  doctor_id INT PRIMARY KEY AUTO_INCREMENT,\n  name VARCHAR(255) NOT NULL,\n  specialization VARCHAR(100),\n  department VARCHAR(100),\n  email VARCHAR(255),\n  phone_number VARCHAR(20)\n);\n\n`;

    doctors.forEach(d => {
      sqlContent += `INSERT INTO Doctor (doctor_id, name, specialization, department, email, phone_number) VALUES (${d.doctor_id}, '${d.name.replace(/'/g, "''")}', '${d.specialization}', '${d.department}', '${d.email}', '${d.phone_number}');\n`;
    });

    sqlContent += `\nDROP TABLE IF EXISTS MedicalRecord;\n`;
    sqlContent += `CREATE TABLE MedicalRecord (\n  record_id INT PRIMARY KEY AUTO_INCREMENT,\n  patient_id INT,\n  doctor_id INT,\n  date DATE,\n  diagnosis TEXT,\n  treatment TEXT,\n  FOREIGN KEY (patient_id) REFERENCES PatientDB.Patient(patient_id),\n  FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id)\n);\n\n`;

    records.forEach(r => {
      sqlContent += `INSERT INTO MedicalRecord (record_id, patient_id, doctor_id, date, diagnosis, treatment) VALUES (${r.record_id}, ${r.patient_id}, ${r.doctor_id}, '${r.date}', '${r.diagnosis.replace(/'/g, "''")}', '${r.treatment.replace(/'/g, "''")}');\n`;
    });

    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MedicalRecordDB_and_PatientDB.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-semibold">
              MySQL 8.0 Studio
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Databases: MedicalRecordDB & PatientDB
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 mt-1">
            <Database className="w-6 h-6 text-amber-400" />
            MySQL Relational Database Viewer
          </h1>
          <p className="text-slate-400 text-xs">
            Directly inspect table schemas, execute SQL queries, and export full DDL/DML scripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetDatabase}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
            title="Reset to default lab data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset DB</span>
          </button>
          <button
            onClick={handleExportSQL}
            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .sql File</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'tables'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Table Data Visualizer</span>
        </button>

        <button
          onClick={() => setActiveTab('query')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'query'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Interactive SQL Query Runner</span>
        </button>
      </div>

      {/* Tab: Tables */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          {/* Table Selector */}
          <div className="flex items-center gap-2">
            {(['MedicalRecord', 'Patient', 'Doctor'] as const).map((tbl) => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                  selectedTable === tbl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tbl === 'MedicalRecord' ? 'MedicalRecordDB.MedicalRecord' : tbl === 'Patient' ? 'PatientDB.Patient' : 'Doctor'}
              </button>
            ))}
          </div>

          {/* Table Display */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              {selectedTable === 'MedicalRecord' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 text-amber-400">record_id [PK]</th>
                      <th className="py-3 px-4 text-sky-400">patient_id [FK]</th>
                      <th className="py-3 px-4 text-emerald-400">doctor_id [FK]</th>
                      <th className="py-3 px-4">date</th>
                      <th className="py-3 px-4">diagnosis</th>
                      <th className="py-3 px-4">treatment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {records.map(r => (
                      <tr key={r.record_id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-bold text-amber-400">{r.record_id}</td>
                        <td className="py-2.5 px-4 text-sky-400">{r.patient_id}</td>
                        <td className="py-2.5 px-4 text-emerald-400">{r.doctor_id}</td>
                        <td className="py-2.5 px-4">{r.date}</td>
                        <td className="py-2.5 px-4 max-w-xs truncate">{r.diagnosis}</td>
                        <td className="py-2.5 px-4 max-w-xs truncate">{r.treatment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'Patient' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 text-amber-400">patient_id [PK]</th>
                      <th className="py-3 px-4">name</th>
                      <th className="py-3 px-4">date_of_birth</th>
                      <th className="py-3 px-4">gender</th>
                      <th className="py-3 px-4">email</th>
                      <th className="py-3 px-4">phone_number</th>
                      <th className="py-3 px-4">address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {patients.map(p => (
                      <tr key={p.patient_id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-bold text-amber-400">{p.patient_id}</td>
                        <td className="py-2.5 px-4 text-white font-sans">{p.name}</td>
                        <td className="py-2.5 px-4">{p.date_of_birth}</td>
                        <td className="py-2.5 px-4">{p.gender}</td>
                        <td className="py-2.5 px-4">{p.email}</td>
                        <td className="py-2.5 px-4">{p.phone_number}</td>
                        <td className="py-2.5 px-4 max-w-xs truncate">{p.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'Doctor' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 text-amber-400">doctor_id [PK]</th>
                      <th className="py-3 px-4">name</th>
                      <th className="py-3 px-4">specialization</th>
                      <th className="py-3 px-4">department</th>
                      <th className="py-3 px-4">email</th>
                      <th className="py-3 px-4">phone_number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {doctors.map(d => (
                      <tr key={d.doctor_id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-bold text-amber-400">{d.doctor_id}</td>
                        <td className="py-2.5 px-4 text-white font-sans">{d.name}</td>
                        <td className="py-2.5 px-4 text-emerald-400">{d.specialization}</td>
                        <td className="py-2.5 px-4">{d.department}</td>
                        <td className="py-2.5 px-4">{d.email}</td>
                        <td className="py-2.5 px-4">{d.phone_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Query Runner */}
      {activeTab === 'query' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 font-mono">SQL Query Editor</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQueryInput("SELECT * FROM Patient WHERE gender = 'Female';")}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg"
                >
                  Female Patients
                </button>
                <button
                  type="button"
                  onClick={() => setQueryInput("SELECT m.record_id, p.name, d.name, m.diagnosis FROM MedicalRecord m JOIN Patient p ON m.patient_id = p.patient_id JOIN Doctor d ON m.doctor_id = d.doctor_id;")}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg"
                >
                  3-Way Table Join
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />

            <div className="flex justify-end">
              <button
                onClick={handleRunQuery}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Query</span>
              </button>
            </div>
          </div>

          {/* Results preview */}
          {queryResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-4 space-y-2">
              <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Query Result: {queryResult.length} rows returned</span>
              </div>
              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      {Object.keys(queryResult[0] || {}).map(k => (
                        <th key={k} className="py-2 px-3">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        {Object.values(row).map((val: any, vIdx) => (
                          <td key={vIdx} className="py-2 px-3 truncate max-w-xs">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
