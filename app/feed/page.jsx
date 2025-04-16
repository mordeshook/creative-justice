'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
  const { user } = useUser();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [showComments, setShowComments] = useState({});
  const [popupImage, setPopupImage] = useState(null); // For popup image modal

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPosts();
      fetchSuggestions();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_users_id', user.id)
      .single();
    if (error) {
      console.error('Error loading profile:', error.message);
    } else {
      setProfile(data);
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching posts:', error.message);
    } else {
      setPosts(data || []);
      const postLikes = {};
      const postComments = {};
      for (let post of data) {
        const { count, error: likeError } = await supabase
          .from('likes')
          .select('post_id', { count: 'exact' })
          .eq('post_id', post.id);

        if (likeError) {
          console.error('Error fetching likes:', likeError.message);
        } else {
          postLikes[post.id] = count || 0;
        }

        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', post.id);
        if (commentsError) {
          console.error('Error fetching comments:', commentsError.message);
        } else {
          postComments[post.id] = commentsData || [];
        }
      }
      setLikes(postLikes);
      setComments(postComments);
    }
  };

  const fetchSuggestions = async () => {
    const { data: allProfiles, error } = await supabase
      .from('profiles')
      .select('name, type, avatar_url, auth_users_id');

    if (error) {
      console.error('Error fetching suggestions:', error.message);
      return;
    }

    const filtered = allProfiles.filter((p) => p.auth_users_id !== user.id);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  };

  const handlePost = async () => {
    let mediaUrl = null;

    if (media) {
      const fileExt = media.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, media);

      if (error) {
        console.error('Upload error:', error.message);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from('media')
        .getPublicUrl(fileName);

      mediaUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase.from('submissions').insert({
      auth_users_id: user.id,
      content,
      media_url: mediaUrl,
      name: profile.name, // Save the profile name when creating the post
    });

    if (error) {
      console.error('Submit error:', error.message);
    } else {
      setContent('');
      setMedia(null);
      fetchPosts();
    }
  };

  const handleLike = async (postId) => {
    const existingLike = await supabase
      .from('likes')
      .select('id')
      .eq('auth_users_id', user.id)
      .eq('post_id', postId)
      .single();

    if (!existingLike.data) {
      const newLikes = likes[postId] + 1;
      setLikes({ ...likes, [postId]: newLikes });

      const { error } = await supabase
        .from('likes')
        .insert({ auth_users_id: user.id, post_id: postId });

      if (error) {
        console.error('Error submitting like:', error.message);
      } else {
        // Insert like notification for the post owner
        const postOwner = posts.find((post) => post.id === postId)?.auth_users_id;
        if (postOwner) {
          await supabase
            .from('notifications')
            .insert({
              auth_users_id: postOwner,
              type: 'like',
              message: `${profile.name} liked your post`,
              post_id: postId,
            });
        }
      }
    } else {
      await supabase
        .from('likes')
        .delete()
        .eq('auth_users_id', user.id)
        .eq('post_id', postId);

      const newLikes = likes[postId] - 1;
      setLikes({ ...likes, [postId]: newLikes });
    }
  };

  const handleCommentTextChange = (postId, text) => {
    setCommentInput({
      ...commentInput,
      [postId]: text,
    });
  };

  const handleComment = async (postId) => {
    const commentText = commentInput[postId];
    if (!commentText) return;

    const newComment = {
      post_id: postId,
      auth_users_id: user.id,
      comment: commentText,
      created_at: new Date().toISOString(),
      name: profile.name, // Save the profile name when posting a comment
    };

    const { error } = await supabase.from('comments').insert(newComment);
    if (error) {
      console.error('Error adding comment:', error.message);
    } else {
      setComments({
        ...comments,
        [postId]: [...(comments[postId] || []), newComment],
      });
      setCommentInput({
        ...commentInput,
        [postId]: '',
      });
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error.message);
    } else {
      setComments({
        ...comments,
        [postId]: comments[postId].filter((comment) => comment.id !== commentId),
      });
    }
  };

  const handleOpenImage = (post) => {
    setPopupImage(post);
  };

  const handleClosePopup = () => {
    setPopupImage(null);
  };

  if (!user || !profile) return <div className="p-6">Loading feed...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Image Popup */}
      {popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">{popupImage.name}</span>
              <button onClick={handleClosePopup} className="text-xl text-red-500">
                X
              </button>
            </div>
            <img
              src={popupImage.media_url}
              alt="Post media"
              className="w-full h-auto mt-2 max-h-[80vh] object-contain"
            />
            <p className="mt-2">{popupImage.content}</p>
          </div>
        </div>
      )}

      <div className="md:col-span-1 bg-white p-4 rounded shadow">
        <img
          src={profile.avatar_url || 'https://placehold.co/100x100'}
          className="w-24 h-24 rounded-full mx-auto"
          alt="Avatar"
        />
        <h2 className="text-center font-semibold mt-2">{profile.name}</h2>
        <p className="text-center text-sm text-gray-500">{profile.type}</p>
        <a
          href={`/profile/${profile.auth_users_id}`}
          className="text-center text-blue-500 text-sm mt-4 block"
        >
          View Profile
        </a>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded shadow">
          <textarea
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/mp4"
            className="mt-2"
            onChange={(e) => setMedia(e.target.files[0])}
          />
          <button
            onClick={handlePost}
            className="mt-2 px-4 py-2 bg-black text-white rounded"
          >
            Post
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Recent Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
                <div className="flex items-center">
                  <h3
                    className="font-medium text-blue-600 cursor-pointer"
                    onClick={() => router.push(`/profile/${post.auth_users_id}`)}
                  >
                    {post.name}
                  </h3>
                  <p className="text-sm ml-2 text-gray-500">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 space-y-2">
  {post.content && (
    <p className="text-sm text-gray-800">{post.content}</p>
  )}

  {post.challenge_id && post.challenge_title && (
    <>
      <h4
        className="text-blue-700 font-semibold underline cursor-pointer"
        onClick={() => router.push(`/challenge/${post.challenge_id}`)}
      >
        {post.challenge_title}
      </h4>
      {post.media_url && (
        <img
          src={post.media_url}
          alt="Challenge Preview"
          className="w-full max-h-80 object-cover rounded cursor-pointer"
          onClick={() => router.push(`/challenge/${post.challenge_id}`)}
        />
      )}
    </>
  )}

