import API from "./api";

export const commentService = {
  // Get all comment for a post
  getComments: async (postId) => {
    const res = await API.get(`/posts/${postId}/comments`);
    return res.data || [];
  },

  //Create comment
  createComment: async (postId, content) => {
    const token = localStorage.getItem("token");
    const res = await API.post(
      `/posts/${postId}/comments`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    const token = localStorage.getItem("token");
    const res = await API.delete(`/posts/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
