require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log("running server.js");
});
