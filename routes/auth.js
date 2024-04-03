const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, mobileNum, email, password } = req.body;

    if (!name || !mobileNum || !email || !password) {
      return res.status(400).json({
        message: "Bad Request!",
      });
    }

    const isExistingUserWithEmail = await User.findOne({ email });
    const isExistingUserWithMoblie = await User.findOne({ mobileNum });
    if (isExistingUserWithEmail || isExistingUserWithMoblie) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      mobileNum,
      email,
      password: hashedPassword,
    });

    const userResponse = await userData.save();

    const token = jwt.sign(
      { userId: userResponse._id },
      process.env.JWT_SECRET_KEY
    );

    res.json({
      message: "User registered successfully",
      token: token,
      username: name,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    const emailOrPhone = req.body.email;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        message: "Bad Request!",
        success: false,
      });
    }

    const userDetailsIfEmail = await User.findOne({ email: emailOrPhone });
    const userDetailsIfPhone = await User.findOne({ mobileNum: emailOrPhone });
    const userDetails = userDetailsIfEmail || userDetailsIfPhone;
    if (!userDetails) {
      return res.status(401).json({
        message: "Invalid Credentials",
        success: false,
      });
    }

    const isPasswordMatches = await bcrypt.compare(
      password,
      userDetails.password
    );

    if (!isPasswordMatches) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: userDetails._id },
      process.env.JWT_SECRET_KEY
    );

    res.json({
      message: "User loggedin successfully",
      token: token,
      username: userDetails.name,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong!",
    });
  }
});

module.exports = router;
