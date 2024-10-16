const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  githubId: String,     
  name: String,          
  fullName: String,       
  organizationId: String, 
  included: { type: Boolean, default: false }, 
  commits: Number,        
  pullRequests: Number,  
  issues: Number,        
});

const Repo = mongoose.model('repo', repoSchema);
module.exports = Repo;
