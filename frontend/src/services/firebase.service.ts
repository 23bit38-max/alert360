import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    orderBy,
    limit,
    setDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../core/config/firebase.config';

// Types (Maintaining names for UI compatibility)
export interface Accident {
    id: string;
    location: string;
    latitude: number;
    longitude: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'pending' | 'responding' | 'resolved';
    beforeImageUrl?: string;
    afterImageUrl?: string;
    observedAt: any;
    createdAt: any;
    responseTime?: number;
    category?: string;
    address?: string;
}

// --- Accident Services ---

export const fetchAccidents = async (): Promise<Accident[]> => {
    const accidentsRef = collection(db, 'accidents');
    const q = query(accidentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            // Convert Firebase Timestamps to JS Dates for UI
            observedAt: data.observedAt?.toDate?.() || data.observedAt,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
        } as Accident;
    });
};

export const fetchAccidentDetail = async (id: string): Promise<Accident | null> => {
    const docRef = doc(db, 'accidents', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            ...data,
            id: docSnap.id,
            observedAt: data.observedAt?.toDate?.() || data.observedAt,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
        } as Accident;
    }
    return null;
};

export const saveAccidentToFirestore = async (incidentData: any, accidentId: string) => {
    const docRef = doc(db, 'accidents', accidentId);
    await setDoc(docRef, {
        ...incidentData,
        id: accidentId,
        createdAt: Timestamp.now(),
        observedAt: (() => {
            try {
                if (!incidentData.incidentTime) return Timestamp.now();
                const timeStr = incidentData.incidentTime.split(':').slice(0, 2).join(':'); // force HH:MM
                const date = new Date(`1970-01-01T${timeStr}:00`);
                if (isNaN(date.getTime())) return Timestamp.now();
                return Timestamp.fromDate(date);
            } catch (e) {
                return Timestamp.now();
            }
        })()
    });
};

export const updateAccidentDoc = async (id: string, data: any) => {
    const docRef = doc(db, 'accidents', id);
    await updateDoc(docRef, data);
};

// --- Camera Services ---

export const fetchCameras = async (): Promise<any[]> => {
    const camerasRef = collection(db, 'cameras');
    const querySnapshot = await getDocs(camerasRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Insight Services ---

export const fetchAIInsights = async (): Promise<any[]> => {
    const insightsRef = collection(db, 'ai_insights');
    const q = query(insightsRef, orderBy('createdAt', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Profile Services ---

export const fetchUsers = async (): Promise<any[]> => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const syncUserProfile = async (uid: string, profileData: any) => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        ...profileData,
        lastModified: Timestamp.now()
    }, { merge: true });
};

export const getUserProfile = async (uid: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};

export const fetchUserApprovals = async (): Promise<any[]> => {
    const approvalsRef = collection(db, 'user_approvals');
    const q = query(approvalsRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateUserDoc = async (uid: string, data: any) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        ...data,
        lastModified: Timestamp.now()
    });
};