{!post.challenge_id && post.media_url && (
  <img
    src={post.media_url}
    alt="Post"
    className="w-full max-h-80 object-cover rounded cursor-pointer"
    onClick={() => handleOpenImage(post)}
  />
)}
</div>


                <div className="flex space-x-4 mt-2">
                  <button
                    className="flex items-center"
                    onClick={() => handleLike(post.id)}
                  >
                    <img
                      src={likes[post.id] > 0 ? '/heart_red.svg' : '/heart_plus.svg'}
                      alt="Like"
                      className="mr-2"
                    />
                    {likes[post.id]} Likes
                  </button>
                  <button
                    className="flex items-center"
                    onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                  >
                    <img
                      src="/add_comment.svg"
                      alt="Comment"
                      className="mr-2"
                    />
                    {comments[post.id] && comments[post.id].length} Comments
                  </button>
                </div>
                {showComments[post.id] && comments[post.id] && (
                  <div className="mt-2">
                    {comments[post.id].map((comment, index) => (
                      <div key={index} className="p-2 border-b">
                        <div className="flex items-center">
                          <img
                            src={comment.profile_avatar || 'https://placehold.co/40x40'}
                            className="w-8 h-8 rounded-full"
                            alt="Commenter avatar"
                          />
                          <p className="ml-2 font-medium text-blue-600 cursor-pointer">
                            {comment.name}
                          </p>
                          <p className="text-sm ml-2 text-gray-500">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                          {comment.auth_users_id === user.id && (
                            <button
                              onClick={() => handleDeleteComment(post.id, comment.id)}
                              className="ml-2 text-red-600"
                            >
                              <img
                                src="/delete.svg"
                                alt="Delete"
                                className="w-5 h-5"
                              />
                            </button>
                          )}
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    ))}
                    <textarea
                      className="w-full p-2 border mt-2"
                      placeholder="Add a comment..."
                      value={commentInput[post.id] || ''}
                      onChange={(e) => handleCommentTextChange(post.id, e.target.value)}
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="inline-flex items-center px-2 py-1 bg-transparent text-blue-500"
                    >
                      <img src="/send.svg" alt="Send" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="md:col-span-1 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Who to Follow</h3>
        {suggestions.map((s) => (
          <div key={s.auth_users_id} className="flex items-center mb-3">
            <img
              src={s.avatar_url || 'https://placehold.co/40x40'}
              className="w-10 h-10 rounded-full"
              alt="Avatar"
            />
            <div className="ml-3">
              <p
                className="font-medium text-blue-600 cursor-pointer"
                onClick={() => router.push(`/profile/${s.auth_users_id}`)}
              >
                {s.name}
              </p>
              <p className="text-xs text-gray-500">{s.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
