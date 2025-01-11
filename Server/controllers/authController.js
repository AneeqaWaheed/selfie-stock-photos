import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import transport from "../config/nodemailer.js";

//registration
export const registerController = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      bio,
      username,
      profileImage,
    } = req.body;
    if (!first_name) {
      return res.status(400).json({
        success: false,
        message: "first_name is Required",
      });
    }
    if (!last_name) {
      return res
        .status(400)
        .json({ success: false, message: "last_name is Required" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email is Required" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "password is Required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      bio,
      username,
      profileImage,
      // oauthId: null,
      // followers: 0,
      // following: 0,
      photos: 0,
      downloads: 0,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};
//login

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered ",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Sucessfully",
      user: {
        first_name: user.first_name,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};

//update profile

export const updateProfileController = async (req, res) => {
  try {
    const { first_name, last_name, email, password, profileImage, bio } =
      req.body;
    const user = await userModel.findById(req.params.id);

    // Password
    if (password && password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        email: email || user.email,
        password: hashedPassword || user.password,
        profileImage: profileImage || user.profileImage,
        bio: bio || user.bio,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
      message: "Error while updating profile",
    });
  }
};
//All users
export const allUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
//delete user account
export const delUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).send({
      success: true,
      message: "user deleted",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // Expires in 1 hour
    await user.save();

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}. It is valid for the next 1 hour.`,
    };

    transport.sendMail(mailOptions, (err) => {
      if (err) {
        console.error("there was an error: ", err);
        return res.status(500).json({ message: "Failed to send OTP email." });
      }
      res.status(200).json({ message: "OTP sent to your email" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await userModel.findOne({ email, resetPasswordOTP: otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await userModel.findOne({ email, resetPasswordOTP: otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Update password
    user.password = await hashPassword(password);

    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
