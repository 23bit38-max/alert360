import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Button } from '../ui/button';
import { Logo } from '../shared/Logo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  Shield,
  Camera,
  AlertTriangle,
  Activity,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle,
  Clock,
  Users,
  Database,
  Network,
  Fingerprint,
  KeyRound,
  Radar,
  Command,
} from 'lucide-react';
import { MOCK_USERS } from '../../data/data';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onSwitchToSignIn: () => void;
}

export const LoginPage = ({ }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [showApprovalRequest, setShowApprovalRequest] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const { login } = useAuth();

  // Form data for approval request
  const [requestForm, setRequestForm] = useState({
    fullName: '',
    email: '',
    department: '',
    position: '',
    phoneNumber: '',
    emergencyId: '',
    reason: '',
    urgency: 'medium',
    acceptTerms: false
  });

  const features = [
    {
      icon: Radar,
      title: 'AI-Powered Detection',
      description: 'Advanced YOLO neural networks with 99.8% accuracy for real-time accident detection',
      stats: '500+ Lives Saved'
    },
    {
      icon: Network,
      title: 'Real-Time Response Network',
      description: 'Instant alert system connecting emergency services with sub-second response times',
      stats: '2.3s Avg Response'
    },
    {
      icon: Database,
      title: 'Comprehensive Analytics',
      description: 'Advanced predictive analytics and incident pattern recognition systems',
      stats: '24/7 Monitoring'
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption with role-based access controls and audit trails',
      stats: '99.99% Uptime'
    }
  ];

  const systemStats = [
    { icon: Camera, value: '187', label: 'Active Cameras', change: '+12%' },
    { icon: Users, value: '89', label: 'Active Responders', change: '+8%' },
    { icon: AlertTriangle, value: '324', label: 'Alerts Sent', change: '+15%' },
    { icon: Activity, value: '47', label: 'Incidents Handled', change: '-5%' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if this is a demo account with direct access
    const demoUser = Object.values(MOCK_USERS).find(
      u => u.email === email && (u.password === password || password === 'demo123')
    );

    if (demoUser) {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } else {
      // For any "unknown" users (or failed real auth), simulate invalid creds unless testing flow
      setError('Invalid credentials or account not authorized.');
    }

    setIsLoading(false);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.acceptTerms) {
      setError('You must accept the terms and conditions to proceed.');
      return;
    }

    // Simulate request submission
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowApprovalRequest(false);
      setRequestSubmitted(false);
      setError('');
      // In a real app we'd trigger a toast or notification here
    }, 2000);
  };

  // Explicitly typed mock accounts list to prevent TS errors on 'role' access
  const mockAccounts = [
    {
      id: 'super_admin',
      role: 'Super Admin',
      department: 'System Administration',
      color: 'from-purple-500 to-pink-500',
      access: 'Immediate'
    },
    {
      id: 'police_admin',
      role: 'Police Admin',
      department: 'Law Enforcement',
      color: 'from-blue-500 to-cyan-500',
      access: 'Demo Only'
    },
    {
      id: 'police_officer',
      role: 'Police Officer',
      department: 'Law Enforcement',
      color: 'from-blue-400 to-cyan-400',
      access: 'Restricted'
    },
    {
      id: 'fire_admin',
      role: 'Fire Admin',
      department: 'Fire & Rescue',
      color: 'from-red-500 to-orange-500',
      access: 'Demo Only'
    },
    {
      id: 'fire_operator',
      role: 'Fire Operator',
      department: 'Fire & Rescue',
      color: 'from-red-400 to-orange-400',
      access: 'Restricted'
    },
    {
      id: 'hospital_admin',
      role: 'Hospital Admin',
      department: 'Emergency Medical',
      color: 'from-green-500 to-emerald-500',
      access: 'Demo Only'
    },
    {
      id: 'hospital_staff',
      role: 'Hospital Staff',
      department: 'Emergency Medical',
      color: 'from-green-400 to-emerald-400',
      access: 'Restricted'
    },
    {
      id: 'monitoring_operator',
      role: 'Monitoring Operator',
      department: 'System Monitoring',
      color: 'from-yellow-500 to-orange-500',
      access: 'Restricted'
    },
    {
      id: 'auditor',
      role: 'System Auditor',
      department: 'Compliance',
      color: 'from-purple-400 to-indigo-400',
      access: 'Read Only'
    }
  ];

  const fillCredentials = (userId: string) => {
    const user = MOCK_USERS[userId as keyof typeof MOCK_USERS];
    if (user) {
      setEmail(user.email);
      setPassword(user.password || 'demo123'); // Fallback if no password in mock
    }
  };

  // Animated background elements

  if (showApprovalRequest) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="w-full max-w-2xl mx-auto p-8 relative z-10">
          <Card className="glass border-white/5 premium-shadow rounded-[24px]">
            <CardHeader className="text-center pt-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <UserPlus className="w-10 h-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-white text-3xl font-bold tracking-tight">Access Request</CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-2">
                Submit your credentials for emergency system authorization
              </CardDescription>
            </CardHeader>

            <CardContent className="px-10 pb-10">
              {requestSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-white mb-3 text-2xl font-bold">Request Received</h3>
                  <p className="text-muted-foreground mb-8">Your application is being processed by our security team.</p>
                  <div className="flex items-center justify-center space-x-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 inline-flex">
                    <Clock className="w-5 h-5 text-primary animate-spin" />
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Awaiting Governance Approval</span>
                  </div>
                  <Button onClick={() => setShowApprovalRequest(false)} variant="outline" className="mt-12 w-full h-12">
                    Return to Terminal
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                      <Input
                        id="fullName"
                        value={requestForm.fullName}
                        onChange={(e) => setRequestForm({ ...requestForm, fullName: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reqEmail" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</Label>
                      <Input
                        id="reqEmail"
                        type="email"
                        value={requestForm.email}
                        onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                        placeholder="j.doe@emergency.gov"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</Label>
                      <Select value={requestForm.department} onValueChange={(value) => setRequestForm({ ...requestForm, department: value })}>
                        <SelectTrigger className="glass-input h-10 border-white/5">
                          <SelectValue placeholder="Select Sector" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10 text-white">
                          <SelectItem value="police">Police Command</SelectItem>
                          <SelectItem value="fire">Rescue Services</SelectItem>
                          <SelectItem value="medical">Health Services</SelectItem>
                          <SelectItem value="traffic">Traffic Control</SelectItem>
                          <SelectItem value="other">Other Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Designation</Label>
                      <Input
                        id="position"
                        value={requestForm.position}
                        onChange={(e) => setRequestForm({ ...requestForm, position: e.target.value })}
                        placeholder="Senior Officer"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Justification</Label>
                    <Textarea
                      id="reason"
                      value={requestForm.reason}
                      onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                      className="glass-input min-h-[120px] focus:ring-primary/30"
                      placeholder="Detail the operational need for access..."
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={requestForm.acceptTerms}
                      onCheckedChange={(checked) => setRequestForm({ ...requestForm, acceptTerms: !!checked })}
                      className="border-white/20 data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                      I certify that this information is accurate and understand that all activities are monitored.
                    </Label>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-medium"
                    >
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowApprovalRequest(false)}
                      className="flex-1 h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!requestForm.acceptTerms}
                      className="flex-1 h-12 rounded-xl h-12 shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white flex lg:flex-row flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Left Panel - System Overview */}
      <div className="lg:w-1/2 w-full p-8 lg:p-20 flex flex-col justify-center relative z-10">
        <div className="max-w-xl mx-auto lg:mx-0">
          {/* Logo & Title */}
          <div className="mb-16">
            <div className="mb-10 inline-block p-1 bg-white/5 rounded-2xl border border-white/5">
              <Logo size="lg" textSize="lg" animated={true} />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
              Smarter<br />
              <span className="text-primary italic">Emergency</span><br />
              Response.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg opacity-80">
              Enterprise AI infrastructure for high-stakes urban safety monitoring and rapid response coordination.
            </p>
          </div>

          {/* Features Carousel */}
          <div className="mb-12 max-w-lg">
            <div className="glass border-white/10 rounded-[24px] p-8 min-h-[200px] transition-all duration-500 backdrop-blur-xl premium-shadow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex items-start space-x-6"
                >
                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    {React.createElement(features[currentSlide].icon, {
                      className: "w-7 h-7 text-primary"
                    })}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-2 tracking-tight">{features[currentSlide].title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm opacity-80">
                      {features[currentSlide].description}
                    </p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 h-6 px-3">
                      {features[currentSlide].stats}
                    </Badge>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide indicators */}
              <div className="flex justify-start space-x-2.5 mt-8">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide
                      ? 'bg-primary w-10 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : 'bg-white/10 w-2 hover:bg-white/20'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg">
            {systemStats.map((stat, index) => (
              <div key={index} className="glass border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors">
                <div className="text-primary mb-2 opacity-80">
                  <stat.icon size={16} />
                </div>
                <span className="text-xl font-black text-white">{stat.value}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="lg:w-1/2 w-full p-6 lg:p-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Login Card */}
          <Card className="glass border-white/5 premium-shadow rounded-[32px] overflow-hidden">
            <CardHeader className="space-y-4 text-center pb-2 pt-10">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div>
                <CardTitle className="text-white text-2xl font-bold tracking-tight">Security Portal</CardTitle>
                <CardDescription className="text-muted-foreground text-sm font-medium mt-1">
                  Secure terminal for authenticated users
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-10 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                    <Fingerprint className="w-3.5 h-3.5 mr-2 text-primary opacity-70" />
                    Operator Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-sm"
                    placeholder="ops.center@protocol.ai"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                      <KeyRound className="w-3.5 h-3.5 mr-2 text-primary opacity-70" />
                      Encrypted Key
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-12 text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2.5 group cursor-pointer">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                      className="h-4 w-4 rounded-md border-white/20 data-[state=checked]:bg-primary"
                    />
                    <span className="text-[11px] font-bold text-muted-foreground group-hover:text-white transition-colors">Trust device</span>
                  </label>
                  <button
                    type="button"
                    className="text-[11px] font-bold text-primary hover:text-primary-hover transition-colors underline-offset-4 hover:underline"
                  >
                    Reset Key?
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-[11px] font-bold"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="leading-tight uppercase tracking-tight">{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] transition-all duration-500"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Command className="w-4 h-4" />
                      <span>Initiate Access</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Demo Accounts Panel */}
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Operations Testing</p>
                  <Badge className="bg-white/5 border-white/10 text-[9px] h-5 opacity-50">PRO-CONSOLE</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                  {mockAccounts.map((account, index) => {
                    const user = MOCK_USERS[account.id as keyof typeof MOCK_USERS];
                    const name = user ? user.name : account.role;

                    return (
                      <button
                        key={index}
                        onClick={() => fillCredentials(account.id)}
                        className="text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${account.color}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-[11px] font-bold truncate group-hover:text-primary transition-colors">{name}</p>
                            <p className="text-[9px] text-muted-foreground truncate opacity-70 group-hover:opacity-100">{account.role}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Request Link */}
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowApprovalRequest(true)}
                  className="text-[11px] font-bold text-muted-foreground hover:text-white transition-colors underline-offset-4 hover:underline uppercase tracking-widest"
                >
                  Request Operational Access
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security Footer */}
          <div className="text-center space-y-3 opacity-50 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Lock className="w-3 h-3" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-black">Secure Data Protocol v4.0</span>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-tighter">
              All interactions are cryptographically signed and archived for audit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
