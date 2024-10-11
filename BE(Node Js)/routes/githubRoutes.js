const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/organizations', githubController.getOrganizations);
router.get('/repos', githubController.getOrganizationRepos);
router.post('/repo-details-batch', githubController.getRepoDetailsBatch);

module.exports = router;


