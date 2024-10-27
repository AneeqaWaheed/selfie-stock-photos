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
import paypal from "paypal-rest-sdk";
// import { initializePassport } from "./config/google/passport.js";
import cookieParser from "cookie-parser";
// config env
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Store your secret key in .env file
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
