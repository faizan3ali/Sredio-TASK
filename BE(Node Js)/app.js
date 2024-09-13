const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("./helpers/passportConfig");
require('./helpers/passportConfig'); // Adjust the path as necessary



dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200", // Frontend origin
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(
  session({
    secret: "github-integration-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  {process.env.GITHUB_CLIENT_ID}
  console.log(`Server running on port ${PORT}`);
});
