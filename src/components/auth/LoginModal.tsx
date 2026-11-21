import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { DEPARTMENTS } from '../../data/departments';
import { 
  X, 
  User, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  KeyRound, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAs, currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('DEPARTMENT_OFFICER');
  const [selectedDeptId, setSelectedDeptId] = useState('dept-trees');
  const [email, setEmail] = useState('officer.trees@civiclens.gov');
  const [password, setPassword] = useState('••••••••••••');

  if (!isLoginModalOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'CITIZEN') {
      setEmail('rahul.citizen@gmail.com');
    } else if (role === 'DEPARTMENT_OFFICER') {
      setEmail('officer.trees@civiclens.gov');
    } else {
      setEmail('commissioner@civiclens.gov');
    }
  };

  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    const d = DEPARTMENTS.find(dep => dep.id === deptId);
    if (d) setEmail(d.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole, selectedDeptId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121A2B] border border-[#2C416A] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#223252] flex items-center justify-between bg-gradient-to-r from-[#16223B] to-[#121A2B]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0B1020] border border-[#2C416A] flex items-center justify-center text-[#C6FF5F]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                CivicLens Access Gateway
              </h2>
              <p className="text-[11px] text-[#8E9EB8]">
                Select role portal or enter municipal credentials
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg bg-[#0B1020] text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Portal Role Selector Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#0B1020] border border-[#223252] text-xs font-mono">
            <button
              type="button"
              onClick={() => handleRoleSelect('CITIZEN')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'CITIZEN' 
                  ? 'bg-[#18233B] text-[#C6FF5F] font-bold border border-[#C6FF5F]/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('DEPARTMENT_OFFICER')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'DEPARTMENT_OFFICER' 
                  ? 'bg-[#18233B] text-[#43D9FF] font-bold border border-[#43D9FF]/40' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Dept Officer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
                selectedRole === 'ADMIN' 
                  ? 'bg-[#18233B] text-white font-bold border border-slate-500' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>City Admin</span>
            </button>
          </div>

          {/* Department Choice if Department Officer is selected */}
          {selectedRole === 'DEPARTMENT_OFFICER' && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-300 tracking-wider">
                Select Department Bureau
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => handleDeptChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B1020] border border-[#2C416A] text-xs font-mono text-white focus:outline-none focus:border-[#43D9FF]"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-[#121A2B]">
                    {dept.name} ({dept.head})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Mock credentials form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate-400">
                Official Email / Citizen ID
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B1020] border border-[#223252] text-xs text-white focus:outline-none focus:border-[#C6FF5F]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate-400">
                Password / Biometric Token
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B1020] border border-[#223252] text-xs text-white focus:outline-none focus:border-[#C6FF5F]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6FF5F] to-[#a8f828] text-[#0B1020] font-bold font-mono text-xs uppercase tracking-wider hover:scale-[1.01] transition-all shadow-lg shadow-[#C6FF5F]/20 mt-2 flex items-center justify-center gap-2"
            >
              <span>ACCESS {selectedRole.replace('_', ' ')} PORTAL →</span>
            </button>
          </form>

          {/* Quick Demo Instant Logins */}
          <div className="pt-2 border-t border-[#223252] space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              1-Click Pitch Logins:
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => loginAs('CITIZEN')}
                className="p-1.5 rounded-lg bg-[#18233B] hover:bg-[#203154] border border-[#243354] text-slate-300 hover:text-[#C6FF5F] text-center truncate"
              >
                👤 Rahul (Citizen)
              </button>
              <button
                type="button"
                onClick={() => loginAs('DEPARTMENT_OFFICER', 'dept-trees')}
                className="p-1.5 rounded-lg bg-[#18233B] hover:bg-[#203154] border border-[#243354] text-slate-300 hover:text-[#43D9FF] text-center truncate"
              >
                🌳 Tree Officer
              </button>
              <button
                type="button"
                onClick={() => loginAs('ADMIN')}
                className="p-1.5 rounded-lg bg-[#18233B] hover:bg-[#203154] border border-[#243354] text-slate-300 hover:text-white text-center truncate"
              >
                🏛️ Commissioner
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
