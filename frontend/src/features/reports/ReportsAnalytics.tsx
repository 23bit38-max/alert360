import React from 'react';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useReportsAnalytics } from '@/features/reports/hooks/useReportsAnalytics';
import { AnalyticsHeader } from '@/features/reports/components/AnalyticsHeader';
import { OperationalTrends } from '@/features/reports/components/OperationalTrends';
import { ZonalAudit } from '@/features/reports/components/ZonalAudit';
import { ImpactMetrics } from '@/features/reports/components/ImpactMetrics';
import { EfficiencyAnalysis } from '@/features/reports/components/EfficiencyAnalysis';
import { ProgressionCharts } from '@/features/reports/components/ProgressionCharts';
import { LatencyAudit } from '@/features/reports/components/LatencyAudit';
import { ClassificationTreemap } from '@/features/reports/components/ClassificationTreemap';
import { DispatchMetrics } from '@/features/reports/components/DispatchMetrics';
import { SeverityMatrix } from '@/features/reports/components/SeverityMatrix';
import { SystemHealthStatus } from '@/features/reports/components/SystemHealthStatus';

export const ReportsAnalytics: React.FC = () => {
    const { loading, loadData, operatorActiveness } = useReportsAnalytics();

    if (loading) {
        return <LoadingScreen message="Compiling Tactical Analytics..." />;
    }

    return (
        <div className="page-container animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1700px] mx-auto pb-12 p-8 space-y-8">
            {/* HEADER SECTION */}
            <AnalyticsHeader onRefresh={loadData} />

            {/* 1. OPERATIONAL INTELLIGENCE (DAILY TRENDS) */}
            <OperationalTrends operatorActiveness={operatorActiveness} />

            {/* 2. ZONAL ACCIDENT vs RESOLUTION DISTRIBUTION */}
            <ZonalAudit />

            {/* 3. CASUALTY METRICS & RESOLUTION EFFICIENCY */}
            <div className="grid grid-cols-12 gap-6 w-full">
                <ImpactMetrics />
                <EfficiencyAnalysis />
            </div>

            {/* 4. WEEKLY ZONAL PROGRESSION & SYSTEM HEALTH */}
            <div className="grid grid-cols-12 gap-6 w-full">
                <ProgressionCharts />
                <LatencyAudit />
            </div>

            {/* 5. ACCIDENT TYPE DISTRIBUTION & NOTIFICATION RADAR */}
            <div className="grid grid-cols-12 gap-6">
                <ClassificationTreemap />
                <DispatchMetrics />
            </div>

            {/* 6. WEEKLY SEVERITY METRICS & SYSTEM HEALTH */}
            <div className="grid grid-cols-12 gap-6">
                <SeverityMatrix />
                <SystemHealthStatus />
            </div>

            <div className="h-12" /> {/* BOTTOM SPACER */}
        </div>
    );
};

export default ReportsAnalytics;
