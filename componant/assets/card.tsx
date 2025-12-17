// componant/AssetCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Asset } from "@/lib/api";
import ImageOrText from "./image-error";
// import content from "./";

interface AssetCardProps {
  asset: Asset;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

export default function AssetCard({ asset }: AssetCardProps) {
    const fileType = asset.file_type ? asset.file_type.toLowerCase() : '';
    const isImage = 
    fileType.startsWith('image/') || 
    fileType === 'png' || 
    fileType === 'jpg' || 
    fileType === 'jpeg' || 
    fileType === 'gif' ||
    fileType === 'webp';

  const imageUrl = `${API_BASE_URL}/assets/file/${asset.id}`;
  console.log(`Image URL for asset ID ${asset.id}: ${imageUrl}`);

  console.log(`Asset file_type for asset ID ${asset.id}: ${asset.file_type}`);

//   const isImage =
//     typeof asset.file_type === "string" && asset.file_type.startsWith("image/");
  // const isImage = true;
  console.log(`Asset ID ${asset.id} isImage: ${isImage}`);

  const metadataUrl = `/metadata/${asset.id}`;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={metadataUrl} className="block">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
          
          <ImageOrText
            src={imageUrl}
            alt="photo"
          />
          {/* {isImage ? (
            // แสดงรูปภาพ
           
            <Image 
              src={imageUrl}
              alt={asset.filename} 
              fill 
              style={{ objectFit: 'cover' }} 
              className="group-hover:opacity-80 transition-opacity"
              // ควรเพิ่ม sizes และกำหนด hostname ใน next.config.js
            />
          ) : (
            // แสดง icon หรือข้อความสำหรับไฟล์ที่ไม่ใช่รูปภาพ หรือ file_type เป็น undefined
            <div className="p-4 text-center">
              <span className="text-4xl text-gray-500">📄</span> 
              <p className="text-sm text-gray-600 mt-2 truncate">
                5555{asset.file_type || 'Unknown Type'}
              </p>
            </div>
          )} */}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold truncate" title={asset.filename}>
            {asset.filename}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{asset.file_type}</p>
        </div>
      </Link>
    </div>
  );
}
