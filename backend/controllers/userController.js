const User = require("../models/User");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { uid, name, email, phone, photoURL } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: existingUser,
      });
    }

    // Create new user
    const user = await User.create({
      uid,
      name,
      email,
       phone,
      photoURL,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Create User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createUser,
  getUsers,
};