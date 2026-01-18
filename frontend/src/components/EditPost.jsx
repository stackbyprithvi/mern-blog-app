import React, { useState } from "react";
import { postService } from "../services/postService";

const EditPost = ({ post, onPostUpdated, onCancel }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updatedPost = await postService.updatePost(
        post._id,
        title,
        content,
      );
      setLoading(false);
      onPostUpdated(updatedPost);
    } catch (err) {
      console.error("Failed to update post:", err);
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
      <h3 className="text-lg font-semibold mb-4">Edit Post</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            rows="4"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded text-sm hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded text-sm hover:bg-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
