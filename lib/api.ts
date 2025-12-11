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
  };
  timestamp: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/assets/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_URL}/assets/job/${jobId}`);

  if (!response.ok) {
    throw new Error('Failed to get job status');
  }

  return response.json();
}
