import React from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, Trash2, X, ArrowUpRight, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ServletConsoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServletConsoleDrawer: React.FC<ServletConsoleDrawerProps> = ({ isOpen, onClose }) => {
  const { logs, clearLogs, sessionUser } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-slate-950/95 border-t border-slate-800 shadow-2xl backdrop-blur-md max-h-96 flex flex-col animate-slide-up">
      {/* Console Header */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
            <Terminal className="w-4 h-4" />
            <span>Servlet & JDBC Runtime Execution Console</span>
          </div>
          <span className="bg-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
            {logs.length} Operations Logged
          </span>
          {sessionUser && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3" />
              HttpSession: {sessionUser.rollNumber}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearLogs}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1 font-mono transition-colors cursor-pointer"
            title="Clear Console Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logs Stream */}
      <div className="overflow-y-auto p-4 space-y-2.5 font-mono text-xs flex-1">
        {logs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No servlet requests recorded yet. Perform a CRUD operation or login to view execution logs.
          </div>
        ) : (
          logs.map((log) => {
            const isError = log.status >= 400;
            return (
              <div
                key={log.id}
                className={`p-3 rounded-xl border transition-all ${
                  isError
                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    : 'bg-slate-900/80 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                      log.method === 'POST' ? 'bg-blue-600 text-white' : 'bg-emerald-700 text-white'
                    }`}>
                      {log.method}
                    </span>
                    <span className="font-bold text-white">{log.servlet}</span>
                    <span className="text-slate-400">{log.urlPattern}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isError
                      ? 'bg-rose-500/20 text-rose-400'
                      : log.status === 302
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    HTTP {log.status}
                  </span>
                </div>

                <div className="text-slate-300 text-xs font-semibold">
                  {log.action}
                </div>

                {log.sqlQuery && (
                  <div className="mt-1.5 p-2 bg-slate-950 rounded-lg text-amber-300/90 text-[11px] flex items-start gap-1.5 border border-slate-800/80">
                    <Database className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="break-all">{log.sqlQuery}</span>
                  </div>
                )}

                <div className="mt-1 text-[11px] text-slate-400">
                  {log.details}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
