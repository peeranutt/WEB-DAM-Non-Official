import Navbar from "@/componant/nav";
import AssetMetadataForm from "@/componant/AssetMetadataForm";

export default async function MetadataPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const resolvedParams = await params;
  const assetIdString = resolvedParams.assetId || "";

  console.log("MetadataPage received params.assetId:", assetIdString);

  if (!assetIdString || isNaN(Number(assetIdString))) {
    console.log("Invalid asset ID:", assetIdString);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Invalid Asset ID</h1>
        <p className="mt-4">Asset ID must be a number.</p>
        <p>Received: {assetIdString || "(empty)"}</p>
      </div>
    );
  }

  const assetId = parseInt(assetIdString, 10);

  console.log("MetadataPage received assetId:", assetId);

  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <AssetMetadataForm assetId={assetId} />
      </main>
    </div>
  );
}
