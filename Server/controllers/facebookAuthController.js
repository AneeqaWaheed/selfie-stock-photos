import admin from "firebase-admin";

import { verifyFacebookToken } from "../config/facebook/facebookService.js";
import userModel from "../models/userModel.js";

export const facebookAuth = async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Verify the Facebook token and get user details
    const facebookUser = await verifyFacebookToken(accessToken);

    // Check if the user already exists in the database
    let user = await userModel.findOne({ oauthId: facebookUser.id });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new userModel({
        first_name: facebookUser.name.split(" ")[0] || "",
        last_name: facebookUser.name.split(" ")[1] || "",
        email: facebookUser.email || `${facebookUser.id}@facebook.com`, // Fallback if email is unavailable
        oauthId: facebookUser.id,
        provider: "facebook",
        username: `fb_${facebookUser.id}`, // Generate a unique username
        profileImage: facebookUser.picture?.data?.url,
      });

      await user.save();
    }

    // Create a Firebase custom token for the user
    const firebaseToken = await admin.auth().createCustomToken(facebookUser.id);

    res.status(200).json({
      message: "Authentication successful",
      firebaseToken,
      user,
    });
  } catch (error) {
    console.error("Facebook Authentication Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
