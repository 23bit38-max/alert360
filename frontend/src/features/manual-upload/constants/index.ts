const RENDER_URL = import.meta.env.VITE_RENDER_BACKEND_URL || 'https://alert360.onrender.com';
const LOCAL_URL = import.meta.env.VITE_LOCAL_BACKEND_URL || 'http://localhost:8000';

const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export let API_BASE_URL = isLocal ? LOCAL_URL : RENDER_URL;

// Optional: Ping the alternative if the primary is down
if (isLocal) {
    fetch(`${LOCAL_URL}/health`).catch(() => {
        console.warn('Local backend unreachable. Switching to Render.');
        API_BASE_URL = RENDER_URL;
    });
} else {
    fetch(`${RENDER_URL}/health`).catch(() => {
        console.warn('Render backend unreachable. Switching to Localhost.');
        API_BASE_URL = LOCAL_URL;
    });
}

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
