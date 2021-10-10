const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
require("dotenv").config();

exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!validator.validate(req.body.email)) {
      return res.status(400).json({ message: "email is not valid" });
    }
    if (existingUser) {
      return res.status(400).json({ message: "email has been taken" });
    }
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
    });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    newUser.password = hashedPassword;
    await newUser.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );

    return res.status(200).json({
      message: `Welcome to the family ${req.body.name}`,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ "err:": err });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      return res.status(401).json({ message: "incorrect email" });
    }
    let match = await bcrypt.compareSync(req.body.password, foundUser.password);
    if (!match) {
      return res.status(401).json({ message: "incorrect password" });
    }
    const token = await jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
        name: foundUser.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.TOKEN_EXPIRY,
      }
    );
    return res
      .status(200)
      .json({ message: "user logged in successfully", token });
  } catch (err) {
    return res.status(500).json({ err });
  }
};
