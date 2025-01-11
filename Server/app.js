import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import connectDB from "./config/db.js";
import authroute from "./routes/authroute.js";
import session from "express-session";
import "./config/passport.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import imagesRoute from "./routes/imagesRoute.js";
import profileRoute from "./routes/profileRoute.js";
import followroute from "./routes/followroute.js";
import notificationRoute from "./routes/notificationRoute.js";
import paypal from "paypal-rest-sdk";
// import { initializePassport } from "./config/google/passport.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// config env
dotenv.config();
console.log("dmsfbsmdnfbsdm", process.env.GOOGLE_CLIENT_ID);

console.log(process.env.GOOGLE_CLIENT_ID);
//database config
connectDB();

//rest object
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Store your secret key in .env file
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());

//paypal
paypal.configure({
  mode: process.env.PAYPAL_MODE, // Use 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

//routes
app.use("/api/v1/auth", authroute);
app.use("/api/payment", paymentRoutes);
app.use("/api/images", imagesRoute);
app.use("/api/profile", profileRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/followers", followroute);
app.use(cors());
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to app</h1>");
});

//PORT
const PORT = process.env.PORT || 5000;

//Run listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// app.listen(PORT, "0.0.0.0", () => {
//   // Listen on all network interfaces
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });
