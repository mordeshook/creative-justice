"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function ChallengeViewPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("challenges")
        .select("id, title, description, budget, deadline, board, roles, assets, created_at, auth_users_id")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching challenges:", error);
      } else {
        setChallenges(data || []);
      }

      setLoading(false);
    };

    fetchChallenges();
  }, []);

  const groupByBoard = (challenges) => {
    return challenges.reduce((acc, challenge) => {
      const board = challenge.board || "Uncategorized";
      if (!acc[board]) acc[board] = [];
      acc[board].push(challenge);
      return acc;
    }, {});
  };

  const getAssetUrl = (challenge) => {
    const relativePath = challenge.assets?.[0]; // full path string, no .name
    if (!relativePath) return null;
    return `https://tyxhurtlifaufindxhex.supabase.co/storage/v1/object/public/challenge-assets/${relativePath}`;
  };

  const groupedChallenges = groupByBoard(challenges);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Browse Challenges</h1>

      {loading && <p>Loading challenges...</p>}

      {!loading && Object.keys(groupedChallenges).length === 0 && (
        <p>No challenges found. Be the first to create one!</p>
      )}

      {!loading &&
        Object.entries(groupedChallenges).map(([board, boardChallenges]) => (
          <section key={board} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 border-b pb-1">{board}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boardChallenges.map((challenge) => {
                const assetUrl = getAssetUrl(challenge);

                return (
                  <div key={challenge.id} className="border rounded p-4 shadow bg-white">
                    {assetUrl ? (
                      <Image
                        src={assetUrl}
                        alt="Challenge Thumbnail"
                        width={400}
                        height={240}
                        className="mb-4 rounded object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-[200px] flex items-center justify-center text-gray-500 mb-4 rounded">
                        No Thumbnail
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{challenge.title}</h3>
                    <p className="text-gray-700 mt-1">{challenge.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <p>💼 Budget: ${challenge.budget || "—"}</p>
                      <p>⏳ Deadline: {challenge.deadline || "—"}</p>
                      <p>🎯 Roles: {challenge.roles?.join(", ") || "—"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
    </main>
  );
}
