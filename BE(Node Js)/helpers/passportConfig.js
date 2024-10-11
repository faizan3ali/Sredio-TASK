const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: ["read:org", "repo", "user", "user:email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }
        user = new User({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          avatar: profile._json.avatar_url,
          connectedAt: new Date(),
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
