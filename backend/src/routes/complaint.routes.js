import express from "express";

import {
  createComplaint,
  getMyComplaintById,
  getMyComplaints,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
  assignComplaint,
  getAssignedComplaints,
  updateComplaintStatus,
  getComplaintStats,
  getComplaintById,
} from "../controllers/complaintController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


// =====================================================
// USER ROUTES
// =====================================================

// Create a new complaint
router.post(
  "/",
  authMiddleware,
  createComplaint
);


// Get complaints created by logged-in user
router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);


// Get one complaint belonging to logged-in user
router.get(
  "/my/:id",
  authMiddleware,
  getMyComplaintById
);


// Update user's own complaint
router.put(
  "/my/:id",
  authMiddleware,
  updateComplaint
);


// Delete user's own complaint
router.delete(
  "/my/:id",
  authMiddleware,
  deleteComplaint
);


// =====================================================
// ADMIN ROUTES
// =====================================================

// Get all complaints
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllComplaints
);


// Get complaint statistics
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin"),
  getComplaintStats
);


// Get one complaint by ID
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getComplaintById
);


// Assign complaint to staff
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignComplaint
);


// =====================================================
// STAFF ROUTES
// =====================================================

// Get complaints assigned to logged-in staff
router.get(
  "/assigned",
  authMiddleware,
  roleMiddleware("staff"),
  getAssignedComplaints
);


// Update complaint status
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("staff"),
  updateComplaintStatus
);


export default router;