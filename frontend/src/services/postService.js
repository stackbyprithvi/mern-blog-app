import API from "./api";

export const postService = {
  getPosts: async () => {
    const res = await API.get("/posts");
    return res.data || [];
  },

  getUserPosts: async (userId) => {
    const res = await API.get(`/posts/user/${userId}`);
    return res.data || [];
  },

  createPost: async (title, content) => {
    const token = localStorage.getItem("token");
    const res = await API.post(
      "/posts",
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  },

  deletePost: async (id) => {
    const token = localStorage.getItem("token");
    const res = await API.delete(`/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  updatePost: async (id, title, content) => {
    const token = localStorage.getItem("token");
    const res = await API.put(
      `/posts/${id}`,
      { title, content },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  },

  likePost: async (id) => {
    const token = localStorage.getItem("token");
    const res = await API.post(`/posts/${id}/like`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
