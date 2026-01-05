import { sha265 } from "./hash";
const mockFilters = {
  success: true,
  data: {
    types: ["image", "video", "document", "audio"],
    keywords: [
      "logo",
      "banner",
      "header",
      "footer",
      "icon",
      "profile",
      "product",
      "event",
      "social",
      "web",
      "design",
      "brand",
      "marketing",
    ],
  },
};

const mockAssets = [
  {
    id: 1,
    name: "Company Logo",
    filename: "logo.png",
    filePath: "/assets/logo.png",
    fileMimeType: "image/png",
    file_type: "image",
    type: "image",
    url: "http://localhost:3001/uploads/logo.png",
    thumbnail: "http://localhost:3001/uploads/thumbnails/logo.png",
    collection: "brand",
    keywords: ["logo", "brand", "identity"],
    size: 5120,
    updatedAt: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-10T14:20:00Z",
  },
  {
    id: 2,
    name: "Product Banner",
    filename: "banner.jpg",
    filePath: "/assets/banner.jpg",
    fileMimeType: "image/jpeg",
    file_type: "image",
    type: "image",
    url: "http://localhost:3001/uploads/banner.jpg",
    thumbnail: "http://localhost:3001/uploads/thumbnails/banner.jpg",
    collection: "marketing",
    keywords: ["banner", "promotion", "product"],
    size: 10240,
    updatedAt: "2024-01-14T09:15:00Z",
    createdAt: "2024-01-12T11:45:00Z",
  },
  {
    id: 3,
    name: "User Manual",
    filename: "manual.pdf",
    filePath: "/assets/manual.pdf",
    fileMimeType: "application/pdf",
    file_type: "document",
    type: "document",
    url: "http://localhost:3001/uploads/manual.pdf",
    thumbnail: "http://localhost:3001/uploads/thumbnails/manual.png",
    collection: "product",
    keywords: ["document", "manual", "guide"],
    size: 20480,
    updatedAt: "2024-01-13T16:20:00Z",
    createdAt: "2024-01-11T08:30:00Z",
  },
];

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
  onProgress?: (p: number) => void
): Promise<{ jobs: { jobId: string; filename: string }[] }> {
  const formData = new FormData();

  for (const file of files){
    const checksum = await sha265(file);
    formData.append("files", file);
    formData.append("checksums", checksum);
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

    xhr.open("POST", `${API_URL}/assets/upload`, true);
    xhr.send(formData);
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
    // ถ้า API ไม่พร้อมให้ใช้ mock data
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
      return mockFilters;
    }
  } catch (error) {
    console.warn("Error fetching filters, using mock data:", error);
    return mockFilters;
  }
};

export const quickSearch = async (query: string) => {
  const res = await fetch(
    `${API_URL}/search/quick?${buildQuery({ q: query })}`
  );
  if (!res.ok) throw new Error("Quick search failed");
  return res.json();
};
