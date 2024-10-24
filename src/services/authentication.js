const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../model/Users');
const Token =require("../model/Token")
const { generateAccessToken, generateRefreshToken } = require('../utils/token');

exports.signUp = async (body) => {
  const { fullname, email, password, username, bio, country, state,  } = body;

  const requiredFields = ['fullname', 'email', 'password', 'username', 'bio', 'country', 'state' ];
  
  for (const field of requiredFields) {
    if (!body[field]) {
      return { status: 400, data: { message: `${field} is required` } };
    }
  }

  const duplicateUser = await User.findOne({ where: { email } });
  if (duplicateUser) {
      return { status: 409, data: { message: 'Email address is associated with an account', } };
    }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullname, email, password: hashedPassword, username, bio, country, state,
  });

  const accessToken = generateAccessToken(newUser.id, newUser.email);
  const refreshToken = generateRefreshToken(newUser.id, newUser.email);

    const user = {
        userId: newUser.id,
        fullName: newUser.fullname,
        email: newUser.email,
        username: newUser.username,
        country: newUser.country,
        state: newUser.country
    };

  return { status: 201, data: { message: 'User created successfully', accessToken, refreshToken, user } };
};

exports.login = async (req) => {
  const { email, password } = req.body;
    const details = ["password", "email"];

    for (const [key, value] of Object.entries(details)) {
    if (!value) {
      return { status: 400, data: { message: `${key} is required` } };
    }
  }

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
       return { status: 401, data: { message: "Invalid email Credential" }};
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { status: 401, data: { message: "Invalid password Credential" }};
    }

    const userToken = await Token.findOne({
      where: { userId: user.id },
    });
    
    const userAgent = req.headers["user-agent"];
    const accessToken = generateAccessToken(user.id, user.email); 
    const refreshToken  = generateRefreshToken(user.id, user.email);

    if (userToken) {
      await userToken.update({
        userAgent,
        accessToken,
        refreshToken,
      });
    } else {
      const myToken = await Token.create({
        accessToken,
        refreshToken,
        userId: user.id,
        userAgent,
      });
    }

    const userSubset = {
        userId: user.id,
        fullName: user.fullname,
        email: user.email,
        username: user.username,
        country: user.country,
        state: user.country
    };

   return { status: 200, data: {
      message: "Login successful",
      accessToken,
      refreshToken,
      user: userSubset,
    }};
 
}