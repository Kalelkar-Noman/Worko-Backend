import { Router } from "express";
import {
  addUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/add-user").post(addUser);
router.route("/list-all-users").get(getAllUsers);
router.route("/user-detail").get(getUserById);
router.route("/update-user").put(updateUser);
router.route("/update-user").patch(updateUser);
router.route("/delete-user").patch(deleteUser);

export default router;
