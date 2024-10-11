const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  githubId: String,  // GitHub organization ID
  login: String,     // Organization login name
  userId: String,    // ID of the associated user
  repos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repo' }] // Repos linked to this organization
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
