import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { RegisterResult } from './AuthContext';
import { Button } from '../ui/button';
import { Logo } from '../shared/Logo';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Shield, Zap, Camera, AlertTriangle, Activity, Lock, Eye, EyeOff, UserPlus, Building, MapPin } from 'lucide-react';

interface SignInPageProps {
  onSwitchToLogin: () => void;
}

export const SignInPage = ({ onSwitchToLogin }: SignInPageProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: '',
    badgeId: '',
    zone: '',
    emergencyContact: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { register } = useAuth();

  const features = [
    {
      icon: UserPlus,
      title: 'Quick Registration',
      description: 'Fast and secure account creation for emergency personnel'
    },
    {
      icon: Shield,
      title: 'Verified Access',
      description: 'Multi-step verification for maximum security'
    },
    {
      icon: Building,
      title: 'Department Integration',
      description: 'Seamless integration with your department systems'
    },
    {
      icon: MapPin,
      title: 'Zone Assignment',
      description: 'Automatic zone assignment based on jurisdiction'
    }
  ];

  const departments = [
    { value: 'police', label: 'Police Department', color: 'from-electric-blue to-blue-600' },
    { value: 'fire', label: 'Fire & Rescue', color: 'from-neon-red to-red-600' },
    { value: 'hospital', label: 'Emergency Medical', color: 'from-lime-green to-green-600' }
  ];

  const zones = [
    { value: 'zone-1', label: 'Zone 1 - Downtown' },
    { value: 'zone-2', label: 'Zone 2 - Industrial' },
    { value: 'zone-3', label: 'Zone 3 - Residential' },
    { value: 'zone-4', label: 'Zone 4 - Highway' },
    { value: 'zone-5', label: 'Zone 5 - Commercial' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value ?? '' // Convert undefined to empty string
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result: RegisterResult = await register(formData);
      if (result.success) {
        setSuccess(result.message ?? 'Registration successful'); // Handle undefined message
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          department: '',
          badgeId: '',
          zone: '',
          emergencyContact: ''
        });
      } else {
        setError(result.message ?? 'Registration failed'); // Handle undefined message
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-lime-green/40 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-lime-green/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-green/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-electric-blue/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-20 left-20 w-40 h-40 bg-neon-red/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex lg:flex-row flex-col relative overflow-hidden">
      {/* Enhanced background elements - removed gradients for solid look */}
      <Particles />

      {/* Left Panel - Features & Branding */}
      <div className="lg:w-1/2 w-full p-8 lg:p-12 flex flex-col justify-center relative z-10">
        <div className="max-w-md mx-auto lg:mx-0">
          {/* Logo & Title */}
          <div className="mb-8">
            <div className="mb-6">
              <Logo size="lg" textSize="lg" animated={false} />
              <div className="mt-2">
                <h1 className="text-white">Join AI Detection System</h1>
                <p className="text-muted-foreground">Emergency Personnel Registration</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Register your emergency department account to access the AI-powered accident detection and response coordination platform
            </p>
          </div>

          {/* Features Carousel */}
          <div className="mb-8">
            <div className="glass rounded-2xl p-6 min-h-[160px] transition-all duration-500 neon-green-glow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-lime-green to-green-400 rounded-lg flex items-center justify-center animate-pulse-glow">
                  {React.createElement(features[currentSlide].icon, {
                    className: "w-6 h-6 text-white"
                  })}
                </div>
                <div className="flex-1">
                  <h3 className="text-white mb-2">{features[currentSlide].title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {features[currentSlide].description}
                  </p>
                </div>
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 mt-4">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                      ? 'bg-lime-green w-6 shadow-lg shadow-lime-green/50'
                      : 'bg-muted w-2 hover:bg-lime-green/60'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Registration Benefits */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-6 h-6 bg-lime-green/20 rounded-full flex items-center justify-center">
                <Activity className="w-3 h-3 text-lime-green" />
              </div>
              <span>Real-time incident monitoring</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-6 h-6 bg-lime-green/20 rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 text-lime-green" />
              </div>
              <span>Access to AI-powered cameras</span>
            </div>
            <div className="flex items-center space-x-3 text-muted-foreground">
              <div className="w-6 h-6 bg-lime-green/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-lime-green" />
              </div>
              <span>Instant emergency alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="lg:w-1/2 w-full p-8 lg:p-12 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Registration Card */}
          <Card className="glass rounded-2xl shadow-2xl neon-green-glow">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-center mb-4">
                <Logo size="lg" showText={false} animated={false} />
              </div>
              <CardTitle className="text-center text-white">Create Account</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Join the emergency response network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {success ? (
                <div className="space-y-4">
                  <Alert className="glass border-lime-green/50 bg-lime-green/10 rounded-xl">
                    <Activity className="h-4 w-4 text-lime-green" />
                    <AlertDescription className="text-green-300">
                      {success}
                    </AlertDescription>
                  </Alert>
                  <div className="flex space-x-4">
                    <Button
                      onClick={onSwitchToLogin}
                      className="flex-1 bg-gradient-to-r from-electric-blue to-cyan-400 hover:from-electric-blue/80 hover:to-cyan-400/80 text-white rounded-xl py-3 neon-glow transition-all duration-300"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Official Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300"
                        placeholder="john.doe@department.gov"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  {/* Department Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-white">Department</Label>
                      <Select value={formData.department} onValueChange={(value: string) => handleInputChange('department', value)}>
                        <SelectTrigger className="glass rounded-xl bg-background/20 text-white border-glass-border focus:ring-2 focus:ring-lime-green">
                          <SelectValue placeholder="Select your department" />
                        </SelectTrigger>
                        <SelectContent className="glass bg-background border-glass-border">
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value} className="text-white hover:bg-background/20">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 bg-gradient-to-r ${dept.color} rounded-full`}></div>
                                <span>{dept.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="badgeId" className="text-white">Badge/ID Number</Label>
                        <Input
                          id="badgeId"
                          type="text"
                          value={formData.badgeId}
                          onChange={(e) => handleInputChange('badgeId', e.target.value)}
                          className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300"
                          placeholder="PD-1234"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zone" className="text-white">Assigned Zone</Label>
                        <Select value={formData.zone} onValueChange={(value: string) => handleInputChange('zone', value)}>
                          <SelectTrigger className="glass rounded-xl bg-background/20 text-white border-glass-border focus:ring-2 focus:ring-lime-green">
                            <SelectValue placeholder="Zone" />
                          </SelectTrigger>
                          <SelectContent className="glass bg-background border-glass-border">
                            {zones.map((zone) => (
                              <SelectItem key={zone.value} value={zone.value} className="text-white hover:bg-background/20">
                                {zone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Create Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300 pr-10"
                          placeholder="Minimum 8 characters"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-lime-green transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300 pr-10"
                          placeholder="Re-enter password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-lime-green transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact" className="text-white">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="glass rounded-xl bg-background/20 text-white placeholder:text-muted-foreground focus:ring-2 focus:ring-lime-green focus:border-lime-green/50 transition-all duration-300"
                      placeholder="Emergency contact name and phone"
                    />
                  </div>

                  {error && (
                    <Alert className="glass border-neon-red/50 bg-neon-red/10 rounded-xl">
                      <AlertTriangle className="h-4 w-4 text-neon-red" />
                      <AlertDescription className="text-red-300">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-lime-green to-green-400 hover:from-lime-green/80 hover:to-green-400/80 text-white rounded-xl py-3 neon-green-glow transition-all duration-300 disabled:opacity-50 hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </form>
              )}

              {/* Switch to Login */}
              <div className="pt-4 border-t border-glass-border text-center">
                <p className="text-muted-foreground mb-3">
                  Already have an account?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSwitchToLogin}
                  className="glass border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10 hover:border-electric-blue/50 rounded-xl transition-all duration-300"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In Instead
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="text-center text-muted-foreground space-y-2">
            <p>🔒 All registration data is encrypted and secure</p>
            <p>Account verification may take up to 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};