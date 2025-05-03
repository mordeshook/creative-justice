"use client";

import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AIPromptDialog({ open, onClose, onSubmit, prompt, setPrompt }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-6 bg-white rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Generate AI Image</h2>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image prompt..."
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button
            onClick={() => {
              onSubmit(prompt);
              onClose();
              setPrompt("");
            }}
            className="bg-blue-600 text-white"
          >
            Generate
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
