export interface UploadedFile {
    file: File;
    preview: string;
    type: 'image' | 'video';
    uploadProgress?: number;
}

export interface DetectionResult {
    accidentDetected: boolean;
    bestConfidence?: number;
    label?: string | null;
    imageUrl?: string | null;
    boxes?: any[];
    /** URL of the frame immediately BEFORE the impact moment */
    beforeSnapshotUrl?: string | null;
    /** URL of the annotated frame AT the impact moment */
    afterSnapshotUrl?: string | null;
}

export interface UploadStats {
    totalUploads: number;
    accidentsDetected: number;
    avgConfidence: number;
    recentUploads: number;
}
