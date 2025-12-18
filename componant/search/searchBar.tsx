"use client";

import { useState } from 'react';
import AdvancedSearch from './advancedSearch';
import AssetCard from '../assets/card';
import { searchAssets } from '@/lib/api'; // เพิ่ม import
import Link from 'next/dist/client/link';

// ใช้ Asset interface จากที่ AssetCard ต้องการ
interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail: string;
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
  fromDate?: Date | null;
  toDate?: Date | null;
  keywords?: string;
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

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
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <input
            placeholder="ค้นหา..."
            className="w-full rounded-full border border-gray-300 px-6 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
        
        <button
          onClick={() => setShowAdvancedSearch(true)}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
          title="ตัวกรองขั้นสูง"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
      </div>

      {/* AdvancedSearch Modal */}
      {showAdvancedSearch && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAdvancedSearch(false)}
          ></div>
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-900">ตัวกรองขั้นสูง</h2>
                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {/* เรียกใช้ AdvancedSearch component */}
                <AdvancedSearch 
                  onSearch={(filters) => {
                    // handleAdvancedSearch(filters);
                    setShowAdvancedSearch(false); // ปิด modal หลังค้นหา
                  }}
                  onClose={() => setShowAdvancedSearch(false)} // เพิ่ม prop onClose
                />
              </div>
              
              {/* ปุ่มที่ด้านล่างถ้าต้องการ */}
              {/* <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowAdvancedSearch(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    // เรียกค้นหา
                    setShowAdvancedSearch(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ค้นหา
                </button>
              </div> */}
            </div>
          </div>
        </>
      )}
      
      {/* ส่วนแสดงผลลัพธ์การค้นหา (คอมเมนต์ไว้) */}
    </div>
  );
}

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //      <input
  //       placeholder="ค้นหา..."
  //       className="w-1/2 rounded-full border px-4 py-2 focus:outline-none"
  //     />
      
  //     {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">ค้นหาไฟล์</h1>
  //     <p className="text-gray-600 mb-8">ใช้ฟอร์มด้านล่างเพื่อค้นหาไฟล์ตามเงื่อนไขที่ต้องการ</p>
  //      */}
  //     {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  //       <div className="lg:col-span-1">
  //         <AdvancedSearch onSearch={handleAdvancedSearch} />
  //       </div>
        
  //       <div className="lg:col-span-3">
  //         {isLoading ? (
  //           <div className="text-center py-12">
  //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //             <p className="mt-4 text-gray-600">กำลังค้นหา...</p>
  //           </div>
  //         ) : searchResults.length > 0 ? (
  //           <>
  //             <div className="mb-6">
  //               <h2 className="text-xl font-semibold text-gray-800">
  //                 ผลลัพธ์การค้นหา ({searchResults.length} รายการ)
  //               </h2>
  //             </div>
  //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //               {searchResults.map((asset) => (
  //                 <AssetCard key={asset.id} asset={asset} />
  //               ))}
  //             </div>
  //           </>
  //         ) : (
  //           <div className="text-center py-12 bg-gray-50 rounded-lg">
  //             <div className="text-gray-400 mb-4">
  //               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  //               </svg>
  //             </div>
  //             <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีผลลัพธ์</h3>
  //             <p className="text-gray-600">ลองเปลี่ยนเงื่อนไขการค้นหาหรือล้างฟิลเตอร์เพื่อเริ่มใหม่</p>
  //           </div>
  //         )}
  //       </div>
  //     </div> */}
  //   </div>
  // );
