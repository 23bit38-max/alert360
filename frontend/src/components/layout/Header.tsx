import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  ChevronDown,
  Wifi,
  Database,
  ShieldCheck,
  Clock,
  Circle
} from "lucide-react";
import { useTheme } from "../../theme";
import type { PageType } from "./DashboardLayout";

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  sidebarCollapsed: boolean;
  isMobile: boolean;
  onToggleMobileSidebar: () => void;
}

// Simple notifications list
const RECENT_ALERTS = [
  { id: 1, type: 'critical', msg: 'Unauthorized access in Lobby', time: '2m ago' },
  { id: 2, type: 'update', msg: 'System update completed', time: '1h ago' },
  { id: 3, type: 'warning', msg: 'Battery low on Camera 12', time: '3h ago' },
];

export const Header = ({
  currentPage,
  setCurrentPage,
  isMobile,
  sidebarCollapsed,
  onToggleMobileSidebar
}: HeaderProps) => {
  const { user, logout } = useAuth();
  useTheme();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getPageTitle = (page: string) => {
    const titles: { [key: string]: string } = {
      dashboard: "Main Overview",
      cameras: "Live Feeds",
      alerts: "Alert History",
      map: "Site Map",
      incidents: "Past Events",
      approvals: "Review Tasks",
      reports: "Data Reports",
      users: "User List",
      settings: "System Settings",
      profile: "My Account",
    };
    return titles[page] || "Control Center";
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f172a]/70 backdrop-blur-xl">
      <div
        className="flex items-center justify-between px-8 h-20 transition-all duration-300 ease-in-out"
        style={{ paddingLeft: isMobile ? '1.5rem' : sidebarCollapsed ? 'calc(80px + 2rem)' : 'calc(288px + 2rem)' }}
      >
        
        {/* --- LEFT: LOGO & PAGE TITLE --- */}
        <div className="flex items-center space-x-6">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleMobileSidebar}
              className="bg-white/5 text-white hover:bg-primary/20 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          <div className="flex flex-col border-l-2 border-primary/40 pl-4">
            <h1 className="text-xl font-black text-white uppercase tracking-wider leading-none">
              {getPageTitle(currentPage)}
            </h1>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Station: Mumbai</span>
              <Circle size={4} className="fill-primary text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* --- RIGHT: ACTIONS & ACCOUNT --- */}
        <div className="flex items-center space-x-4">
          
          {/* Quick System Stats */}
          <div className="hidden xl:flex items-center space-x-6 mr-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center text-primary space-x-1">
                <Wifi size={12} />
                <span className="text-[11px] font-black">{isOnline ? 'LIVE' : 'OFF'}</span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Network</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center text-white space-x-1">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span className="text-[11px] font-black">SECURE</span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Status</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center text-white space-x-1">
                <Clock size={12} className="text-slate-400" />
                <span className="text-[11px] font-black">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase">Local Time</span>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Enhanced Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative bg-white/5 border border-white/5 hover:border-primary/50 text-slate-400 hover:text-white rounded-xl h-11 w-11 transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-[#0f172a] shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-slate-900 border-white/10 rounded-[24px] p-2 mt-4 shadow-2xl backdrop-blur-2xl">
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-xs font-black text-white uppercase tracking-widest">Recent Activity</span>
                <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <div className="space-y-1 py-2">
                {RECENT_ALERTS.map((alert) => (
                  <DropdownMenuItem key={alert.id} className="flex flex-col items-start p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                    <div className="flex justify-between w-full items-center mb-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        alert.type === 'critical' ? 'bg-red-500 text-white' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-200 leading-snug">{alert.msg}</p>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-white/5" />
              <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:text-white hover:bg-primary/10 rounded-xl py-3">
                Clear All Notifications
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group flex items-center space-x-3 p-1 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all duration-300"
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 rounded-xl border border-white/10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-700 text-white text-xs font-black rounded-xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-[#0f172a]" />
                </div>
                {!isMobile && (
                  <div className="text-left pr-2">
                    <p className="text-[11px] font-black text-white uppercase tracking-wider leading-none">{user.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Super Admin</p>
                  </div>
                )}
                <ChevronDown size={14} className="text-slate-500 group-hover:text-white transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-slate-900 border-white/10 rounded-[24px] p-2 mt-4 shadow-2xl backdrop-blur-2xl">
              <div className="p-4 bg-primary/5 rounded-2xl mb-2 border border-primary/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-xs font-black text-white truncate">{user.email}</p>
              </div>
              <div className="p-1 space-y-1">
                <DropdownMenuItem onClick={() => setCurrentPage('profile')} className="rounded-xl hover:bg-white/5 py-3 cursor-pointer group transition-all">
                  <User className="mr-3 h-4 w-4 text-slate-500 group-hover:text-primary" />
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white">My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentPage('settings')} className="rounded-xl hover:bg-white/5 py-3 cursor-pointer group transition-all">
                  <Settings className="mr-3 h-4 w-4 text-slate-500 group-hover:text-primary" />
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 mx-2" />
                <DropdownMenuItem onClick={logout} className="rounded-xl hover:bg-red-500/10 text-red-400 py-3 cursor-pointer transition-all">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-xs font-black uppercase">Logout</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};