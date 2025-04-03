'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MyNetworkPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) return null;

  const peopleYouMayKnow = [
    { name: 'Jacob Stanley', role: 'Designer' },
    { name: 'Eric Garcia', role: 'Teacher' },
    { name: 'Moshe David', role: 'Artist' },
    { name: 'Kevin Stelzer', role: 'Developer' },
    { name: 'Robert Bouwer-Bosch', role: 'Engineer' }
  ];

  const connections = [
    { name: 'Ann Kalen', role: 'Project Manager' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
        {/* Left Profile Card */}
        <section className="bg-white shadow p-4 rounded-md col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
            <h2 className="font-semibold text-center text-sm">{user.email}</h2>
            <p className="text-xs text-gray-500">1 Connections | 1 Views</p>
          </div>
        </section>

        {/* Center Connections */}
        <section className="bg-white shadow p-4 rounded-md col-span-2">
          <h3 className="font-semibold mb-2">People</h3>
          {connections.map((person) => (
            <div key={person.name} className="flex justify-between items-center p-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.role}</p>
                </div>
              </div>
              <div className="flex gap-2 text-gray-400 text-xl">
                💬 📩
              </div>
            </div>
          ))}
        </section>

        {/* Right Suggestions */}
        <section className="bg-white shadow p-4 rounded-md col-span-1">
          <h3 className="font-semibold mb-3">People you may know</h3>
          {peopleYouMayKnow.map((person) => (
            <div key={person.name} className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm font-medium">{person.name}</p>
                  <p className="text-xs text-gray-500">{person.role}</p>
                </div>
              </div>
              <button className="text-xs border border-purple-500 text-purple-500 px-2 py-1 rounded hover:bg-purple-100 transition">
                Connect
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
