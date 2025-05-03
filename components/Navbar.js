import { useRouter } from 'next/navigation';
import { useUser } from '@/components/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const { data: rows, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('auth_users_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error.message);
      return;
    }

    const enriched = await Promise.all(
      rows.map(async (n) => {
        if (n.name && n.avatar_url) return n;
    
        if (n.source_id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('auth_users_id', n.source_id)
            .single();
    
          if (profileError || !profile) {
            console.warn('No profile found for source_id:', n.source_id, profileError);
            return {
              ...n,
              name: 'Someone',
              avatar_url: '/default-avatar.png',
            };
          }
    
          return {
            ...n,
            name: profile.name,
            avatar_url: profile.avatar_url || '/default-avatar.png',
          };
        }
    
        return {
          ...n,
          name: 'Someone',
          avatar_url: '/default-avatar.png',
        };
      })
    );
    

    setNotifications(enriched);
    setHasNotifications(enriched.length > 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handleNotificationClick = async (notification) => {
    let submissionId = notification.post_id;
    if (!submissionId) return;

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (!error) {
      setSelectedSubmission(data);
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedSubmission(null);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-50">
      <div
        className="text-4xl font-bold text-pink-600 cursor-pointer"
        onClick={() => router.push('/.')}
      >
        nuveuu
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/feed')}>
          <img src="/home.svg" alt="Home" className="h-6 w-6 cursor-pointer" />
        </button>

        <button onClick={() => router.push('/profile')}>
          <img src="/profile.svg" alt="Profile" className="h-6 w-6 cursor-pointer" />
        </button>

        <button onClick={() => router.push('/community')}>
          <img src="/communities.svg" alt="Community" className="h-6 w-6 cursor-pointer" />
        </button>

        <button onClick={() => router.push('/challenge')}>
          <img src="/challenges.svg" alt="Challenges" className="h-6 w-6 cursor-pointer" />
        </button>

        <div className="relative">
          <button className="text-lg cursor-pointer" title="Notifications" onClick={toggleNotifications}>
            <img
              src={hasNotifications ? '/notification_pink.svg' : '/notifications.svg'}
              alt="Notifications"
              className="h-6 w-6 cursor-pointer"
            />
          </button>

          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 bg-white border p-4 shadow-lg w-80 max-h-96 overflow-y-auto"
            >
              <h3 className="font-bold text-lg">Notifications</h3>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No new notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleNotificationClick(n)}
                  >
                    <img
                      src={n.avatar_url || '/default-avatar.png'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">
                      {n.type === 'user_follow' && `${n.name} followed you`}
                        {n.type === 'like' && `${n.name} liked your post`}
                        {n.type === 'comment' && `${n.name} commented on your post`}
                        {n.type === 'post' && `You created a new post`}
                        {n.type === 'challenge_created' && `${n.name} created a new challenge`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="text-pink-500 hover:text-pink-600 cursor-pointer"
        >
          Log Out
        </button>
      </div>

      {showPopup && selectedSubmission && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="font-bold text-lg">Submission</h2>
            <p className="mb-4">{selectedSubmission.content}</p>
            <button
              onClick={handlePopupClose}
              className="bg-red-500 text-white py-1 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
