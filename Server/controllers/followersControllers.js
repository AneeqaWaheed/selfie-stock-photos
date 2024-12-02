import userModel from "../models/userModel.js";

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.body; // User who is following
    const { id } = req.params; // User to be followed

    const user = await userModel.findById(userId);
    const targetUser = await userModel.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.following) {
      user.following = [];
    }

    if (!targetUser.followers) {
      targetUser.followers = [];
    }
    if (!user.following.includes(id)) {
      user.following.push(id);
      targetUser.followers.push(userId);
      await user.save();
      await targetUser.save();
      return res.status(200).json({ message: "User followed successfully" });
    }
    res.status(400).json({ message: "Already following" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const user = await userModel.findById(userId);
    const targetUser = await userModel.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    user.following = user.following.filter((uid) => uid.toString() !== id);
    targetUser.followers = targetUser.followers.filter(
      (uid) => uid.toString() !== userId
    );

    await user.save();
    await targetUser.save();
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
