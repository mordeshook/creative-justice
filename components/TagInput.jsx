"use client";

import { useState } from "react";

export default function TagInput({ tags, setTags, placeholder = "Add a role…" }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="p-2 border rounded w-full"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={addTag}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
        >
          Add
        </button>
      </div>
    </div>
  );
}
