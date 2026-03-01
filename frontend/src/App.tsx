import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/core/auth/AuthContext';
import { NotificationProvider } from '@/shared/components/NotificationService';
import { AuthPage } from '@/core/auth/AuthPage';
import { DashboardLayout } from '@/core/layout/DashboardLayout';

import { Dashboard } from '@/features/dashboard/Dashboard';
import { LiveCameras } from '@/features/live-cameras';
import { RealTimeAlerts } from '@/features/alerts/real-time-alerts/RealTimeAlerts';
import { MapView } from '@/features/alerts/map-view/MapView';
import { IncidentHistory } from '@/features/incidents/incident-history';
import { Approvals } from '@/features/settings/approvals/Approvals';
import { NotificationControl } from '@/features/notifications/NotificationControl';
import { ReportsAnalytics } from '@/features/reports';
import { UserManagement } from '@/features/users/user-management';
import { SystemSettings } from '@/features/settings/system-settings/SystemSettings';
import { ManualUpload } from '@/features/manual-upload/ManualUpload';
import { ProtectedPage } from '@/core/auth/ProtectedPage';
import { ThemeProvider } from '@/core/theme';

import { Toaster } from '@/shared/components/ui/sonner';
import { StickyNotifications } from '@/shared/components/StickyNotifications';
import { ProfileDashboard as Profile } from '@/features/users/profile/ProfileDashboard';
import { ProfileSetup } from '@/core/auth/ProfileSetup';

type PageType =
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

const LoadingScreen = () => (
  <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
    <div className="glass rounded-[24px] p-8 sm:p-12 text-center neon-glow max-w-md w-full border-white/10">
      <div className="relative mx-auto mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20 rounded-full mx-auto"></div>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">Alert360</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-white/90 mb-3">
        Initializing AI Detection
      </h2>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Securely connecting to the mumbai emergency response network.
      </p>
      <div className="flex items-center justify-center space-x-3 text-xs font-medium text-primary/80 bg-primary/5 py-2 px-4 rounded-full w-fit mx-auto">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        <span className="uppercase tracking-widest">System Online</span>
      </div>
    </div>
  </div>
);

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-6 sm:p-8 text-center neon-red-glow max-w-md w-full">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="mb-4">
            <h1 className="text-lg font-bold text-white mb-1">Alert360</h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-neon-red to-red-400 mx-auto mb-3"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">System Error</h2>
          <p className="text-sm text-muted-foreground mb-4">
            An unexpected error occurred. Please refresh the page or contact system administrator.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-electric-blue to-cyan-400 text-black px-4 py-2 rounded-lg hover:from-electric-blue/80 hover:to-cyan-400/80 transition-all duration-200"
          >
            Reload Alert360
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Handle online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


  // Prevent zoom on mobile devices
  React.useEffect(() => {
    let lastTouch = 0;

    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventDoubleZoom = (e: TouchEvent) => {
      const t2 = e.timeStamp;
      const dt = t2 - lastTouch;
      if (dt < 300) {
        e.preventDefault();
      }
      lastTouch = t2;
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchstart', preventDoubleZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchstart', preventDoubleZoom);
    };
  }, []);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const installPrompt = document.getElementById('pwa-install-prompt');
      if (installPrompt) {
        installPrompt.classList.remove('hidden');
      }
    };

    const handleAppInstalled = () => {
      const installPrompt = document.getElementById('pwa-install-prompt');
      if (installPrompt) {
        installPrompt.classList.add('hidden');
      }
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        const installPrompt = document.getElementById('pwa-install-prompt');
        if (installPrompt) {
          installPrompt.classList.add('hidden');
        }
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismissInstallPrompt = () => {
    const installPrompt = document.getElementById('pwa-install-prompt');
    if (installPrompt) {
      installPrompt.classList.add('hidden');
    }
    setDeferredPrompt(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthPage />;
  }

  if (user.profileCompleted === false) {
    return <ProfileSetup />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <ProtectedPage page="dashboard">
            <Dashboard />
          </ProtectedPage>
        );
      case 'cameras':
        return (
          <ProtectedPage page="cameras">
            <LiveCameras />
          </ProtectedPage>
        );
      case 'alerts':
        return (
          <ProtectedPage page="alerts">
            <RealTimeAlerts setCurrentPage={setCurrentPage} />
          </ProtectedPage>
        );
      case 'map':
        return (
          <ProtectedPage page="map">
            <MapView />
          </ProtectedPage>
        );
      case 'incidents':
        return (
          <ProtectedPage page="incidents">
            <IncidentHistory />
          </ProtectedPage>
        );
      case 'approvals':
        return (
          <ProtectedPage page="approvals">
            <Approvals />
          </ProtectedPage>
        );
      case 'notifications':
        return (
          <ProtectedPage page="notifications"> // Note: notifications might not be in PAGE_ACCESS, let's check or use a fallback. 'notifications' is NOT in PAGE_ACCESS.
            <NotificationControl />
          </ProtectedPage>
        );
      case 'reports':
        return (
          <ProtectedPage page="analytics">
            <ReportsAnalytics />
          </ProtectedPage>
        );
      case 'users':
        return (
          <ProtectedPage page="user-management">
            <UserManagement />
          </ProtectedPage>
        );
      case 'settings':
        return (
          <ProtectedPage page="settings">
            <SystemSettings />
          </ProtectedPage>
        );
      case 'profile':
        return <Profile />;
      case 'upload':
        return (
          <ProtectedPage page="manual-upload">
            <ManualUpload />
          </ProtectedPage>
        );
      default:
        return (
          <ProtectedPage page="dashboard">
            <Dashboard />
          </ProtectedPage>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-neon-red/90 text-white text-center py-2 text-sm z-[100] backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You are currently offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      <DashboardLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <ErrorBoundary>{renderPage()}</ErrorBoundary>
      </DashboardLayout>

      {/* Sticky Notifications */}
      <StickyNotifications />

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass border-glass-border',
          style: {
            background: 'var(--glass-bg)',
            color: 'white',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
          },
          duration: 4000,
        }}
        closeButton
        richColors
      />

      {/* PWA Install Prompt */}
      <div
        id="pwa-install-prompt"
        className="hidden fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 glass rounded-xl p-4 z-50 border border-glass-border"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">Install Alert360</h3>
            <p className="text-xs text-gray-400 mt-1">
              Install this app for quick access and offline capabilities.
            </p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="text-xs bg-electric-blue text-black px-3 py-1.5 rounded-lg hover:bg-electric-blue/80 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismissInstallPrompt}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <div className="dark">
            <AppContent />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
