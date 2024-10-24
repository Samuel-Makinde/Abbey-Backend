const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/Dashboard/user")

router.get("/users/connect/:userId", dashboardController.getAllUser);
router.get("/users/search/:country/:state/:userId", dashboardController.searchUsers);

router.post('/follow',  dashboardController.followUser);
router.post('/unfollow', dashboardController.unfollowUser);

router.get('/followers/:userId',  dashboardController.getFollowers);
router.get('/following/:userId',  dashboardController.getFollowing);

module.exports = router;