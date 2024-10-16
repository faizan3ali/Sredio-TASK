const passport = require("passport");
const User = require("../models/userModel");
const axios = require("axios");

// Helper to handle redirect with status
const redirectWithStatus = (res, status, userId = "") =>
  res.redirect(`${process.env.FRONTEND_URL}?status=${status}${userId ? `&id=${userId}` : ""}`);

exports.githubLogin = passport.authenticate("github", {
  scope: ["read:org", "repo", "user", "user:email"],
});

exports.githubCallback = (req, res, next) => {
  passport.authenticate("github", (err, user) => {
    if (err || !user) {
      return redirectWithStatus(res, "error");
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return redirectWithStatus(res, "error");
      }
      return redirectWithStatus(res, "success", user.id);
    });
  })(req, res, next);
};

exports.getAuthStatus = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      isAuthenticated: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        connectedAt: user.connectedAt,
      },
    });
  } catch (err) {
    console.error("Error fetching auth status:", err.message);
    return res.status(500).json({ message: "Verification failed", error: err.message });
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err.message);
      return res.status(500).json({ message: "Logout failed", error: err.message });
    }
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

exports.removeUserAndRevokeGithub = async (req, res) => {
  const { id: userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.githubId) {
      return res
        .status(400)
        .json({ message: "User not found or not connected with GitHub" });
    }

    const { GITHUB_CLIENT_ID: clientId, GITHUB_CLIENT_SECRET: clientSecret } = process.env;
    const revokeUrl = `https://api.github.com/applications/${clientId}/token`;

    // Revoke GitHub access token
    await axios.delete(revokeUrl, {
      auth: { username: clientId, password: clientSecret },
      data: { access_token: user.accessToken },
    });

    // Remove user from the database
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User removed and GitHub token revoked" });
  } catch (err) {
    console.error("Error removing user and revoking GitHub token:", err.message);
    return res.status(500).json({ message: "Failed to remove user", error: err.message });
  }
};
