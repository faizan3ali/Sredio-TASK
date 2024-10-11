const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  githubId: String,       // GitHub repo ID
  name: String,           // Repository name
  fullName: String,       // Full name of the repo
  organizationId: String, // ID of the organization
  included: { type: Boolean, default: false }, // Included checkbox status
  commits: Number,        // Number of commits
  pullRequests: Number,   // Number of pull requests
  issues: Number,         // Number of issues
});

const Repo = mongoose.model('repo', repoSchema);
module.exports = Repo;
