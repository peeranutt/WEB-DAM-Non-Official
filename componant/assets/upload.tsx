"use client";

export default function UploadAssets() {
    const handleBrowse = () => {
        document.getElementById("upload-input")?.click();
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        const foemData = new FormData();
        foemData.append("file", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/assets/upload`, {
            method: "POST",
            body: foemData,
        });

        const data = await res.json();
        console.log("data ", data);
        alert("Upload successful!");
    }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex items-center justify-center w-1/3">
        <div className="flex flex-col items-center justify-center w-full h-64 bg-neutral-secondary-medium border border-dashed border-default-strong rounded-base">
          <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
              />
            </svg>
            <p className="mb-2 text-sm">Click the button below to upload</p>

            <button
              type="button"
              onClick={handleBrowse}
              className="inline-flex items-center text-white bg-blue-600 hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2"
            >
              Browse file
            </button>
          </div>
        </div>
        <input 
        id="upload-input" 
        type="file" 
        className="hidden"
        onChange={handleUpload} />
      </div>
    </div>
  );
}
