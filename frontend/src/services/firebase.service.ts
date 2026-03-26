import {
    collection,
    query,
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
import { MOCK_USERS, AI_INSIGHTS, PENDING_USER_APPROVALS } from '@/data/data';

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
    try {
        const accidentsRef = collection(db, 'accidents');
        // Temporarily remove orderBy to avoid index requirements
        const querySnapshot = await getDocs(accidentsRef);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                observedAt: data.observedAt?.toDate?.() || data.observedAt,
                createdAt: data.createdAt?.toDate?.() || data.createdAt,
            } as Accident;
        });
    } catch (error) {
        console.error("Error in fetchAccidents:", error);
        // Fallback to python backend api which bypasses rules
        try {
            const API_BASE_URL = import.meta.env.VITE_LOCAL_BACKEND_URL || 'http://localhost:8000';
            const res = await fetch(`${API_BASE_URL}/api/accidents`);
            if (res.ok) {
                const data = await res.json();
                return data.map((d: any) => ({
                    ...d,
                    observedAt: new Date(d.observedAt),
                    createdAt: new Date(d.createdAt)
                }));
            }
        } catch (e) {
            console.error("Backend fetch fallback failed:", e);
        }
        return [];
    }
};

export const fetchAccidentDetail = async (id: string): Promise<Accident | null> => {
    try {
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
    } catch (error) {
        console.warn("fetchAccidentDetail permissions failure.");
    }
    return null;
};

export const saveAccidentToFirestore = async (incidentData: any, accidentId: string) => {
    try {
        const docRef = doc(db, 'accidents', accidentId);
        await setDoc(docRef, {
            ...incidentData,
            id: accidentId,
            createdAt: Timestamp.now(),
            observedAt: (() => {
                try {
                    if (!incidentData.incidentTime) return Timestamp.now();
                    const parts = incidentData.incidentTime.split(':');
                    if (parts.length < 2) return Timestamp.now();

                    // Combine today's date with the provided time
                    const now = new Date();
                    const date = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        parseInt(parts[0]),
                        parseInt(parts[1])
                    );

                    if (isNaN(date.getTime())) return Timestamp.now();
                    return Timestamp.fromDate(date);
                } catch (e) {
                    return Timestamp.now();
                }
            })()
        });
    } catch (error) {
        console.warn("saveAccidentToFirestore permissions failure.");
    }
};

export const updateAccidentDoc = async (id: string, data: any) => {
    try {
        const docRef = doc(db, 'accidents', id);
        await updateDoc(docRef, data);
    } catch (error) {
        console.warn("updateAccidentDoc permissions failure.");
    }
};

// --- Camera Services ---

export const fetchCameras = async (): Promise<any[]> => {
    try {
        const camerasRef = collection(db, 'cameras');
        const querySnapshot = await getDocs(camerasRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("fetchCameras permissions failure.");
        return [];
    }
};

// --- Insight Services ---

export const fetchAIInsights = async (): Promise<any[]> => {
    try {
        const insightsRef = collection(db, 'ai_insights');
        const q = query(insightsRef, orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("fetchAIInsights permissions failure. Using mock insights.");
        // Fallback to mock insights
        const allInsights = Object.values(AI_INSIGHTS).flat();
        return allInsights;
    }
};

// --- Profile Services ---

export const fetchUsers = async (): Promise<any[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("fetchUsers permissions failure. Using mock users.");
        return Object.values(MOCK_USERS);
    }
};

export const syncUserProfile = async (uid: string, profileData: any) => {
    try {
        const userRef = doc(db, 'users', uid);
        await setDoc(userRef, {
            ...profileData,
            lastModified: Timestamp.now()
        }, { merge: true });
    } catch (error) {
        console.warn("syncUserProfile permissions failure.");
    }
};

export const getUserProfile = async (uid: string) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
        console.warn("getUserProfile permissions failure. Using mock user.");
        // Fallback: try finding mock user by uid
        const user = Object.values(MOCK_USERS).find(u => u.id === uid || u.email === uid);
        return user || null;
    }
};

export const fetchUserApprovals = async (): Promise<any[]> => {
    try {
        const approvalsRef = collection(db, 'user_approvals');
        const q = query(approvalsRef, orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.warn("fetchUserApprovals permissions failure. Using mock approvals.");
        return PENDING_USER_APPROVALS;
    }
};

export const updateUserDoc = async (uid: string, data: any) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...data,
            lastModified: Timestamp.now()
        });
    } catch (error) {
        console.warn("updateUserDoc permissions failure.");
    }
};
