'use client';
import { useEffect, useState } from 'react';
import { getAssets, Asset } from '@/lib/api'; 
import AssetCard from '@/componant/assets/card'; 
import Link from 'next/link';

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        setLoading(true);
        // ตรวจสอบ Token ก่อนเรียก API
        if (!localStorage.getItem('token')) {
            setError("กรุณาล็อกอินเพื่อดูรายการ Asset.");
            setLoading(false);
            return;
        }

        const fetchedAssets = await getAssets();
        setAssets(fetchedAssets);
      } catch (err: any) {
        console.error("Error fetching assets:", err);
        // แสดงข้อความ Error ที่มาจาก API หรือการตรวจสอบ Token
        setError(err.message || "ไม่สามารถดึงข้อมูล Asset ได้ กรุณาลองใหม่.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
    
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-center p-10">กำลังโหลด...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-4">
        <div className="text-center p-10 text-red-500">
            <p>{error}</p>
        </div>
        {(error.includes('No token') || error.includes('login')) && (
           <div className='text-center mt-4'>
               <Link href="/login" className="text-blue-500 hover:underline">ไปหน้าเข้าสู่ระบบ</Link>
           </div>
        )}
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4">

      {assets.length === 0 ? (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <p className="text-lg text-gray-500">ไม่พบ Asset ใด ๆ</p>
          <Link href="/upload" className="text-blue-500 hover:underline mt-2 inline-block">
            อัพโหลด Asset ใหม่
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {assets.map((asset) => (
            // The fix in AssetCard.tsx prevents the 'startsWith' error here.
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </main>
  );
}