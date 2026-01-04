"use client";
import {
  Home,
  Upload,
  LogIn,
  FolderClosed,
  History,
  Trash2,
  Server,
  FileChartLine,
  Search ,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SearchPage from "./search/searchBar";

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="">
      <nav className="w-64 h-screen bg-[#F8FAFD] shadow-lg fixed left-0 top-0 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b">
          <a href="/" className="text-2xl font-bold text-gray-800">
            DAM System
          </a>
        </div>

        {/* Menu */}
        <div className="flex-1 flex flex-col py-4 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <Home size={18} />
            หน้าหลัก
          </a>

          <button
            onClick={() => router.push("/search")}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <Search size={18} />
            ค้นหา
          </button>

          <button
            onClick={() => router.push("/upload")}
            className="w-full flex items-center gap-3 px-6 py-3 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <Upload size={18} />
            อัปโหลด
          </button>

          <a
            href="/collection"
            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <FolderClosed size={18} />
            กลุ่ม
          </a>

          <a
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <Trash2 size={18} />
            ถังขยะ
          </a>

          <a
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <Server size={18} />
            พื้นที่เก็บข้อมูล
          </a>

          <a
            href="/"
            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium"
          >
            <FileChartLine size={18} />
            รายงาน
          </a>
        </div>
        
      </nav>
    </div>
  );
}
