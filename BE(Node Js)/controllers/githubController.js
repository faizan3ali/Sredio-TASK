const axios = require('axios');
const Organization = require('../models/organizationModel');
const Repo = require('../models/repoModel');
const User = require('../models/userModel');

// Generic function to fetch data from GitHub API
const fetchGithubData = async (url, accessToken) => {
  try {
    const { data, headers } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });
    console.log('Granted Scopes:', headers['x-oauth-scopes']);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw new Error('Failed to fetch data from GitHub');
  }
};

const findUserById = async (userId, res) => {
  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    throw new Error('User not found');
  }
  return user;
};


const findOrganizationById = async (organizationId, res) => {
  const organization = await Organization.findById(organizationId);
  if (!organization) {
    res.status(404).json({ message: 'Organization not found' });
    throw new Error('Organization not found');
  }
  return organization;
};

exports.getOrganizations = async (req, res) => {
  try {
    const user = await findUserById(req.query.userId, res);
    const organizationsData = await fetchGithubData('https://api.github.com/user/orgs', user.accessToken);

    const organizations = await Organization.insertMany(
      organizationsData.map(({ id, login }) => ({
        githubId: id,
        login,
        userId: user._id,
      }))
    );

    res.status(200).json(organizations);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch organizations', error: err.message });
  }
};

exports.getOrganizationRepos = async (req, res) => {
  try {
    const user = await findUserById(req.query.userId, res);
    const organization = await findOrganizationById(req.query.organizationId, res);
    const reposData = await fetchGithubData(`https://api.github.com/orgs/${organization.login}/repos`, user.accessToken);

    const repos = await Repo.insertMany(
      reposData.map(({ id, name, full_name }) => ({
        githubId: id,
        name,
        fullName: full_name,
        organizationId: organization._id,
      }))
    );

    res.status(200).json(repos);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch repos', error: err.message });
  }
};

exports.getRepoDetailsBatch = async (req, res) => {
  try {
    const user = await findUserById(req.body.userId, res);

    const userStats = await Promise.all(
      req.body.repoIds.map(async (repoId) => {
        const repo = await Repo.findOne({ githubId: repoId });
        if (!repo) return null;

        try {
          const [commits, pullRequests, issues] = await Promise.all([
            fetchGithubData(`https://api.github.com/repos/${repo.fullName}/commits`, user.accessToken),
            fetchGithubData(`https://api.github.com/repos/${repo.fullName}/pulls`, user.accessToken),
            fetchGithubData(`https://api.github.com/repos/${repo.fullName}/issues`, user.accessToken),
          ]);

          return {
            user: user.username,
            userId: user._id,
            repoId,
            repoName: repo.name,
            totalCommits: commits.length,
            totalPullRequests: pullRequests.length,
            totalIssues: issues.length,
          };
        } catch (error) {
          console.error(`Error fetching details for repo ${repoId}:`, error.message);
          return null;
        }
      })
    );

    res.status(200).json(userStats.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch repo details', error: err.message });
  }
};