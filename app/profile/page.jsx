"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/components/AuthContext";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState({
    header: false,
    avatar: false,
    profile: false,
    portfolio: false,
    mediums: false, // Add this for mediums
    roles: false, // ✅ Add this
  });
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    portfolio_url: "",
    avatar_url: "",
    header_image: "",
    creative_roles: [], // ✅ Add this
  });

  const activateEditMode = (section) => {
    setEditMode((prev) => ({
      ...prev,
      [section]: true,
    }));
  };
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);  
  const [ogData, setOgData] = useState(null);
  const [ogError, setOgError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediumsOptions, setMediumsOptions] = useState([]);
  const [causesOptions, setCausesOptions] = useState([]); // For storing causes data
  const [creativeRolesOptions, setCreativeRolesOptions] = useState([]); // dropdown options
  const [rolesOptions, setRolesOptions] = useState([]);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data: experience, error } = await supabase
        .from("experience")
        .select("*")
        .eq("auth_users_id", user.id)
        .order("start_date", { ascending: false });
  
      if (error) {
        console.error('Error fetching experience:', error.message); // log error if exists
      } else {
        console.log("Fetched experience:", experience);  // log experience data for debugging
        setExperienceData(experience || []);
      }
    };
  
    if (user) {
      fetchExperience();
    }
  }, [user]);

  useEffect(() => {
    const fetchEducation = async () => {
      const { data: education, error } = await supabase
        .from("education")
        .select("*")
        .eq("auth_users_id", user.id)
        .order("start_year", { ascending: false });
  
      if (error) {
        console.error("Error fetching education:", error.message); // log error if exists
      } else {
        setEducationData(education || []);
      }
    };
  
    if (user) {
      fetchEducation();
    }
  }, [user]);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data, error } = await supabase
        .from("creative_roles")
        .select("creative_role"); // Pulls role values
  
      if (error) {
        console.error("Error fetching roles:", error.message);
      } else {
        setRolesOptions(data); // Store in local state
      }
    };
  
    fetchRoles();
  }, []);
  

  useEffect(() => {
    const fetchCauses = async () => {
      const { data, error } = await supabase
        .from('advocate_mission_support')
        .select('name'); // Fetch only the 'name' column from the 'advocate_mission_support' table
  
      if (error) {
        console.error('Error fetching causes:', error.message);
      } else {
        setCausesOptions(data);
      }
    };
  
    fetchCauses();
  }, []);
  
  useEffect(() => {
    const fetchMediums = async () => {
      const { data, error } = await supabase
        .from('mediums')
        .select('*');
  
      if (error) {
        console.error('Error fetching mediums:', error.message);
      } else {
        setMediumsOptions(data);
      }
    };
  
    fetchMediums();
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  
  const fetchProfile = async () => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_users_id", user.id)
      .single();
  
    if (error) {
      console.error("Profile fetch error:", error.message);
      return;
    }
  
    setProfile(profileData);
  
    setFormData({
      ...profileData,
      mediums: profileData.mediums || [],
      creative_roles: profileData.creative_roles || [],
      advocate_mission_support: profileData.advocate_mission_support || [],
    });
  
    fetchOGPreview(profileData.portfolio_url);
  };
  
  const fetchOGPreview = async (url) => {
    setOgData(null);
    setOgError("");
    if (!url?.startsWith("http")) return;
  
    try {
      const res = await fetch(
        `https://tyxhurtlifaufindxhex.supabase.co/functions/v1/og-preview?url=${encodeURIComponent(url)}`
      );
      const json = await res.json();
      setOgData(json);
    } catch {
      setOgError("Preview unavailable. Try a different link.");
    }
  };
  

  const handleSectionSave = async (section) => {
    if (section === "education" && educationData.length > 0) {
      for (let edu of educationData) {
        if (!edu.id) {
          const { error } = await supabase
            .from("education")
            .insert({
              ...edu,
              auth_users_id: user.id,
            });
          if (error) {
            console.error("Error inserting new education:", error.message);
          }
        } else {
          const { error } = await supabase
            .from("education")
            .update(edu)
            .eq("id", edu.id);
          if (error) {
            console.error("Error updating education:", error.message);
          }
        }
      }
    } else if (section === "experience" && experienceData.length > 0) {
      for (let exp of experienceData) {
        if (!exp.id) {
          const { error } = await supabase
            .from("experience")
            .insert({
              ...exp,
              auth_users_id: user.id,
            });
          if (error) {
            console.error("Error adding new experience:", error.message);
          }
        } else {
          const { error } = await supabase
            .from("experience")
            .update(exp)
            .eq("id", exp.id);
          if (error) {
            console.error("Error updating experience:", error.message);
          }
        }
      }
    }
  
    fetchProfile();
    setEditMode((prev) => ({ ...prev, [section]: false }));
  
    if (section === "experience") {
      setExperienceData([
        ...experienceData,
        { title: "", company: "", start_date: "", end_date: "", description: "" },
      ]);
    }
  };
  
  


  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    const fileExt = file.name.split(".").pop();
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueId = crypto.randomUUID().slice(0, 8);
    const fileName = `${timestamp}_${type}_${uniqueId}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const bucket = type === "header" ? "headers" : "avatars";

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return;
    }

    const {
      data: { publicUrl },
      error: urlError,
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    if (urlError) {
      console.error("URL error:", urlError.message);
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
  };

  const handleProfileSave = async (section) => {
    const updateData = {
      name: formData.name,
      bio: formData.bio,
      portfolio_url: formData.portfolio_url,
      avatar_url: formData.avatar_url,
      header_image: formData.header_image,
      linkedin_summary: formData.linkedin_summary,
      linkedin_url: formData.linkedin_url,
      mediums: formData.mediums, // Add the mediums to be saved
      advocate_mission_support: formData.advocate_mission_support, // Save the selected causes
      creative_roles: formData.creative_roles, // ADD THIS
    };
  
    await supabase.from("profiles").update(updateData).eq("auth_users_id", user.id);
    fetchProfile();
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  const handleCauseChange = (e) => {
    const selectedCause = e.target.value;
    setFormData((prev) => ({
      ...prev,
      advocate_mission_support: [...prev.advocate_mission_support, selectedCause], // Adds the selected cause to the list
    }));
  };

  const handleMediumChange = (e) => {
    const selectedMedium = e.target.value;
    setFormData((prev) => ({
      ...prev,
      mediums: [...prev.mediums, selectedMedium], // Adds the selected medium to the list
    }));
  };
  
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({
      ...prev,
      creative_roles: [...prev.creative_roles, selectedRole], // Adds the selected role to the list
    }));
  };
  

  const cancelEdit = (section) => {
    setFormData(profile);
    setEditMode((prev) => ({ ...prev, [section]: false }));
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">

      {/* Header */}

      <div className="relative">
        {profile.header_image && (
          <img
            src={profile.header_image}
            className="w-full h-64 object-cover rounded-xl"
          />
        )}
        {editMode.header ? (
          <div className="absolute top-4 right-4 flex gap-2 items-center">
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, "header")}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
            <Image
              src="/save.svg"
              width={20}
              height={20}
              alt="Save"
              title="Save"
              onClick={(e) => handleImageUpload(e, "header")}
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
        <img
          src={profile.avatar_url}
          className="object-cover w-full h-full rounded-full"
        />

        {editMode.avatar ? (
          <div className="absolute bottom-1 right-1 flex flex-col items-center z-50">
            <input
              type="file"
              onChange={(e) => handleImageUpload(e, "avatar")}
              className="text-xs border border-gray-300 rounded px-1 py-0.5 bg-white"
            />
            <div className="flex gap-1 mt-1">
              <Image
                src="/save.svg"
                width={20}
                height={20}
                alt="Save"
                title="Save"
                onClick={(e) => handleImageUpload(e, "avatar")}
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
              src="/edit.svg"
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
          value={formData.name || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Full Name"
          className="border rounded px-2 py-1 w-full mb-2"
        />
        <textarea
          value={formData.bio || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
          placeholder="Bio"
          className="border rounded px-2 py-1 w-full mb-2"
        />
      </>
    ) : (
      <>
        <p className="text-xl font-semibold">{profile?.name || "Full name not provided"}</p> {/* ✅ UPDATED */}
        <p>{profile?.bio || "Bio not provided"}</p>
      </>
    )}
  </div>
</section>
 {/* End of Profile Info */}

      {/* My Portfolio */}
      <section>
        <div className="flex justify-between items-center mt-6">
          <h2 className="font-bold text-gray-400">My Portfolio</h2>

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
              value={formData.portfolio_url || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  portfolio_url: e.target.value,
                }))
              }
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <>
              <span
                onClick={() => setIsModalOpen(true)}
                className="text-blue-500 underline cursor-pointer"
                title="Click to preview"
              >
                Preview Portfolio
              </span>
              {ogData && (
                <div className="mt-2 overflow-hidden p-2 bg-gray-20">
                  <span
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer"
                    title="Click for Pop-up"
                  >
                    <div className="flex gap-4">
                      <img
                        src={ogData.image}
                        alt="Preview"
                        className="w-50 h-50 object-cover rounded"
                      />
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
        </div>
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
          className="cursor-pointer"
          onClick={() => handleProfileSave("introduction")}
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
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
        className="cursor-pointer"
        onClick={() => activateEditMode("introduction")}
      />
    )}
  </div>
  <div className="mt-2">
    {editMode.introduction ? (
      <>
        <textarea
          value={formData.linkedin_summary || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, linkedin_summary: e.target.value }))
          }
          placeholder="Introduction"
          className="border rounded px-2 py-1 w-full mb-2"
        />
        <input
          type="text"
          value={formData.linkedin_url || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))
          }
          placeholder="LinkedIn URL"
          className="border rounded px-2 py-1 w-full"
        />
      </>
    ) : (
      <>
        <p>{profile.linkedin_summary}</p>
        {profile.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 underline"
          >
            {profile.linkedin_url}
          </a>
        )}
      </>
    )}
  </div>
</section>
{/* My Introduction Ends */}

{/* My Roles Section */}
<section>
  <div className="flex justify-between items-center mt-6">
    <h2 className="text-xl font-semibold">My Roles</h2>
    {editMode.roles ? (
      <div className="flex gap-2">
        <Image
          src="/save.svg"
          width={20}
          height={20}
          alt="Save"
          onClick={() => handleProfileSave("roles")}
          className="cursor-pointer"
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
          onClick={() => cancelEdit("roles")}
          className="cursor-pointer"
        />
      </div>
    ) : (
      <Image
        src="/edit.svg"
        width={20}
        height={20}
        alt="Edit"
        onClick={() => setEditMode((prev) => ({ ...prev, roles: true }))}
        className="cursor-pointer"
      />
    )}
  </div>
  <div className="mt-2">
    {editMode.roles ? (
      <>
        <select
          value={""}
          onChange={(e) => {
            const selectedRole = e.target.value;
            if (
              selectedRole &&
              !formData.creative_roles.includes(selectedRole)
            ) {
              setFormData((prev) => ({
                ...prev,
                creative_roles: [...prev.creative_roles, selectedRole],
              }));
            }
          }}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select role to add</option>
          {rolesOptions.map((r) => (
            <option key={r.id} value={r.creative_role}>
              {r.creative_role}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.creative_roles.map((r, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {r}
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    creative_roles: prev.creative_roles.filter(
                      (_, idx) => idx !== i
                    ),
                  }))
                }
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </>
    ) : (
      <div className="flex flex-wrap gap-2">
        {(profile.creative_roles || []).map((r, i) => (
          <span
            key={i}
            className="bg-gray-200 px-3 py-1 rounded-full text-sm"
          >
            {r}
          </span>
        ))}
      </div>
    )}
  </div>
</section>
{/* End of My Roles Section */}

 {/* Mediums Section */}
<section>
  <div className="flex justify-between items-center mt-6">
    <h2 className="text-xl font-semibold">My Mediums</h2>
    {editMode.mediums ? (
      <div className="flex gap-2">
        <Image
          src="/save.svg"
          width={20}
          height={20}
          alt="Save"
          onClick={() => handleProfileSave("mediums")}
          className="cursor-pointer"
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
          onClick={() => cancelEdit("mediums")}
          className="cursor-pointer"
        />
      </div>
    ) : (
      <Image
        src="/edit.svg"
        width={20}
        height={20}
        alt="Edit"
        onClick={() => setEditMode((prev) => ({ ...prev, mediums: true }))}
        className="cursor-pointer"
      />
    )}
  </div>
  <div className="mt-2">
    {editMode.mediums ? (
      <>
        <select
          value={formData.mediums || ""}
          onChange={handleMediumChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select medium to add</option>
          {mediumsOptions.map((med) => (
            <option key={med.id} value={med.medium}>
              {med.medium}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.mediums.map((m, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {m}
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    mediums: prev.mediums.filter((_, idx) => idx !== i),
                  }))
                }
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </>
    ) : (
      <div className="flex flex-wrap gap-2">
        {(profile.mediums || []).map((m, i) => (
          <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            {m}
          </span>
        ))}
      </div>
    )}
  </div>
</section>
{/* End of Mediums Section */}

{/* My Causes */}
<section>
  <div className="flex justify-between items-center mt-6">
    <h2 className="text-xl font-semibold">My Causes</h2>
    {editMode.causes ? (
      <div className="flex gap-2">
        <Image
          src="/save.svg"
          width={20}
          height={20}
          alt="Save"
          onClick={() => handleProfileSave("causes")}
          className="cursor-pointer"
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
          onClick={() => cancelEdit("causes")}
          className="cursor-pointer"
        />
      </div>
    ) : (
      <Image
        src="/edit.svg"
        width={20}
        height={20}
        alt="Edit"
        onClick={() => setEditMode((prev) => ({ ...prev, causes: true }))}
        className="cursor-pointer"
      />
    )}
  </div>
  <div className="mt-2">
    {editMode.causes ? (
      <>
        <select
          value={formData.advocate_mission_support || ""}
          onChange={handleCauseChange}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select cause to support</option>
          {causesOptions.map((cause) => (
            <option key={cause.id} value={cause.name}>
              {cause.name}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.advocate_mission_support.map((cause, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {cause}
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    advocate_mission_support: prev.advocate_mission_support.filter((_, idx) => idx !== i),
                  }))
                }
                className="ml-2 text-red-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </>
    ) : (
      <div className="flex flex-wrap gap-2">
        {(profile.advocate_mission_support || []).map((cause, i) => (
          <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            {cause}
          </span>
        ))}
      </div>
    )}
  </div>
</section>
{/* End of My Causes */}

{/* Editable Experience Section */}
<section>
  <div className="flex justify-between items-center mt-6">
    <h2 className="text-xl font-semibold">Experience</h2>
    {editMode.experience ? (
      <div className="flex gap-2">
        <Image
          src="/insert.svg"
          width={20}
          height={20}
          alt="Insert"
          onClick={() => {
            setExperienceData([
              ...experienceData,
              { title: "", company: "", start_date: "", end_date: "", description: "" },
            ]);
          }}
          className="cursor-pointer"
        />
        <Image
          src="/save.svg"
          width={20}
          height={20}
          alt="Save"
          onClick={() => handleSectionSave("experience")}
          className="cursor-pointer"
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
          onClick={() => cancelEdit("experience")}
          className="cursor-pointer"
        />
      </div>
    ) : (
      <div className="flex gap-2">
        <Image
          src="/edit.svg"
          width={20}
          height={20}
          alt="Edit"
          onClick={() => setEditMode((prev) => ({ ...prev, experience: true }))}
          className="cursor-pointer"
        />
        {experienceData.length === 0 && (
          <button
            onClick={() =>
              setExperienceData([
                ...experienceData,
                { title: "", company: "", start_date: "", end_date: "", description: "" },
              ])
            }
            className="px-4 py-2 bg-green-500 text-white rounded-full"
          >
            Add Experience
          </button>
        )}
      </div>
    )}
  </div>

  <div className="mt-2 space-y-4">
    {editMode.experience ? (
      experienceData.map((exp, idx) => (
        <div key={idx} className="space-y-1 border-t pt-2">
          <input
            className="border px-2 py-1 w-full rounded"
            value={exp.title}
            onChange={(e) => {
              const updated = [...experienceData];
              updated[idx].title = e.target.value;
              setExperienceData(updated);
            }}
            placeholder="Title"
          />
          <input
            className="border px-2 py-1 w-full rounded"
            value={exp.company}
            onChange={(e) => {
              const updated = [...experienceData];
              updated[idx].company = e.target.value;
              setExperienceData(updated);
            }}
            placeholder="Company"
          />
          <input
            className="border px-2 py-1 w-full rounded"
            type="date"
            value={exp.start_date}
            onChange={(e) => {
              const updated = [...experienceData];
              updated[idx].start_date = e.target.value;
              setExperienceData(updated);
            }}
            placeholder="Start Date"
          />
          <input
            className="border px-2 py-1 w-full rounded"
            type="date"
            value={exp.end_date || ""}
            onChange={(e) => {
              const updated = [...experienceData];
              updated[idx].end_date = e.target.value;
              setExperienceData(updated);
            }}
            placeholder="End Date"
          />
          <textarea
            className="border px-2 py-1 w-full rounded"
            value={exp.description}
            onChange={(e) => {
              const updated = [...experienceData];
              updated[idx].description = e.target.value;
              setExperienceData(updated);
            }}
            placeholder="Description"
          />
          <button
  className="text-red-500"
  onClick={async () => {
    // Get the ID of the experience to delete
    const expToDelete = experienceData[idx];

    // Delete the experience from Supabase
    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", expToDelete.id); // Match the ID of the experience to delete

    if (error) {
      console.error("Error deleting experience:", error.message);
    } else {
      // If successful, remove it from the UI by updating the experienceData state
      const updated = experienceData.filter((_, index) => index !== idx);
      setExperienceData(updated);
    }
  }}
>
  Delete Experience
</button>
        </div>
      ))
    ) : experienceData.length > 0 ? (
      experienceData.map((exp, idx) => (
        <div key={idx} className="border-t pt-2">
          <p className="font-semibold">{exp.title} at {exp.company}</p>
          <p className="text-xs text-gray-500">
            {exp.start_date} - {exp.end_date || "Present"}
          </p>
          <p className="text-sm text-gray-600">{exp.description}</p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No experience listed.</p>
    )}
  </div>
</section>
{/* End of Editable Experience Section */}



{/* Editable Education Section */}
<section>
  <div className="flex justify-between items-center mt-6">
    <h2 className="text-xl font-semibold">Education</h2>
    {editMode.education ? (
      <div className="flex gap-2">
        <Image
          src="/insert.svg"
          width={20}
          height={20}
          alt="Insert"
          onClick={() => {
            setEducationData([
              ...educationData,
              { school: "", degree: "", start_year: "", end_year: "" },
            ]);
          }}
          className="cursor-pointer"
        />
        <Image
          src="/save.svg"
          width={20}
          height={20}
          alt="Save"
          onClick={() => handleSectionSave("education")}
          className="cursor-pointer"
        />
        <Image
          src="/cancel.svg"
          width={20}
          height={20}
          alt="Cancel"
          onClick={() => cancelEdit("education")}
          className="cursor-pointer"
        />
      </div>
    ) : (
      <div className="flex gap-2">
        <Image
          src="/edit.svg"
          width={20}
          height={20}
          alt="Edit"
          onClick={() => setEditMode((prev) => ({ ...prev, education: true }))}
          className="cursor-pointer"
        />
        {educationData.length === 0 && (
          <button
            onClick={() =>
              setEducationData([
                ...educationData,
                { school: "", degree: "", start_year: "", end_year: "" },
              ])
            }
            className="px-4 py-2 bg-green-500 text-white rounded-full"
          >
            Add Education
          </button>
        )}
      </div>
    )}
  </div>

  <div className="mt-2 space-y-4">
    {editMode.education ? (
      educationData.map((edu, idx) => (
        <div key={idx} className="space-y-1 border-t pt-2">
          <input
            className="border px-2 py-1 w-full rounded"
            value={edu.school}
            onChange={(e) => {
              const updated = [...educationData];
              updated[idx].school = e.target.value;
              setEducationData(updated);
            }}
            placeholder="School"
          />
          <input
            className="border px-2 py-1 w-full rounded"
            value={edu.degree}
            onChange={(e) => {
              const updated = [...educationData];
              updated[idx].degree = e.target.value;
              setEducationData(updated);
            }}
            placeholder="Degree"
          />
          <input
            className="border px-2 py-1 w-full rounded"
            value={edu.start_year}
            onChange={(e) => {
              const updated = [...educationData];
              updated[idx].start_year = e.target.value;
              setEducationData(updated);
            }}
            placeholder="Start Year"
          />
          <input
            className="border px-2 py-1 w-full rounded"
            value={edu.end_year || ""}
            onChange={(e) => {
              const updated = [...educationData];
              updated[idx].end_year = e.target.value;
              setEducationData(updated);
            }}
            placeholder="End Year"
          />
          <button
            className="text-red-500"
            onClick={async () => {
              // Get the ID of the education to delete
              const eduToDelete = educationData[idx];

              // Delete the education from Supabase
              const { error } = await supabase
                .from("education")
                .delete()
                .eq("id", eduToDelete.id); // Match the ID of the education to delete

              if (error) {
                console.error("Error deleting education:", error.message);
              } else {
                // If successful, remove it from the UI by updating the educationData state
                const updated = educationData.filter((_, index) => index !== idx);
                setEducationData(updated);
              }
            }}
          >
            Delete Education
          </button>
        </div>
      ))
    ) : educationData.length > 0 ? (
      educationData.map((edu, idx) => (
        <div key={idx} className="border-t pt-2">
          <p className="font-semibold">{edu.school}</p>
          <p className="text-sm text-gray-600">{edu.degree}</p>
          <p className="text-xs text-gray-500">
            {edu.start_year} - {edu.end_year || "Present"}
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No education listed.</p>
    )}
  </div>
</section>

{/* End of Editable Education Section */}

    </div>
  );
}
