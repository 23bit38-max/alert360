import { fetchAccidents } from '@/services/supabase.service';

export const fetchAlertsData = async () => {
    return await fetchAccidents();
};
