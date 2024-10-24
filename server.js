require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/dbConnect.js");
const app = express();
const cors = require("cors");
const corsOptions = require("./src/config/corsOptions");
const PORT = process.env.PORT || 8000;
const path = require("path");
const helmet = require("helmet")
const rateLimiter = require('./src/middleware/rateLimiter'); // Import the rate limiter


app.use(express.urlencoded({ extended: false }));

connectDB();

app.use(cors(corsOptions));
app.use(helmet())
// build in middleware for json
app.use(express.json({ limit: "10mb" }));

// Set Cache-Control headers globally for all routes
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0
  res.setHeader("Expires", "0"); // Proxies
  next();
});

app.set ('trust proxy', 1);

// Apply the rate limiter globally
app.use(rateLimiter);

app.use("/api/v1/", require("./src/routes/authentication"));
app.use("/api/v1/", require("./src/routes/dashboard"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});