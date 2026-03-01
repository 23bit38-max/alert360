import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/core/auth/AuthContext';
import { useTheme } from '@/core/theme';
import type { Alert } from '@/features/incidents/incident-history/types/incidentHistory.types';
import { incidentHistoryService } from '@/features/incidents/incident-history/services/incidentHistory.service';
import {
    getAccessibleZones,
    canAccessZone,
    isSuperAdmin,
} from '@/shared/utils/rbac';

export const useIncidentHistory = () => {
    const { user } = useAuth();
    const { colors } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [timeRange, setTimeRange] = useState('7d');
    const [viewMode, setViewMode] = useState<'table' | 'analytics'>('table');
    const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
    const [incidents, setIncidents] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const accessibleZones = getAccessibleZones(user);

    const loadData = async () => {
        setLoading(true);
        const data = await incidentHistoryService.loadIncidents();
        setIncidents(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const analytics = useMemo(() => {
        const trends: Record<string, { date: string; collisions: number; fires: number; medical: number; rollovers: number }> = {};
        const severityCount = { critical: 0, high: 0, medium: 0, low: 0 };

        incidents.forEach(inc => {
            const date = inc.timestamp.toISOString().split('T')[0];
            if (!trends[date]) trends[date] = { date, collisions: 0, fires: 0, medical: 0, rollovers: 0 };

            const type = inc.type.toLowerCase();
            if (type.includes('collision')) trends[date].collisions++;
            else if (type.includes('fire')) trends[date].fires++;
            else if (type.includes('medical')) trends[date].medical++;
            else if (type.includes('rollover')) trends[date].rollovers++;

            const sev = inc.severity.toLowerCase();
            if (sev in severityCount) severityCount[sev as keyof typeof severityCount]++;
        });

        const severityDistribution = [
            { name: 'Critical', value: severityCount.critical, color: colors.status.critical.main },
            { name: 'High', value: severityCount.high, color: colors.status.warning.main },
            { name: 'Medium', value: severityCount.medium, color: colors.status.info.main },
            { name: 'Low', value: severityCount.low, color: colors.status.safe.main },
        ].filter(s => s.value > 0);

        return {
            incidentTrends: Object.values(trends).sort((a, b) => a.date.localeCompare(b.date)).slice(-7),
            severityDistribution: severityDistribution.length > 0 ? severityDistribution : [
                { name: 'No Data', value: 1, color: colors.background.border }
            ],
            totalIncidents: incidents.length,
            resolvedCount: incidents.filter(i => i.status === 'resolved').length,
            activeCount: incidents.filter(i => i.status !== 'resolved').length
        };
    }, [incidents, colors]);

    const filteredIncidents = incidents.filter(incident => {
        const matchesZone = accessibleZones.includes('all') || canAccessZone(user, incident.zone);
        const matchesDept = isSuperAdmin(user) || incident.responsibleDepartment === user?.department;
        const matchesType = selectedType === 'all' || incident.type === selectedType;
        const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
        const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            incident.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesZone && matchesDept && matchesType && matchesSeverity && matchesSearch;
    });

    return {
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
    };
};
