import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Shield,
  Upload,
  AlertTriangle,
  FileText,
  Clock,
  Lock
} from 'lucide-react';

interface SignInPageProps {
  onSwitchToLogin: () => void;
}

type ViewState = 'form' | 'submitted';

export const SignInPage = ({ onSwitchToLogin }: SignInPageProps) => {
  const [viewState, setViewState] = useState<ViewState>('form');
  const [isLoading, setIsLoading] = useState(false);

  // Stage 1 Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    role: '',
    zone: '',
    reason: '',
    compliance: false
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    setViewState('submitted');
  };

  // --------------------------------------------------------------------------------
  // STAGE 1: Access Request Form View
  // --------------------------------------------------------------------------------
  const renderRequestForm = () => (
    <div className="w-full max-w-4xl mx-auto bg-[#0F172A] border border-slate-700/60 rounded-lg p-8 md:p-10 shadow-xl">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Request Operational Access</h2>
        <p className="text-sm text-slate-400 mt-2 flex items-start gap-2 max-w-2xl">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          All access requests are reviewed by Super Administration. Unauthorized requests are logged and audited per Directive 4.A.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Personal Details */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800/50 pb-2">Identity Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Full Legal Name</Label>
              <Input required className="bg-[#0B1220] border-slate-700 rounded-md focus-visible:ring-blue-500/50 text-slate-200" placeholder="e.g., Jane Doe" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Government / Employee ID</Label>
              <Input required className="bg-[#0B1220] border-slate-700 rounded-md focus-visible:ring-blue-500/50 text-slate-200" placeholder="Enter ID number" value={formData.employeeId} onChange={e => handleInputChange('employeeId', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section: Contact Details */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800/50 pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Official Work Email</Label>
              <Input type="email" required className="bg-[#0B1220] border-slate-700 rounded-md focus-visible:ring-blue-500/50 text-slate-200" placeholder="jane.doe@agency.gov" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Work Phone Number</Label>
              <Input type="tel" required className="bg-[#0B1220] border-slate-700 rounded-md focus-visible:ring-blue-500/50 text-slate-200" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section: Operational Role */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800/50 pb-2">Operational Assignment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Organization / Department</Label>
              <Input required className="bg-[#0B1220] border-slate-700 rounded-md focus-visible:ring-blue-500/50 text-slate-200" placeholder="e.g., Metro Police Dept" value={formData.department} onChange={e => handleInputChange('department', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Requested Role</Label>
              <Select value={formData.role} onValueChange={v => handleInputChange('role', v)} required>
                <SelectTrigger className="bg-[#0B1220] border-slate-700 rounded-md text-slate-200 focus:ring-blue-500/50">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0F172A] border-slate-700 text-slate-200">
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Police Admin">Police Admin</SelectItem>
                  <SelectItem value="Fire Admin">Fire Admin</SelectItem>
                  <SelectItem value="Hospital Admin">Hospital Admin</SelectItem>
                  <SelectItem value="Field Operator">Field Operator</SelectItem>
                  <SelectItem value="Monitoring Analyst">Monitoring Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-300">Zone / Jurisdiction</Label>
              <Input required className="bg-[#0B1220] border-slate-700 rounded-md focus-visible:ring-blue-500/50 text-slate-200" placeholder="e.g., Sector 7G" value={formData.zone} onChange={e => handleInputChange('zone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section: Justification & Docs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Reason for Access</Label>
            <Textarea required className="bg-[#0B1220] border-slate-700 rounded-md min-h-[100px] resize-y focus-visible:ring-blue-500/50 text-slate-200" placeholder="Provide detailed operational justification for this access request..." value={formData.reason} onChange={e => handleInputChange('reason', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-300">Upload Official ID (Optional)</Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline" className="bg-[#0B1220] border-slate-700 hover:bg-slate-800 text-slate-300 rounded-md px-4">
                <Upload className="w-4 h-4 mr-2" /> Choose File
              </Button>
              <span className="text-xs text-slate-500">Max size: 5MB (PDF, PNG, JPG)</span>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-[#0B1220]/50 p-4 border border-slate-800 rounded-md">
          <label className="flex items-start gap-3 cursor-pointer">
            <Checkbox
              required
              checked={formData.compliance}
              onCheckedChange={v => handleInputChange('compliance', !!v)}
              className="mt-1 rounded-sm border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className="text-sm text-slate-300 leading-snug">
              I acknowledge and agree to the <strong>Compliance & Data Security Policy</strong>. I understand that my access is granted for official duties only and all actions on this platform are monitored, recorded, and subject to audit.
            </span>
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800 pt-6">
          <button type="button" onClick={onSwitchToLogin} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Return to Login</button>
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-8 h-11 shadow-sm font-medium">
            {isLoading ? 'Processing...' : 'Submit Access Request'}
          </Button>
        </div>
      </form>
    </div>
  );

  // --------------------------------------------------------------------------------
  // STAGE 1 POST-SUBMISSION: Pending Status View
  // --------------------------------------------------------------------------------
  const renderSubmitted = () => (
    <div className="w-full max-w-xl mx-auto bg-[#0F172A] border border-slate-700/60 rounded-lg p-10 text-center shadow-xl">
      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
        <FileText className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight">Access Request Submitted</h2>
      <p className="text-slate-400 mb-8 max-w-md mx-auto">
        Your credentials and justification have been securely transmitted to the administrative review board.
      </p>

      <div className="p-4 bg-[#0B1220] border border-slate-800 rounded-md inline-flex items-center gap-3 mb-8">
        <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
        <div className="text-left">
          <div className="text-sm font-medium text-slate-200">Status: Pending Administrative Review</div>
          <div className="text-xs text-slate-500">Ref ID: REQ-99482-B</div>
        </div>
      </div>

      <div>
        <Button onClick={onSwitchToLogin} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md">
          Return to Login
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1220] font-sans text-slate-200 selection:bg-blue-500/30 flex flex-col items-center">

      {/* Header Logo */}
      <div className="w-full p-6 sm:p-8 flex justify-between items-center max-w-6xl mx-auto border-b border-transparent">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">ALERT360</h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 py-10">
        {viewState === 'form' && renderRequestForm()}
        {viewState === 'submitted' && renderSubmitted()}
      </div>

      {/* Simple Footer */}
      <div className="w-full p-6 text-center border-t border-slate-800/50 mt-auto">
        <div className="flex items-center justify-center gap-2 text-slate-600">
          <Lock className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-widest font-medium">Enterprise Security Protocol V4 // Authorized Personnel Only</span>
        </div>
      </div>

    </div>
  );
};
