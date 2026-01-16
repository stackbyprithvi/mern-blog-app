import React, { useState, useEffect } from "react";
import { postService } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingPostId, setLikingPostId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  //CALLBACK POST CREATE
  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

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

  const handleLike = async (postId) => {
    if (!user) {
      alert("Please login to like posts");
      return;
    }

    if (likingPostId === postId) {
      return;
    }
    setLikingPostId(postId);

    try {
      const updatedPost = await postService.likePost(postId);
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error("Failed to like post:", err);
      alert("Failed to like post");
    } finally {
      setLikingPostId(null);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      {/* Create Post Section - Only show if logged in */}
      {user && (
        <div className="border rounded p-6 mb-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      {/* Posts Feed */}
      <h1 className="text-3xl font-bold mb-6">Recent Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first to post!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLiked = user && post.likes?.includes(user._id);
            const isLiking = likingPostId === post._id;

            return (
              <div
                key={post._id}
                className="border rounded p-6 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      By {post.author?.username || "Unknown"} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleLike(post._id)}
                    disabled={!user || isLiking}
                    className={`px-4 py-2 rounded text-sm transition ${
                      isLiked
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    } ${
                      !user || isLiking ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLiking ? "..." : isLiked ? "👍 Liked" : "👍 Like"} (
                    {post.likes?.length || 0})
                  </button>

                  {user && user._id === post.author?._id && (
                    <>
                      <button className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
