"use client";
import { useState, useEffect } from "react";
import { getAsset, getMetadataFields, saveAssetMetadata } from "@/lib/api";

interface MetadataField {
  id: number;
  name: string;
  type: string;
  options?: string;
}

export default function AssetMetadataForm({ assetId }: { assetId: number }) {
  const [fields, setFields] = useState<MetadataField[]>([]);
  const [formData, setFormData] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);

  useEffect(() => {
    // ดึงข้อมูล Field
    getMetadataFields()
      .then(setFields)
      .catch(console.error)
      .finally(() => setLoading(false));

    // 2. Logic: ดึงข้อมูล Asset Detail และ Thumbnail
    // const assetIdNum = parseInt(assetId); // แปลงเป็นตัวเลขสำหรับ API ถ้าจำเป็น

    if (!isNaN(assetId) && assetId > 0) {
      getAsset(assetId)
        .then((details) => {
          if (details.thumbnailPath) {
            // สร้าง URL เต็มรูปแบบสำหรับรูปภาพ
            setThumbnailUrl(
              `http://localhost:3001/uploads/${details.thumbnailPath}`
            );
          } else {
            setThumbnailUrl(null); // ไม่มี Thumbnail
          }
          // ถ้ามีข้อมูล Metadata ที่บันทึกไว้ก่อนหน้า สามารถใช้ details.metadata เพื่อตั้งค่า formData ได้ที่นี่
        })
        .catch((error) => {
          console.error("Error fetching asset details:", error);
          setAssetError("ไม่สามารถดึงข้อมูลพรีวิวของ Asset ได้");
        });
    }
  }, [assetId]);

  const handleInputChange = (fieldId: number, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const metadata = Object.entries(formData).map(([fieldId, value]) => ({
        fieldId: parseInt(fieldId),
        value,
      }));

      await saveAssetMetadata(assetId, metadata);
      alert("Metadata saved successfully!");
    } catch (error) {
      console.error("Error saving metadata:", error);
      alert("Failed to save metadata");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading metadata fields...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-green-100">
      <h3 className="font-medium text-blue-900 mb-3">ข้อมูลเมตา</h3>
      <div className="flex flex-row justify-between">
        <div className="space-y-3 w-full">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700">
                {field.name}
              </label>
              {field.type === "text" && (
                <input
                  type="text"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                />
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                />
              )}
              {field.type === "select" && (
                <select
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                >
                  <option value="">Select...</option>
                  {field.options &&
                    JSON.parse(field.options).map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <div className="w-2/5 p-4 border rounded-lg bg-white shadow-sm self-start">
          <p className="font-medium text-gray-700 mb-2">Asset Preview</p>
           {assetError && <p className="text-red-500 text-sm">{assetError}</p>}
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={`Preview of Asset ID ${assetId}`}
              className="w-full h-auto rounded-md object-contain border"
            />
          ) : (
            <div className="bg-gray-200 h-48 flex items-center justify-center rounded text-gray-500">
              {/* แสดงข้อความแจ้ง หากไม่มี Thumbnail */}
              <p>No preview available</p>
            </div>
          )}
        </div>
        
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Asset Information"}
      </button>
    </div>
  );
}
