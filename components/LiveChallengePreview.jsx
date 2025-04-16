"use client";

export default function LiveChallengePreview({ title, description, intent, roles, budget, deadline }) {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg border sticky top-4">
      <h2 className="text-xl font-bold mb-3 text-indigo-700">Live Challenge Preview</h2>

      <div className="mb-2">
        <strong>Title:</strong>
        <p>{title || "Untitled Challenge"}</p>
      </div>

      <div className="mb-2">
        <strong>Description:</strong>
        <p>{description || "No description provided."}</p>
      </div>

      <div className="mb-2">
        <strong>Intent:</strong>
        <p>{intent || "Not specified."}</p>
      </div>

      <div className="mb-2">
        <strong>Roles:</strong>
        <ul className="list-disc ml-6 text-sm">
          {roles.length > 0 ? roles.map((r, i) => <li key={i}>{r}</li>) : <li>No roles listed</li>}
        </ul>
      </div>

      <div className="mb-2">
        <strong>Budget:</strong>
        <p>{budget ? `$${budget}` : "Not listed"}</p>
      </div>

      <div>
        <strong>Deadline:</strong>
        <p>{deadline || "None set"}</p>
      </div>
    </div>
  );
}
