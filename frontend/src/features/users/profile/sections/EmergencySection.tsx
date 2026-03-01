import { useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { HeartPulse, UserCircle, PhoneIncoming, FileWarning, Activity, ShieldCheck, Cross } from 'lucide-react';
import { SectionHeader } from '@/features/users/profile/components/SectionHeader';
import { SettingCard } from '@/features/users/profile/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { ProfileEmergencyData } from '@/features/users/profile/types/index';
import { Badge } from '@/shared/components/ui/badge';

interface EmergencySectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

export const EmergencySection = ({ onDirtyChange }: EmergencySectionProps) => {
    const initialData: ProfileEmergencyData = {
        contactName: 'Priya Sharma',
        relationship: 'Spouse',
        contactPhone: '+91 98223 114XX',
        medicalNotes: 'Personnel has a history of mild hypertension. No surgical history in the last 5 years.',
        bloodGroup: 'O Positive',
        allergies: ['Penicillin', 'Dust Mites'],
        insuranceProvider: 'Star Health Operational Cover',
        policyNumber: 'A360-INS-992831',
    };

    const { currentData, isDirty, updateField } = useUnsavedChanges<ProfileEmergencyData>(initialData);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Medical & Emergency"
                description="Crucial information for personnel safety. This data is only accessible to medical staff and emergency response units during a crisis."
                icon={<HeartPulse size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="EMERGENCY CONTACT">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Primary Contact Name</Label>
                                <div className="relative">
                                    <UserCircle size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.contactName}
                                        onChange={(e) => updateField('contactName', e.target.value)}
                                        className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Relationship</Label>
                                <Input
                                    value={currentData.relationship}
                                    onChange={(e) => updateField('relationship', e.target.value)}
                                    className="glass border-white/5 h-11 focus:border-primary/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Secure Emergency Line</Label>
                            <div className="relative">
                                <PhoneIncoming size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                <Input
                                    value={currentData.contactPhone}
                                    onChange={(e) => updateField('contactPhone', e.target.value)}
                                    className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-mono"
                                />
                            </div>
                        </div>
                    </SettingCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingCard title="MEDICAL PROFILE">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Blood Group</Label>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                        <Activity size={16} className="text-rose-500" />
                                        <span className="text-sm font-black text-white">{currentData.bloodGroup}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Known Allergies</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {currentData.allergies.map((allergy, idx) => (
                                            <Badge key={idx} className="bg-zinc-800 text-zinc-400 border-none text-[9px] font-bold">
                                                {allergy.toUpperCase()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SettingCard>

                        <SettingCard title="OPERATIONAL INSURANCE">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Provider</Label>
                                    <div className="relative">
                                        <ShieldCheck size={14} className="absolute left-3 top-3.5 text-emerald-500" />
                                        <Input
                                            value={currentData.insuranceProvider}
                                            onChange={(e) => updateField('insuranceProvider', e.target.value)}
                                            className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all text-xs font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Policy ID</Label>
                                    <Input
                                        value={currentData.policyNumber}
                                        onChange={(e) => updateField('policyNumber', e.target.value)}
                                        className="glass border-white/5 h-11 focus:border-primary/50 transition-all font-mono text-[11px]"
                                    />
                                </div>
                            </div>
                        </SettingCard>
                    </div>

                    <SettingCard title="CRITICAL MEDICAL NOTES" description="Essential information for first responders during field incidents.">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Operational Restrictions or Conditions</Label>
                            <Textarea
                                value={currentData.medicalNotes}
                                onChange={(e) => updateField('medicalNotes', e.target.value)}
                                className="glass border-white/5 min-h-[100px] focus:border-rose-500/50 transition-all resize-none text-sm leading-relaxed"
                            />
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                        <div className="flex items-center gap-3 mb-4">
                            <FileWarning className="text-rose-500" size={20} />
                            <h4 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Privacy Protocol</h4>
                        </div>
                        <p className="text-[10px] text-rose-500/70 leading-relaxed font-bold">
                            This section is end-to-end encrypted. Access is strictly logged and restricted to authorized Medical Officers.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Cross className="text-emerald-500" size={20} />
                            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Medical Record Status</p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-400">Sync Status</span>
                                <span className="text-emerald-500 font-bold uppercase">Active</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-400">Vault Integrity</span>
                                <span className="text-emerald-500 font-bold">100%</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-zinc-400">Last Verified</span>
                                <span className="text-zinc-500 font-mono">2024-02-10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
