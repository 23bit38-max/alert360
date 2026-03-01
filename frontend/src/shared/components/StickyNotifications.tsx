import { useState, useEffect } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { supabase } from '@/core/config/supabase.config';
import { AppColors } from '@/core/theme/app.colors';
import {
  Bell,
  X,
  MapPin,
  Flame,
  Ambulance,
  Users,
  ChevronDown,
  ChevronUp,
  Activity,
  Radio,
  Wifi
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyNotification {
  id: string;
  type: 'alert' | 'system' | 'update' | 'warning';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  location?: string;
  department?: 'police' | 'fire' | 'hospital' | 'multi';
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
}

export const StickyNotifications = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState<StickyNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  // Persistence for read/dismissed state
  useEffect(() => {
    localStorage.getItem('alert360_notifications_state');
  }, []);

  const mapAccidentToNotification = (accident: any): StickyNotification => {
    return {
      id: accident.id,
      type: 'alert',
      priority: (accident.operational_priority || 'medium').toLowerCase() as any,
      title: `${accident.incident_category || 'New Incident'} Detected`,
      message: `${accident.incident_category} reported at ${accident.address || accident.location || 'site'}. Source: ${accident.source_type || 'AI Sensor'}.`,
      location: accident.address || accident.location || 'Mumbai Core',
      department: (accident.department || 'multi').toLowerCase().includes('fire') ? 'fire' :
        (accident.department || 'multi').toLowerCase().includes('police') ? 'police' :
          (accident.department || 'multi').toLowerCase().includes('medical') ? 'hospital' : 'multi',
      timestamp: new Date(accident.observed_at || accident.created_at),
      read: false,
      dismissed: false
    };
  };

  const fetchInitialNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('accidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        const mapped = data.map(mapAccidentToNotification);
        const savedStates = JSON.parse(localStorage.getItem('alert360_notifications_state') || '{}');
        setNotifications(mapped.map(n => ({
          ...n,
          read: savedStates[n.id]?.read || false,
          dismissed: savedStates[n.id]?.dismissed || false
        })));
      }
    } catch (e) {
      console.error('Failed to load initial notifications:', e);
    }
  };

  useEffect(() => {
    fetchInitialNotifications();

    // Supabase Real-time Subscription
    const channel = supabase
      .channel('accidents-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'accidents' }, (payload) => {
        console.log('New Accident!:', payload);
        const newNotif = mapAccidentToNotification(payload.new);

        setNotifications(prev => {
          const newNotifs = [newNotif, ...prev];
          return newNotifs;
        });

        // Play subtle tactical alert sound for critical/high
        if (newNotif.priority === 'critical' || newNotif.priority === 'high') {
          playAlertSound();
          setIsExpanded(true); // Auto-expand for critical notifications
        }
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read && !n.dismissed).length);

    // Save state to localStorage
    const statesMap: Record<string, { read: boolean, dismissed: boolean }> = {};
    notifications.forEach(n => {
      statesMap[n.id] = { read: n.read, dismissed: n.dismissed };
    });
    localStorage.setItem('alert360_notifications_state', JSON.stringify(statesMap));
  }, [notifications]);

  const playAlertSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {
      console.warn('Audio playback failed');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (isNaN(diff)) return 'N/A';
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'NOW';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const dismissNotification = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, dismissed: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dismissed: true })));
    setIsExpanded(false);
  };

  const activeNotifications = notifications.filter(n => !n.dismissed);
  const hasNotifications = activeNotifications.length > 0;

  if (!hasNotifications && isConnected) {
    // Show a minimal "System Online" bar if no notifications
    return (
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-20 left-4 right-4 z-40 lg:left-auto lg:right-6 lg:w-96 flex justify-end"
      >
        <div
          className="px-4 py-2 rounded-full glass border-white/5 shadow-2xl flex items-center gap-3 backdrop-blur-xl transition-all hover:scale-105 cursor-pointer"
          style={{ backgroundColor: AppColors.background.surface }}
          onClick={fetchInitialNotifications}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Matrix Protocol: Secured</span>
          <Wifi size={10} className="text-primary/40" />
        </div>
      </motion.div>
    );
  }

  if (!hasNotifications) return null;

  const latestNotif = activeNotifications[0];

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 lg:hidden pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        <AnimatePresence mode="popLayout">
          {/* Header Controller Bar */}
          <motion.div
            layoutId="notif-bar"
            className="rounded-[20px] overflow-hidden premium-shadow"
            style={{
              backgroundColor: AppColors.background.surface,
              border: `1px solid ${AppColors.background.border}`,
              backdropFilter: 'blur(20px)'
            }}
          >
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl relative ${unreadCount > 0 ? 'bg-primary/10' : 'bg-white/5'}`}>
                  <Bell size={18} className={unreadCount > 0 ? 'text-primary' : 'text-white/40'} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black text-white border-2 border-[#0B0F1A]">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em] leading-none">Command Signals</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={`w-1 h-1 rounded-full ${isConnected ? 'bg-primary' : 'bg-red-500'} animate-pulse`} />
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">
                      {isConnected ? 'Real-time Link Active' : 'Matrix Connection Error'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isExpanded && latestNotif && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden md:flex flex-col items-end max-w-[150px]"
                  >
                    <span className="text-[10px] font-bold text-white truncate w-full text-right">{latestNotif.title}</span>
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{formatTimeAgo(latestNotif.timestamp)}</span>
                  </motion.div>
                )}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </div>
              </div>
            </div>

            {/* Expanded List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5"
                >
                  <div className="p-3 flex items-center justify-between bg-white/[0.02]">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] ml-2">Active Intelligence</span>
                    <Button
                      variant="ghost"
                      onClick={clearAllNotifications}
                      className="h-6 px-3 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 hover:bg-red-400/10"
                    >
                      Purge Signals
                    </Button>
                  </div>

                  <ScrollArea className="max-h-[450px] overflow-x-hidden p-3 custom-scrollbar">
                    <div className="flex flex-col gap-3 pb-2">
                      {activeNotifications.map((notif) => (
                        <NotificationCard
                          key={notif.id}
                          notification={notif}
                          onRead={() => markAsRead(notif.id)}
                          onDismiss={(e) => dismissNotification(notif.id, e)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const NotificationCard = ({ notification, onRead, onDismiss }: {
  notification: StickyNotification,
  onRead: () => void,
  onDismiss: (e: React.MouseEvent) => void
}) => {
  const info = (priority: string) => {
    switch (priority) {
      case 'critical': return { color: AppColors.status.critical.main, bg: AppColors.status.critical.soft, glow: 'rgba(239, 68, 68, 0.4)' };
      case 'high': return { color: AppColors.status.warning.main, bg: AppColors.status.warning.soft, glow: 'rgba(245, 158, 11, 0.4)' };
      case 'medium': return { color: AppColors.accent.primary, bg: AppColors.accent.soft, glow: 'rgba(16, 185, 129, 0.4)' };
      default: return { color: AppColors.text.muted, bg: 'rgba(255,255,255,0.05)', glow: 'transparent' };
    }
  };

  const style = info(notification.priority);
  const DeptIcon = (department?: string) => {
    switch (department) {
      case 'police': return Users;
      case 'fire': return Flame;
      case 'hospital': return Ambulance;
      case 'multi': return Radio;
      default: return Activity;
    }
  };
  const Icon = DeptIcon(notification.department);
  const deptColor = (department?: string) => {
    switch (department) {
      case 'police': return AppColors.accent.secondary;
      case 'fire': return AppColors.status.critical.main;
      case 'hospital': return AppColors.accent.primary;
      case 'multi': return '#A855F7';
      default: return AppColors.text.muted;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'NOW';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onRead}
      className={`relative group rounded-[18px] p-4 bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.05] cursor-pointer ${!notification.read ? 'ring-1 ring-white/10' : 'opacity-60'}`}
    >
      {!notification.read && (
        <div className="absolute top-4 left-0 w-1 h-6 rounded-r-full" style={{ backgroundColor: style.color, boxShadow: `0 0 10px ${style.glow}` }} />
      )}

      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
          style={{ backgroundColor: `${deptColor(notification.department)}15`, color: deptColor(notification.department) }}
        >
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <h5 className="text-[11px] font-black text-white uppercase tracking-tight truncate">{notification.title}</h5>
              <Badge
                className="text-[7px] font-black px-1.5 py-0 h-4 border-none"
                style={{ backgroundColor: style.bg, color: style.color }}
              >
                {notification.priority.toUpperCase()}
              </Badge>
            </div>
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">{formatTimeAgo(notification.timestamp)}</span>
          </div>

          <p className="text-[10px] font-medium text-white/60 leading-relaxed mb-3 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {notification.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={10} className="text-primary" />
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-tight truncate max-w-[120px]">{notification.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Radio size={10} style={{ color: deptColor(notification.department) }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: deptColor(notification.department) }}>{notification.department}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <X size={12} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
