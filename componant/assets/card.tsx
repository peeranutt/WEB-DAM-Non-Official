// componant/AssetCard.tsx
import Link from "next/link";
import { Asset } from "@/lib/api";
import ImageOrText from "./image-error";

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

  const imageUrl = `${API_BASE_URL}/assets/file/${asset.id}?type=thumb`;
  console.log(`Image URL for asset ID ${asset.id}: ${imageUrl}`);

  console.log(`Asset file_type for asset ID ${asset.id}: ${asset.file_type}`);

  console.log(`Asset ID ${asset.id} isImage: ${isImage}`);

  const metadataUrl = `/metadata/${asset.id}`;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={metadataUrl} className="block">
        <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
          
          <ImageOrText
            src={imageUrl}
            alt={asset.filename}
          />
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
