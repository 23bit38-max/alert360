import { useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { BadgeCheck, Building2, CreditCard, MapPin, Briefcase, FileText, Download, Users, Clock, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/features/users/profile/components/SectionHeader';
import { SettingCard } from '@/features/users/profile/components/SettingCard';
import { useUnsavedChanges } from '@/features/settings/system-settings/hooks/useUnsavedChanges';
import type { ProfileProfessionalData } from '@/features/users/profile/types/index';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface ProfessionalSectionProps {
    onDirtyChange: (isDirty: boolean) => void;
}

export const ProfessionalSection = ({ onDirtyChange }: ProfessionalSectionProps) => {
    const { user } = useAuth();

    const initialData: ProfileProfessionalData = {
        department: user?.department || 'Emergency Response & Traffic Control',
        badgeId: (user as any)?.badgeId || 'AID-99283-X',
        title: 'Senior Response Coordinator',
        assignedZones: user?.assignedZones || ['Mumbai Sector 4', 'Western Express Highway'],
        role: (user?.role as any) || 'Operator',
        clearanceLevel: 4,
        documents: [
            { type: 'National ID', idNumber: 'XXXX-XXXX-4421', issueDate: '2022-01-10', status: 'Verified' },
            { type: 'Departmental NDA', idNumber: 'NDA-A360-992', issueDate: '2024-02-28', status: 'Verified' },
            { type: 'Firearms Permit', idNumber: 'WP-99281-B', issueDate: '2023-05-15', expiryDate: '2026-05-15', status: 'Verified' },
        ],
        manager: {
            name: 'Cmdr. Vikram Singh',
            id: 'OPS-DIR-001',
        },
        shiftTiming: '08:00 - 16:00 (Alpha Shift)',
    };

    const { currentData, isDirty, updateField } = useUnsavedChanges<ProfileProfessionalData>(initialData);

    useEffect(() => {
        onDirtyChange(isDirty);
    }, [isDirty, onDirtyChange]);

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Professional Credentials"
                description="Tactical role assignment, jurisdictional authority, and verified credentials. This section defines your operational mandate."
                icon={<BadgeCheck size={24} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <SettingCard title="CORE ASSIGNMENT">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Primary Department</Label>
                                <div className="relative">
                                    <Building2 size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.department}
                                        onChange={(e) => updateField('department', e.target.value)}
                                        className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Official Title</Label>
                                <div className="relative">
                                    <Briefcase size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.title}
                                        onChange={(e) => updateField('title', e.target.value)}
                                        className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Badge ID (Permanent)</Label>
                                <div className="relative">
                                    <CreditCard size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.badgeId}
                                        readOnly
                                        className="glass border-white/5 h-11 pl-10 opacity-60 cursor-not-allowed font-mono text-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Current Shift</Label>
                                <div className="relative">
                                    <Clock size={14} className="absolute left-3 top-3.5 text-zinc-500" />
                                    <Input
                                        value={currentData.shiftTiming}
                                        onChange={(e) => updateField('shiftTiming', e.target.value)}
                                        className="glass border-white/5 h-11 pl-10 focus:border-primary/50 transition-all font-mono text-[11px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="ORGANIZATIONAL HIERARCHY" description="Reporting line and team oversight.">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-primary/20 flex items-center justify-center text-primary font-bold">
                                        VS
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-zinc-500 uppercase font-black tracking-widest">Reporting Manager</p>
                                        <p className="text-sm text-white font-bold">{currentData.manager.name}</p>
                                        <p className="text-[10px] text-zinc-400 font-mono">{currentData.manager.id}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                    <ChevronRight size={16} />
                                </Button>
                            </div>

                            <div className="flex-1 p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-zinc-500 uppercase font-black tracking-widest">Team Assignment</p>
                                        <p className="text-sm text-white font-bold">Alpha Strike Unit</p>
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">8 Personnel</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="OFFICIAL DOCUMENTATION" description="Verified identification and legal agreements on file.">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentData.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] text-white font-bold uppercase tracking-wider">{doc.type}</p>
                                            <p className="text-[9px] text-zinc-500">{doc.idNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-bold">{doc.status}</Badge>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white">
                                            <Download size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full h-auto py-3 border-dashed border-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5">
                                + UPLOAD NEW CREDENTIAL
                            </Button>
                        </div>
                    </SettingCard>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <SettingCard title="ASSIGNED JURISDICTIONS" description="Sectors and zones under your active monitoring responsibility.">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {currentData.assignedZones.map((zone, idx) => (
                                    <Badge key={idx} className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 text-[9px] font-bold tracking-tight">
                                        {zone}
                                    </Badge>
                                ))}
                            </div>
                            <div className="pt-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin size={12} className="text-zinc-500" />
                                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Active Perimeter</span>
                                </div>
                                <div className="h-[120px] rounded-xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-600 italic text-[10px] relative overflow-hidden">
                                    Tactical Map Overlay (Restricted)
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </SettingCard>

                    <SettingCard title="CLEARANCE STATUS">
                        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mb-2 border border-amber-500/20">
                                <span className="text-xl font-black">L{currentData.clearanceLevel}</span>
                            </div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Operational Level</h4>
                            <p className="text-[10px] text-zinc-500 mt-2">Authorized for Level 4 Data Clusters and Real-time Decryption.</p>
                        </div>
                        <Button className="w-full mt-4 h-9 bg-zinc-800 hover:bg-zinc-700 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                            Request Level Upgrade
                        </Button>
                    </SettingCard>
                </div>
            </div>
        </div>
    );
};
