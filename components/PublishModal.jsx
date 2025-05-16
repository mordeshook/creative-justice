// components/PublishModal.jsx
import React from 'react';

export default function PublishModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-4 w-96 rounded shadow">
        <h2 className="font-bold text-sm mb-2">Publish Project</h2>
        <label>Project Title</label>
        <input type="text" className="w-full border p-1 mb-2 text-xs" placeholder="Enter title" />
        <label>Description</label>
        <textarea className="w-full border p-1 text-xs" placeholder="Enter description..." />
        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="text-xs px-2 py-1 border">Cancel</button>
          <button className="text-xs px-2 py-1 bg-blue-600 text-white">Publish</button>
        </div>
      </div>
    </div>
  );
}
