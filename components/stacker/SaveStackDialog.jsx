// components/stacker/SaveStackDialog.jsx

"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SaveStackDialog({ open, onClose, onSave }) {
  const [stackName, setStackName] = useState("");

  const handleSave = () => {
    if (!stackName.trim()) {
      alert("Please enter a stack name.");
      return;
    }
    onSave(stackName.trim());
    setStackName(""); // reset field
    onClose();        // close dialog
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Save Your Stack</h2>
        <Input
          type="text"
          placeholder="Enter a name for your stack"
          value={stackName}
          onChange={(e) => setStackName(e.target.value)}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
