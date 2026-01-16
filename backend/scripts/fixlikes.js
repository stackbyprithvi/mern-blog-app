const mongoose = require("mongoose");
const Post = require("../models/Post");
require("dotenv").config();

const fixLikes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Find all posts
    const posts = await Post.find({});
    console.log(`Found ${posts.length} posts`);

    let fixed = 0;
    for (const post of posts) {
      // Check if likes is corrupted (string or not an array)
      if (typeof post.likes === "string" || !Array.isArray(post.likes)) {
        console.log(`Fixing post ${post._id}: likes was ${typeof post.likes}`);
        post.likes = [];
        await post.save();
        fixed++;
      }
    }

    console.log(`✅ Fixed ${fixed} posts`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

fixLikes();
