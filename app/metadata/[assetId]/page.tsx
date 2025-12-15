import Navbar from "@/componant/nav";
import AssetMetadataForm from "@/componant/AssetMetadataForm";

export default function MetadataPage({ params }: { params: { assetId: string } }) {
  console.log("MetadataPage received params.assetId:", params.assetId);
  const assetId = parseInt(params.assetId, 10);
  
  console.log("MetadataPage received assetId:", assetId);

  if (isNaN(assetId) || assetId <= 0) {
    return (
        <div className="mt-20 p-6 max-w-lg mx-auto bg-red-50 rounded-lg border border-red-200">
            <h1 className="text-xl font-semibold text-red-800">Error: Invalid Asset ID provided.</h1>
            <p className="text-sm text-red-600 mt-2">โปรดตรวจสอบ URL, Asset ID ต้องเป็นตัวเลขจำนวนเต็มบวก</p>
        </div>
    )
  }

  return (
    <div>
      <Navbar />
      <AssetMetadataForm assetId={assetId} />
    </div>
  );
}