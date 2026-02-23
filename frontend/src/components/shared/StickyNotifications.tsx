import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Flame,
  Ambulance,
  Users,
  ChevronDown,
  ChevronUp
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
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState<StickyNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications with Alert360 branding
  useEffect(() => {
    const mockNotifications: StickyNotification[] = [
      {
        id: 'notif-1',
        type: 'alert',
        priority: 'critical',
        title: 'Critical Accident Alert',
        message: 'Multi-vehicle collision detected at Anna Salai Junction requiring immediate emergency response.',
        location: 'Anna Salai Junction, Mumbai',
        department: 'multi',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        read: false,
        dismissed: false
      },
      {
        id: 'notif-2',
        type: 'alert',
        priority: 'high',
        title: 'Vehicle Fire Detected',
        message: 'Alert360 AI detected vehicle fire on OMR Highway. Fire department dispatched.',
        location: 'OMR Highway, Sholinganallur',
        department: 'fire',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        dismissed: false
      },
      {
        id: 'notif-3',
        type: 'system',
        priority: 'medium',
        title: 'Alert360 System Update',
        message: 'System successfully updated with enhanced AI detection algorithms.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        dismissed: false
      },
      {
        id: 'notif-4',
        type: 'update',
        priority: 'low',
        title: 'Camera Network Status',
        message: 'All 47 Alert360 cameras in Mumbai network are online and operational.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true,
        dismissed: false
      }
    ];

    // Filter notifications based on user role and department
    const filteredNotifications = mockNotifications.filter(notification => {
      if (user?.role === 'super_admin') return true;
      if (notification.type === 'system' || notification.type === 'update') return true;
      if (notification.department === user?.department || notification.department === 'multi') return true;
      return false;
    });

    setNotifications(filteredNotifications);
    setUnreadCount(filteredNotifications.filter(n => !n.read && !n.dismissed).length);
  }, [user]);

  // Auto-expand for critical notifications
  useEffect(() => {
    const hasCritical = notifications.some(n => n.priority === 'critical' && !n.read && !n.dismissed);
    if (hasCritical) {
      setIsExpanded(true);
    }
  }, [notifications]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return AlertTriangle;
      case 'system': return CheckCircle;
      case 'update': return Bell;
      case 'warning': return AlertTriangle;
      default: return Bell;
    }
  };

  const getDepartmentIcon = (department?: string) => {
    switch (department) {
      case 'police': return Users;
      case 'fire': return Flame;
      case 'hospital': return Ambulance;
      case 'multi': return AlertTriangle;
      default: return Bell;
    }
  };

  const getDepartmentColor = (department?: string) => {
    switch (department) {
      case 'police': return 'text-blue-400';
      case 'fire': return 'text-red-400';
      case 'hospital': return 'text-green-400';
      case 'multi': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, dismissed: true } : n
    ));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === id);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, dismissed: true })));
    setUnreadCount(0);
    setIsExpanded(false);
  };

  const activeNotifications = notifications.filter(n => !n.dismissed);
  const hasNotifications = activeNotifications.length > 0;

  if (!hasNotifications) return null;

  return (
    <>
      {/* Sticky Notification Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-[70px] left-2 right-2 z-40"
        aria-live="polite"
      >
        <div className="glass rounded-xl border border-glass-border overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div
            className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-electric-blue/10 to-lime-green/10 border-b border-glass-border backdrop-blur-md"
            onClick={() => setIsExpanded(!isExpanded)}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
            aria-label="Toggle notifications"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(!isExpanded); }}
          >
            <div className="flex items-center space-x-3">
              {/* Alert360 Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-electric-blue to-lime-green rounded-full flex items-center justify-center animate-spin-slow">
                  <Bell className="w-3 h-3 text-black" />
                </div>
                <span className="text-white font-semibold text-sm tracking-wide drop-shadow">Alert360</span>
              </div>
              {/* Notification Count */}
              {unreadCount > 0 && (
                <Badge className="bg-neon-red text-white text-xs animate-pulse shadow-lg">
                  {unreadCount}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Latest notification preview */}
              <div className="flex items-center space-x-1 max-w-40">
                <span className="text-xs text-gray-300 truncate font-medium">
                  {activeNotifications[0]?.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-white focus:outline-none"
                aria-label={isExpanded ? 'Collapse notifications' : 'Expand notifications'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Expanded Notifications */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="max-h-96 bg-background/95 backdrop-blur-lg border-t border-glass-border relative">
                  {/* Header */}
                  <div className="flex items-center justify-between p-3 border-b border-glass-border sticky top-0 bg-background/80 z-10">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold text-sm tracking-wide">Emergency Alerts</h3>
                      <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                        {activeNotifications.length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="text-xs text-gray-400 hover:text-white h-6 px-2"
                      aria-label="Clear all notifications"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Notifications List - Enhanced Scrollable Area */}
                  <ScrollArea className="max-h-80 overflow-y-auto px-1 py-2 scrollbar-thin scrollbar-thumb-electric-blue scrollbar-track-transparent">
                    <div className="space-y-2">
                      {activeNotifications.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          <span>No active notifications.</span>
                        </div>
                      )}
                      {activeNotifications.map((notification) => {
                        const TypeIcon = getTypeIcon(notification.type);
                        const DepartmentIcon = getDepartmentIcon(notification.department);
                        return (
                          <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`p-3 border border-glass-border/30 rounded-lg shadow-md bg-gradient-to-r from-background/80 to-electric-blue/10 hover:scale-[1.01] transition-transform duration-150 cursor-pointer ${!notification.read ? 'bg-electric-blue/10 ring-2 ring-electric-blue/30' : ''
                              }`}
                            tabIndex={0}
                            aria-label={`Notification: ${notification.title}`}
                          >
                            <div className="flex items-start space-x-3">
                              {/* Type Icon */}
                              <div className={`p-2 rounded-lg flex-shrink-0 shadow ${notification.type === 'alert' ? 'bg-red-500/20' :
                                  notification.type === 'system' ? 'bg-blue-500/20' :
                                    notification.type === 'update' ? 'bg-green-500/20' :
                                      'bg-yellow-500/20'
                                }`}>
                                <TypeIcon className={`w-4 h-4 ${notification.type === 'alert' ? 'text-red-400 animate-pulse' :
                                    notification.type === 'system' ? 'text-blue-400' :
                                      notification.type === 'update' ? 'text-green-400' :
                                        'text-yellow-400'
                                  }`} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className={`text-sm font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'
                                    } truncate drop-shadow`}>{notification.title}</h4>
                                  <Badge className={`text-xs ml-2 ${getPriorityColor(notification.priority)} shadow-sm`}>
                                    {notification.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-300 mb-2 line-clamp-3 leading-relaxed">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{formatTimeAgo(notification.timestamp)}</span>
                                    </div>
                                    {notification.location && (
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3" />
                                        <span className="truncate max-w-32">{notification.location}</span>
                                      </div>
                                    )}
                                    {notification.department && (
                                      <div className="flex items-center space-x-1">
                                        <DepartmentIcon className={`w-3 h-3 ${getDepartmentColor(notification.department)}`} />
                                        <span className={`${getDepartmentColor(notification.department)} uppercase text-xs font-bold`}>
                                          {notification.department === 'multi' ? 'Multi' : notification.department}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="h-5 w-5 p-0 text-blue-400 hover:text-blue-300 focus:outline-none"
                                        aria-label="Mark as read"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => dismissNotification(notification.id)}
                                      className="h-5 w-5 p-0 text-gray-400 hover:text-red-400 focus:outline-none"
                                      aria-label="Dismiss notification"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                  {/* Custom Scrollbar styles (if using Tailwind plugin) */}
                  <style>{`
                    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
                    .scrollbar-thumb-electric-blue::-webkit-scrollbar-thumb { background: #00eaff; border-radius: 6px; }
                  `}</style>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};
