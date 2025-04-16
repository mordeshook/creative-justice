'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/components/AuthContext';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false); // To control the open/close state of the notification menu
  const notificationRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('auth_users_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error) setNotifications(data);
  };

  const markAsRead = async (notificationId) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close the notification menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={notificationRef}>
      <button
        className="relative"
        onClick={() => setOpen(!open)} // Toggle open state on click
        title="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow rounded z-50">
          <div className="p-2 font-semibold border-b">Notifications</div>
          <ul>
            {notifications.length === 0 ? (
              <li className="p-2 text-sm text-gray-500">No notifications</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${!n.is_read ? 'font-bold' : 'text-gray-600'}`}
                >
                  {n.message}
                  <div className="text-xs text-gray-400">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
