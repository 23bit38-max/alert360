import { useState } from 'react';
import type { CameraApprovalRequest } from '@/features/settings/approvals/types/index';
import { Camera, MapPin, BadgeCheck, DollarSign, Activity, Cpu, Wind, Video, Layers } from 'lucide-react';
import { RequestCard } from '@/features/settings/approvals/components/RequestCard';
import { PENDING_CAMERA_APPROVALS } from '@/data/data';
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

export const CameraDeploymentSection: React.FC = () => {
    const [selectedRequest, setSelectedRequest] = useState<CameraApprovalRequest | null>(null);

    const handleViewDetail = (request: any) => {
        setSelectedRequest(request as CameraApprovalRequest);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {PENDING_CAMERA_APPROVALS.map((request: any) => (
                    <RequestCard
                        key={request.id}
                        id={request.id}
                        title={request.location}
                        subtitle={request.installationType}
                        status={request.status}
                        urgency={request.priority}
                        timestamp={request.submittedAt}
                        department="DEPLOYMENT"
                        icon={Camera}
                        onView={() => handleViewDetail(request)}
                        metadata={[
                            { label: 'REQUESTER', value: request.requesterName, icon: BadgeCheck },
                            { label: 'SECTOR', value: request.zone.toUpperCase(), icon: MapPin },
                            { label: 'EST. COST', value: `₹${request.estimatedCost.toLocaleString()}`, icon: DollarSign },
                            { label: 'AI NODES', value: request.technicalSpecs.aiCapabilities.length, icon: Activity }
                        ]}
                    />
                ))}
            </div>

            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="glass border-white/10 max-w-3xl rounded-[32px] premium-shadow p-0 overflow-hidden bg-[#0B1220]/95 backdrop-blur-3xl">
                    {selectedRequest && (
                        <div className="flex flex-col h-[85vh]">
                            {/* Deployment Header */}
                            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-transparent">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-20 h-20 rounded-[28px] bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 shadow-2xl">
                                            <Camera size={40} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedRequest.location}</h2>
                                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                                                    NODE INSTALL
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] font-bold text-zinc-400 tracking-[0.2em] uppercase">
                                                SECTOR: {selectedRequest.zone} • {selectedRequest.installationType}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Authorization Priority</div>
                                        <Badge className={`${selectedRequest.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'} text-white text-[9px] font-black uppercase tracking-widest border-0`}>
                                            {selectedRequest.priority} Priority
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="space-y-10">
                                    {/* Technical Specification Matrix */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <section className="space-y-4">
                                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-2">
                                                <Cpu size={12} /> Hardware Blueprint
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Optical Resolution', value: selectedRequest.technicalSpecs.resolution, icon: Video },
                                                    { label: 'Night Vision', value: selectedRequest.technicalSpecs.nightVision ? 'Enabled (IR)' : 'Disabled', icon: Activity },
                                                    { label: 'Ingress Protection', value: selectedRequest.technicalSpecs.weatherProof, icon: Wind },
                                                    { label: 'AI Processing', value: 'Edge Compute (v2)', icon: Layers }
                                                ].map((item, i) => (
                                                    <div key={i} className="glass border-white/5 p-4 rounded-2xl group hover:bg-white/[0.03] transition-all">
                                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2">
                                                            <item.icon size={10} className="text-blue-500" /> {item.label}
                                                        </div>
                                                        <div className="text-[11px] font-bold text-white uppercase">{item.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="space-y-4">
                                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] flex items-center gap-2">
                                                <Activity size={12} /> AI Capability Matrix
                                            </h4>
                                            <div className="glass border-white/5 p-5 rounded-[24px] space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedRequest.technicalSpecs.aiCapabilities.map((cap, i) => (
                                                        <Badge key={i} className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
                                                            {cap.replace('_', ' ')}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Est. Deployment Cost</span>
                                                    <span className="text-sm font-black text-white">₹{selectedRequest.estimatedCost.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Deployment Rationale */}
                                    <section className="space-y-4">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Operational Rationale</h4>
                                        <div className="glass border-white/5 p-6 rounded-[28px] relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500/20" />
                                            <p className="text-xs font-semibold text-zinc-300 leading-relaxed italic relative z-10">
                                                "{selectedRequest.description}"
                                            </p>
                                        </div>
                                    </section>

                                    {/* Deployment Logistics */}
                                    <section className="space-y-4">
                                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Logistics & Stakeholders</h4>
                                        <div className="p-5 rounded-[24px] bg-white/[0.02] border border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors">
                                                    <BadgeCheck size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase tracking-tight">{selectedRequest.requesterName}</p>
                                                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Field Deployment Hub Chief</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" className="text-[10px] font-black text-blue-500 hover:bg-blue-500/10 tracking-widest">
                                                VIEW CREDENTIALS
                                            </Button>
                                        </div>
                                    </section>
                                </div>
                            </ScrollArea>

                            {/* Deployment Footer */}
                            <div className="p-8 border-t border-white/5 bg-black/40 backdrop-blur-xl flex gap-4">
                                <Button className="flex-1 h-14 rounded-2xl glass border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl">
                                    Decline Request
                                </Button>
                                <Button className="flex-1 h-14 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:scale-[1.02]">
                                    Authorize Deployment
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
