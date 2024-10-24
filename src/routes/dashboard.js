const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/Dashboard/user")
const authenticatedUser = require("../middleware/authenticatedUser")

router.get("/users/connect/:userId", 
    authenticatedUser, 
    dashboardController.getAllUser);

router.get("/users/search/:country/:state/:userId",  
    authenticatedUser, 
    dashboardController.searchUsers);

router.post('/follow',  
    authenticatedUser, 
    dashboardController.followUser);

router.post('/unfollow',  
    authenticatedUser, 
    dashboardController.unfollowUser);

router.get('/followers/:userId',  
    authenticatedUser,  
    dashboardController.getFollowers);
    
router.get('/following/:userId',  
    authenticatedUser,  
    dashboardController.getFollowing);

module.exports = router;