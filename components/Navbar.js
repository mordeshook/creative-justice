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
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('auth_users_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error.message);
    } else {
      setNotifications(data);
      setHasNotifications(data.length > 0);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handleNotificationClick = async (notification) => {
    let submissionId = null;

    if (notification.message === 'like') {
      submissionId = notification.submission_id;
    } else if (notification.message === 'comment' || notification.message === 'post') {
      submissionId = notification.post_id;
    }

    if (submissionId) {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (error) {
        console.error('Error fetching submission:', error.message);
      } else {
        setSelectedSubmission(data);
        setShowPopup(true);
      }
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
        <button 
          onClick={() => router.push('/feed')} 
          className="hover:underline" 
          title="Feed"
        >
          <img src="/home.svg" alt="Home" className="h-6 w-6 cursor-pointer" />
        </button>

        {/* 👤 Profile Icon */}
        <button 
          onClick={() => router.push('/profile')} 
          className="hover:underline" 
          title="Profile"
        >
          <img src="/profile.svg" alt="Profile" className="h-6 w-6 cursor-pointer" />
        </button>

        <button 
          onClick={() => router.push('/community')} 
          className="hover:underline" 
          title="Community"
        >
          <img src="/communities.svg" alt="Community" className="h-6 w-6 cursor-pointer" />
        </button>

        {/* 🔔 Notification Bell */}
        <div className="relative">
          <button
            className="text-lg cursor-pointer"
            title="Notifications"
            onClick={toggleNotifications}
          >
            <img 
              src={hasNotifications ? '/notification_pink.svg' : '/notifications.svg'} 
              alt="Notifications" 
              className="h-6 w-6 cursor-pointer"
            />
          </button>

          {showNotifications && hasNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 bg-white border p-4 shadow-lg w-80 max-h-96 overflow-y-auto"
            >
              <h3 className="font-bold text-lg">Notifications</h3>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <img 
                    src={notification.avatar_url || '/default-avatar.png'}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
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

      {/* 📄 Submission Popup Modal */}
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
