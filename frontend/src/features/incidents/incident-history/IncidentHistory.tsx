import { useTheme, GlobalStyles } from '@/core/theme';
import { useIncidentHistory } from '@/features/incidents/incident-history/hooks/useIncidentHistory';
import { History, CheckCircle, AlertTriangle, Clock, Truck } from 'lucide-react';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { Badge } from '@/shared/components/ui/badge';
import { Shield } from 'lucide-react';
import { IncidentDetail } from '@/features/incidents/incident-detail/IncidentDetail';

// Sub-components
import { SystemStatus } from '@/features/incidents/incident-history/components/SystemStatus';
import { StatCard } from '@/features/incidents/incident-history/components/StatCard';
import { HistoryFilters } from '@/features/incidents/incident-history/components/HistoryFilters';
import { HistoryAnalytics } from '@/features/incidents/incident-history/components/HistoryAnalytics';
import { HistoryTable } from '@/features/incidents/incident-history/components/HistoryTable';

export const IncidentHistory = () => {
    const { colors, sizes, typography } = useTheme();
    const {
        user,
        loading,
        searchQuery,
        setSearchQuery,
        selectedType,
        setSelectedType,
        selectedSeverity,
        setSelectedSeverity,
        timeRange,
        setTimeRange,
        viewMode,
        setViewMode,
        selectedIncident,
        setSelectedIncident,
        incidents,
        filteredIncidents,
        analytics,
    } = useIncidentHistory();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div style={GlobalStyles.pageContainer}>
            {/* Top Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <SystemStatus colors={colors} />

                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: colors.background.elevated }}>
                        <Shield size={14} color={colors.accent.primary} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">System Administrator</span>
                        <Badge style={{ backgroundColor: colors.status.info.soft, color: colors.status.info.main, border: 'none', fontSize: '8px', fontWeight: 900 }}>
                            ROOT_ACCESS
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
                <StatCard icon={History} label="Reports" value={analytics.totalIncidents} trend={12} color={colors.status.info.main} colors={colors} GlobalStyles={GlobalStyles} typography={typography} />
                <StatCard icon={CheckCircle} label="Solved" value={analytics.resolvedCount} trend={8} color={colors.status.safe.main} colors={colors} GlobalStyles={GlobalStyles} typography={typography} />
                <StatCard icon={AlertTriangle} label="Active" value={analytics.activeCount} trend={-5} color={colors.status.warning.main} colors={colors} GlobalStyles={GlobalStyles} typography={typography} />
                <div className="hidden md:block">
                    <StatCard icon={Clock} label="Avg Time" value="3.8m" trend={-2} color={colors.accent.primary} colors={colors} GlobalStyles={GlobalStyles} typography={typography} />
                </div>
                <div className="hidden md:block">
                    <StatCard icon={Truck} label="Units" value="342" trend={15} color={colors.accent.secondary} colors={colors} GlobalStyles={GlobalStyles} typography={typography} />
                </div>
            </div>

            {/* Filter Bar */}
            <HistoryFilters
                colors={colors}
                sizes={sizes}
                typography={typography}
                GlobalStyles={GlobalStyles}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedSeverity={selectedSeverity}
                setSelectedSeverity={setSelectedSeverity}
                viewMode={viewMode}
                setViewMode={setViewMode}
                user={user}
            />

            {/* Conditional Content */}
            {viewMode === 'analytics' ? (
                <HistoryAnalytics
                    analytics={analytics}
                    colors={colors}
                    GlobalStyles={GlobalStyles}
                    typography={typography}
                />
            ) : (
                <HistoryTable
                    filteredIncidents={filteredIncidents}
                    analytics={analytics}
                    colors={colors}
                    typography={typography}
                    GlobalStyles={GlobalStyles}
                    setSelectedIncident={setSelectedIncident}
                />
            )}

            {/* Detail Overlay */}
            {selectedIncident && (
                <div className="fixed inset-0 z-[100] bg-[#05080E]">
                    <IncidentDetail
                        incident={incidents.find(i => i.id === selectedIncident) as any}
                        onBack={() => setSelectedIncident(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default IncidentHistory;
