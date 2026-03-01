import { useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { User, Mail, MapPin, Calendar, Building2, Briefcase, Activity } from 'lucide-react';
import { SectionHeader } from '@/features/users/profile/components/SectionHeader';
import { SettingCard } from '@/features/users/profile/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { ProfilePersonalData } from '@/features/users/profile/types/index';

interface GeneralSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

export const GeneralSection = ({ onDirtyChange }: GeneralSectionProps) => {
    const { user } = useAuth();

    const initialData: ProfilePersonalData = {
        name: user?.name || 'Aryan Sharma',
        email: user?.email || 'a.sharma@alert360.gov',
        phone: (user as any)?.phone || '+91 98XXX X4421',
        bio: (user as any)?.bio || 'Senior Traffic & Emergency Response Coordinator with 8+ years of field experience in urban anomaly detection.',
        joinedDate: '2022-10-14',
        workLocation: 'Mumbai Central Operations Hub',
        employmentStatus: 'Full-time / Active',
    };

    const { currentData, isDirty, updateField } = useUnsavedChanges<ProfilePersonalData>(initialData);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Personnel Identity"
                description="Core identification and contact parameters for official departmental records."
                icon={<User size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="OFFICIAL IDENTITY">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Full Legal Name</Label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Official Email</Label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.email}
                                        readOnly
                                        className="glass border-white/5 h-11 pl-10 opacity-60 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Personnel Biography / Field Brief</Label>
                            <Input
                                value={currentData.bio}
                                onChange={(e) => updateField('bio', e.target.value)}
                                className="glass border-white/5 h-11 focus:border-primary/50 transition-all text-sm"
                            />
                        </div>
                    </SettingCard>

                    <SettingCard title="SERVICE DETAILS">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Work Location</Label>
                                <div className="relative">
                                    <MapPin size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.workLocation}
                                        onChange={(e) => updateField('workLocation', e.target.value)}
                                        className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Joined Date</Label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.joinedDate}
                                        readOnly
                                        className="glass border-white/5 h-11 pl-10 opacity-60 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="SERVICE STATUS">
                        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-primary" />
                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Employment</span>
                                </div>
                                <span className="text-[10px] text-emerald-500 font-black tracking-tighter uppercase">Active</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed">
                                Personnel is currently assigned to the Mumbai Central Operations cluster with Class A response authorization.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                <Briefcase size={16} className="mx-auto text-zinc-500 mb-2" />
                                <p className="text-[10px] font-bold text-white uppercase tracking-tight">8.2 Years</p>
                                <p className="text-[8px] text-zinc-500 uppercase font-black">Exp.</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                                <Activity size={16} className="mx-auto text-primary mb-2" />
                                <p className="text-[10px] font-bold text-white uppercase tracking-tight">Alpha</p>
                                <p className="text-[8px] text-zinc-500 uppercase font-black">Shift</p>
                            </div>
                        </div>
                    </SettingCard>

                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                        <h4 className="text-[11px] font-black text-primary uppercase tracking-widest mb-2">Record Integrity</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-bold">
                            This personnel record is cryptographically signed and verified by the Central Command.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
