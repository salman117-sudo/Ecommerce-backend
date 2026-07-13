import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://salmansabir2002_db_user:peIMI0yHF1t80MKk@cluster0.dspbsia.mongodb.net/",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

export default env;
