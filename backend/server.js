const path = require("path");

// Render injects env vars natively in production — only load .env files locally
if (process.env.NODE_ENV !== "production") {
  const env = process.env.NODE_ENV || "development";
  require("dotenv").config({ path: path.join(__dirname, "..", `.env.${env}`) });
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT} in ${process.env.NODE_ENV} mode`);
});
