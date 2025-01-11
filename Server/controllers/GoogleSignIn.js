import { verifyToken } from "../firebase.js";
import userModel from "../models/userModel.js";
const googleAuth = async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;

  try {
    // Verify the ID token sent by the frontend
    const decodedToken = await verifyToken(uid);

    // Check if user exists in MongoDB
    let user = await userModel.findOne({ oauthId: decodedToken.uid });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new userModel({
        first_name: displayName.split(" ")[0], // Assuming first name is the first part of the display name
        last_name: displayName.split(" ")[1] || "",
        email,
        oauthId: decodedToken.uid,
        provider: "google",
        profileImage: photoURL,
        username: email.split("@")[0], // Use email prefix as username
      });

      await user.save();
    }

    res.status(200).json({
      message: "Google login successful",
      user: {
        uid: user._id,
        email: user.email,
        displayName: user.first_name + " " + user.last_name,
        photoURL: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { googleAuth };
