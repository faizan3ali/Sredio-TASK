const passport = require("passport");
const User = require("../models/userModel");
const axios = require("axios");


exports.githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

exports.githubCallback = (req, res, next) => {
  passport.authenticate("github", (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}?status=error`);
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res.redirect(`${process.env.FRONTEND_URL}?status=error`);
      }

      // Use template literal correctly
      return res.redirect(`${process.env.FRONTEND_URL}?id=${user.id}`);
    });
  })(req, res, next);
};

exports.getAuthStatus = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    console.log(user);
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
    return res.status(500).json({ message: "Verification failed", error: err });
  }
};

exports.logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: "Logged out" });
};

exports.removeUserAndRevokeGithub = async (req, res) => {
  const userId = req.body.id;

  try {
    console.log(userId);
    const user = await User.findById(userId);
    console.log(user);
    if (!user || !user.githubId) {
      return res
        .status(400)
        .json({ message: "User not found or not connected with GitHub" });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const revokeUrl = `https://api.github.com/applications/${clientId}/token`;

    await axios({
      method: "delete",
      url: revokeUrl,
      auth: {
        username: clientId,
        password: clientSecret,
      },
      data: {
        access_token: user.accessToken,
      },
    });

    await User.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "User removed and GitHub token revoked" });
  } catch (err) {
    console.error("Error removing user and revoking GitHub token:", err);
    return res
      .status(500)
      .json({ message: "Failed to remove user", error: err });
  }
};
