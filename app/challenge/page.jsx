"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function ChallengeListPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState("All Boards");

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("challenges")
        .select("id, auth_users_id, title, description, budget, deadline, board, roles, assets, created_at")
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

  const getAssetUrl = (challenge) => {
    const path = challenge.assets?.[0];
    if (!path) return null;
    return `https://tyxhurtlifaufindxhex.supabase.co/storage/v1/object/public/challenge-assets/${path}`;
  };

  const groupByBoard = (challenges) => {
    return challenges.reduce((acc, challenge) => {
      const board = challenge.board || "Uncategorized";
      if (!acc[board]) acc[board] = [];
      acc[board].push(challenge);
      return acc;
    }, {});
  };

  const grouped = groupByBoard(challenges);
  const allBoards = Object.keys(grouped).sort();

  const filteredGrouped =
    selectedBoard === "All Boards"
      ? grouped
      : { [selectedBoard]: grouped[selectedBoard] || [] };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Published Challenges</h1>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
        >
          <option>All Boards</option>
          {allBoards.map((board) => (
            <option key={board}>{board}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading challenges...</p>
      ) : Object.keys(filteredGrouped).length === 0 ? (
        <p>No published challenges found.</p>
      ) : (
        Object.entries(filteredGrouped).map(([board, boardChallenges]) => (
          <section key={board} className="mb-10">
            <h2 className="text-xl font-semibold mb-4 border-b border-black pb-1">{board}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {boardChallenges.map((challenge) => {
                const imageUrl = getAssetUrl(challenge);
                return (
                  <Link
                    key={challenge.id}
                    href={`/challenge/${challenge.id}`}
                    className="block border border-gray-300 rounded p-4 shadow bg-white hover:shadow-lg transition"
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="Challenge Thumbnail"
                        width={400}
                        height={200}
                        className="mb-4 rounded object-cover w-full h-[200px]"
                      />
                    ) : (
                      <div className="bg-gray-200 h-[200px] flex items-center justify-center text-gray-500 mb-4 rounded">
                        No Thumbnail
                      </div>
                    )}
                    <h3 className="text-lg font-bold mb-1">{challenge.title}</h3>
                    <p className="text-gray-700 text-sm line-clamp-2">{challenge.description}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      <p>💼 Budget: ${challenge.budget || "—"}</p>
                      <p>⏳ Deadline: {challenge.deadline || "—"}</p>
                      <p>🎯 Roles: {challenge.roles?.join(", ") || "—"}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
