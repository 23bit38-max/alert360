import { useState, useEffect } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useTheme } from '@/core/theme';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { getAccessibleZones, canAccessZone } from '@/shared/utils/rbac';
import { fetchAccidents } from '@/services/supabase.service';
import { getAIInsights, CHART_DATA } from '@/data/data';

// Modular Components
import { KPIGrid } from '@/features/dashboard/components/KPIGrid';
import { AnalyticsSection } from '@/features/dashboard/components/AnalyticsSection';
import { IntelligenceFeed } from '@/features/dashboard/components/IntelligenceFeed';
import { AIInsightsSection } from '@/features/dashboard/components/AIInsightsSection';
import { RecordManagementSection } from '@/features/dashboard/components/RecordManagementSection';

export const Dashboard = () => {
  const { user } = useAuth();
  useTheme();
  const [loading, setLoading] = useState(true);
  const [accidents, setAccidents] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAccidents();
      setAccidents(data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user) return null;
  if (loading) return <LoadingScreen message="Compiling Real-time Detection Data..." />;

  const accessibleZones = getAccessibleZones(user);
  const rawAlerts = accidents.filter((alert: any) =>
    accessibleZones.includes('all') || canAccessZone(user, alert.zone)
  );

  const recentAlerts = rawAlerts
    .map((a: any) => ({
      id: a.id,
      type: a.operational_priority?.toLowerCase() === 'critical' ? 'critical' :
        a.operational_priority?.toLowerCase() === 'high' ? 'high' :
          a.operational_priority?.toLowerCase() === 'medium' ? 'medium' : 'low',
      location: a.address || a.location || 'Unknown Location',
      time: new Date(a.observed_at || a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: a.response_status || 'Active',
      vehicles: a.vehicle_involvement?.[0]?.vehicle_count || 0,
      department: a.department?.toLowerCase() || 'multi-department',
      zone: a.zone,
      casualties: a.casualty_report?.[0]?.injured_count || 0,
    }))
    .slice(0, 8);

  const kpiData = {
    totalAccidents: accidents.length,
    alertsSent: accidents.length,
    liveCameras: 24,
    activeResponders: 12,
  };

  const departmentBreakdown = {
    police: { accidents: Math.floor(accidents.length * 0.4), responders: 5 },
    fire: { accidents: Math.floor(accidents.length * 0.3), responders: 4 },
    hospital: { accidents: Math.floor(accidents.length * 0.3), responders: 3 },
  };

  const aiInsights = (getAIInsights(user?.role) || []).slice(0, 3).map((insight: any) => ({
    ...insight,
    type: ['warning', 'prediction', 'analysis', 'optimization', 'critical'].includes(insight.type) ? insight.type : 'analysis'
  }));

  return (
    <div className="page-container animate-in fade-in duration-1000 pb-24 lg:pb-12 max-w-[1700px] mx-auto space-y-10">
      {/* 01. OPERATIONAL HEADERS (KPIs) */}
      <header className="pt-6">
        <KPIGrid data={kpiData} />
      </header>

      {/* 02. ANALYTICS & STRATEGIC VIEW */}
      <main className="grid grid-cols-1 gap-10">
        <AnalyticsSection
          accidentTrend={CHART_DATA.accidentTrend}
          departmentBreakdown={departmentBreakdown}
          responseTime={CHART_DATA.responseTime}
        />

        {/* 03. TACTICAL FEED & RECORD MANAGEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 h-[750px]">
            <IntelligenceFeed alerts={recentAlerts} />
          </div>
          <div className="lg:col-span-4 h-[750px]">
            <AIInsightsSection insights={aiInsights} />
          </div>
        </div>

        {/* 04. RECORD ARCHIVE (FILE MANAGEMENT) */}
        <section className="h-[600px] pb-10">
          <RecordManagementSection />
        </section>
      </main>
    </div>
  );
};
