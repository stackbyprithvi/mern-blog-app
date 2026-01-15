import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { postService } from "../services/postService";

const Home = () => {
  const { user, loading: userLoading } = useAuth(); // AuthContext
  const [posts, setPosts] = useState([]); // API posts
  const [loading, setLoading] = useState(true); // Posts loading
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getPosts(); // API returns array
      setPosts(data || []); // defensive: default to empty array
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Show loader until both user and posts are ready
  if (userLoading || loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome {user?.username || "Guest"}</h1>

      <h2>Latest Posts</h2>
      {posts.length === 0 ? (
        <div>No posts yet. Be the first to create one!</div>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>{post.title}</li>
          ))}
        </ul>
      )}

      <h2>Your Posts</h2>
      {user?.posts?.length > 0 ? ( // optional chaining to prevent crash
        <ul>
          {user.posts.map((post) => (
            <li key={post._id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <div>You have no posts yet.</div>
      )}
    </div>
  );
};

export default Home;
