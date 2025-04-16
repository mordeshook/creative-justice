'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NotificationPage() {
  const { user } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);  // State to toggle notification visibility

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('auth_users_id', user.id)  // Ensure fetching notifications for the current user
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error.message);
    } else {
      setNotifications(data);
    }
  };

  const handleNotificationClick = async (notificationId, postId) => {
    // Toggle the notification popup visibility
    setNotificationOpen(!notificationOpen);

    // If postId exists, fetch the submission (post) related to the notification
    if (!postId) {
      console.error('Post ID is missing for notification');
      return;
    }

    const { data: postData, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', postId)  // Now using postId to fetch the related submission/post
      .single();

    if (error) {
      console.error('Error fetching post:', error.message);
    } else {
      setSelectedNotification(postData);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Notifications</h2>

      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notifications.map((notification) => {
          let notificationMessage = '';
          let avatarUrl = '/default-avatar.png';  // Default avatar for users

          if (notification.type === 'like') {
            notificationMessage = `${notification.avatar_url ? notification.avatar_url : '/default-avatar.png'} You received a like from ${notification.name}`;
          } else if (notification.type === 'comment') {
            notificationMessage = `${notification.avatar_url ? notification.avatar_url : '/default-avatar.png'} You received a comment from ${notification.name}`;
          } else if (notification.type === 'post') {
            notificationMessage = `${notification.avatar_url ? notification.avatar_url : '/default-avatar.png'} Your post was successful.`;
          }

          return (
            <div
              key={notification.id}
              className="bg-white p-4 rounded shadow mb-4 cursor-pointer"
              onClick={() => handleNotificationClick(notification.id, notification.post_id)} // Use post_id from notification
            >
              <div className="flex items-center gap-2">
                <img
                  src={notification.avatar_url || '/default-avatar.png'} // Assuming avatar_url in notifications table
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="font-semibold text-sm">{notificationMessage}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Show details of the clicked notification */}
      {selectedNotification && (
        <div className="bg-white p-6 rounded shadow-lg mt-4">
          <h3 className="text-lg font-semibold">{selectedNotification.content}</h3>
          <p className="mt-2">{selectedNotification.description}</p>

          {/* Add comments and likes logic here */}
          {/* Example: Render the comment section and likes for the selected post */}
        </div>
      )}
    </div>
  );
}
