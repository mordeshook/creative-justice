// components/enhancer/SoulVoiceBuilder.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";

export default function SoulVoiceBuilder({ onSave }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [traits, setTraits] = useState("");
  const [tone, setTone] = useState("");
  const [memoryFile, setMemoryFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!memoryFile || !name) return alert("Please enter a name and select a file.");
    setUploading(true);
    const fileExt = memoryFile.name.split(".").pop();
    const filePath = `souls/${name.replace(/\s+/g, "_")}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("processed").upload(filePath, memoryFile);
    if (uploadError) {
      setUploading(false);
      return alert("Upload failed: " + uploadError.message);
    }

    const { data } = supabase.storage.from("processed").getPublicUrl(filePath);
    const voice = {
      name,
      role,
      traits,
      tone,
      memoryUrl: data.publicUrl,
    };
    onSave(voice);
    setUploading(false);
  };

  return (
    <div className="p-4 space-y-4 border rounded-xl bg-white shadow">
      <h2 className="text-lg font-bold">Create a Soul Voice</h2>

      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label>Role / Archetype</Label>
        <Input value={role} onChange={(e) => setRole(e.target.value)} />
      </div>

      <div>
        <Label>Personality Traits (comma-separated)</Label>
        <Input value={traits} onChange={(e) => setTraits(e.target.value)} />
      </div>

      <div>
        <Label>Writing Tone / Style</Label>
        <Input value={tone} onChange={(e) => setTone(e.target.value)} />
      </div>

      <div>
        <Label>Upload Persona Memory (PDF, DOCX, TXT)</Label>
        <Input type="file" onChange={(e) => setMemoryFile(e.target.files[0])} />
      </div>

      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Save Soul Voice"}
      </Button>
    </div>
  );
}
