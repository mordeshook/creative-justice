"use client";

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'cropperjs/dist/cropper.css';
import { supabase } from '@/lib/supabaseClient';

// Dynamically import cropper to avoid SSR issues
const Cropper = dynamic(() => import('react-cropper'), { ssr: false });

export default function ImageCropPage() {
  const cropperRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState('free');
  const [publicUrl, setPublicUrl] = useState(null);

  const onSelectImage = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setPublicUrl(null);
    };
    reader.readAsDataURL(files[0]);
  };

  const onRatioChange = (ratio) => {
    setSelectedRatio(ratio);
    if (!cropperRef.current) return;
    const cropper = cropperRef.current.cropper;
    cropper.setAspectRatio(
      ratio === 'free' ? NaN : 
      ratio === '1:1' ? 1 : 
      ratio === '16:9' ? 16 / 9 : 
      ratio === '9:16' ? 9 / 16 : NaN
    );
  };

  const handleDownload = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleUpload = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob(async (blob) => {
      const fileName = `crop_${Date.now()}.png`;
      const { error } = await supabase.storage.from('images').upload(fileName, blob);
      if (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image.');
        return;
      }
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      if (data?.publicUrl) {
        setPublicUrl(data.publicUrl);
        alert('Image uploaded successfully.');
      }
    }, 'image/png');
  };

  const handleCopyURL = () => {
    if (!publicUrl) return alert('No URL to copy.');
    navigator.clipboard.writeText(publicUrl);
    alert('Copied image URL to clipboard.');
  };

  const handleEmail = () => {
    if (!publicUrl) return alert('No URL to email.');
    window.location.href = `mailto:?subject=${encodeURIComponent('Check out my cropped image')}&body=${encodeURIComponent(publicUrl)}`;
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">nuveuu Image Cropper</h1>

      <input type="file" accept="image/*" onChange={onSelectImage} className="file:py-2 file:px-4 file:bg-blue-600 file:text-white file:rounded" />

      <div className="flex gap-2 my-4">
        {['free', '1:1', '16:9', '9:16'].map(ratio => (
          <button
            key={ratio}
            onClick={() => onRatioChange(ratio)}
            className={`px-3 py-1 rounded ${selectedRatio === ratio ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {imageSrc && (
        <Cropper
          src={imageSrc}
          style={{ width: '100%', height: 400 }}
          aspectRatio={selectedRatio === 'free' ? NaN : eval(selectedRatio.replace(':', '/'))}
          guides={true}
          ref={cropperRef}
          viewMode={1}
        />
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded">Download</button>
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">Upload & Share</button>
        <button onClick={handleCopyURL} className="bg-gray-400 px-4 py-2 rounded">Copy URL</button>
        <button onClick={handleEmail} className="bg-gray-400 px-4 py-2 rounded">Email</button>
      </div>

      {publicUrl && (
        <div className="mt-4">
          <p className="text-sm">Public URL:</p>
          <a href={publicUrl} target="_blank" className="underline text-blue-600">
            {publicUrl}
          </a>
        </div>
      )}
    </div>
  );
}
