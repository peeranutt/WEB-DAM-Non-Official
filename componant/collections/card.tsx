import Image from "next/image";

export default function CollectionCard({
  title,
  image,
  create,
}: {
  title?: string;
  image?: string;
  create?: boolean;
}) {
  if (create) {
    return (
      <div className="h-40 rounded-xl bg-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-400">
        <span className="text-3xl">+</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border hover:shadow-md cursor-pointer">
      <div className="h-28 bg-gray-400 relative">
        {image && (
          <Image
            src={image}
            alt={title || ""}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="px-3 py-2 flex justify-between items-center">
        <span className="font-medium">{title}</span>
        <span>⋮</span>
      </div>
    </div>
  );
}
