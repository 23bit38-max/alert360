import { API_BASE_URL } from '@/features/manual-upload/constants';
import type { DetectionResult } from '@/features/manual-upload/types/index';

/**
 * Polls /api/status/<filename> in the background to get real-time analysis updates.
 * Calls `onUpdate` whenever new data (confidence, detection status, or snapshots) is available.
 * Stops when status is 'done' or 'error', or after timeout.
 */
/**
 * Polls /api/status/<filename> in the background to get real-time analysis updates.
 * Calls `onUpdate` whenever new data (confidence, detection status, or snapshots) is available.
 * Stops when status is 'done' or 'error', or after timeout.
 */
function startStatusPolling(
    base: DetectionResult,
    filename: string,
    onUpdate: (updated: DetectionResult) => void,
    signal?: AbortSignal
): void {
    const deadline = Date.now() + 120_000; // 2 minutes max (videos can be long)
    let isDone = false;

    if (signal) {
        if (signal.aborted) return;
        signal.addEventListener('abort', () => { isDone = true; });
    }

    const poll = async () => {
        if (Date.now() >= deadline || isDone) return;
        if (signal?.aborted) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/status/${filename}`);
            if (res.ok) {
                const status = await res.json();

                // Build updated result object
                // We trust the backend's "latched" status for accident_detected/confidence
                const updatedResult: DetectionResult = {
                    ...base,
                    accidentDetected: status.accident_detected ?? base.accidentDetected,
                    bestConfidence: status.confidence ?? base.bestConfidence,
                    label: status.label ?? base.label,
                    boxes: status.boxes ?? base.boxes,
                    beforeSnapshotUrl: status.before_snapshot_url ?? base.beforeSnapshotUrl,
                    afterSnapshotUrl: status.after_snapshot_url ?? base.afterSnapshotUrl,
                };

                // Notify UI immediately (only if not aborted right after fetch)
                if (!signal?.aborted && !isDone) {
                    onUpdate(updatedResult);
                }

                // Check terminal states
                if (status.status === 'done' || status.status === 'error') {
                    isDone = true;
                    return;
                }
            }
        } catch (err) {
            console.warn('Polling error (transient):', err);
        }

        // Poll every 500ms for smoother updates
        if (!isDone && !signal?.aborted) {
            setTimeout(poll, 500);
        }
    };

    // Start polling immediately
    poll();
}

/**
 * Analyse a single file.
 * - Returns the initial DetectionResult immediately (live stream URL is usable right away).
 * - For video uploads, kicks off a background status poll and calls
 *   `onUpdate` continuously with live analysis data.
 */
export const analyzeIncident = async (
    file: File,
    cameraId: string,
    location: string,
    accidentId?: string,
    enableEmail: boolean = true,
    enableSms: boolean = true,
    enableCall: boolean = true,
    onUpdate?: (updated: DetectionResult) => void,
    signal?: AbortSignal
): Promise<DetectionResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('camera_id', cameraId || 'Manual_Upload');
    formData.append('location', location);
    if (accidentId) formData.append('accident_id', accidentId);
    formData.append('enable_email', String(enableEmail));
    formData.append('enable_sms', String(enableSms));
    formData.append('enable_call', String(enableCall));

    let res: Response;
    try {
        res = await fetch(`${API_BASE_URL}/api/analyze`, {
            method: 'POST',
            body: formData,
            signal, // Pass signal to fetch request too
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Analysis cancelled by user');
        }
        throw new Error(
            `Cannot reach the detection server at ${API_BASE_URL}. ` +
            'Make sure the Python backend is running (uvicorn api:app --reload).',
        );
    }

    if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}. Check backend logs.`);
    }

    const data = await res.json() as {
        accident_detected?: boolean;
        best_confidence?: number;
        label?: string | null;
        image_url?: string | null;
        is_video?: boolean;
        filename?: string;
        before_snapshot_url?: string | null;
        after_snapshot_url?: string | null;
        error?: string;
    };

    if (data.error) {
        throw new Error(`Backend error: ${data.error}`);
    }

    const result: DetectionResult = {
        accidentDetected: data.accident_detected ?? false,
        bestConfidence: data.best_confidence,
        label: data.label,
        boxes: (data as any).boxes,
        imageUrl: data.image_url,
        beforeSnapshotUrl: data.before_snapshot_url ?? null,
        afterSnapshotUrl: data.after_snapshot_url ?? null,
    };

    // For videos: kick off polling immediately
    if (data.is_video && data.filename && onUpdate) {
        startStatusPolling(result, data.filename, onUpdate, signal);
    }

    return result;
};
