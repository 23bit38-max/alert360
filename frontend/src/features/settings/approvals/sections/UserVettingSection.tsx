import { useState, useEffect } from 'react';
import type { UserApprovalRequest } from '@/features/settings/approvals/types/index';
import { User, Mail, Building, BadgeCheck, MapPin, Shield, Calendar, Phone, Activity } from 'lucide-react';
import { RequestCard } from '@/features/settings/approvals/components/RequestCard';
import { fetchUserApprovals } from '@/services/firebase.service';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { LoadingScreen } from '@/shared/components/LoadingScreen';

export const UserVettingSection: React.FC = () => {
    const [selectedRequest, setSelectedRequest] = useState<UserApprovalRequest | null>(null);
    const [approvals, setApprovals] = useState<UserApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const loadApprovals = async () => {
        try {
            setLoading(true);
            const data = await fetchUserApprovals();

            if (data) {
                const mapped: UserApprovalRequest[] = data.map(r => ({
                    id: r.id,
                    fullName: r.fullName,
                    email: r.email,
                    department: r.department,
                    position: r.position,
                    phoneNumber: r.phoneNumber,
                    employeeId: r.employeeId,
                    justification: r.justification,
                    urgency: r.urgency as any,
                    status: r.status as any,
                    requestedRole: r.requestedRole,
                    requestedZones: r.requestedZones,
                    documents: r.documents || [],
                    submittedAt: r.submittedAt?.toDate?.() || r.submittedAt,
                    reviews: r.reviews || []
                }));
                setApprovals(mapped);
            }
        } catch (e) {
            console.error('Failed to load user approvals:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApprovals();
    }, []);

    const handleViewProfile = (request: any) => {
        setSelectedRequest(request as UserApprovalRequest);
    };

    if (loading) return <div className="h-64 flex items-center justify-center"><LoadingScreen message="Accessing Vetting Records..." /></div>;

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {approvals.length === 0 ? (
                    <div className="text-center py-20 glass border-white/5 rounded-[32px]">
                        <User size={48} className="mx-auto text-zinc-700 mb-4" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-widest">No Active Requests</h3>
                        <p className="text-xs text-zinc-500 mt-2">The vetting queue is currently clear.</p>
                    </div>
                ) : (
                    approvals.map((request: any) => (
                        <RequestCard
                            key={request.id}
                            id={request.id}
                            title={request.fullName}
                            subtitle={request.email}
                            status={request.status}
                            urgency={request.urgency}
                            timestamp={request.submittedAt}
                            department={request.department || 'OPERATIONS'}
                            icon={User}
                            onView={() => handleViewProfile(request)}
                            metadata={[
                                { label: 'ROLE', value: (request.requestedRole || 'USER').replace('_', ' ').toUpperCase(), icon: Shield },
                                { label: 'ZONES', value: (request.requestedZones || []).join(', ').toUpperCase() || 'NONE', icon: MapPin },
                                { label: 'ID', value: request.employeeId || 'N/A', icon: BadgeCheck },
                                { label: 'MOBILE', value: request.phoneNumber || 'N/A', icon: Phone }
                            ]}
                        />
                    ))
                )}
            </div>

            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="glass border-white/10 max-w-3xl rounded-[32px] premium-shadow p-0 overflow-hidden bg-[#0B1220]/95 backdrop-blur-3xl">
                    {selectedRequest && (
                        <div className="flex flex-col h-[85vh]">
                            {/* Profile Header */}
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-20 h-20 rounded-[28px] bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-2xl">
                                            <Shield size={40} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedRequest.fullName}</h2>
                                                <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                                                    Level {selectedRequest.requestedRole === 'super_admin' ? '3' : '2'} Clearance
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-bold text-zinc-400 tracking-[0.2em] uppercase">
                                                ID: {selectedRequest.id} • {selectedRequest.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Authorization Priority</div>
                                        <div className={`px-3 py-1 rounded-lg ${selectedRequest.urgency === 'critical' ? 'bg-red-500' : 'bg-primary'} text-white text-[9px] font-black uppercase tracking-widest border-0`}>
                                            {selectedRequest.urgency} Priority
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-10">
                                    {/* Operational Metadata */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <section className="space-y-4">
                                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                                <Activity size={12} /> Access Parameters
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Primary Department', value: selectedRequest.department, icon: Building },
                                                    { label: 'Requested Role', value: selectedRequest.requestedRole, icon: Shield },
                                                    { label: 'Personnel ID', value: selectedRequest.employeeId || 'NOT ASSIGNED', icon: BadgeCheck },
                                                    { label: 'Assigned Zones', value: (selectedRequest.requestedZones || []).join(', '), icon: MapPin }
                                                ].map((item, i) => (
                                                    <div key={i} className="glass border-white/5 p-4 rounded-2xl group hover:bg-white/[0.03] transition-all">
                                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2">
                                                            <item.icon size={10} className="text-primary" /> {item.label}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-white uppercase">{item.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                                <Calendar size={12} /> Request Timeline
                                            </h4>
                                            <div className="glass border-white/5 p-5 rounded-[24px] space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Submission Date</span>
                                                    <span className="text-[11px] font-black text-white">{new Date(selectedRequest.submittedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Mobile Auth</span>
                                                    <span className="text-[11px] font-black text-white">{selectedRequest.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Operational Justification */}
                                    <section className="space-y-4">
                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Operational Rationale</h4>
                                        <div className="glass border-white/5 p-6 rounded-[28px] relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                            <p className="text-xs font-semibold text-zinc-300 leading-relaxed italic">
                                                "{selectedRequest.justification}"
                                            </p>
                                        </div>
                                    </section>

                                    {/* Document Verification */}
                                    <section className="space-y-4">
                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Submitted Credentials</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(selectedRequest.documents || []).map((doc, i) => (
                                                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                                                            <Mail size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-white uppercase tracking-tight">{doc.name}</p>
                                                            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">{doc.type}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-[9px] font-black text-primary hover:bg-primary/10 tracking-widest">
                                                        VERIFY
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </ScrollArea>

                            {/* Action Footer */}
                            <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl flex gap-4">
                                <Button className="flex-1 h-14 rounded-2xl glass border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl">
                                    Deny Access
                                </Button>
                                <Button className="flex-1 h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl hover:scale-[1.02]">
                                    Authorize Access
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
