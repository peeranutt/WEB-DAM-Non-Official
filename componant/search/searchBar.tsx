"use client";

import { useState } from "react";
import AdvancedSearch from "./advancedSearch";
import AssetCard from "../assets/card";
import { searchAssets, quickSearch } from "@/lib/api";
import Link from "next/dist/client/link";

// ใช้ Asset interface จากที่ AssetCard ต้องการ
interface Asset {
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
  title?: string;
  description?: string;
  size?: number;
  createdAt?: string;
}

// Interface สำหรับ response จาก API
interface SearchResponse {
  data?: Asset[];
  assets?: Asset[];
  items?: Asset[];
  results?: Asset[];
  success?: boolean;
  message?: string;
}

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
  const [keyword, setKeyword] = useState("");

  // แก้ไข: เปลี่ยนพารามิเตอร์เป็น string
  const handleQuickSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await quickSearch(searchTerm);
      
      // แก้ไข: ดึงข้อมูล assets จาก response
      let assets: Asset[] = [];
      
      if (Array.isArray(response)) {
        // ถ้า response เป็น array โดยตรง
        assets = response;
      } else if (response && typeof response === 'object') {
        // ถ้า response เป็น object ที่มี properties ต่างๆ
        const res = response as SearchResponse;
        assets = res.data || res.assets || res.items || res.results || [];
      }
      
      setSearchResults(assets);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // เพิ่มฟังก์ชันสำหรับ advanced search
  const handleAdvancedSearch = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const response = await searchAssets(filters);
      
      // ดึงข้อมูล assets จาก response
      let assets: Asset[] = [];
      
      if (Array.isArray(response)) {
        assets = response;
      } else if (response && typeof response === 'object') {
        const res = response as SearchResponse;
        assets = res.data || res.assets || res.items || res.results || [];
      }
      
      setSearchResults(assets);
    } catch (error) {
      console.error("Advanced search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับกด Enter ในช่องค้นหา
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keyword.trim()) {
      handleQuickSearch(keyword.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <input
            placeholder="ค้นหา..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
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
          <button 
            onClick={() => handleQuickSearch(keyword.trim())}
            disabled={!keyword.trim() || isLoading}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 rounded-full transition-colors ${
              keyword.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "กำลังค้นหา..." : "ค้นหา"}
          </button>
        </div>

        <button
          onClick={() => setShowAdvancedSearch(true)}
          disabled={isLoading}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors shadow-md ${
            isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowAdvancedSearch(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  ตัวกรองขั้นสูง
                </h2>
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
                <AdvancedSearch
                  onSearch={(filters) => {
                    handleAdvancedSearch(filters);
                    setShowAdvancedSearch(false);
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            ผลการค้นหา ({searchResults.length} รายการ)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((asset) => (
              <Link key={asset.id} href={`/assets/${asset.id}`}>
                <AssetCard asset={asset} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && searchResults.length === 0 && keyword && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500">ไม่พบผลลัพธ์สำหรับ "{keyword}"</p>
        </div>
      )}

      {/* Initial State */}
      {!isLoading && searchResults.length === 0 && !keyword && (
        <div className="mt-12 text-center text-gray-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <p>กรอกคำค้นหาเพื่อเริ่มต้น</p>
          <p className="text-sm mt-2">หรือใช้ตัวกรองขั้นสูงสำหรับการค้นหาที่ละเอียด</p>
        </div>
      )}
    </div>
  );
}