"use client";
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { getSearchFilters } from '@/lib/api';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  name?: string;
  type?: string;
  collection?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  keywords?: string;
}

interface FilterOptions {
  types: string[];
  collections: string[];
  keywords: string[];
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    collections: [],
    keywords: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // ดึงตัวกรองที่มีอยู่
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await getSearchFilters();
        setFilterOptions(data);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };
    loadFilters();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, field: 'fromDate' | 'toDate') => {
    setFilters(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSearch(filters);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">การค้นหาขั้นสูง</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ชื่อ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ
          </label>
          <input
            type="text"
            name="name"
            value={filters.name || ''}
            onChange={handleInputChange}
            placeholder="ค้นหาด้วยชื่อไฟล์"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ประเภท */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ประเภท
          </label>
          {/* <select
            name="type"
            value={filters.type || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกประเภททั้งหมด</option>
            {filterOptions.types.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select> */}
        </div>

        {/* คอลเลคชัน */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            คอลเลคชัน
          </label>
          {/* <select
            name="collection"
            value={filters.collection || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">เลือกคอลเลคชันทั้งหมด</option>
            {filterOptions.collections.map(collection => (
              <option key={collection} value={collection}>
                {collection}
              </option>
            ))}
          </select> */}
        </div>

        {/* วันที่แก้ไขล่าสุด */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            วันที่แก้ไขล่าสุด
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">จากวันที่</label>
              <DatePicker
                selected={filters.fromDate || null}
                onChange={(date) => handleDateChange(date, 'fromDate')}
                dateFormat="dd/MM/yyyy"
                placeholderText="วันที่เริ่มต้น"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">ถึงวันที่</label>
              <DatePicker
                selected={filters.toDate || null}
                onChange={(date) => handleDateChange(date, 'toDate')}
                dateFormat="dd/MM/yyyy"
                placeholderText="วันที่สิ้นสุด"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* คำสำคัญ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            คำสำคัญ
          </label>
          <input
            type="text"
            name="keywords"
            value={filters.keywords || ''}
            onChange={handleInputChange}
            placeholder="ป้อนคำสำคัญ (คั่นด้วย comma)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* {filterOptions.keywords.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">คำสำคัญที่มี:</p>
              <div className="flex flex-wrap gap-1">
                {filterOptions.keywords.slice(0, 10).map(keyword => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      const current = filters.keywords || '';
                      const keywords = current ? current.split(',').map(k => k.trim()) : [];
                      if (!keywords.includes(keyword)) {
                        const newKeywords = [...keywords, keyword].join(', ');
                        setFilters(prev => ({ ...prev, keywords: newKeywords }));
                      }
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )} */}
        </div>

        {/* ปุ่ม */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            ล้าง
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังค้นหา...
              </span>
            ) : (
              'ค้นหา'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}