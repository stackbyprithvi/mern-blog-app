import React, { useState, useEffect } from "react";
import { postService } from "../services/postService";
import CreatePost from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
    } catch {
      alert("Failed to delete post");
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Latest Posts</h1>
      {user && (
        <CreatePost onPostCreated={(post) => setPosts([post, ...posts])} />
      )}

      {posts.length === 0 ? (
        <div>No posts yet. Be the first to create one!</div>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <strong>{post.title}</strong>
              <p>{post.content}</p>
              <p>By: {post.author?.username || "Unknown"}</p>
              {user && user._id === post.author?._id && (
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
