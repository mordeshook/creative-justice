'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/AuthContext';

export default function MessagingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('auth_user_id, auth_user_id_to')
      .or(`auth_user_id.eq.${user.id},auth_user_id_to.eq.${user.id}`);

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    const otherUserIds = [
      ...new Set(
        data
          .flatMap(m => [m.auth_user_id, m.auth_user_id_to])
          .filter(id => id !== user.id)
      )
    ];

    const { data: profiles } = await supabase
      .from('profiles')
      .select('auth_users_id, name, avatar_url')
      .in('auth_users_id', otherUserIds);

    setConversations(profiles || []);
  };

  const fetchMessages = async (otherUserId) => {
    setSelectedUser(otherUserId);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(auth_user_id.eq.${user.id},auth_user_id_to.eq.${otherUserId}),
         and(auth_user_id.eq.${otherUserId},auth_user_id_to.eq.${user.id})`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const { error } = await supabase.from('messages').insert({
      auth_user_id_to: user.id,      // ✅ Sender
      auth_user_id: selectedUser,    // ✅ Recipient
      message: newMessage,           // ✅ Not 'content'
    });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
      fetchMessages(selectedUser);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {conversations.map((conv) => (
          <div
            key={conv.auth_users_id}
            onClick={() => fetchMessages(conv.auth_users_id)}
            className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedUser === conv.auth_users_id ? 'bg-gray-200' : ''
            }`}
          >
            <div className="font-medium">{conv.name}</div>
          </div>
        ))}
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 ${
                    msg.auth_user_id_to === user.id ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded ${
                      msg.auth_user_id_to === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border px-4 py-2 rounded-l"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500">Select a conversation</div>
        )}
      </div>
    </div>
  );
}
