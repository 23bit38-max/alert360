import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

export const HistorySection: React.FC = () => {
    const history = [
        { id: 'H001', type: 'USER', subject: 'Inspector Rajesh Kumar', action: 'APPROVED', date: '2025-02-15 14:30', reviewer: 'System Admin', impact: 'South-Mumbai Access' },
        { id: 'H002', type: 'CAMERA', subject: 'Sector 7, OMR Junction', action: 'APPROVED', date: '2025-02-14 09:15', reviewer: 'System Admin', impact: 'AI Thermal Deploy' },
        { id: 'H003', type: 'USER', subject: 'Analyst S. Verma', action: 'REJECTED', date: '2025-02-12 11:20', reviewer: 'Super Admin', impact: 'No Clearance' },
        { id: 'H004', type: 'CAMERA', subject: 'GNT Road Park', action: 'REJECTED', date: '2025-02-10 16:45', reviewer: 'System Admin', impact: 'Budget Overrun' },
        { id: 'H005', type: 'USER', subject: 'Dr. Priya Sharma', action: 'APPROVED', date: '2025-02-08 10:00', reviewer: 'System Admin', impact: 'Medical Override' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                    <Input placeholder="Search Audit Trails..." className="glass border-white/5 h-12 pl-10 focus:border-primary/50 transition-all font-medium rounded-2xl" />
                </div>
                <Button variant="outline" className="glass border-white/10 h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest gap-2">
                    <Filter size={14} /> Filter Logic
                </Button>
            </div>

            <div className="glass border-white/5 rounded-[32px] overflow-hidden premium-shadow">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol ID</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Entity Subject</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Command Action</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Reviewer</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Timestamp</th>
                                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Operational Impact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.map((item) => (
                                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="p-6 py-8">
                                        <span className="text-[11px] font-black text-zinc-500 font-mono tracking-tighter">#{item.id}</span>
                                    </td>
                                    <td className="p-6 py-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                                                <Clock size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-white tracking-tight">{item.subject}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 py-8">
                                        <Badge className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase ${item.action === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {item.action === 'APPROVED' ? <CheckCircle2 size={10} className="mr-1.5" /> : <XCircle size={10} className="mr-1.5" />}
                                            {item.action}
                                        </Badge>
                                    </td>
                                    <td className="p-6 py-8">
                                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight">{item.reviewer}</span>
                                    </td>
                                    <td className="p-6 py-8">
                                        <span className="text-xs font-bold text-zinc-400">{item.date}</span>
                                    </td>
                                    <td className="p-6 py-8">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{item.impact}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-3">Audit logs are immutable and cryptographically signed.</p>
                <Button variant="ghost" className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest">Export Full Archive (.PDF)</Button>
            </div>
        </div>
    );
};
