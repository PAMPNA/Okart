
const express = require("express");

const router = express.Router();

const {
  createUser,
  getUsers,
  addAddress,
  getAddresses,
  deleteAddress,
} = require("../controllers/userController");

// Create User
router.post("/", createUser);

// Get All Users
router.get("/", getUsers);

// Add a new saved address
router.post("/:uid/addresses", addAddress);

// Get all saved addresses
router.get("/:uid/addresses", getAddresses);
// Delete a saved address
router.delete("/:uid/addresses/:addressId", deleteAddress);
module.exports = router;