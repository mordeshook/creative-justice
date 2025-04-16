"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageUploadPreview({ file, setFile }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">Upload Thumbnail or Asset</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <div className="mt-3">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={200}
            className="border rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
