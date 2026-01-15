import API from "./api";

export const postService = {
  getPosts: async () => {
    const res = await API.get("/posts");
    return res.data.posts;
  },
};
