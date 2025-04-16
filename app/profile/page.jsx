"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState({
    header: false,
    avatar: false,
    profile: false,
    portfolio: false,
    introduction: false,
    skills: false,
    education: false,
    experience: false,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    type: "",
    bio: "",
    linkedin_summary: "",
    portfolio_url: "",
    linkedin_url: "",
    avatar_url: "",
    header_image: "",
  });
  const [skillsData, setSkillsData] = useState([]);
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  
  const [headerFile, setHeaderFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [ogData, setOgData] = useState(null);
  const [ogError, setOgError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchOGPreview = async (url) => {
    setOgData(null);
    setOgError("");
    if (!url?.startsWith("http")) return;

    try {
      const res = await fetch(`https://tyxhurtlifaufindxhex.supabase.co/functions/v1/og-preview?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      setOgData(json);
    } catch {
      setOgError("Preview unavailable. Try a different link.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_users_id", user.id)
      .single();

    setProfile(profileData);
    setFormData(profileData);
    fetchOGPreview(profileData.portfolio_url);



    const { data: postData } = await supabase
      .from("submissions")
      .select("*")
      .eq("auth_users_id", user.id)
      .order("created_at", { ascending: false });
      const { data: skills } = await supabase
      .from("skills")
      .select("*")
      .eq("auth_users_id", user.id);
    
    const { data: education } = await supabase
      .from("education")
      .select("*")
      .eq("auth_users_id", user.id)
      .order("start_year", { ascending: false });
    
    const { data: experience } = await supabase
      .from("experience")
      .select("*")
      .eq("auth_users_id", user.id)
      .order("start_date", { ascending: false });
 
      // ✅ ADD THESE LINES
  setSkillsData(skills || []);
  setEducationData(education || []);
  setExperienceData(experience || []);

    
    // Add to profile object
    setProfile({
      ...profileData,
      skills: skills?.map((s) => s.skill),
      education,
      experience,
    });
    setPosts(postData.map((p) => ({ ...p, editing: false })));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;
  
    const fileExt = file.name.split(".").pop();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Safe format
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const fileName = `${timestamp}_${type}_${uniqueId}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const bucket = type === "header" ? "headers" : "avatars";
  
    setUploading(true);
  
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // Don't overwrite
      });
  
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      setUploading(false);
      return;
    }
  
    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from(bucket).getPublicUrl(filePath);
  
    if (urlError) {
      console.error("URL error:", urlError.message);
      setUploading(false);
      return;
    }
  
    const fieldToUpdate = type === "header" ? "header_image" : "avatar_url";
  
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ [fieldToUpdate]: publicUrl })
      .eq("auth_users_id", user.id);
  
    if (updateError) {
      console.error("Profile update error:", updateError.message);
    } else {
      setProfile({ ...profile, [fieldToUpdate]: publicUrl });
    }
  
    setUploading(false);
  };
  

 
  const handleProfileSave = async (section) => {
    await supabase.from("profiles").update(formData).eq("auth_users_id", user.id);
    fetchProfile();
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  const handleSectionSave = async (section) => {
    if (section === "skills") {
      await supabase.from("skills").delete().eq("auth_users_id", user.id);
      for (let s of skillsData) {
        await supabase.from("skills").insert({ auth_users_id: user.id, skill: s.skill });
      }
    } else if (section === "education") {
      for (let edu of educationData) {
        await supabase
          .from("education")
          .update(edu)
          .eq("id", edu.id);
      }
    } else if (section === "experience") {
      for (let exp of experienceData) {
        await supabase
          .from("experience")
          .update(exp)
          .eq("id", exp.id);
      }
    }
    fetchProfile();
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  const cancelEdit = (section) => {
    setFormData(profile);
    setEditMode((prev) => ({ ...prev, [section]: false }));
    setHeaderFile(null);
    setAvatarFile(null);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="relative">
        {profile.header_image && (
          <img src={profile.header_image} className="w-full h-64 object-cover rounded-xl" />
        )}
        {editMode.header ? (
          <div className="absolute top-4 right-4 flex gap-2 items-center">
            <input
              type="file"
              onChange={(e) => setHeaderFile(e.target.files[0])}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
            <Image
              src="/save.svg"
              width={20}
              height={20}
              alt="Save"
              title="Save"
              onClick={(e) => handleImageUpload({ target: { files: [headerFile] } }, "header")}
              className="cursor-pointer"
            />
            <Image
              src="/cancel.svg"
              width={20}
              height={20}
              alt="Cancel"
              title="Cancel"
              onClick={() => cancelEdit("header")}
              className="cursor-pointer"
            />
          </div>
        ) : (
          <div
  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow cursor-pointer"
  onClick={() => setEditMode((prev) => ({ ...prev, header: true }))}
  title="Edit Header"
>
  <Image src="/edit.svg" width={20} height={20} alt="Edit" />
</div>
        )}
      </div>

    {/* Avatar */}
<div className="relative w-40 h-40 mx-auto -mt-20 rounded-full border-4 border-white shadow-lg">
  <img src={profile.avatar_url} className="object-cover w-full h-full rounded-full" />

  {editMode.avatar ? (
    <div className="absolute bottom-1 right-1 flex flex-col items-center z-50">
      <input
        type="file"
        onChange={(e) => setAvatarFile(e.target.files[0])}
        className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
      />
      <div className="flex gap-1 mt-1">
        <Image
          src="/save.svg"
          width={20}
          height={20}
          alt="Save"
          title="Save"
          onClick={() =>
            handleImageUpload({ target: { files: [avatarFile] } }, "avatar")
          }
          className="cursor-pointer"
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
          title="Cancel"
          onClick={() => cancelEdit("avatar")}
          className="cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div
      className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer z-50"
      onClick={() => setEditMode((prev) => ({ ...prev, avatar: true }))}
      title="Edit Avatar"
    >
      <Image
        src="/edit_avatar_white.svg"
        width={16}
        height={16}
        alt="Edit Avatar"
      />
    </div>
  )}
</div>

      {/* Profile Info */}
      <section>
        <div className="flex justify-between items-center">
        <h2 className="font-bold text-gray-400">My Profile</h2>
          {editMode.profile ? (
            <div className="flex gap-2">
              <Image
                src="/save.svg"
                width={20}
                height={20}
                alt="Save"
                title="Save"
                className="cursor-pointer"
                onClick={() => handleProfileSave("profile")}
              />
              <Image
                src="/cancel.svg"
                width={20}
                height={20}
                alt="Cancel"
                title="Cancel"
                className="cursor-pointer"
                onClick={() => cancelEdit("profile")}
              />
            </div>
          ) : (
            <Image
              src="/edit.svg"
              width={20}
              height={20}
              alt="Edit"
              title="Edit"
              className="cursor-pointer"
              onClick={() => setEditMode((prev) => ({ ...prev, profile: true }))}
            />
          )}
        </div>
        <div className="mt-2">
          {editMode.profile ? (
            <>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name"
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                placeholder="Type"
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Bio"
                className="border rounded px-2 py-1 w-full"
              />
            </>
          ) : (
            <>
              <p className="text-3xl font-semibold text-gray-700">{profile.name}</p>
              <p className="text-gray-400">{profile.type}</p>
              <p className="mt-2">{profile.bio}</p>
            </>
          )}
        </div>
      </section>

      {/* My Portfolio */}
      <section>
        <div className="flex justify-between items-centermt-6">
        <h2 className="font-bold text-gray-400">My Portfolio </h2>
      
          {editMode.portfolio ? (
            <div className="flex gap-2">
              <Image
                src="/save.svg"
                width={20}
                height={20}
                alt="Save"
                title="Save"
                className="cursor-pointer"
                onClick={() => handleProfileSave("portfolio")}
              />
              <Image
                src="/cancel.svg"
                width={20}
                height={20}
                alt="Cancel"
                title="Cancel"
                className="cursor-pointer"
                onClick={() => cancelEdit("portfolio")}
              />
            </div>
          ) : (
            <Image
              src="/edit.svg"
              width={20}
              height={20}
              alt="Edit"
              title="Edit"
              className="cursor-pointer"
              onClick={() => setEditMode((prev) => ({ ...prev, portfolio: true }))}
            />
          )}
        </div>
        <div className="mt-2">
        {editMode.portfolio ? (
  <input
    type="text"
    value={formData.portfolio_url}
    onChange={(e) => setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))}
    className="border rounded px-2 py-1 w-full"
  />
) : (
  <>
<span
  onClick={() => setIsModalOpen(true)}
  className="text-blue-500 underline cursor-pointer"
  title="Click to preview"
>
  
</span>
{ogData && (
  <div className="mt-2 overflow-hidden p-2 bg-gray-20">
    <span
      onClick={() => setIsModalOpen(true)}
      className="cursor-pointer"
      title="Click for Pop-up"
    >
      <div className="flex gap-4">
        <img src={ogData.image} alt="Preview" className="w-50 h-50 object-cover rounded" />
        <div>
        <h4 className="font-bold text-gray-500">Click to View</h4>
          <p className="text-xs text-blue-500 underline">{ogData.url}</p>
        </div>
      </div>
    </span>
  </div>
)}

        {ogError && <p className="text-red-500 text-sm mt-1">{ogError}</p>}
  </>
)}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
    <div className="bg-white w-[80%] h-[80%] rounded-lg shadow-lg relative overflow-hidden">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-gray-700 text-lg font-bold z-10"
        title="Close"
      >
        ×
      </button>
      <iframe
        src={profile.portfolio_url}
        title="Portfolio Preview"
        className="w-full h-full border-0"
      />
    </div>
  </div>
)}
</div>  {/* ✅ this closes the <div className="mt-2"> */}
</section>


      {/* My Introduction */}
      <section>
        <div className="flex justify-between items-center mt-6">
        <h2 className="font-bold text-gray-400">My Intro</h2>
          {editMode.introduction ? (
            <div className="flex gap-2">
              <Image
                src="/save.svg"
                width={20}
                height={20}
                alt="Save"
                title="Save"
                className="cursor-pointer"
                onClick={() => handleProfileSave("introduction")}
              />
              <Image
                src="/cancel.svg"
                width={20}
                height={20}
                alt="Cancel"
                title="Cancel"
                className="cursor-pointer"
                onClick={() => cancelEdit("introduction")}
              />
            </div>
          ) : (
            <Image
              src="/edit.svg"
              width={20}
              height={20}
              alt="Edit"
              title="Edit"
              className="cursor-pointer"
              onClick={() => setEditMode((prev) => ({ ...prev, introduction: true }))}
            />
          )}
        </div>
        <div className="mt-2">
          {editMode.introduction ? (
            <textarea
              value={formData.linkedin_summary}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, linkedin_summary: e.target.value }))
              }
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <p>{profile.linkedin_summary}</p>
          )}
        </div>
      </section>

