"use client";
import { useState, useEffect } from "react";
import { getAsset, getMetadataFields, saveAssetMetadata } from "@/lib/api";
import ImageOrText from "./assets/image-error";

interface MetadataField {
  id: number;
  name: string;
  name_th: string;
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    // ดึงข้อมูล Field
    getMetadataFields()
      .then(setFields)
      .catch(console.error)
      .finally(() => setLoading(false));

    if (!isNaN(assetId) && assetId > 0) {
      // getAsset(assetId) ส่ง number ไป
      console.log("Fetching asset details for ID:", assetId);
      getAsset(assetId)
        .then((details) => {
          console.log("Asset details received:", details);
          const thumbnailPath = details.thumbnail;

          if (thumbnailPath) {
            setThumbnailUrl(`${API_BASE_URL}/assets/file/${details.id}`);
          } else {
            setThumbnailUrl(null);
          }

          // set metadata form data
          if (details.metadata && details.metadata.length > 0) {
            console.log("Asset metadata:", details.metadata);

            const mappedFormData: { [key: number]: string } = {};

            details.metadata.forEach((item: any) => {
              let value = item.value;

              // ถ้าเป็น date → แปลง ISO เป็น yyyy-MM-dd
              if (item.field?.type === "date" && value) {
                console.log("Original date value:", value);
                console.log("Converted date value:", value.split("T")[0]);
                value = value.split("T")[0];
              }

              mappedFormData[item.field_id] = value;
            });

            setFormData(mappedFormData);
          }
        })
        .catch((error) => {
          console.error(
            `Error fetching asset details for ID ${assetId}:`,
            error
          );
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
    <div className="max-w-4xl mx-auto p-6 ">
      <h3 className="font-medium text-black-900 mb-3">ข้อมูลเมตา</h3>
      <div className="flex flex-row justify-between">
        <pre>{JSON.stringify(fields, null, 2)}</pre>
        <div className="space-y-3 w-full">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700">
                {field.name_th}
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
              {/* {field.type === "select" && (
                <select
                  value={formData[field.id] || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                >
                  <option value="">เลือก...</option>
                  {field.options &&
                    JSON.parse(field.options).map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              )} */}
            </div>
          ))}
        </div>

        <div className="w-2/5 p-4 border rounded-lg bg-white shadow-sm self-start">
          {assetError && <p className="text-red-500 text-sm">{assetError}</p>}
          {thumbnailUrl ? (
            <ImageOrText src={thumbnailUrl} alt="photo" />
          ) : (
            <div className="bg-gray-200 h-48 flex items-center justify-center rounded text-gray-500">
              <p>ไม่มีรูปภาพ</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() =>
          window.open(`${API_BASE_URL}/assets/${assetId}/download`, "_blank")
        }
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ดาวน์โหลดไฟล์
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "บันทึก"}
      </button>
    </div>
  );
}
