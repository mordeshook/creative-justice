"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useUser } from "@/components/AuthContext";

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const { user } = useUser();

  const [challenge, setChallenge] = useState(null);
  const [creator, setCreator] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    if (id) fetchChallengeAndCreator();
    if (user) fetchProfile();
  }, [id, user]);

  const fetchChallengeAndCreator = async () => {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setChallenge(data);

      if (data.auth_users_id) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, type")
          .eq("auth_users_id", data.auth_users_id)
          .single();
        if (!profileError) setCreator(profile);
      }
    } catch (err) {
      console.error("Error loading challenge:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_users_id", user.id)
      .single();
    if (!error) setProfile(data);
  };

  const getAssetUrl = () => {
    const path = challenge?.assets?.[0];
    if (!path) return null;
    return `https://tyxhurtlifaufindxhex.supabase.co/storage/v1/object/public/challenge-assets/${path}`;
  };

  const handleShare = async () => {
    if (!profile || !challenge) return;
    const mediaUrl = getAssetUrl();
  
    const { error } = await supabase.from("submissions").insert({
      auth_users_id: user.id,
      content: shareText,
      media_url: mediaUrl,
      name: profile.name,
      challenge_id: challenge.id, // 👈 Add this line
      challenge_title: challenge.title, // ✅ this fixes missing title
    });
  
    if (error) {
      alert("Error sharing challenge: " + error.message);
    } else {
      setShowModal(false);
      setShareText("");
      alert("Challenge shared to feed!");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!challenge) return <p className="p-6 text-red-500">Challenge not found.</p>;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {getAssetUrl() && (
        <Image
          src={getAssetUrl()}
          alt="Challenge Asset"
          width={800}
          height={400}
          className="rounded-lg mb-6 w-full object-cover max-h-[400px]"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
      <p className="text-sm text-gray-600 mb-1">🗂️ Board: {challenge.board || "Uncategorized"}</p>
      <p className="text-sm text-gray-600 mb-4">
        📅 Created: {new Date(challenge.created_at).toLocaleDateString()}
      </p>

      {creator && (
        <div className="flex items-center gap-4 mb-6">
          {creator.avatar_url && (
            <Image
              src={creator.avatar_url}
              alt={creator.full_name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-semibold">{creator.full_name}</p>
            <p className="text-sm text-gray-500">{creator.type}</p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-800 whitespace-pre-line">{challenge.description}</p>
      </div>

      {challenge.overview && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-800">{challenge.overview}</p>
        </div>
      )}

      {challenge.intent && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Intent</h2>
          <p className="text-gray-800">{challenge.intent}</p>
        </div>
      )}

      {challenge.refined_intent && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Refined Intent</h2>
          <p className="text-gray-800">{challenge.refined_intent}</p>
        </div>
      )}

      {challenge.roles?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Creative Roles Needed</h2>
          <ul className="list-disc ml-5 text-gray-700">
            {challenge.roles.map((role, idx) => (
              <li key={idx}>{role}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        {challenge.budget && (
          <p className="text-md text-green-700 font-medium">
            💰 Budget: ${challenge.budget}
          </p>
        )}
        {challenge.deadline && (
          <p className="text-md text-red-600 font-medium mt-2">
            ⏳ Deadline: {new Date(challenge.deadline).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Share Button */}
      {user && (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-700 text-white px-4 py-2 rounded"
          >
            📤 Share This Challenge
          </button>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow max-w-lg w-full">
                <h2 className="text-xl font-bold mb-2">Share to Feed</h2>
                <p className="text-sm text-gray-600 mb-4">{profile?.name}</p>
                <textarea
                  className="w-full border p-2 rounded mb-4"
                  placeholder="Say something about this challenge..."
                  value={shareText}
                  onChange={(e) => setShareText(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowModal(false)} className="text-gray-500">Cancel</button>
                  <button onClick={handleShare} className="bg-blue-600 text-white px-4 py-2 rounded">Share now</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
