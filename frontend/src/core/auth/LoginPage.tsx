import React, { useState } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Shield,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  Activity,
  Server,
  User,
  ShieldAlert,
  KeyRound,
  Mail,
  UserPlus
} from 'lucide-react';
import { MOCK_USERS } from '@/data/data';


interface LoginPageProps {
  onSwitchToSignIn: () => void;
}

export const LoginPage = ({ onSwitchToSignIn }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, mockLogin } = useAuth();

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setError('');
    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));

      const demoUser = Object.values(MOCK_USERS).find(
        u => u.email === loginEmail && (u.password === loginPassword || loginPassword === 'demo123')
      );

      if (demoUser) {
        // Bypass Firebase Authentication completely for demo testing accounts
        mockLogin({ ...demoUser, id: demoUser.email || 'mock_id' } as any);
      } else {
        // Normal user login without auto-registration
        await login(loginEmail, loginPassword);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const mockAccounts = [
    { id: 'super_admin', role: 'Super Admin', access: 'Level 5 - Root', type: 'system' },
    { id: 'police_admin', role: 'Police Admin', access: 'Level 4 - Command', type: 'police' },
    { id: 'police_officer', role: 'Police Officer', access: 'Level 3 - Field', type: 'police' },
    { id: 'fire_admin', role: 'Fire Admin', access: 'Level 4 - Command', type: 'fire' },
    { id: 'fire_operator', role: 'Fire Operator', access: 'Level 3 - Field', type: 'fire' },
    { id: 'hospital_admin', role: 'Medical Admin', access: 'Level 4 - Control', type: 'medical' },
    { id: 'hospital_staff', role: 'Medical Staff', access: 'Level 2 - Support', type: 'medical' },
    { id: 'monitoring_operator', role: 'System Operator', access: 'Level 3 - Watch', type: 'system' },
    { id: 'auditor', role: 'System Auditor', access: 'Level 1 - Read Only', type: 'system' },
    { id: 'new_approved_user', role: 'New Operator', access: 'Needs Profile Setup', type: 'system' }
  ];

  const getRoleIcon = (type: string) => {
    switch (type) {
      case 'police': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'fire': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'medical': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'system': return <Server className="w-4 h-4 text-slate-400" />;
      default: return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  const fillCredentials = async (userId: string) => {
    const user = MOCK_USERS[userId as keyof typeof MOCK_USERS];
    if (user) {
      const loginEmail = user.email;
      const loginPassword = user.password || 'demo123';
      setEmail(loginEmail);
      setPassword(loginPassword);
      await performLogin(loginEmail, loginPassword);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex flex-col font-sans selection:bg-blue-500/30 overflow-y-auto">
      {/* Container aligned to center with a wider max width for desktop */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 w-full max-w-6xl mx-auto">

        {/* System Identity Header */}
        <div className="w-full mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20 shadow-sm">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">ALERT360</h1>
              <p className="text-sm text-slate-400 font-medium">Urban AI Emergency Infrastructure</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-400 bg-[#0F172A] px-4 py-2 border border-slate-800 rounded-md shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
              System Status: Online
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
            <div className="hidden sm:block font-medium">Encryption: AES-256</div>
            <div className="hidden sm:block w-px h-4 bg-slate-700"></div>
            <div className="hidden sm:block font-medium text-blue-400">Monitoring: Active</div>
          </div>
        </div>

        {/* Main Dashboard Panel */}
        <div className="w-full bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

          {/* Left Column: Authorization Module */}
          <div className="w-full lg:w-5/12 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-800 bg-[#0B1220]/30 flex flex-col">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-100 mb-2">Operator Authorization</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Provide authenticated credentials to access the emergency response control matrix. Log in to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-500" />
                  Operator Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-[#0F172A] border-slate-700 text-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-lg text-sm"
                  placeholder="operator@nexus.gov"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    Encrypted Access Key
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-[#0F172A] border-slate-700 text-slate-200 pr-10 focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-lg text-sm"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer group">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="h-4 w-4 rounded-[4px] border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-colors"
                  />
                  <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 select-none transition-colors">Trust device</span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-start gap-3 mt-4">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-red-400 font-medium">{error}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    'INITIATE ACCESS'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500 mb-3">Unauthorized personnel? Request access credentials.</p>
              <Button
                type="button"
                variant="outline"
                onClick={onSwitchToSignIn}
                className="w-full text-sm font-medium border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg h-10 transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Request Operational Access
              </Button>
            </div>
          </div>

          {/* Right Column: Operations Testing Accounts */}
          <div className="w-full lg:w-7/12 p-8 lg:p-10 flex flex-col bg-[#0F172A]">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-200">Operations Testing Accounts</h3>
                <p className="text-sm text-slate-400 mt-1">Select an identity profile to pre-fill access credentials.</p>
              </div>
              <Server className="w-5 h-5 text-slate-500 hidden sm:block opacity-50" />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar content-start">
              {mockAccounts.map((account, idx) => {
                const user = MOCK_USERS[account.id as keyof typeof MOCK_USERS];
                const name = user ? user.name : account.role;

                return (
                  <button
                    key={idx}
                    onClick={() => fillCredentials(account.id)}
                    className="flex items-start gap-3 p-3 bg-[#0B1220] border border-slate-800 hover:border-slate-600 hover:bg-slate-800/50 rounded-lg text-left transition-all duration-200 group"
                  >
                    <div className="pt-0.5 p-1.5 bg-slate-800/50 rounded-md border border-slate-700/50 group-hover:border-slate-600">
                      {getRoleIcon(account.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white truncate">{name}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{account.role}</div>
                      <div className="text-[11px] font-medium text-blue-400/80 mt-1.5 pt-1.5 border-t border-slate-800 inline-block w-full">{account.access}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-2 gap-4">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Enterprise Connection</span>
          </div>
          <div className="flex gap-6 font-medium">
            <button className="hover:text-slate-300 transition-colors">Privacy Policy</button>
            <button className="hover:text-slate-300 transition-colors">Terms of Service</button>
            <button className="hover:text-slate-300 transition-colors">Help Center</button>
          </div>
        </div>

      </div>
    </div>
  );
};

