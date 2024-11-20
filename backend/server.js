require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
// const questionRoutes = require("./routes/question");
// const answerRoutes = require("./routes/answer");
// const storyRoutes = require("./routes/story");
const app = express();

const port = process.env.PORT || 5000; // Default to port 5000 if not specified

// Middleware for handling CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Your frontend's URL
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/users", userRoutes);   // Route for user-related operations (signup, login)
//app.use("/api/posts", postRoutes);   // Route for post-related operations

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the pragatihub backend!");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI) // MongoDB connection URI from environment variable
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
