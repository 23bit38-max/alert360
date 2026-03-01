import { useState, useEffect } from 'react';
import { useTheme, GlobalStyles } from '@/core/theme';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useAuth } from '@/core/auth/AuthContext';
import { Card } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Users,
  Camera,
  History,
  Lock,
} from 'lucide-react';
import {
  StatsSection,
  UserVettingSection,
  CameraDeploymentSection,
  HistorySection
} from '@/features/settings/approvals/sections';

export const Approvals = () => {
  const { user } = useAuth();
  useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen message="Initializing Vetting Terminal..." />;
  }

  // Access Control: Strict Super Admin Only
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="p-8 flex items-center justify-center min-h-[70vh]">
        <Card className="glass border-white/10 max-w-md w-full p-10 text-center premium-shadow rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <Lock className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-4">Access Denied</h2>
          <p className="text-zinc-400 text-sm font-bold leading-relaxed uppercase tracking-widest opacity-80 mb-8">
            Operational failure. This terminal is restricted to Council-Level Administrators only.
          </p>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Attempt Logged • Protocol 0x82...F92
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={GlobalStyles.pageContainer} className="relative min-h-screen pb-20">
      <div className="pt-4" />

      {/* Top Matrix Stats */}
      <StatsSection />

      {/* Approval Tabular Interface */}
      <Tabs defaultValue="personnel" className="space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <TabsList className="glass border-white/10 p-1.5 rounded-[24px] h-18 w-full lg:w-auto shadow-2xl backdrop-blur-3xl">
            <TabsTrigger
              value="personnel"
              className="flex-1 lg:min-w-[200px] h-14 rounded-[20px] data-[state=active]:bg-primary data-[state=active]:text-white text-[10px] font-black uppercase tracking-[2px] transition-all gap-3"
            >
              <Users size={18} /> Personnel Vetting
            </TabsTrigger>
            <TabsTrigger
              value="nodes"
              className="flex-1 lg:min-w-[200px] h-14 rounded-[20px] data-[state=active]:bg-blue-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-[2px] transition-all gap-3"
            >
              <Camera size={18} /> Node Deployment
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 lg:min-w-[200px] h-14 rounded-[20px] data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-[10px] font-black uppercase tracking-[2px] transition-all gap-3"
            >
              <History size={18} /> Audit Archive
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4 px-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1220] bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin${i}`} alt="Admin" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#0B1220] bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                +2
              </div>
            </div>
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Command Board Online</div>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <TabsContent value="personnel" className="m-0 focus-visible:outline-none">
            <UserVettingSection />
          </TabsContent>

          <TabsContent value="nodes" className="m-0 focus-visible:outline-none">
            <CameraDeploymentSection />
          </TabsContent>

          <TabsContent value="history" className="m-0 focus-visible:outline-none">
            <HistorySection />
          </TabsContent>
        </div>
      </Tabs>

      {/* Tactical Floating Background Decoration */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 opacity-20 pointer-events-none" />
    </div>
  );
};
