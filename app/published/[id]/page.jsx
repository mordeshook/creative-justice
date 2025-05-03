"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function PublishedContentPage() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("published_content")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching published content:", error.message);
        setLoading(false);
        return;
      }

      setContent(data);
      setLoading(false);
    };

    fetchContent();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!content) return <div className="p-6 text-center text-red-500">Content not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{content.category || "Published Content"}</h1>

      {content.image_url && (
        <div className="mb-4">
          <Image
            src={content.image_url}
            alt="Published Visual"
            width={1024}
            height={1024}
            className="rounded shadow"
          />
        </div>
      )}

      <article className="whitespace-pre-wrap bg-white border border-gray-200 p-4 rounded">
        {content.enhanced_output || content.output}
      </article>

      <div className="mt-6 text-sm text-gray-500">
        <p><strong>Style:</strong> {content.style}</p>
        <p><strong>Format:</strong> {content.format}</p>
        <p><strong>Tone:</strong> {content.tone}</p>
        <p><strong>Visibility:</strong> {content.is_public ? "Public" : "Private"}</p>
      </div>
    </div>
  );
}
