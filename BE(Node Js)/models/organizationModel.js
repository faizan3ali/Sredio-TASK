const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  githubId: String,  
  login: String,    
  userId: String,  
  repos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Repo' }] 
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
