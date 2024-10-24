const User = require('../model/Users');
const { Op } = require('sequelize');
const Follower = require('../model/Follower');




exports.getAllUser = async (params) => {
    const { userId } = params;

    // Validate that userId is provided
    const requiredFields = ['userId'];
    for (const field of requiredFields) {
        if (!params[field]) {
            return { status: 400, data: { message: `${field} is required` } };
        }
    }

    // Fetch the current user's details, excluding updatedAt and password
    const getUser = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ['updatedAt', 'password'] }
    });

    if (!getUser) {
        return { status: 404, data: { message: 'User not found' } };
    }

    const { country, state } = getUser;

    // Fetch users that the current user is following
    const followingList = await Follower.findAll({
        where: { followerId: userId },
        attributes: ['followingId']
    });

    // Extract IDs of users that the current user is following
    const followingIds = followingList.map(follow => follow.followingId);

    // Find users with the same country and state, excluding those followed by the user
    const sameCountryStateUsers = await User.findAll({
        where: {
            country: country,
            state: state,
            id: {
                [Op.and]: [
                    { [Op.ne]: userId }, // Exclude current user
                    { [Op.notIn]: followingIds } // Exclude followed users
                ]
            }
        },
        attributes: { exclude: ['updatedAt', 'password'] }
    });

    // Find users with the same country but different state, excluding those followed by the user
    const sameCountryUsers = await User.findAll({
        where: {
            country: country,
            state: { [Op.ne]: state },
            id: {
                [Op.and]: [
                    { [Op.ne]: userId }, // Exclude current user
                    { [Op.notIn]: followingIds } // Exclude followed users
                ]
            }
        },
        attributes: { exclude: ['updatedAt', 'password'] }
    });

    // Find users from other countries, excluding those followed by the user
    const otherUsers = await User.findAll({
        where: {
            country: { [Op.ne]: country },
            id: {
                [Op.and]: [
                    { [Op.ne]: userId }, // Exclude current user
                    { [Op.notIn]: followingIds } // Exclude followed users
                ]
            }
        },
        attributes: { exclude: ['updatedAt', 'password'] }
    });

    // Combine all users into a single array
    const usersToConnectWith = [
        ...sameCountryStateUsers,
        ...sameCountryUsers,
        ...otherUsers
    ];

    return { status: 200, data: usersToConnectWith };
};


exports.searchUsers = async (params) => {
    const { country, state, userId } = params;

    const requiredFields = ['userId', 'country'];
  
    for (const field of requiredFields) {
        if (!params[field]) {
            return { status: 400, data: { message: `${field} is required` } };
        }
    }

    // Build the query based on the presence of state
    const whereClause = {
        country: country,
        id: { [Op.ne]: userId },
        ...(state && state !== "not available" ? { state: state } : { state: { [Op.or]: [state, null] } }) 
    };

        const users = await User.findAll({
            where: whereClause,
            attributes: { exclude: ['updatedAt', 'password'] } 
        });

        return { status: 200, data: users };
};


// logic to follow and unfollow users
exports.followUser = async (body) => {
    
    const { followerId, followingId } = body;

    const requiredFields = ['followingId', 'followerId'];
  
    for (const field of requiredFields) {
        if (!body[field]) {
            return { status: 400, data: { message: `${field} is required` } };
        }
    }

    if (followerId === followingId) {
        return { status: 400, data: { message: 'You cannot follow yourself' } };
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follower.findOne({
        where: {
            followerId: followerId,
            followingId: followingId
        }
    });

    if (existingFollow) {
        return { status: 409, data: { message: 'You are already following this user' } };
    }

    // Create a new follow relationship
    await Follower.create({ followerId, followingId });

    return { status: 200, data: { message: 'You are now following this user' } };
};

exports.unfollowUser = async (body) => {
    const { followerId, followingId } = body;

    const requiredFields = ['followingId', 'followerId'];
  
    for (const field of requiredFields) {
        if (!body[field]) {
            return { status: 400, data: { message: `${field} is required` } };
        }
    }
    // Check if the follow relationship exists
    const existingFollow = await Follower.findOne({
        where: {
            followerId: followerId,
            followingId: followingId
        }
    });

    if (!existingFollow) {
        return { status: 404, data: { message: 'You are not following this user' } };
    }

    // Delete the follow relationship
    await Follower.destroy({
        where: {
            followerId,
            followingId
        }
    });

    return { status: 200, data: { message: 'You have unfollowed this user' } };
};


// logic to get my followers and people i follow
exports.getFollowers = async (params) => {
    const {userId} = params
    if (!userId) {
        return { status: 400, data: { message: 'user id is required' } };
    }
    console.log('userId type:', userId, 'Type:', typeof userId);
    const followers = await Follower.findAll({
        where: {
            followingId: userId
        },
        include: [{
            model: User,
            as: 'follower', 
            attributes: ['id', 'fullname', 'username', 'email', 'bio', 'createdAt', 'country', 'state'] 
        }],
        order: [['createdAt', 'ASC']] 
    });

    
    const followersList = followers.map(follow => follow.follower);

    return { status: 200, data: followersList };
};

exports.getFollowing = async (params) => {

     const {userId} = params
     if (!userId) {
        return { status: 400, data: { message: 'user id is required' } };
    }

    // Retrieve users that the current user is following
    const following = await Follower.findAll({
        where: {
            followerId: userId
        },
        include: [{
            model: User,
            as: 'following', 
            attributes: ['id', 'fullname', 'username', 'email', 'bio', 'createdAt', 'country', 'state']
        }],
        order: [['createdAt', 'ASC']] 
    });

    
    const followingList = following.map(follow => follow.following);

    return { status: 200, data: followingList };
};