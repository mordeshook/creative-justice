// Component: ImageUploadDialog.jsx

"use client";

import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

export default function ImageUploadDialog({ isOpen, onClose, onUpload }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleConfirm = () => {
    if (file) {
      onUpload(preview, file);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setFile(null);
    inputRef.current.value = "";
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Upload Image
          </Dialog.Title>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Preview" className="max-w-full max-h-64 rounded border" />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button onClick={handleClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!file}>
              Confirm
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
