import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartPulse, 
  Users, 
  FileText, 
  UserPlus, 
  FilePlus, 
  LogOut, 
  Stethoscope, 
  Menu,
  X,
  Code2,
  Database,
  Building2,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, sessionUser, logout, records, patients } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'home', label: 'Dashboard', icon: HeartPulse },
    { id: 'viewPatient', label: 'Patients', icon: Users, badge: patients.length },
    { id: 'addPatient', label: 'Register Patient', icon: UserPlus },
    { id: 'viewRecord', label: 'Medical Records', icon: FileText, badge: records.length },
    { id: 'addRecord', label: 'New Record', icon: FilePlus },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top hospital status bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-blue-200" />
          <span className="text-white font-semibold tracking-wide">
            MediCare Health System
          </span>
          <span className="hidden sm:inline text-blue-200/90 text-[11px]">
            • Clinical Care & Patient Records Portal
          </span>
        </div>
        <div className="flex items-center gap-4 text-blue-100 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Online System
          </span>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('code')}
              className={`px-2 py-0.5 rounded transition-colors text-[11px] flex items-center gap-1 ${
                currentPage === 'code' ? 'bg-white text-blue-900 font-bold' : 'hover:bg-white/10 text-blue-100'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Lab Source Code</span>
            </button>
            <button
              onClick={() => setCurrentPage('database')}
              className={`px-2 py-0.5 rounded transition-colors text-[11px] flex items-center gap-1 ${
                currentPage === 'database' ? 'bg-white text-blue-900 font-bold' : 'hover:bg-white/10 text-blue-100'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>Database DDL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">
                MediCare
              </span>
              <span className="text-[11px] text-blue-300 block font-medium -mt-1">
                Hospital Records Management
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-blue-700' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="hidden sm:flex items-center gap-3">
            {sessionUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-500/30">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-white block">
                    Staff ID: {sessionUser.rollNumber}
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    Logged In
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1">
          {sessionUser && (
            <div className="p-3 mb-2 bg-slate-800/90 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Signed In As:</span>{' '}
                <strong className="text-white font-semibold">Staff {sessionUser.rollNumber}</strong>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-rose-400 font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setCurrentPage('code');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-center bg-slate-800 rounded-lg text-xs text-blue-300 font-medium"
            >
              Source Code
            </button>
            <button
              onClick={() => {
                setCurrentPage('database');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-center bg-slate-800 rounded-lg text-xs text-amber-300 font-medium"
            >
              Database
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
