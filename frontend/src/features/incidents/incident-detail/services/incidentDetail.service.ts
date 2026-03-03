import { updateAccidentDoc } from '@/services/firebase.service';

export const updateAccidentStatus = async (id: string, nextStatus: string) => {
    return await updateAccidentDoc(id, {
        status: nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)
    });
};
