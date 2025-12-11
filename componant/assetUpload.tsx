'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { uploadFile, getJobStatus, JobStatus } from '@/lib/api';

interface UploadJob {
  jobId: string;
  filename: string;
  status: JobStatus | null;
  file: File;
}

export default function AssetUploader() {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervals = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const status = await getJobStatus(jobId);
      
      setJobs(prev =>
        prev.map(job =>
          job.jobId === jobId ? { ...job, status } : job
        )
      );

      // หยุด polling ถ้า job เสร็จแล้ว
      if (status.state === 'completed' || status.state === 'failed') {
        const interval = pollIntervals.current.get(jobId);
        if (interval) {
          clearInterval(interval);
          pollIntervals.current.delete(jobId);
        }
      }
    } catch (error) {
      console.error('Error polling job status:', error);
    }
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Upload file
        const response = await uploadFile(file);
        
        // เพิ่ม job ใหม่
        const newJob: UploadJob = {
          jobId: response.jobId,
          filename: response.filename,
          status: null,
          file,
        };
        
        setJobs(prev => [...prev, newJob]);

        // เริ่ม polling status ทุก 1 วินาที
        const interval = setInterval(() => {
          pollJobStatus(response.jobId);
        }, 1000);
        
        pollIntervals.current.set(response.jobId, interval);
        
        // Poll ครั้งแรกทันที
        pollJobStatus(response.jobId);
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      pollIntervals.current.forEach(interval => clearInterval(interval));
      pollIntervals.current.clear();
    };
  }, []);

  const getStateColor = (state?: string) => {
    switch (state) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'active':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStateIcon = (state?: string) => {
    switch (state) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✗';
      case 'active':
        return '⟳';
      default:
        return '○';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Asset Uploader</h1>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          accept="image/*,video/*"
        />
        
        <div className="space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <p className="text-lg font-medium">
              Drag and drop files here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click the button below
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Select Files
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Upload Queue</h2>
          
          {jobs.map((job) => (
            <div
              key={job.jobId}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium">{job.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(job.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${getStateColor(job.status?.state)}`}>
                    {getStateIcon(job.status?.state)}
                  </span>
                  <span className={`text-sm font-medium ${getStateColor(job.status?.state)}`}>
                    {job.status?.state || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {job.status && job.status.state !== 'completed' && (
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.status.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {job.status.progress || 0}% complete
                  </p>
                </div>
              )}

              {/* Results */}
              {job.status?.state === 'completed' && job.status.result && (
                <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    Processing completed!
                  </p>
                  
                  {job.status.result.thumbnail && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Thumbnail:</p>
                        <img
                          src={`http://localhost:3001/uploads/${job.status.result.thumbnail}`}
                          alt="Thumbnail"
                          className="rounded border"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Optimized:</p>
                        <img
                          src={`http://localhost:3001/uploads/${job.status.result.optimized}`}
                          alt="Optimized"
                          className="rounded border"
                        />
                      </div>
                    </div>
                  )}

                  {job.status.result.metadata && (
                    <div className="mt-2 text-xs text-gray-600">
                      <p>Dimensions: {job.status.result.metadata.width} × {job.status.result.metadata.height}</p>
                      <p>Format: {job.status.result.metadata.format}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {job.status?.state === 'failed' && (
                <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                  <p className="text-sm text-red-800">
                    Processing failed. Please try again.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}