{/* Editable Skills Section */}
<section>
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold">Featured Skills</h2>
          {editMode.skills ? (
            <div className="flex gap-2">
              <Image src="/save.svg" width={20} height={20} alt="Save" onClick={() => handleSectionSave("skills")} className="cursor-pointer" />
              <Image src="/cancel.svg" width={20} height={20} alt="Cancel" onClick={() => cancelEdit("skills")} className="cursor-pointer" />
            </div>
          ) : (
            <Image src="/edit.svg" width={20} height={20} alt="Edit" onClick={() => setEditMode((prev) => ({ ...prev, skills: true }))} className="cursor-pointer" />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {editMode.skills ? (
            skillsData.map((s, idx) => (
              <input
                key={idx}
                type="text"
                value={s.skill}
                onChange={(e) => {
                  const updated = [...skillsData];
                  updated[idx].skill = e.target.value;
                  setSkillsData(updated);
                }}
                className="border px-2 py-1 rounded text-sm"
              />
            ))
          ) : (
            profile.skills?.length > 0 ? profile.skills.map((skill, idx) => (
              <span key={idx} className="bg-gray-200 text-sm px-3 py-1 rounded-full text-gray-700">{skill}</span>
            )) : <p className="text-sm text-gray-500">No skills listed.</p>
          )}
        </div>
      </section>

 {/* Editable Education Section */}
 <section>
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold">Education</h2>
          {editMode.education ? (
            <div className="flex gap-2">
              <Image src="/save.svg" width={20} height={20} alt="Save" onClick={() => handleSectionSave("education")} className="cursor-pointer" />
              <Image src="/cancel.svg" width={20} height={20} alt="Cancel" onClick={() => cancelEdit("education")} className="cursor-pointer" />
            </div>
          ) : (
            <Image src="/edit.svg" width={20} height={20} alt="Edit" onClick={() => setEditMode((prev) => ({ ...prev, education: true }))} className="cursor-pointer" />
          )}
        </div>
        <div className="mt-2 space-y-4">
          {editMode.education ? (
            educationData.map((edu, idx) => (
              <div key={idx} className="space-y-1 border-t pt-2">
                <input className="border px-2 py-1 w-full rounded" value={edu.school} onChange={(e) => {
                  const updated = [...educationData];
                  updated[idx].school = e.target.value;
                  setEducationData(updated);
                }} placeholder="School" />
                <input className="border px-2 py-1 w-full rounded" value={edu.degree} onChange={(e) => {
                  const updated = [...educationData];
                  updated[idx].degree = e.target.value;
                  setEducationData(updated);
                }} placeholder="Degree" />
                <input className="border px-2 py-1 w-full rounded" value={edu.start_year} onChange={(e) => {
                  const updated = [...educationData];
                  updated[idx].start_year = e.target.value;
                  setEducationData(updated);
                }} placeholder="Start Year" />
                <input className="border px-2 py-1 w-full rounded" value={edu.end_year || ""} onChange={(e) => {
                  const updated = [...educationData];
                  updated[idx].end_year = e.target.value;
                  setEducationData(updated);
                }} placeholder="End Year" />
              </div>
            ))
          ) : (
            profile.education?.length > 0 ? profile.education.map((e, idx) => (
              <div key={idx} className="border-t pt-2">
                <p className="font-semibold">{e.school}</p>
                <p className="text-sm text-gray-600">{e.degree}</p>
                <p className="text-xs text-gray-500">{e.start_year} - {e.end_year || "Present"}</p>
              </div>
            )) : <p className="text-sm text-gray-500">Education is for suckers.</p>
          )}
        </div>
      </section>


   {/* Editable Experience Section */}
      <section>
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold">Experience</h2>
          {editMode.experience ? (
            <div className="flex gap-2">
              <Image src="/save.svg" width={20} height={20} alt="Save" onClick={() => handleSectionSave("experience")} className="cursor-pointer" />
              <Image src="/cancel.svg" width={20} height={20} alt="Cancel" onClick={() => cancelEdit("experience")} className="cursor-pointer" />
            </div>
          ) : (
            <Image src="/edit.svg" width={20} height={20} alt="Edit" onClick={() => setEditMode((prev) => ({ ...prev, experience: true }))} className="cursor-pointer" />
          )}
        </div>
        <div className="mt-2 space-y-4">
          {editMode.experience ? (
            experienceData.map((exp, idx) => (
              <div key={idx} className="space-y-1 border-t pt-2">
                <input className="border px-2 py-1 w-full rounded" value={exp.title} onChange={(e) => {
                  const updated = [...experienceData];
                  updated[idx].title = e.target.value;
                  setExperienceData(updated);
                }} placeholder="Title" />
                <input className="border px-2 py-1 w-full rounded" value={exp.company} onChange={(e) => {
                  const updated = [...experienceData];
                  updated[idx].company = e.target.value;
                  setExperienceData(updated);
                }} placeholder="company" />
                <input className="border px-2 py-1 w-full rounded" value={exp.start_date} onChange={(e) => {
                  const updated = [...experienceData];
                  updated[idx].start_date = e.target.value;
                  setExperienceData(updated);
                }} placeholder="Start Date" />
                <input className="border px-2 py-1 w-full rounded" value={exp.end_date || ""} onChange={(e) => {
                  const updated = [...experienceData];
                  updated[idx].end_date = e.target.value;
                  setExperienceData(updated);
                }} placeholder="End Date" />
                <textarea className="border px-2 py-1 w-full rounded" value={exp.description} onChange={(e) => {
                  const updated = [...experienceData];
                  updated[idx].description = e.target.value;
                  setExperienceData(updated);
                }} placeholder="Description" />
              </div>
            ))
          ) : (
            profile.experience?.length > 0 ? profile.experience.map((exp, idx) => (
              <div key={idx} className="border-t pt-2">
                <p className="font-semibold">{exp.title} at {exp.company}</p>
                <p className="text-xs text-gray-500">{exp.start_date} - {exp.end_date || "Present"}</p>
                <p className="text-sm text-gray-600">{exp.description}</p>
              </div>
            )) : <p className="text-sm text-gray-500">No experience listed.</p>
          )}
        </div>
      </section>

      {/* Posts */}
<section>
  <h2 className="text-xl font-semibold mt-6">My Posts</h2>
  <div className="grid grid-cols-1 gap-4 mt-2">
    {posts.map((post) => (
      <div key={post.id} className="border rounded p-4 relative">
        <div className="absolute top-2 right-2 flex gap-2">
          {post.editing ? (
            <>
              <Image
                src="/save.svg"
                width={16}
                height={16}
                alt="Save"
                title="Save"
                className="cursor-pointer"
                onClick={async () => {
                  const updatedPost = posts.find((p) => p.id === post.id);
                  await supabase
                    .from("submissions")
                    .update({ content: post.content })
                    .eq("id", post.id);
                  fetchProfile();
                }}
              />
              <Image
                src="/cancel.svg"
                width={16}
                height={16}
                alt="Cancel"
                title="Cancel"
                className="cursor-pointer"
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id ? { ...p, editing: false } : p
                    )
                  )
                }
              />
            </>
          ) : (
            <>
              <Image
                src="/edit.svg"
                width={16}
                height={16}
                alt="Edit"
                title="Edit"
                className="cursor-pointer"
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id ? { ...p, editing: true } : p
                    )
                  )
                }
              />
              <Image
                src="/delete.svg"
                width={16}
                height={16}
                alt="Delete"
                title="Delete"
                className="cursor-pointer"
                onClick={async () => {
                  const confirmed = window.confirm("Are you sure you want to delete this post?");
                  if (confirmed) {
                    await supabase.from("submissions").delete().eq("id", post.id);
                    fetchProfile();
                  }
                }}
              />
            </>
          )}
        </div>

        {post.editing ? (
          <textarea
            value={post.content}
            onChange={(e) =>
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === post.id ? { ...p, content: e.target.value } : p
                )
              )
            }
            className="border rounded w-full p-2 mb-2 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-700 mb-2">{post.content}</p>
        )}

        {post.media_url && (
          post.media_url.endsWith(".mp4") || post.media_url.endsWith(".webm") ? (
            <video
              src={post.media_url}
              controls
              className="w-full max-h-96 rounded"
            />
          ) : (
            <img
              src={post.media_url}
              alt="Post media"
              className="w-full max-h-96 object-contain rounded"
            />
          )
        )}
      </div>
    ))}
  </div>
</section>
    </div>
  );
}