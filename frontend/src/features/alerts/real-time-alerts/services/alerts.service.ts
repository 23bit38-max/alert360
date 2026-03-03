import { fetchAccidents } from '@/services/firebase.service';

export const fetchAlertsData = async () => {
    return await fetchAccidents();
};
