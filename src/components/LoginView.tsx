import React, { useState } from 'react';
import { BookOpen, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, UserPlus, LogIn, Award } from 'lucide-react';
import { SystemOperator } from '../types';
import { INITIAL_OPERATORS } from '../initialData';

interface LoginViewProps {
  onLoginSuccess: (operatorEmail: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  // Database State (Dynamic Operators)
  const [operators, setOperators] = useState<SystemOperator[]>(() => {
    const saved = localStorage.getItem('bookvault_operators');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    // Set initial seed
    localStorage.setItem('bookvault_operators', JSON.stringify(INITIAL_OPERATORS));
    return INITIAL_OPERATORS;
  });

  // Mode state: false = Sign In, true = Register New Administrative Authorized User
  const [isRegister, setIsRegister] = useState(false);

  // Sign In inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('Circulation Desk Staff');
  const [regPass, setRegPass] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  // Interface feedback states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePrefill = (oper: SystemOperator) => {
    setEmail(oper.email);
    setPassword(oper.pass);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsRegister(false);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const normEmail = email.trim().toLowerCase();
    const normPass = password.trim();

    if (!normEmail || !normPass) {
      setErrorMessage('Please provide both administrative Email and Password.');
      return;
    }

    setLoading(true);

    // Simulate validation and authorization with the dynamic persistent database
    setTimeout(() => {
      setLoading(false);
      
      const foundOp = operators.find(
        (op) => op.email.toLowerCase().trim() === normEmail && op.pass === normPass
      );

      // Support classic backup admin
      const isAllowedAdminBackdoor = normEmail === 'admin@bookvault.org' && normPass === 'admin';

      if (foundOp || isAllowedAdminBackdoor) {
        setSuccessMessage('Credentials authorized. Unlocking BookVault cloud core...');
        setTimeout(() => {
          onLoginSuccess(foundOp ? foundOp.email : 'sarah.jenkins@bookvault.org');
        }, 1100);
      } else {
        setErrorMessage('Invalid credentials. Check password or select a registered Operator card below to fill.');
      }
    }, 900);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const normName = regName.trim();
    const normEmail = regEmail.trim().toLowerCase();
    const normPass = regPass;

    if (!normName || !normEmail || !normPass) {
      setErrorMessage('Please fill in all metadata fields to generate registration keys.');
      return;
    }

    if (!normEmail.includes('@') || normEmail.length < 5) {
      setErrorMessage('Please enter a valid institutional email address.');
      return;
    }

    // Check collision in persistent operator table
    const exists = operators.some(op => op.email.toLowerCase().trim() === normEmail);
    if (exists || normEmail === 'admin@bookvault.org') {
      setErrorMessage('The requested email is already on file. Try signing in directly.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      const newOperator: SystemOperator = {
        name: normName,
        email: normEmail,
        role: regRole,
        pass: normPass
      };

      // Update database state & persist
      const updatedList = [...operators, newOperator];
      setOperators(updatedList);
      localStorage.setItem('bookvault_operators', JSON.stringify(updatedList));

      setSuccessMessage(`Success! Operator "${normName}" registered below. You can now login.`);
      setIsRegister(false);

      // Prefill Login Fields automatically
      setEmail(normEmail);
      setPassword(normPass);

      // Reset Register Forms
      setRegName('');
      setRegEmail('');
      setRegPass('');
      setRegRole('Circulation Desk Staff');
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 font-sans" id="login-screen-root">
      
      {/* Top spacer */}
      <div />

      {/* Main Double Column Card */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 transition-all">
        
        {/* Left Side: Brand presentation / system state status */}
        <div className="md:col-span-12 lg:col-span-5 bg-[#0B1B3D] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Abstract backdrop blur decorations */}
          <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

          {/* Brand header details */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg border border-blue-400/20">
                <BookOpen className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white leading-none">BookVault</h1>
                <p className="text-[10px] uppercase font-bold text-blue-300 tracking-wider mt-1">Cloud Library System</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/20 rounded-full text-[10px] text-blue-300 font-extrabold uppercase tracking-wide">
                Secure Enterprise Release
              </p>
              <h2 className="text-xl font-bold text-white leading-tight">Secure Cloud Library Management System</h2>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Connect and manage university catalogs, dispatch member queues, reconcile overdue fine records, and analyze operations instantly in real-time.
              </p>
            </div>
          </div>

          {/* Secure system states block */}
          <div className="relative z-10 space-y-4 pt-12 border-t border-white/10 mt-8">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Persistent Operator DB Active</span>
            </div>
            
            <div className="text-[10px] text-slate-400 font-mono space-y-1">
              <div>Device Nodes: active-browser-local</div>
              <div>Authorized Accounts: {operators.length} librarians</div>
            </div>
          </div>
        </div>

        {/* Right Side: Operations credentials Form & Toggle */}
        <div className="md:col-span-12 lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          
          {/* TAB SWITCHER: LOGIN VS REGISTER */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200/30">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !isRegister ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="switch-login-tab"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Librarian Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2.5 text-center rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isRegister ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="switch-register-tab"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create New Staff User</span>
            </button>
          </div>

          <div className="space-y-1 mb-6">
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
              {isRegister ? 'Register Authorized Administrator' : 'Administrative Access Portal'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRegister 
                ? 'Create a new operator account credentials. It will persist in our BookVault database.'
                : 'Please enter authorized staff credentials key values to decrypt the system dashboard.'}
            </p>
          </div>

          {/* Feedback banners */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in" id="login-error-alert">
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2.5 animate-pulse" id="login-success-alert">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORM SELECTION */}
          {!isRegister ? (
            /* SIGN IN FORM BODY */
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-core-form">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-[10.5px] font-bold text-slate-500 uppercase block tracking-wider">
                  Operator E-Mail Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="sarah.jenkins@bookvault.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="text-[10.5px] font-bold text-slate-500 uppercase block tracking-wider font-sans">
                    System Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setErrorMessage('To reset passwords, ask Sarah Jenkins (sarah.jenkins@bookvault.org) or add a brand new accounts tab on the top-right switcher.');
                    }}
                    className="text-[11px] text-blue-600 hover:underline font-bold"
                  >
                    Forgot Password?
                  </a>
                </div>
                
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer font-medium select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-600 border-slate-200 focus:ring-blue-500/30 rounded cursor-pointer"
                  />
                  <span>Keep system administrative node session key valid</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-blue-600/15 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                id="login-submit-button"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Authorizing Operator ID...</span>
                  </>
                ) : (
                  <>
                    <span>Decrypt Vault System Core</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* REGISTER STAFF / REGISTER NEW USER FORM BODY */
            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="register-core-form border border-slate-100 p-2 text-slate-800">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="reg-name" className="text-[10.5px] font-bold text-slate-500 uppercase block tracking-wider">
                  Librarian Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Prof. Jane Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="reg-email" className="text-[10.5px] font-bold text-slate-500 uppercase block tracking-wider">
                  Official Email Address (@bookvault.org or .edu)
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="jane.doe@bookvault.org"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Grid: Role & Password inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Operator clearance role dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-role" className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    System Clearance Role
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none bg-white cursor-pointer font-bold focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Head Librarian">Head Librarian (Owner)</option>
                    <option value="Circulation Desk Staff">Circulation Desk Staff</option>
                    <option value="Database Associate">Database Associate</option>
                    <option value="Technical Admin">Technical Admin</option>
                  </select>
                </div>

                {/* Password input */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-pass" className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Administrative Access Key 
                  </label>
                  <div className="relative">
                    <input
                      id="reg-pass"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Access Code"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-slate-450 hover:text-slate-600 cursor-pointer text-xs"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Submit Registration button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-emerald-600/15 flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
                id="register-submit-button"
              >
                <UserPlus className="w-4 h-4" />
                <span>Publish Account to Database</span>
              </button>

            </form>
          )}
          
        </div>

      </div>

      {/* DYNAMIC SYSTEM OPERATOR DATABASE SELECTION ("move all prefill data in Sample Preview") */}
      <div className="max-w-4xl w-full mx-auto mt-6 bg-slate-50 border border-slate-250 p-6 rounded-3xl" id="sample-credentials-desk-preview">
        <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
              BOOKVAULT OPERATOR DIRECTORY ({operators.length} SYSTEM USERS LOADED)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-450 uppercase font-bold bg-slate-205 px-2 py-0.5 rounded-md">
            DB Status: Connected Sync
          </span>
        </div>
        
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Click any registered database operator card below to auto-populate credentials directly and switch back to Sign In mode:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {operators.map((operator) => {
            const isMatched = email.toLowerCase().trim() === operator.email.toLowerCase().trim();
            return (
              <button
                key={operator.email}
                onClick={() => handlePrefill(operator)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer group text-xs ${
                  isMatched
                    ? 'bg-blue-50/50 border-blue-400 shadow-md ring-1 ring-blue-300'
                    : 'bg-white hover:bg-slate-55 border-slate-200/80 shadow-sm'
                }`}
                type="button"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-extrabold text-slate-800 block group-hover:text-blue-600 transition-colors truncate max-w-[110px]">
                    {operator.name}
                  </span>
                  
                  <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                    operator.role.includes('Head')
                      ? 'bg-amber-100 text-amber-800'
                      : operator.role.includes('Tech')
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {operator.role.includes('Head') ? 'Owner' : 'Staff'}
                  </span>
                </div>
                
                <div className="font-mono text-[9.5px] text-slate-500 truncate">{operator.email}</div>
                
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold block truncate max-w-[100px]">{operator.role}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-medium">Pass:</span>
                    <span className="font-mono bg-slate-150 px-1 py-0.2 rounded text-slate-700 font-bold">{operator.pass}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer copyright tagline */}
      <p className="text-center text-[10.5px] text-slate-450 font-semibold mt-4">
        BookVault Cloud Storage Portal © {new Date().getFullYear()} — Secure Cloud Library Database Interface.
      </p>

    </div>
  );
}
