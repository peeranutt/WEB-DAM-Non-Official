import Navbar from "@/componant/nav";
import AssetMetadataForm from "@/componant/AssetMetadataForm";

export default async function MetadataPage({
  params,
}: {
  params: { assetId: string | undefined };
}) {
  const assetIdString = String(params.assetId ?? "");

  console.log("MetadataPage received params.assetId:", assetIdString);
  const assetId = parseInt(assetIdString, 10);

  console.log("MetadataPage received assetId:", assetId);

  if (isNaN(assetId) || assetId <= 0) {
    return (
      <div className="mt-20 p-6 max-w-lg mx-auto bg-red-50 rounded-lg border border-red-200">
        <h1 className="text-xl font-semibold text-red-800">
          Error: Invalid Asset ID provided.
        </h1>
        <p className="text-sm text-red-600 mt-2">
          โปรดตรวจสอบ URL, Asset ID ต้องเป็นตัวเลขจำนวนเต็มบวก
        </p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <AssetMetadataForm assetId={assetId} />
      </main>
    </div>
  );
}
