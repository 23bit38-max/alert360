import { useState, useEffect } from 'react';
import type { ReactNode } from "react";
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { LayoutDashboard, Camera, AlertTriangle, Bell } from 'lucide-react';
import { useTheme } from '../../theme';

export type PageType =
  | 'dashboard'
  | 'cameras'
  | 'alerts'
  | 'map'
  | 'incidents'
  | 'approvals'
  | 'notifications'
  | 'reports'
  | 'users'
  | 'settings'
  | 'profile'
  | 'upload';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export const DashboardLayout = ({ children, currentPage, setCurrentPage }: DashboardLayoutProps) => {
  useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size and auto-collapse sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-collapse sidebar on medium screens
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1280) {
        setSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when page changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [currentPage]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden bg-[#070B14] text-white selection:bg-primary/30 selection:text-primary transition-all duration-300"
      style={{
        backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Structural Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Persistence Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
        onToggleCollapse={toggleSidebar}
      />

      {/* Orchestration Layer: Main Content */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${isMobile ? '' : sidebarCollapsed ? 'pl-20' : 'pl-72'}`}
      >
        {/* Fixed Authority: Header */}
        <div className="fixed top-0 right-0 left-0 z-40">
          <Header
            onToggleMobileSidebar={toggleMobileSidebar}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
          />
        </div>

        {/* Content Matrix */}
        <main className="flex-1 mt-20 pb-20 lg:pb-8">
          <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Context Wrapper: Standardized vertical rhythm */}
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Tactical Mobile Navigation */}
      {isMobile && (
        <div
          className="fixed bottom-4 left-4 right-4 z-40 h-16 glass border border-white/10 rounded-2xl shadow-2xl safe-area-inset-bottom"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.98)' }}
        >
          <nav className="flex items-center justify-around h-full px-2">
            {[
              { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'cameras', label: 'Feeds', icon: Camera },
              { id: 'notifications', label: 'Signal', icon: Bell, badge: true }
            ].map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as PageType)}
                  className={`relative flex flex-col items-center justify-center space-y-1 h-12 rounded-xl flex-1 transition-all
                    ${isActive ? 'text-primary scale-105' : 'text-muted-foreground'}
                  `}
                >
                  <div className="relative">
                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    {item.badge && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F172A]" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  );
};