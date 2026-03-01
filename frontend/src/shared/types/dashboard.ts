import type { LucideIcon } from "lucide-react";


export interface DashboardData {
  totalAccidents: number;
  alertsSent: number;
  liveCameras: number;
  activeResponders: number;
  departmentBreakdown?: {
    police: DepartmentStats;
    fire: DepartmentStats;
    hospital: DepartmentStats;
  };
}

interface DepartmentStats {
  accidents: number;
  alerts: number;
  responders: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  status: 'active' | 'responding' | 'resolved';
  vehicles: number;
  time: string;
  description?: string;
  department?: 'police' | 'fire' | 'hospital' | 'multi-department';
  images?: any[];
}

export interface AIInsight {
  type: 'warning' | 'prediction' | 'analysis' | 'optimization' | 'critical';
  title: string;
  message: string;
  confidence: number;
  time: string;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  change: string;
  icon: LucideIcon;
  trend: 'up' | 'down';
  description: string;
  color?: 'blue' | 'red' | 'green' | 'purple';
  compact?: boolean;
}

export interface ChartDataPoint {
  time: string;
  accidents: number;
}

export interface SeverityDataPoint {
  name: string;
  value: number;
  color: string;
}