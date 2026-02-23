import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// ================== TYPES ==================
interface Notification {
  type: string;
  title: string;
  message: string;
  priority?: "low" | "medium" | "high" | "critical";
  department?: string;
  requestedBy?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
  soundAlerts: boolean;
  emailFrequency: "immediate" | "hourly" | "daily";
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
  showToast: (type: string, title: string, message: string) => void;
  addNotification: (notification: Notification) => void;
}

// ================== DEFAULT SETTINGS ==================
const defaultSettings: NotificationSettings = {
  email: true,
  sms: true,
  whatsapp: false,
  push: true,
  soundAlerts: true,
  emailFrequency: "immediate",
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "07:00",
  },
};

// ================== CONTEXT ==================
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Custom hook
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// ================== PROVIDER ==================
export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [ , setNotifications] = useState<Notification[]>([]);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("notification_settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings) as NotificationSettings);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("notification_settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving notification settings:", error);
    }
  }, [settings]);

  // Update settings
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reset settings
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("notification_settings");
  };

  // Show toast
  const showToast = (type: string, title: string, message: string) => {
    console.log("TOAST:", { type, title, message });
    // TODO: integrate with your toast system (shadcn useToast, react-hot-toast, etc.)
  };

  // Add notification
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);
    console.log("Notification Added:", notification);
  };

  const value: NotificationContextType = {
    settings,
    updateSettings,
    resetSettings,
    showToast,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// ================== HELPERS ==================
export const isQuietHoursActive = (
  quietHours: NotificationSettings["quietHours"]
): boolean => {
  if (!quietHours.enabled) return false;
  try {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMin] = quietHours.start.split(":").map(Number);
    const [endHour, endMin] = quietHours.end.split(":").map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    }
    return currentTime >= startTime && currentTime <= endTime;
  } catch (error) {
    console.error("Error checking quiet hours:", error);
    return false;
  }
};

export const formatNotificationTime = (date: Date): string => {
  try {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid time";
  }
};

export const getChannelDisplayName = (
  channel: keyof NotificationSettings
): string => {
  const channelNames = {
    email: "Email",
    sms: "SMS",
    whatsapp: "WhatsApp",
    push: "Push Notifications",
    soundAlerts: "Sound Alerts",
    emailFrequency: "Email Frequency",
    quietHours: "Quiet Hours",
  };
  return channelNames[channel] || "Unknown";
};
