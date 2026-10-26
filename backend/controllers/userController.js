
const User = require("../models/User");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { uid, name, email, phone, photoURL } = req.body;

    const existingUser = await User.findOne({ uid });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        data: existingUser,
      });
    }

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

// Add a new saved address
const addAddress = async (req, res) => {
  try {
    const { uid } = req.params;

    const {
      label,
      fullName,
      phone,
      houseNumber,
      street,
      city,
      state,
      pinCode,
      isDefault,
    } = req.body;

    // Validate required fields
    if (
      !label ||
      !fullName ||
      !phone ||
      !houseNumber ||
      !street ||
      !city ||
      !state ||
      !pinCode
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If this is the first address, make it default
    const shouldBeDefault =
      user.addresses.length === 0 || isDefault === true;

    // If the new address is default, remove default from others
    if (shouldBeDefault) {
      user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      phone,
      houseNumber,
      street,
      city,
      state,
      pinCode,
      isDefault: shouldBeDefault,
    });

    const updatedUser = await user.save();

    const savedAddress =
      updatedUser.addresses[updatedUser.addresses.length - 1];

    return res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: savedAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save address",
    });
  }
};

// Get all saved addresses
const getAddresses = async (req, res) => {
  try {
    const { uid } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: user.addresses.length,
      data: user.addresses,
    });
  } catch (error) {
    console.error("Get Addresses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};
// Delete a saved address
const deleteAddress = async (req, res) => {
  try {
    const { uid, addressId } = req.params;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const addressExists = user.addresses.some(
      (address) => address._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== addressId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  addAddress,
  getAddresses,
  deleteAddress,
};