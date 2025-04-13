const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "Incorrect Email.")
    errors.email = "Email not registered.";

  if (err.message === "Incorrect Password.")
    errors.email = "Password is incorrect.";

  if (err.code === 11000) {
    errors.email = "Email already registered.";
    return errors;
  }

  if (err.message.includes("Users validation failed.")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await UserModel.create({ email, password });
    const token = createToken(user._id);

    // res.cookie("jwt", token, {
    //   //   withCredentials: true,
    //   //   httpOnly: false,
    //   httpOnly: true,
    //   maxAge: maxAge * 1000,
    // });
    res.cookie("token", token, {
      httpOnly: true, // Security: JS can't access it
      // secure: false, // Set to true in production (HTTPS only)
      secure: process.env.NODE_ENV === "production",
      sameSite: "None", // Or "Strict" if you want tighter control
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });
    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);
    // const errors = handleErrors(err);
    // res.json({ errors, created: false });
    res
      .status(400)
      .json({ error: "Registration failed", details: err.message });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        errors: { email: "Email not registered" },
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({
        errors: { password: "Incorrect password" },
      });
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });

    // res.cookie("jwt", token, {
    //   httpOnly: false,
    //   withCredentials: true,
    //   maxAge: maxAge * 1000,
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // res.status(200).json({ user: user._id });
    res.status(200).json({
      user: { _id: user._id, email: user.email },
      token, // 👈 Return the token here!
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: { email: "Server error" } });
  }
};
