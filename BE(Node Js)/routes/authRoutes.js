const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/github", authController.githubLogin);
router.get("/github/callback", authController.githubCallback);
router.post("/status", authController.getAuthStatus);
router.post("/remove", authController.removeUserAndRevokeGithub);

module.exports = router;
