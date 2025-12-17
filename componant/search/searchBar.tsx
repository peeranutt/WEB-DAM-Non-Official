// app/search/page.tsx
"use client";

import { useState } from 'react';
import AdvancedSearch from './advancedSearch';
import AssetCard from '../assets/card';
import { searchAssets } from '@/lib/api'; // เพิ่ม import

// ใช้ Asset interface จากที่ AssetCard ต้องการ
interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail: string;
  collection: string;
  updatedAt: string;
  keywords: string[];
  filename: string;           // เพิ่มจาก error
  filePath: string;           // เพิ่มจาก error
  fileMimeType: string;       // เพิ่มจาก error
  file_type: string;          // เพิ่มจาก error
  // เพิ่ม properties อื่นๆ ตามที่ AssetCard ต้องการ
  title?: string;
  description?: string;
  size?: number;
  createdAt?: string;
}

// อัพเดท SearchFilters ให้ตรงกับที่ AdvancedSearch ใช้
interface SearchFilters {
  name?: string;
  type?: string;
  collection?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  keywords?: string;
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdvancedSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      // ส่ง request ไปยัง API
      const response = await searchAssets(filters);
      
      // แปลงข้อมูลให้ตรงกับ Asset interface
      const formattedResults = response.data.map((item: any) => ({
        id: item.id,
        name: item.name || item.title || '',
        type: item.type || item.file_type || '',
        url: item.url || item.filePath || '',
        thumbnail: item.thumbnail || item.url || '',
        collection: item.collection || '',
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        keywords: item.keywords || [],
        filename: item.filename || item.name || '',
        filePath: item.filePath || item.url || '',
        fileMimeType: item.fileMimeType || item.type || '',
        file_type: item.file_type || item.type || '',
        title: item.title || item.name || '',
        description: item.description || '',
        size: item.size || 0,
        createdAt: item.createdAt || item.updatedAt || new Date().toISOString(),
      }));
      
      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ค้นหาไฟล์</h1>
      <p className="text-gray-600 mb-8">ใช้ฟอร์มด้านล่างเพื่อค้นหาไฟล์ตามเงื่อนไขที่ต้องการ</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar สำหรับ Advanced Search */}
        <div className="lg:col-span-1">
          <AdvancedSearch onSearch={handleAdvancedSearch} />
        </div>
        
        {/* ผลลัพธ์การค้นหา */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">กำลังค้นหา...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  ผลลัพธ์การค้นหา ({searchResults.length} รายการ)
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีผลลัพธ์</h3>
              <p className="text-gray-600">ลองเปลี่ยนเงื่อนไขการค้นหาหรือล้างฟิลเตอร์เพื่อเริ่มใหม่</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}