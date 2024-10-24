const userService = require('../../services/userServices');

exports.getAllUser = async (req, res) => {
  try {
    const response = await userService.getAllUser(req.params);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const response = await userService.searchUsers(req.params);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

exports.followUser = async (req, res) => {
  try {
    const response = await userService.followUser(req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const response = await userService.unfollowUser(req.body);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const response = await userService.getFollowers(req.params);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const response = await userService.getFollowing(req.params);
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", detail: error });
  }
};
