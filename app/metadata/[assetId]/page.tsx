import Navbar from "@/componant/nav";
import AssetMetadataForm from "@/componant/AssetMetadataForm";

export default function MetadataPage({ params }: { params: { assetId: number } }) {
  const assetId = params.assetId;

  return (
    <div>
      <Navbar />
      <AssetMetadataForm assetId={assetId} />
    </div>
  );
}