import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Shield, Key, Smartphone, HardDrive, Lock, CheckCircle2, Fingerprint, Mail, FileText } from 'lucide-react';
import { SectionHeader } from '@/features/users/profile/components/SectionHeader';
import { SettingCard } from '@/features/users/profile/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { ProfileSecurityData } from '@/features/users/profile/types/index';
import { Badge } from '@/shared/components/ui/badge';

interface SecuritySectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

export const SecuritySection = ({ onDirtyChange }: SecuritySectionProps) => {
    const initialData: ProfileSecurityData = {
        twoFactorEnabled: true,
        lastPasswordChange: '2024-01-15',
        activeSessions: 3,
        encryptionLevel: 'AES-256-GCM',
        verification: {
            emailVerified: true,
            passwordConfigured: true,
            twoFactorStatus: 'Secured',
            ndaAccepted: true,
            monitoringPolicySigned: true,
            biometricSync: true,
            lastSecurityAudit: '2024-02-25',
        },
        securityEvents: [
            { event: 'Authorized Login', date: 'Today, 09:42 AM', status: 'Safe' },
            { event: 'MFA Heartbeat Sync', date: 'Yesterday, 11:20 PM', status: 'Safe' },
            { event: 'New Device Registered', date: '2024-02-20', status: 'Warning' },
            { event: 'Password Policy Audit', date: '2024-02-15', status: 'Safe' },
        ],
    };

    const { currentData, isDirty } = useUnsavedChanges<ProfileSecurityData>(initialData);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Security & Access"
                description="Manage authentication protocols, monitor active sessions, and review operational compliance status."
                icon={<Shield size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="AUTHENTICATION METHODS">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Smartphone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</p>
                                        <p className="text-[10px] text-zinc-500">Secure your account with hardware-backed MFA.</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold">ACTIVE</Badge>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                                        <Key size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Master Password</p>
                                        <p className="text-[10px] text-zinc-500 whitespace-nowrap overflow-hidden text-ellipsis">Last changed: {currentData.lastPasswordChange}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold tracking-widest border-white/10 hover:bg-white/5">
                                    UPDATE
                                </Button>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="RECENT SECURITY ACTIVITY" description="Audit log of authentication and authorization events.">
                        <div className="space-y-3">
                            {currentData.securityEvents.map((event, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${event.status === 'Safe' ? 'bg-emerald-500' :
                                            event.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500'
                                            }`} />
                                        <div>
                                            <p className="text-[11px] text-white font-bold">{event.event}</p>
                                            <p className="text-[9px] text-zinc-500 font-mono">{event.date}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black border-white/10 text-zinc-500 px-2">
                                        {event.status.toUpperCase()}
                                    </Badge>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-[9px] font-black text-zinc-500 hover:text-white tracking-widest">
                                VIEW FULL AUDIT TRAIL
                            </Button>
                        </div>
                    </SettingCard>

                    <SettingCard title="ACTIVE SESSIONS">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex gap-4 items-center">
                                <HardDrive size={20} className="text-primary" />
                                <div>
                                    <p className="text-sm font-bold text-white tracking-tight">{currentData.activeSessions} Active Devices</p>
                                    <p className="text-[10px] text-zinc-500">Currently logged in to the Alert360 cluster.</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 font-bold">
                                Terminate All
                            </Button>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="OPERATIONAL COMPLIANCE">
                        <div className="space-y-4 pt-1">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">Email Verified</span>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Lock size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">Password Policy</span>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Smartphone size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">2FA Secured</span>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <FileText size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">NDA Signed</span>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Shield size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">Monitoring Policy</span>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Fingerprint size={14} />
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">Biometric Sync</span>
                                </div>
                                <CheckCircle2 size={14} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Compliance Score</span>
                                <span className="text-xs text-emerald-500 font-bold">100%</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            </div>
                            <p className="text-[9px] text-zinc-500 mt-3 text-center">Last audit performed on {currentData.verification.lastSecurityAudit}</p>
                        </div>
                    </SettingCard>

                    <SettingCard title="ENCRYPTION">
                        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-3">
                            <div className="flex items-center gap-3">
                                <Lock size={16} className="text-amber-500" />
                                <span className="text-[11px] font-bold text-white">{currentData.encryptionLevel}</span>
                            </div>
                            <p className="text-[9px] text-zinc-500 leading-relaxed">
                                Standard departmental encryption is applied to all local data clusters and outgoing tactical transmissions.
                            </p>
                        </div>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};
