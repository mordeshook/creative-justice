// Component: TextEditorDialog.jsx

"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog"; // replace with your actual dialog import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const FONT_OPTIONS = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];

export default function TextEditorDialog({ open, onClose, onSave, initialText = {} }) {
  const [text, setText] = useState(initialText.content || "");
  const [fontFamily, setFontFamily] = useState(initialText.fontFamily || "Arial");
  const [fontSize, setFontSize] = useState(initialText.fontSize || 24);
  const [fill, setFill] = useState(initialText.fill || "#000000");

  useEffect(() => {
    if (open) {
      setText(initialText.content || "");
      setFontFamily(initialText.fontFamily || "Arial");
      setFontSize(initialText.fontSize || 24);
      setFill(initialText.fill || "#000000");
    }
  }, [open]); // only reset state on dialog open

  const handleSave = () => {
    onSave({
      content: text,
      fontFamily,
      fontSize: parseInt(fontSize),
      fill,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-6 space-y-4 w-96 bg-white shadow-xl rounded-md">
        <h2 className="text-xl font-semibold">Edit Text</h2>

        <div>
          <Label>Text</Label>
          <input
  type="text"
  className="border p-2 rounded w-full"
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
        </div>

        <div>
          <Label>Font Family</Label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Font Size</Label>
          <Input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
        </div>

        <div>
          <Label>Text Color</Label>
          <Input type="color" value={fill} onChange={(e) => setFill(e.target.value)} />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 text-white" onClick={handleSave}>
            Save Text
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
