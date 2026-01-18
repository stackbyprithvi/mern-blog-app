import React, { useState, useEffect } from "react";
import { postService } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/CreatePost";
import CommentSection from "../components/CommentSection";
import EditPost from "../components/EditPost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likingPostId, setLikingPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => setPosts([newPost, ...posts]);
  const handlePostUpdated = (updatedPost) =>
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure?")) return;
    await postService.deletePost(postId);
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handleLike = async (postId) => {
    if (!user) return alert("Login first!");
    if (likingPostId === postId) return;
    setLikingPostId(postId);

    try {
      const updatedPost = await postService.likePost(postId);
      setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
    } catch {
      alert("Failed to like post");
    } finally {
      setLikingPostId(null);
    }
  };

  if (loading)
    return (
      <div className="mt-10 text-center text-gray-800 dark:text-gray-100">
        Loading...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 text-gray-800 dark:text-gray-100">
      {user && (
        <div className="mb-6 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Create a Post</h2>
          <CreatePost onPostCreated={handlePostCreated} />
        </div>
      )}

      <h1 className="mb-6 text-3xl font-bold">Recent Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => {
            const isLiked =
              user &&
              post.likes?.some((id) => id.toString() === user._id.toString());
            const isLiking = likingPostId === post._id;
            const isEditing = editingPostId === post._id;

            return (
              <div
                key={post._id}
                className="rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                {isEditing ? (
                  <EditPost
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onCancel={() => setEditingPostId(null)}
                  />
                ) : (
                  <>
                    <h2 className="mb-1 text-2xl font-semibold">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      By {post.author?.username || "Unknown"} •{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                      {post.content}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleLike(post._id)}
                        disabled={!user || isLiking}
                        className={`px-4 py-2 text-sm rounded-md text-white transition ${
                          isLiked
                            ? "bg-blue-600"
                            : "bg-blue-500 hover:bg-blue-600"
                        } ${!user || isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isLiking ? "..." : isLiked ? "👍 Liked" : "👍 Like"} (
                        {post.likes?.length || 0})
                      </button>

                      {user && user._id === post.author?._id && (
                        <>
                          <button
                            onClick={() => setEditingPostId(post._id)}
                            className="px-4 py-2 text-sm rounded-md bg-gray-500 text-white hover:bg-gray-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>

                    <CommentSection postId={post._id} />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
