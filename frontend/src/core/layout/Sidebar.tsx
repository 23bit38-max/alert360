import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useTheme } from '@/core/theme';
import { canAccessPage } from '@/shared/utils/rbac';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import {
  LayoutDashboard,
  Camera,
  AlertTriangle,
  MapPin,
  History,
  CheckSquare,
  Bell,
  BarChart3,
  Users,
  Activity,
  Zap,
  ShieldCheck,
  Cpu,
  Globe
} from 'lucide-react';
import type { PageType } from '@/core/layout/DashboardLayout';

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: any;
  badge?: number;
  roles?: string[];
  permissions?: string[];
  category?: 'core' | 'management' | 'system';
}

export const Sidebar = ({ currentPage, setCurrentPage, collapsed, mobileOpen, onCloseMobile }: SidebarProps) => {
  const { user } = useAuth();
  useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard, category: 'core' },
    { id: 'cameras', label: 'Live Cameras', icon: Camera, badge: isOnline ? 47 : 0, category: 'core' },
    { id: 'alerts', label: 'Real-time Alerts', icon: AlertTriangle, badge: 3, category: 'core' },
    { id: 'map', label: 'Map View', icon: MapPin, category: 'core' },
    { id: 'incidents', label: 'Incident History', icon: History, category: 'management' },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, roles: ['super_admin'], category: 'management' },
    { id: 'reports', label: 'Analytics', icon: BarChart3, category: 'management' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3, category: 'system' },
    { id: 'users', label: 'Users', icon: Users, roles: ['super_admin'], category: 'system' },
    { id: 'upload', label: 'Manual Upload', icon: Activity, category: 'system' }
  ];

  const filteredNavItems = navItems.filter(item => canAccessPage(user, item.id));

  const handleNavItemClick = (itemId: PageType) => {
    setCurrentPage(itemId);
    if (isMobile) onCloseMobile();
  };

  if (!user) return null;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out border-r border-white/10 shadow-[25px_0_60px_rgba(0,0,0,0.7)] overflow-hidden ${isMobile ? (mobileOpen ? 'w-[280px]' : 'w-0') : (collapsed ? 'w-20' : 'w-72')}`}
        style={{
          background: 'linear-gradient(165deg, rgba(10, 15, 28, 0.95), rgba(5, 8, 15, 0.98))',
          backdropFilter: 'blur(25px)'
        }}
      >
        {/* Subtle Scanning Line Animation */}
        <div className="absolute inset-0 w-full h-[2px] bg-primary/5 opacity-20 animate-scan pointer-events-none" />

        <div className="flex h-full flex-col relative">
          
          {/* --- SECTION 1: BRAND IDENTITY --- */}
          <div className="h-24 flex items-center px-6 border-b border-white/5 relative group cursor-pointer overflow-hidden" onClick={() => handleNavItemClick('dashboard')}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/40" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/40" />
            
            {(!collapsed || isMobile) ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-emerald-600 to-emerald-900 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-all duration-500">
                    <Zap size={24} className="text-white fill-white animate-pulse" />
                  </div>
                  <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white leading-none">ALERT<span className="text-primary italic">360</span></span>
                  <div className="flex items-center mt-1.5 space-x-1">
                    <span className="text-[8px] font-bold text-primary/70 uppercase tracking-[0.3em]">Neural Core v4.2</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <Zap size={24} className="text-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            )}
          </div>

          {/* --- SECTION 2: NAVIGATION MATRIX --- */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-6 space-y-8">
              
              {/* Category Helper Function */}
              {['core', 'management', 'system'].map((cat) => {
                const items = filteredNavItems.filter(i => i.category === cat);
                if (items.length === 0) return null;

                return (
                  <div key={cat} className="space-y-2">
                    {(!collapsed || isMobile) && (
                      <div className="flex items-center px-3 mb-3 opacity-40">
                        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-400">{cat}</span>
                        <div className="ml-4 flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavItemClick(item.id)}
                            className={`group relative flex items-center gap-4 w-full h-11 px-3 rounded-xl transition-all duration-200
                              ${isActive ? 'bg-white/[0.03] border border-white/10' : 'hover:bg-white/[0.02] border border-transparent'}
                            `}
                          >
                            {/* Active Indicator Pin */}
                            {isActive && (
                              <div className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(16,185,129,1)]" />
                            )}

                            <div className={`transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-500 group-hover:text-slate-200'}`}>
                              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                            </div>

                            {(!collapsed || isMobile) && (
                              <div className="flex-1 flex items-center justify-between overflow-hidden">
                                <span className={`text-[10px] font-bold tracking-widest uppercase truncate ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <div className={`px-1.5 py-0.5 rounded text-[9px] font-black ${item.id === 'alerts' ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                    {item.badge}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Hover Decorative Corner */}
                            <div className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-40 transition-all duration-300" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* --- SECTION 3: SYSTEM DIAGNOSTICS & USER --- */}
          <div className="mt-auto p-4 space-y-4 border-t border-white/5 bg-black/20 backdrop-blur-xl">
            
            {(!collapsed || isMobile) ? (
              <div className="space-y-4">
                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col items-center">
                    <ShieldCheck size={14} className="text-primary mb-1" />
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Encrypted</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col items-center">
                    <Globe size={14} className={isOnline ? "text-primary" : "text-red-500"} />
                    <span className="text-[8px] text-slate-500 font-bold uppercase">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>

                {/* System Health */}
                <div className="px-2 space-y-2">
                  <div className="flex justify-between text-[8px] font-black tracking-widest text-slate-400">
                    <span className="flex items-center gap-1"><Cpu size={10} /> PROCESSING POWER</span>
                    <span className="text-primary">84%</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-primary w-[84%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>

                {/* User Profile Hook */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 group hover:border-primary/40 transition-all duration-500 cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-black text-primary text-xs shadow-inner">
                      {user.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-[3px] border-slate-950 ${isOnline ? 'bg-primary' : 'bg-red-500'} shadow-lg`} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-black text-white truncate uppercase tracking-wider">{user.name}</p>
                    <p className="text-[8px] font-bold text-slate-500 truncate uppercase">Level 4 Operator</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-primary font-black cursor-pointer hover:border-primary transition-colors">
                  {user.name.charAt(0)}
                </div>
                <div className="w-1 h-8 bg-gradient-to-b from-primary/40 to-transparent rounded-full" />
              </div>
            )}
          </div>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}} />
    </>
  );
};