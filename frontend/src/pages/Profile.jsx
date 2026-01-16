import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/postService";
import CreatePost from "../components/CreatePost";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch user's posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const data = await postService.getUserPosts(user._id);
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchMyPosts();
  }, [user]);

  // Handle post creation callback
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await postService.deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">Loading user...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      {/* Profile Info */}
      <div className="border rounded p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <p className="mb-2">
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Create Post Form */}
      <div className="border rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
        <CreatePost onPostCreated={handlePostCreated} />
      </div>

      {/* User Posts */}
      <div className="border rounded p-6">
        <h2 className="text-xl font-semibold mb-4">
          Your Posts ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
