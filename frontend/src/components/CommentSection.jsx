import React, { useState, useEffect } from "react";
import { commentService } from "../services/commentService";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await commentService.getComments(postId);
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const comment = await commentService.createComment(postId, newComment);
      setComments([comment, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to create comment:", err);
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment");
    }
  };

  return (
    <div className="mt-6 border-t dark:border-gray-700 pt-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border dark:border-gray-600 rounded 
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Please login to comment
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-50 dark:bg-gray-700 rounded p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">
                    {comment.author?.username || "Unknown"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {user && user._id === comment.author?._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
