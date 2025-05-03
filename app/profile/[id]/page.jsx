'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id;

  const [profile, setProfile] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [experienceData, setExperienceData] = useState([]);
  const [ogData, setOgData] = useState(null);
  const [ogError, setOgError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
      fetchExperience(userId);
      fetchEducation(userId);
    }
  }, [userId]);

  const fetchProfile = async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_users_id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error.message);
    } else {
      setProfile(data);
      if (data.portfolio_url) fetchOGPreview(data.portfolio_url);
    }
  };

  const fetchExperience = async (id) => {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('auth_users_id', id)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching experience:', error.message);
    } else {
      setExperienceData(data || []);
    }
  };

  const fetchEducation = async (id) => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('auth_users_id', id)
      .order('start_year', { ascending: false });

    if (error) {
      console.error('Error fetching education:', error.message);
    } else {
      setEducationData(data || []);
    }
  };

  const fetchOGPreview = async (url) => {
    setOgData(null);
    setOgError('');
    if (!url?.startsWith('http')) return;

    try {
      const res = await fetch(
        `https://tyxhurtlifaufindxhex.supabase.co/functions/v1/og-preview?url=${encodeURIComponent(url)}`
      );
      const json = await res.json();
      setOgData(json);
    } catch {
      setOgError('Preview unavailable. Try a different link.');
    }
  };

  if (!profile) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="relative">
        {profile.header_image && (
          <img
            src={profile.header_image}
            className="w-full h-64 object-cover rounded-xl"
            alt="Header"
          />
        )}
      </div>

      {/* Avatar */}
      <div className="relative w-40 h-40 mx-auto -mt-20 rounded-full border-4 border-white shadow-lg">
        <img
          src={profile.avatar_url}
          className="object-cover w-full h-full rounded-full"
          alt="Avatar"
        />
      </div>

      {/* Profile Info */}
      <section>
        <h2 className="font-bold text-gray-400">My Profile</h2>
        <div className="mt-2">
          <p className="text-xl font-semibold">{profile.name || 'Full name not provided'}</p>
          <p>{profile.bio || 'Bio not provided'}</p>
        </div>
      </section>

      {/* Portfolio */}
      <section>
        <h2 className="font-bold text-gray-400 mt-6">My Portfolio</h2>
        <div className="mt-2">
          <span
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 underline cursor-pointer"
            title="Click to preview"
          >
            Preview Portfolio
          </span>
          {ogData && (
            <div className="mt-2 overflow-hidden p-2 bg-gray-20">
              <span onClick={() => setIsModalOpen(true)} className="cursor-pointer">
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

      {/* Introduction */}
      <section>
        <h2 className="font-bold text-gray-400 mt-6">My Intro</h2>
        <div className="mt-2">
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
        </div>
      </section>

      {/* Roles */}
      <section>
        <h2 className="text-xl font-semibold mt-6">My Roles</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {(profile.creative_roles || []).map((r, i) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {r}
            </span>
          ))}
        </div>
      </section>

      {/* Mediums */}
      <section>
        <h2 className="text-xl font-semibold mt-6">My Mediums</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {(profile.mediums || []).map((m, i) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {m}
            </span>
          ))}
        </div>
      </section>

      {/* Causes */}
      <section>
        <h2 className="text-xl font-semibold mt-6">My Causes</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {(profile.advocate_mission_support || []).map((cause, i) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {cause}
            </span>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-xl font-semibold mt-6">Experience</h2>
        <div className="mt-2 space-y-4">
          {experienceData.length > 0 ? (
            experienceData.map((exp, idx) => (
              <div key={idx} className="border-t pt-2">
                <p className="font-semibold">
                  {exp.title} at {exp.company}
                </p>
                <p className="text-xs text-gray-500">
                  {exp.start_date} - {exp.end_date || 'Present'}
                </p>
                <p className="text-sm text-gray-600">{exp.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No experience listed.</p>
          )}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xl font-semibold mt-6">Education</h2>
        <div className="mt-2 space-y-4">
          {educationData.length > 0 ? (
            educationData.map((edu, idx) => (
              <div key={idx} className="border-t pt-2">
                <p className="font-semibold">{edu.school}</p>
                <p className="text-sm text-gray-600">{edu.degree}</p>
                <p className="text-xs text-gray-500">
                  {edu.start_year} - {edu.end_year || 'Present'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No education listed.</p>
          )}
        </div>
      </section>
    </div>
  );
}
