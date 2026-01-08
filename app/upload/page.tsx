"use client";
import Navbar from "../../componant/nav";
import UploadAssets from "../../componant/assets/assetUpload";

export default function Upload() {
  return (
    <div>
      <Navbar />
      <main className="ml-64 flex-1">
        <UploadAssets />
      </main>
    </div>
  );
}
