"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageOrText({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="p-4 text-center">
        <span className="text-4xl text-gray-500">📄</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      onError={() => setError(true)}
    />
  );
}
