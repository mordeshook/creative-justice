'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) router.push('/auth');
    else fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, type, actor_id, target_id, created_at, actors:profiles!notifications_actor_id_fkey(name)')
      .eq('target_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error.message);
    } else {
      setNotifications(data);
    }
  };

  const formatMessage = (notif) => {
    const actor = notif.actors?.name || 'Someone';
    switch (notif.type) {
      case 'view':
        return `${actor} viewed your profile.`;
      case 'like':
        return `${actor} liked your post.`;
      case 'comment':
        return `${actor} commented on your post.`;
      default:
        return `${actor} interacted with you.`;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-black p-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <ul className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <li key={notif.id} className="border-b pb-4">
                <p className="text-sm text-gray-800">{formatMessage(notif)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No notifications yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
