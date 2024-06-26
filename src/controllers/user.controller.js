import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as EmailValidator from "email-validator";
import * as ZipcodeValidator from "postal-codes-js";

const addUser = asyncHandler(async (req, res) => {
  const { name, email, age, city, zipcode } = req.body;

  if ([name, email, age, city, zipcode].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  if (!EmailValidator.validate(email) || !ZipcodeValidator.validate(zipcode)) {
    throw new ApiError(400, "Please enter a valid zipcode and email");
  }

  const newUser = await User.create({
    name,
    email,
    age,
    city,
    zipcode,
  });

  const addedUser = await User.findById(newUser._id);
  if (!addedUser) {
    throw new ApiError(500, "Something went wrong while adding user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, addedUser, "User Added Successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const foundUser = await User.findOne({ _id: userId });
  if (!foundUser) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, foundUser, "User Fetched Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const foundUsers = await User.find();
  if (!foundUsers) {
    throw new ApiError(404, "No Users Found");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, foundUsers, "Users Fetched Successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, name, email, age, city, zipcode } = req.body;

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }
  const foundUser = await User.findOne({ _id: id });
  if (!foundUser) {
    throw new ApiError(404, "Invalid user");
  } else {
    if (zipcode && zipcode.length > 0) {
      if (!ZipcodeValidator.validate(zipcode)) {
        throw new ApiError(400, "Please enter a valid zipcode");
      }
    }
    if (email && email.length > 0) {
      if (!EmailValidator.validate(email)) {
        throw new ApiError(400, "Please enter a valid email");
      }
    }
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        name: name ? name : foundUser.name,
        email: email ? email : foundUser.email,
        age: age ? age : foundUser.age,
        city: city ? city : foundUser.city,
        zipcode: zipcode ? zipcode : foundUser.zipcode,
      },
    },
    { new: true }
  ).select();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "user details updated successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const foundUser = await User.findOne({ _id: id });
  if (!foundUser) {
    throw new ApiError(404, "User Not exist");
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "user deleted successfully"));
});

export { addUser, getUserById, getAllUsers, updateUser, deleteUser };
