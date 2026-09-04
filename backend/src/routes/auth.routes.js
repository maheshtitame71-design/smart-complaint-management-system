import express from "express"
import { register, login, getMe, getStaffMembers, getAllUser, getUserById, deleteUser, changePassword } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router()


// POST /register
router.post("/register", register);

/// POST /login
router.post("/login", login)

// GET
router.get("/me",authMiddleware,getMe);

// GET/ STAFF
router.get("/staff",authMiddleware,roleMiddleware("admin"),getStaffMembers);

// GET ALL USERS
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getAllUser
);

// GET /api/auth/users/:id
router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getUserById
);

router.delete("/users/:id",authMiddleware,roleMiddleware("admin"),deleteUser);

router.patch(
  "/change-password",
  authMiddleware,
  changePassword
);

export default router;
