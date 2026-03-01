import { useState } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export const ProfileSetup = () => {
    const { user, updateUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCompleteSetup = async () => {
        if (!user) return;
        setIsProcessing(true);
        // Simulate API call for setup
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update the user to marked as setup completed
        await updateUser({
            ...user,
            profileCompleted: true,
            status: 'active'
        });

        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-[#0B1220] font-sans text-slate-200 selection:bg-blue-500/30 flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8 py-10">
                <div className="w-full max-w-3xl mx-auto bg-[#0F172A] border border-slate-700/60 rounded-lg p-8 md:p-10 shadow-xl">
                    <div className="text-center mb-8 border-b border-slate-800 pb-8">
                        <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-100 mb-2 tracking-tight">Mandatory Security Setup</h2>
                        <p className="text-sm text-slate-400 max-w-lg mx-auto">
                            Your access request has been approved. You must complete the security profile configuration before accessing the operational dashboard. Profile completion must reach 100%.
                        </p>

                        <div className="mt-6 max-w-md mx-auto">
                            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
                                <span>Progress</span>
                                <span className="text-emerald-500">100%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Task 1: Done */}
                        <div className="flex items-center gap-4 p-4 bg-[#0B1220] border border-slate-800 border-l-4 border-l-emerald-500 rounded-md opacity-80">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-200">Email Verification</h4>
                                <p className="text-xs text-slate-500">Identity verified via secure email link.</p>
                            </div>
                            <div className="text-xs font-mono text-emerald-500 uppercase">Verified</div>
                        </div>

                        {/* Task 2: Done */}
                        <div className="flex items-center gap-4 p-4 bg-[#0B1220] border border-slate-800 border-l-4 border-l-emerald-500 rounded-md opacity-80">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-200">Set Secure Password</h4>
                                <p className="text-xs text-slate-500">Strong cryptographic password configured.</p>
                            </div>
                            <div className="text-xs font-mono text-emerald-500 uppercase">Configured</div>
                        </div>

                        {/* Task 3: Done */}
                        <div className="flex items-center gap-4 p-4 bg-[#0B1220] border border-slate-800 border-l-4 border-l-emerald-500 rounded-md opacity-80">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-200">Configure 2FA</h4>
                                <p className="text-xs text-slate-500">Device linked via multi-factor authenticator app.</p>
                            </div>
                            <div className="text-xs font-mono text-emerald-500 uppercase">Secured</div>
                        </div>

                        {/* Task 4: Done */}
                        <div className="flex items-center gap-4 p-4 bg-[#0B1220] border border-slate-800 border-l-4 border-l-emerald-500 rounded-md opacity-80">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-200">NDAs & Monitoring Policy</h4>
                                <p className="text-xs text-slate-500">System usage agreements reviewed and electronically signed.</p>
                            </div>
                            <div className="text-xs font-mono text-emerald-500 uppercase">Accepted</div>
                        </div>
                    </div>

                    <div className="mt-8 text-center bg-blue-900/10 border border-blue-500/30 p-6 rounded-lg pb-8">
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Profile Configuration Complete</h3>
                        <p className="text-sm text-slate-400 mb-6">Your identity has been fully verified and system access is now permitted.</p>
                        <Button
                            onClick={handleCompleteSetup}
                            disabled={isProcessing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md h-12 shadow-md transition-all font-medium text-sm"
                        >
                            {isProcessing ? 'INITIALIZING WORKSPACE...' : 'PROCEED TO OPERATIONAL DASHBOARD'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
