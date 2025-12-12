// web-dam/lib/api.ts
export interface UploadResponse {
    success: boolean;
    jobId: string;
    filename: string;
    message: string;
}

export interface JobStatus {
    id: string;
    state: 'waiting' | 'active' | 'completed' | 'failed';
    progress: number;
    result?: {
    success: boolean;
    filename: string;
    thumbnail?: string;
    optimized?: string;
    metadata?: {
      width: number;
      height: number;
      format: string;
    };
    assetId?: number;
  };
  timestamp: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', async () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse response'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', `${API_URL}/assets/upload`);
    xhr.send(formData);
  });
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_URL}/assets/job/${jobId}`);

  if (!response.ok) {
    throw new Error('Failed to get job status');
  }

  return response.json();
}

export async function getAsset(assetId: number) {
  const response = await fetch(`${API_URL}/assets/${assetId}`);
  if (!response.ok) {
    throw new Error('Failed to get asset');
  }
  return response.json();
}

export async function getMetadataFields() {
  const response = await fetch(`${API_URL}/assets/metadata-fields`);
  if (!response.ok) {
    throw new Error('Failed to get metadata fields');
  }
  return response.json();
}

export async function saveAssetMetadata(
  assetId: number,
  metadata: { fieldId: number; value: string }[]
) {
  const response = await fetch(`${API_URL}/assets/${assetId}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metadata }),
  });
  if (!response.ok) {
    throw new Error('Failed to save metadata');
  }
  return response.json();
}