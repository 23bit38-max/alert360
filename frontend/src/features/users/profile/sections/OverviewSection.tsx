import { Shield, BadgeCheck, Activity, FileText, MapPin, Clock, Star, Zap } from 'lucide-react';
import { SettingCard } from '@/features/users/profile/components/SettingCard';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/core/auth/AuthContext';

export const OverviewSection = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Personnel Profile Hero */}
                <div className="lg:col-span-8">
                    <div className="relative overflow-hidden p-8 rounded-[2rem] glass border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                        <div className="absolute top-0 right-0 p-6 opacity-20">
                            <Shield size={120} className="text-primary rotate-12" />
                        </div>

                        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="w-24 h-24 rounded-3xl bg-zinc-900 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-3xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                {user?.name?.[0] || 'A'}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-black text-white tracking-tight">{user?.name || 'Aryan Sharma'}</h2>
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px] px-2 py-0.5">ACTIVE DUTY</Badge>
                                </div>
                                <p className="text-zinc-400 text-sm font-bold flex items-center gap-2 mb-4">
                                    <BadgeCheck size={16} className="text-primary" />
                                    Senior Response Coordinator • AID-99283-X
                                </p>
                                <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> Mumbai Sector 7</span>
                                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> 08:00 - 16:00 (Alpha)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Snapshot */}
                <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] glass border-white/5 bg-white/[0.01] flex flex-col justify-between">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Incidents</p>
                        <div>
                            <p className="text-3xl font-black text-white leading-none">1.4K</p>
                            <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% vs last mth</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-[2rem] glass border-white/5 bg-white/[0.01] flex flex-col justify-between">
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Efficiency</p>
                        <div>
                            <p className="text-3xl font-black text-white leading-none">98%</p>
                            <p className="text-[10px] text-primary font-bold mt-1">Grade: A+</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SettingCard title="OPERATIONAL COMPLIANCE" description="Mandatory security benchmarks.">
                    <div className="space-y-4 pt-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">Security Audit</span>
                            <span className="text-emerald-500 font-black text-[10px]">PASSED</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: Shield, color: 'text-emerald-500' },
                                { icon: BadgeCheck, color: 'text-emerald-500' },
                                { icon: Zap, color: 'text-emerald-500' }
                            ].map((item, i) => (
                                <div key={i} className="h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                                    <item.icon size={16} className={item.color} />
                                </div>
                            ))}
                        </div>
                    </div>
                </SettingCard>

                <SettingCard title="RECENT CREDENTIALS" description="Latest verified documents.">
                    <div className="space-y-3">
                        {[
                            { name: 'National ID', date: '2024-02-10' },
                            { name: 'Tactical Permit', date: '2024-01-15' }
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <FileText size={16} className="text-zinc-500" />
                                <div>
                                    <p className="text-[11px] font-bold text-white">{doc.name}</p>
                                    <p className="text-[9px] text-zinc-500 font-mono">Verified • {doc.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SettingCard>

                <SettingCard title="SERVICE ACHIEVEMENTS">
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                            <Star size={16} className="text-amber-500 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-white tracking-widest uppercase">Honors</p>
                            <p className="text-xs font-black text-white mt-1">4 Medals</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                            <Activity size={16} className="text-emerald-500 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-white tracking-widest uppercase">Response</p>
                            <p className="text-xs font-black text-white mt-1">3.2s Avg</p>
                        </div>
                    </div>
                </SettingCard>
            </div>
        </div>
    );
};
