import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '..//ui/scroll-area';
import {
  Users,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  DollarSign,
  Shield,
  Mail,
  Building,
  BadgeCheck,
} from 'lucide-react';
import { PENDING_USER_APPROVALS, PENDING_CAMERA_APPROVALS } from '../../data/data';
import { toast } from 'sonner';

export const Approvals = () => {
  const { user } = useAuth();
  const [selectedUserRequest, setSelectedUserRequest] = useState<(typeof PENDING_USER_APPROVALS)[number] | null>(null);
  const [selectedCameraRequest, setSelectedCameraRequest] = useState<(typeof PENDING_CAMERA_APPROVALS)[number] | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Only Super Admins can access this page
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="p-8 page-container flex items-center justify-center min-h-[60vh]">
        <Card className="glass border-white/5 max-w-md w-full p-8 text-center premium-shadow rounded-[32px]">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Authorization failure. This terminal is restricted to Level 4 Super Administrators only.
          </p>
        </Card>
      </div>
    );
  }

  // Statistics for dashboard overview
  const userStats = {
    pending: PENDING_USER_APPROVALS.filter(req => String((req as any).status) === 'pending').length,
    underReview: PENDING_USER_APPROVALS.filter(req => String((req as any).status) === 'under_review').length,
  };

  const cameraStats = {
    pending: PENDING_CAMERA_APPROVALS.filter(req => String((req as any).status) === 'pending').length,
    underReview: PENDING_CAMERA_APPROVALS.filter(req => String((req as any).status) === 'under_review').length,
    total: PENDING_CAMERA_APPROVALS.length
  };

  const handleUserApproval = async (_id: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success(action === 'approve' ? 'Access Authorized' : 'Access Denied');
      setIsProcessing(false);
      setSelectedUserRequest(null);
      setReviewComment('');
    }, 1500);
  };

  const handleCameraApproval = async (_id: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success(action === 'approve' ? 'Installation Approved' : 'Installation Rejected');
      setIsProcessing(false);
      setSelectedCameraRequest(null);
      setReviewComment('');
    }, 1500);
  };

  return (
    <div className="page-container animate-in fade-in duration-1000 max-w-[1600px] mx-auto pb-12">
      {/* Tactical Header */}
      {/* Authorization Operational Bar */}
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Council Terminal: </span>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Level 4 Clearance</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-[9px] font-black tracking-[0.2em] uppercase rounded-lg">
            Vetting Protocol Active
          </Badge>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'User Requests', value: userStats.pending, icon: Users, color: '#10B981' },
          { label: 'Camera Nodes', value: cameraStats.pending, icon: Camera, color: '#3B82F6' },
          { label: 'Under Review', value: userStats.underReview + cameraStats.underReview, icon: Clock, color: '#F59E0B' },
          { label: 'Total Matrix', value: PENDING_USER_APPROVALS.length + cameraStats.total, icon: BadgeCheck, color: '#8B5CF6' }
        ].map((stat, i) => (
          <Card key={i} className="glass border-white/5 rounded-[24px] premium-shadow group hover:bg-white/5 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-5">
                <div
                  className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                  style={{ color: stat.color }}
                >
                  <stat.icon size={28} />
                </div>
                <div>
                  <div className="text-3xl font-black text-white tracking-tighter leading-none mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Approval Portal */}
      <Tabs defaultValue="users" className="space-y-8">
        <TabsList className="glass border-white/10 p-1.5 rounded-2xl h-16 shadow-2xl">
          <TabsTrigger
            value="users"
            className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest transition-all gap-3"
          >
            <Users size={16} /> User Vetting
            {userStats.pending > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-md text-[8px]">{userStats.pending}</span>}
          </TabsTrigger>
          <TabsTrigger
            value="cameras"
            className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest transition-all gap-3"
          >
            <Camera size={16} /> Field Nodes
            {cameraStats.pending > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-md text-[8px]">{cameraStats.pending}</span>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          {PENDING_USER_APPROVALS.length === 0 ? (
            <div className="glass border-white/5 border-dashed rounded-[32px] p-20 text-center opacity-30">
              <Users size={64} className="mx-auto mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest">Protocol Clean</h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {PENDING_USER_APPROVALS.map((request) => (
                <Card key={request.id} className="glass border-white/5 rounded-[28px] overflow-hidden premium-shadow group hover:bg-white/5 transition-all">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      <div className="w-20 h-20 rounded-[22px] bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-black text-primary shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        {request.fullName.charAt(0)}
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-bold text-white tracking-tight">{request.fullName}</h3>
                          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                            {request.status}
                          </Badge>
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                            {request.urgency} Priority
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                          <div className="flex items-center gap-2"><Mail size={14} className="text-primary" /> {request.email}</div>
                          <div className="flex items-center gap-2"><Building size={14} className="text-primary" /> {request.department} Dept</div>
                          <div className="flex items-center gap-2"><BadgeCheck size={14} className="text-primary" /> {request.position}</div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-14 px-8 rounded-2xl glass border-white/10 hover:bg-primary hover:text-white hover:border-primary text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                            onClick={() => setSelectedUserRequest(request)}
                          >
                            <Eye size={18} className="mr-2" /> Vetting Portal
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 max-w-2xl rounded-[32px] premium-shadow">
                          <DialogHeader className="space-y-2 pb-6 border-b border-white/5">
                            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Security Dossier</DialogTitle>
                            <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Reviewing authorization request for Level 3 clearance</DialogDescription>
                          </DialogHeader>

                          {selectedUserRequest && (
                            <ScrollArea className="max-h-[60vh] pr-4 mt-6">
                              <div className="space-y-8">
                                <section className="space-y-4">
                                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Credentials</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {[
                                      { label: 'Role Type', value: selectedUserRequest.requestedRole },
                                      { label: 'Zone Access', value: selectedUserRequest.requestedZones.join(', ') },
                                      { label: 'Emergency ID', value: selectedUserRequest.emergencyId },
                                      { label: 'Submitted', value: selectedUserRequest.submittedAt.toLocaleDateString() }
                                    ].map((item, i) => (
                                      <div key={i} className="glass border-white/5 p-4 rounded-xl">
                                        <div className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">{item.label}</div>
                                        <div className="text-xs font-bold text-white uppercase">{item.value}</div>
                                      </div>
                                    ))}
                                  </div>
                                </section>

                                <section className="space-y-4">
                                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Justification</h4>
                                  <div className="glass border-white/5 p-5 rounded-2xl text-xs font-medium text-white/80 leading-relaxed italic">
                                    "{selectedUserRequest.reason}"
                                  </div>
                                </section>

                                <section className="space-y-4">
                                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Vetting Actions</h4>
                                  <Textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Enter authorization notes or rejection reasoning..."
                                    className="glass border-white/5 rounded-[20px] bg-black/20 text-xs font-medium p-6 min-h-[120px]"
                                  />
                                </section>

                                <div className="flex gap-4 pt-4">
                                  <Button
                                    onClick={() => handleUserApproval(selectedUserRequest.id, 'reject')}
                                    disabled={isProcessing}
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl glass border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
                                  >
                                    <XCircle size={18} className="mr-2" /> Deny Access
                                  </Button>
                                  <Button
                                    onClick={() => handleUserApproval(selectedUserRequest.id, 'approve')}
                                    disabled={isProcessing}
                                    className="flex-1 h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
                                  >
                                    <CheckCircle size={18} className="mr-2" /> Authorize
                                  </Button>
                                </div>
                              </div>
                            </ScrollArea>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cameras" className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
          {PENDING_CAMERA_APPROVALS.length === 0 ? (
            <div className="glass border-white/5 border-dashed rounded-[32px] p-20 text-center opacity-30">
              <Camera size={64} className="mx-auto mb-6" />
              <h3 className="text-xl font-bold uppercase tracking-widest">Matrix Unified</h3>
            </div>
          ) : (
            <div className="grid gap-6">
              {PENDING_CAMERA_APPROVALS.map((request) => (
                <Card key={request.id} className="glass border-white/5 rounded-[28px] overflow-hidden premium-shadow group hover:bg-white/5 transition-all">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                      <div className="w-20 h-20 rounded-[22px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                        <Camera size={40} />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-bold text-white tracking-tight">{request.location}</h3>
                          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                            Node Request
                          </Badge>
                          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                            {request.priority} Priority
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
                          <div className="flex items-center gap-2"><BadgeCheck size={14} className="text-blue-500" /> Requester: {request.requesterName}</div>
                          <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /> Sector: {request.zone}</div>
                          <div className="flex items-center gap-2"><DollarSign size={14} className="text-blue-500" /> Est: ₹{request.estimatedCost.toLocaleString()}</div>
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-14 px-8 rounded-2xl glass border-white/10 hover:bg-blue-500 hover:text-white hover:border-blue-500 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl"
                            onClick={() => setSelectedCameraRequest(request)}
                          >
                            <Eye size={18} className="mr-2" /> Node Dossier
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass border-white/10 max-w-3xl rounded-[32px] premium-shadow">
                          <DialogHeader className="space-y-2 pb-6 border-b border-white/5">
                            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">Installation Protocol</DialogTitle>
                            <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Evaluating field node deployment matrix</DialogDescription>
                          </DialogHeader>

                          {selectedCameraRequest && (
                            <ScrollArea className="max-h-[60vh] pr-4 mt-6">
                              <div className="space-y-8">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                  {[
                                    { label: 'Type', value: selectedCameraRequest.installationType },
                                    { label: 'Res', value: selectedCameraRequest.technicalSpecs.resolution },
                                    { label: 'Night', value: selectedCameraRequest.technicalSpecs.nightVision ? 'Enabled' : 'Disabled' },
                                    { label: 'Weather', value: selectedCameraRequest.technicalSpecs.weatherProof }
                                  ].map((item, i) => (
                                    <div key={i} className="glass border-white/5 p-4 rounded-xl text-center">
                                      <div className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">{item.label}</div>
                                      <div className="text-[10px] font-black text-white uppercase">{item.value}</div>
                                    </div>
                                  ))}
                                </div>

                                <section className="space-y-4">
                                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">AI Integration Matrix</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedCameraRequest.technicalSpecs.aiCapabilities.map((cap, i) => (
                                      <Badge key={i} className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] font-black uppercase tracking-widest px-3 py-1">
                                        {cap.replace('_', ' ')}
                                      </Badge>
                                    ))}
                                  </div>
                                </section>

                                <section className="space-y-4">
                                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Operational Notes</h4>
                                  <Textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Enter technical review or deployment scheduling notes..."
                                    className="glass border-white/5 rounded-[20px] bg-black/20 text-xs font-medium p-6 min-h-[120px]"
                                  />
                                </section>

                                <div className="flex gap-4 pt-4">
                                  <Button
                                    onClick={() => handleCameraApproval(selectedCameraRequest.id, 'reject')}
                                    disabled={isProcessing}
                                    variant="outline"
                                    className="flex-1 h-14 rounded-2xl glass border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
                                  >
                                    <XCircle size={18} className="mr-2" /> Block Node
                                  </Button>
                                  <Button
                                    onClick={() => handleCameraApproval(selectedCameraRequest.id, 'approve')}
                                    disabled={isProcessing}
                                    className="flex-1 h-14 rounded-2xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:scale-105 transition-all"
                                  >
                                    <CheckCircle size={18} className="mr-2" /> Authorize Deploy
                                  </Button>
                                </div>
                              </div>
                            </ScrollArea>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
