// app/enhancer/brandbuilder/chapter7.jsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import { Wand2 } from "lucide-react";

const questions = [
  {
    label: "The Echo",
    question: "What idea or belief will your brand leave behind—even after it’s gone?",
    field: "brand_legacy_belief",
  },
  {
    label: "The Ripple",
    question: "What behavior should your audience carry forward because of your brand?",
    field: "brand_legacy_behavior",
  },
  {
    label: "The Legend",
    question: "What stories do you hope people tell about your brand in 10 years?",
    field: "brand_legacy_story",
  },
  {
    label: "The Inheritance",
    question: "What unfinished work should others build on after you?",
    field: "brand_legacy_openwork",
  },
  {
    label: "The Letter",
    question: "If your brand wrote a message to the future, what would it say?",
    field: "brand_legacy_letter",
  },
];

export default function Chapter7() {
  const { user } = useUser();
  const router = useRouter();
  const [draftId, setDraftId] = useState(null);
  const [brandName, setBrandName] = useState("");
  const [answers, setAnswers] = useState({});
  const [loadingField, setLoadingField] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDraftId(params.get("id"));
    }
  }, []);
  
  useEffect(() => {
    if (!user?.id || !draftId) return;
  
    const load = async () => {
      const { data } = await supabase
        .from("brand_profiles_drafts")
        .select("*")
        .eq("id", draftId)
        .single();
  
      if (data) {
        setBrandName(data.brand_name || "");
        const newAnswers = {};
        questions.forEach((q) => {
          newAnswers[q.field] = data[q.field] || "";
        });
        setAnswers(newAnswers);
      }
    };
  
    load();
  }, [user?.id, draftId]);

  const handleWand = async (field, questionText) => {
    try {
      setLoadingField(field);
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const res = await fetch("https://tyxhurtlifaufindxhex.functions.supabase.co/enhancer-chapter7", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          draftId,
          field,
          question: questionText,
          existing: answers[field],
        }),
      });

      const json = await res.json();
      if (json.result) {
        setAnswers((prev) => ({ ...prev, [field]: json.result }));
        console.log(`📤 GPT PROMPT (${field}):\n`, json.debug); // 💥 Log the actual prompt
      } else {
        console.error("AI response missing 'result':", json);
      }
    } catch (err) {
      console.error("Wand AI error:", err);
    } finally {
      setLoadingField(null);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !draftId) return;
    const updateData = {};
    questions.forEach((q) => {
      updateData[q.field] = answers[q.field] || "";
    });

    await supabase
      .from("brand_profiles_drafts")
      .update(updateData)
      .eq("id", draftId)
      .eq("auth_users_id", user.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div className="text-green-600 font-semibold">Chapter 7 of 7</div>
          <div className="text-black font-bold">Brand: {brandName}</div>
        </div>

        <h2 className="text-2xl font-bold mb-6">🔮 Chapter 7: Legacy & Leverage</h2>

        {questions.map(({ label, question, field }) => (
          <div key={field} className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold mb-1">{label}</h3>
              {loadingField === field ? (
                <span className="text-sm text-gray-500">⏳ Running tool...</span>
              ) : (
                <button
                  onClick={() => handleWand(field, question)}
                  className="text-[#e5007d] hover:text-[#cc006f]"
                  title="Enhance with AAA"
                  disabled={loadingField !== null}
                >
                  <Wand2 className="w-5 h-5" color="#e5007d" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{question}</p>
            <textarea
              className="w-full border px-3 py-2 rounded"
              rows={5}
              value={answers[field] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [field]: e.target.value }))
              }
              placeholder="Type your response here..."
            />
          </div>
        ))}

        <div className="flex justify-between mt-8">
          <button
            onClick={async () => {
              await handleSave();
              router.push(`/enhancer/brandbuilder/chapter6?id=${draftId}`);
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>

            <button
              onClick={async () => {
                await handleSave();
                router.push(`/enhancer/brandbuilder/preview?id=${draftId}`);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Finish & Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
