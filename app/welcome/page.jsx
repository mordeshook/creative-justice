"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  const { user } = useUser();
  const [challenges, setChallenges] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("All Boards");
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    fetchChallenges();
    fetchLikes();
    fetchComments();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("challenges")
      .select("id, auth_users_id, title, description, overview, intent, refined_intent, board, deadline, budget, roles, assets, created_at")
      .order("created_at", { ascending: false });
    if (!error) setChallenges(data || []);
    setLoading(false);
  };

  const fetchLikes = async () => {
    const { data } = await supabase.from("likes").select("*");
    setLikes(data || []);
  };

  const fetchComments = async () => {
    const { data } = await supabase.from("comments").select("*");
    setComments(data || []);
  };

  const getAssetUrl = (challenge) => {
    const path = challenge.assets?.[0];
    if (!path) return null;
    return `https://tyxhurtlifaufindxhex.supabase.co/storage/v1/object/public/challenge-assets/${path}`;
  };

  const groupByBoard = (challenges) => {
    return challenges.reduce((acc, item) => {
      const board = item.board || "Uncategorized";
      if (!acc[board]) acc[board] = [];
      acc[board].push(item);
      return acc;
    }, {});
  };

  const handleLikeChallenge = async (challengeId) => {
    if (!user) return;
    const { error } = await supabase.from("likes").insert({
      auth_users_id: user.id,
      challenge_id: challengeId,
    });
    if (error) console.error("❌ Like insert failed:", error);
    fetchLikes();
  };

  const handleLikeBoard = async (boardName) => {
    if (!user) return;
    const { error } = await supabase.from("likes").insert({
      auth_users_id: user.id,
      board_name: boardName,
    });
    if (error) console.error("❌ Board like insert failed:", error);
    fetchLikes();
  };

  const handleComment = async (challengeId, comment) => {
    if (!user || !comment.trim()) return;
    const { error } = await supabase.from("comments").insert({
      auth_users_id: user.id,
      challenge_id: challengeId,
      comment,
      created_at: new Date(),
    });
    if (error) console.error("❌ Comment insert failed:", error);
    fetchComments();
  };

  const grouped = groupByBoard(challenges);
  const allBoards = Object.keys(grouped).sort();
  const filtered = selectedBoard === "All Boards" ? grouped : { [selectedBoard]: grouped[selectedBoard] || [] };

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
        <p>Loading...</p>
      ) : (
        Object.entries(filtered)
          .sort(([a], [b]) => a.localeCompare(b)) // Alphabetical sort by board
          .map(([board, boardChallenges]) => (
            <section key={board} className="mb-10">
              <h2 className="text-xl font-semibold mb-2">{board}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {boardChallenges.map((challenge) => {
                  const imageUrl = getAssetUrl(challenge);
                  const challengeLikes = likes.filter((l) => l.challenge_id === challenge.id);
                  const challengeComments = comments.filter((c) => c.challenge_id === challenge.id);
                  const commentInputId = `comment-${challenge.id}`;

                  return (
                    <div
                      key={challenge.id}
                      className={`border border-gray-300 rounded p-4 bg-white transition-shadow duration-200 ${
                        hovered === challenge.id ? "shadow-lg" : ""
                      }`}
                      onMouseEnter={() => setHovered(challenge.id)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {imageUrl ? (
                        <Link href={`/challenge/${challenge.id}`}>
                          <Image
                            src={imageUrl}
                            alt="Challenge Thumbnail"
                            width={400}
                            height={200}
                            className="mb-4 rounded object-cover w-full h-[200px] cursor-pointer"
                          />
                        </Link>
                      ) : (
                        <div className="bg-gray-200 h-[200px] flex items-center justify-center text-gray-500 mb-4 rounded">
                          No Thumbnail
                        </div>
                      )}

                      <Link href={`/challenge/${challenge.id}`}>
                        <h3 className="text-lg font-bold hover:underline cursor-pointer">{challenge.title}</h3>
                      </Link>
                      <p className="text-gray-700 mt-1 text-sm">{challenge.description}</p>

                      {challenge.overview && (
                        <p className="text-sm italic mt-2 text-gray-800">
                          <strong>Overview:</strong> {challenge.overview}
                        </p>
                      )}
                      {challenge.refined_intent && (
                        <p className="text-sm italic mt-1 text-gray-700">
                          <strong>Refined Intent:</strong> {challenge.refined_intent}
                        </p>
                      )}

                      <div className="text-sm text-gray-500 mt-2 mb-2">
                        <p>💼 Budget: ${challenge.budget || "—"}</p>
                        <p>⏳ Deadline: {challenge.deadline || "—"}</p>
                        <p>🎯 Roles: {challenge.roles?.join(", ") || "—"}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>❤️ {challengeLikes.length} Likes</span>
                        <span>💬 {challengeComments.length} Comments</span>
                      </div>

                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleLikeChallenge(challenge.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Like
                        </button>
                      </div>

                      <div className="mb-2">
                        <input
                          id={commentInputId}
                          type="text"
                          placeholder="Add a comment..."
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                        <button
                          className="text-xs mt-1 text-green-600 hover:underline"
                          onClick={() =>
                            handleComment(challenge.id, document.getElementById(commentInputId).value)
                          }
                        >
                          Submit
                        </button>
                      </div>

                      {challengeComments.slice(0, 3).map((c, idx) => (
                        <p key={idx} className="text-xs text-gray-700 border-t pt-1 mt-1">
                          {c.comment}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </section>
          ))
      )}
    </main>
  );
}
