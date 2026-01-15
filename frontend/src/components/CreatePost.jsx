import React, { useState } from "react";
import { postService } from "../services/postService";

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = await postService.createPost(title, content);
      onPostCreated(newPost);
      setTitle("");
      setContent("");
    } catch {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
