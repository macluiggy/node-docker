//@ts-check
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
        hp: hashedPassword,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // 1) Check if email and password exist
    if (!username || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password!",
      });
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ username }).select("+password");
    // const correct = await user.correctPassword(password, user.password);
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
    // 3) If everything ok, send token to client
    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
