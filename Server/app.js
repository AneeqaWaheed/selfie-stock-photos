import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authroute from "./routes/authroute.js";
import session from "express-session";
import passport from "passport";
import "./config/facebook/passport.js"; // Import passport config
import "./config/instagram/passport.js";
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
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//middleware
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authroute);
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//Run listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
