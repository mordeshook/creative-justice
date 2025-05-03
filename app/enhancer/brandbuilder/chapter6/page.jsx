"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import { Wand2 } from "lucide-react";

const questions = [
  {
    label: "David Ogilvy — The Father of Persuasion",
    question:
      "What does your audience really want—and how does your brand fulfill that desire better than anyone else?",
    field: "Chapter6question1",
  },
  {
    label: "Bill Bernbach — The Soul of Creativity",
    question:
      "What truth about your audience can your brand say out loud—that no one else is brave enough to say?",
    field: "Chapter6question2",
  },
  {
    label: "Lee Clow — The Poet of Culture",
    question:
      "If your audience is part of a movement, what are they rebelling against—and how do you lead them forward?",
    field: "Chapter6question3",
  },
  {
    label: "Mary Wells Lawrence — The Queen of Transformation",
    question:
      "What role does your brand play in transforming your audience’s world?",
    field: "Chapter6question4",
  },
  {
    label: "Dan Wieden — The Spirit of Belief",
    question:
      "What does your audience believe in—and how does your brand help them live that belief louder?",
    field: "Chapter6question5",
  },
];

export default function Chapter6() {
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
  
      const res = await fetch("https://tyxhurtlifaufindxhex.functions.supabase.co/enhancer-chapter6-fix", {
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
        console.log(`📤 GPT PROMPT (${field}):\n`, json.debug);
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
          <div className="text-green-600 font-semibold">Chapter 6 of 7</div>
          <div className="text-black font-bold">Brand: {brandName}</div>
        </div>

        <h2 className="text-2xl font-bold mb-6">🎯 Chapter 6: Audience Mastery</h2>

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
              router.push(`/enhancer/brandbuilder/chapter5?id=${draftId}`);
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
                router.push(`/enhancer/brandbuilder/chapter7?id=${draftId}`);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Next Chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
