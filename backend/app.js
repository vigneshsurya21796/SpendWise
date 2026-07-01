const express = require("express");
const app = express();
const errorhandler = require("./middlewars/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const env = process.env.NODE_ENV || "development";

// Security headers
app.use(helmet());

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many requests, please try again later." },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// NoSQL injection prevention — Express 5 makes req.query read-only,
// so sanitize only body and params manually
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body);
  req.params = mongoSanitize.sanitize(req.params);
  next();
});

const users = require("./routes/user.routes");
const expense = require("./routes/expense.routes");
const stats = require("./routes/stats.routes");
const auth = require("./routes/auth.routes");

app.use("/api/v1/auth", env === "production" ? authLimiter : (req, res, next) => next(), auth);
app.use("/api/v1/expenses", expense);
app.use("/api/v1/users", users);
app.use("/api/v1/stats", stats);

app.use(errorhandler);
module.exports = app;
