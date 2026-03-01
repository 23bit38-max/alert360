import { useState } from 'react';
import type { Alert } from '@/features/incidents/incident-detail/constants/incidentDetail.types';
import { updateAccidentStatus } from '@/features/incidents/incident-detail/services/incidentDetail.service';

export const useIncidentDetail = (initialIncident: Alert) => {
    const [incident, setIncident] = useState(initialIncident);

    const handleStatusTransition = async () => {
        let nextStatus: Alert['status'] = 'active';
        if (incident.status === 'responding') {
            nextStatus = 'pending' as any;
        } else if (incident.status === 'pending' as any) {
            nextStatus = 'resolved';
        } else {
            return;
        }

        try {
            const { error } = await updateAccidentStatus(incident.id, nextStatus);
            if (error) throw error;
            setIncident(prev => ({ ...prev, status: nextStatus }));
        } catch (err) {
            console.error('Failed to persist status change:', err);
        }
    };

    const getStatusConfig = (status: Alert['status']) => {
        switch (status) {
            case 'responding': return { label: 'ACKNOWLEDGE ACTION', color: 'bg-red-500', sub: 'IMMEDIATE RESPONSE REQ' };
            case 'pending' as any: return { label: 'MARK AS RESOLVED', color: 'bg-orange-500', sub: 'CASE UNDER INVESTIGATION' };
            case 'resolved': return { label: 'INCIDENT SECURED', color: 'bg-primary/50', sub: 'AREA CLEARED' };
            case 'active': return { label: 'INITIATE RESPONSE', color: 'bg-blue-500', sub: 'ACTIVE ALERT' };
            default: return { label: 'UNKNOWN', color: 'bg-slate-500', sub: 'N/A' };
        }
    };

    return {
        incident,
        handleStatusTransition,
        getStatusConfig
    };
};
