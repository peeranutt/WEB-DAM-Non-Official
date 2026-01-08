import { sha265 } from "./hash";

export interface UploadResponse {
  success: boolean;
  jobId: string;
  filename: string;
  message: string;
}

export interface JobStatus {
  id: string;
  state: "waiting" | "active" | "completed" | "failed";
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

export interface Asset {
  id: number;
  original_name: string;
  filename: string;
  thumbnail: string | null;
  file_type: string;
  file_size: number | string;
  path: string;
  keywords: string[];
  status: string;
  create_by: number;
  created_at: string;
  updated_at: string;
  metadata?: [];
}

export interface SearchFilters {
  filename?: string;
  type?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  keywords?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
}

export interface SearchResponse {
  success: boolean;
  data: Asset[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: SearchFilters;
}

const API_URL = process.env.NEXT_PUBLIC_API;

const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  return query.toString();
};

export async function uploadFiles(
  files: File[],
  onProgress?: (p: number) => void,
  storageLocation?: string
): Promise<{ jobs: { jobId: string; filename: string }[] }> {
  const formData = new FormData();

  for (const file of files){
    const checksum = await sha265(file);
    formData.append("files", file);
    formData.append("checksums", checksum);
  }
  console.log("Uploading to storage location:", storageLocation);

  if (storageLocation) {
    formData.append("storageLocation", storageLocation);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true; // ส่ง cookie

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress((e.loaded / e.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText));
      }
    };

    xhr.open("POST", `${API_URL}/assets/upload?storageLocation=${storageLocation}`, true);
    xhr.send(formData);
    console.log('File upload request sent.', { files, storageLocation });
  });
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await fetch(`${API_URL}/assets/job/${jobId}`);

  if (!response.ok) {
    throw new Error("Failed to get job status");
  }

  return response.json();
}

export async function getAssets(): Promise<Asset[]> {

  const res = await fetch(`${API_URL}/assets`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch assets:", await res.text());
    return [];
  }

  return res.json();
}

export async function getAsset(assetId: number): Promise<Asset> {

  const response = await fetch(`${API_URL}/assets/${assetId}`, {
    credentials: 'include',
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to get asset");
  }

  return response.json() as Promise<Asset>;
}

export async function getMetadataFields() {
  const response = await fetch(`${API_URL}/assets/metadata-fields`);
  if (!response.ok) {
    throw new Error("Failed to get metadata fields");
  }
  return response.json();
}

export async function saveAssetMetadata(
  assetId: number,
  metadata: { fieldId: number; value: string }[]
) {
  const response = await fetch(`${API_URL}/assets/${assetId}/metadata`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ metadata }),
  });
  if (!response.ok) {
    throw new Error("Failed to save metadata");
  }
  return response.json();
}

export async function createGroup(name: string, description?: string) {
  const response = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create group');
  }
  return response.json();
}

export async function getUserGroups() {
  const response = await fetch(`${API_URL}/groups`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to get groups');
  }
  return response.json();
}

export async function createCollection(name: string, description?: string) {
  const response = await fetch(`${API_URL}/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create collection');
  }
  return response.json();
}

export async function getCollections() {
  const response = await fetch(`${API_URL}/collections`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to get collections');
  }
  return response.json();
}

export async function addGroupMember(groupId: number, username: string, permission?: string) {
  const response = await fetch(`${API_URL}/groups/${groupId}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, permission }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to add member');
  }
  return response.json();
}

export async function removeGroupMember(groupId: number, userId: number) {
  const response = await fetch(`${API_URL}/groups/${groupId}/members/${userId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to remove member');
  }
  return response.json();
}

export async function updateGroupMemberPermission(groupId: number, userId: number, permission: string) {
  console.log("Updating permission:", { groupId, userId, permission });
  const response = await fetch(`${API_URL}/groups/${groupId}/members/${userId}/permission`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ permission }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to update member permission');
  }
  return response.json();
}

export async function getGroupMembers(groupId: number) {
  const response = await fetch(`${API_URL}/groups/${groupId}/members`, {
    credentials: 'include',
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to get members');
  }
  return response.json();
}

export const searchAssets = async (
  filters: SearchFilters
): Promise<SearchResponse> => {
  const query = buildQuery({
    ...filters,
    fromDate: filters.fromDate?.toISOString(),
    toDate: filters.toDate?.toISOString(),
  });

  const res = await fetch(`${API_URL}/search/advanced?${query}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const getSearchFilters = async () => {
  try {
    console.log("Attempting to fetch filters from API...");

    const response = await fetch(`${API_URL}/search/filters`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Filters fetched successfully:", data);
      return data;
    } else {
      console.warn("API filters endpoint failed, using mock data");
    }
  } catch (error) {
    console.warn("Error fetching filters, using mock data:", error);
  }
};

export const quickSearch = async (query: string) => {
  const res = await fetch(
    `${API_URL}/search/quick?${buildQuery({ q: query })}`
  );
  if (!res.ok) throw new Error("Quick search failed");
  return res.json();
};
