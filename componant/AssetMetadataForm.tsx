import { useState, useEffect } from 'react';
import { getMetadataFields, saveAssetMetadata } from '@/lib/api';

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

  useEffect(() => {
    getMetadataFields().then(setFields).catch(console.error).finally(() => setLoading(false));
  }, []);

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
      alert('Metadata saved successfully!');
    } catch (error) {
      console.error('Error saving metadata:', error);
      alert('Failed to save metadata');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading metadata fields...</p>;

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
      <h3 className="font-medium text-blue-900 mb-3">Asset Information</h3>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700">
              {field.name}
            </label>
            {field.type === 'text' && (
              <input
                type="text"
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            )}
            {field.type === 'date' && (
              <input
                type="date"
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
              />
            )}
            {field.type === 'select' && (
              <select
                value={formData[field.id] || ''}
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
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Asset Information'}
      </button>
    </div>
  );
}