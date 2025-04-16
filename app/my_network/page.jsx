"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@/components/AuthContext";

export default function MyNetworkPage() {
  const router = useRouter();
  const { user } = useUser();
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Fetch connections
    const fetchConnections = async () => {
      try {
        const { data: connectionRows, error } = await supabase
          .from("connections")
          .select("auth_user_id_follow")
          .eq("auth_user_id", user.id);

        if (error) throw error;

        // Log the fetched connection rows
        console.log("Connections data:", connectionRows);

        const connectedUserIds = connectionRows.map((row) => row.auth_user_id_follow);

        // Fetch profiles for connected users
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("auth_users_id, name, type, avatar_url")
          .in("auth_users_id", connectedUserIds);

        if (profileError) throw profileError;

        // Log the matched profiles
        console.log("Matched Profiles:", profiles);

        setConnections(profiles);
      } catch (err) {
        console.error("Error fetching connections:", err);
      }
    };

    // Fetch suggestions (users not connected)
    const fetchSuggestions = async () => {
      try {
        const { data: connectionRows, error } = await supabase
          .from("connections")
          .select("auth_user_id_follow")
          .eq("auth_user_id", user.id);

        if (error) throw error;

        const connectedUserIds = connectionRows.map((row) => row.auth_user_id_follow);

        // Fetch all profiles excluding the current user
        const { data: profiles, error: suggestionError } = await supabase
          .from("profiles")
          .select("auth_users_id, name, type, avatar_url")
          .neq("auth_users_id", user.id);

        if (suggestionError) throw suggestionError;

        // Log all profiles fetched (for debugging)
        console.log("All Profiles:", profiles);

        // Filter profiles that are not connected to the user
        const notConnected = profiles.filter(
          (profile) => !connectedUserIds.includes(profile.auth_users_id)
        );

        // Log profiles after filtering
        console.log("Profiles after filtering:", notConnected);

        // Shuffle suggestions and limit to 3
        const shuffled = notConnected.sort(() => 0.5 - Math.random());
        console.log("Shuffled Suggestions:", shuffled); // Log suggestions for debugging
        setSuggestions(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    // Fetch data on load
    fetchConnections();
    fetchSuggestions();
  }, [user]);

  const handleConnect = async (auth_user_id_follow) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("connections").insert([
        {
          auth_user_id: user.id,
          auth_user_id_follow,
          status: "connected",
        },
      ]);
      if (error) throw error;
      window.location.reload(); // Reload the page after making a connection
    } catch (err) {
      console.error("Error connecting:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Network</h1>

      <div className="mb-10 p-4 border rounded bg-white">
        <h2 className="font-semibold mb-2">People You're Connected To</h2>
        {connections.length === 0 ? (
          <p>No connections yet.</p>
        ) : (
          <ul className="space-y-2">
            {connections.map((profile) => (
              <li
                key={profile.auth_users_id}
                className="flex items-center justify-between border p-2 rounded"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/profile/${profile.auth_users_id}`)}
                >
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-sm text-gray-500">{profile.type}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border rounded bg-white">
        <h2 className="font-semibold mb-2">People You May Know</h2>
        {suggestions.length === 0 ? (
          <p>No suggestions available.</p>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((profile) => (
              <li
                key={profile.auth_users_id}
                className="flex items-center justify-between border p-2 rounded"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/profile/${profile.auth_users_id}`)}
                >
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-sm text-gray-500">{profile.type}</div>
                </div>
                <button
                  className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleConnect(profile.auth_users_id)}
                >
                  Connect
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
