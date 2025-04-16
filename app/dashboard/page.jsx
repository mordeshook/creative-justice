"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const [challenges, setChallenges] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [grants, setGrants] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    const [chData, drData, grData, appData] = await Promise.all([
      supabase.from("challenges").select("*").eq("auth_users_id", user.id),
      supabase.from("challenge_drafts").select("*").eq("auth_users_id", user.id),
      supabase.from("opportunity_grants").select("*").eq("auth_users_id", user.id),
      supabase.from("challenge_applications").select("*").eq("auth_users_id", user.id),
    ]);
    setChallenges(chData?.data || []);
    setDrafts(drData?.data || []);
    setGrants(grData?.data || []);
    setApplications(appData?.data || []);
  };

  const renderThumbnail = (assets) => {
    if (!assets || assets.length === 0) return null;
    return (
      <Image
        src={assets[0]?.url || assets[0]?.path}
        alt="thumb"
        width={120}
        height={80}
        className="rounded border object-cover"
      />
    );
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📢 Published Challenges</h2>
        {challenges.length === 0 ? (
          <p className="text-gray-600">You haven’t published any challenges yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((ch) => (
              <div key={ch.id} className="p-4 border rounded shadow bg-white">
                {renderThumbnail(ch.assets)}
                <h3 className="font-bold mt-2">{ch.title}</h3>
                <p className="text-sm text-gray-600">{ch.board}</p>
                <Link
                  href={`/challenge/${ch.id}`}
                  className="inline-block mt-2 text-blue-600 text-sm underline"
                >
                  View Challenge
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📝 Saved Drafts</h2>
        {drafts.length === 0 ? (
          <p className="text-gray-600">No drafts saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((dr) => (
              <div key={dr.id} className="p-4 border rounded shadow bg-white">
                {renderThumbnail(dr.assets)}
                <h3 className="font-bold mt-2">{dr.title}</h3>
                <p className="text-sm text-gray-600">{dr.board}</p>
                <Link
                  href={`/challenge/draft`}
                  className="inline-block mt-2 text-blue-600 text-sm underline"
                >
                  Finalize Draft
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💸 Opportunity Grants</h2>
        {grants.length === 0 ? (
          <p className="text-gray-600">No grants posted yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-800">
            {grants.map((g) => (
              <li key={g.id}>
                <strong>{g.title}</strong> – Budget: ${g.budget}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">🤝 Team Applications</h2>
        {applications.length === 0 ? (
          <p className="text-gray-600">No team applications yet.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-800">
            {applications.map((app) => (
              <li key={app.id}>
                Role: <strong>{app.role_applied}</strong> – Status:{" "}
                <span className="text-blue-700">{app.status || "Pending"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
