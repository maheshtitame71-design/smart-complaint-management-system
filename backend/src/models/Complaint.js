import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: [true, "Complaint title are required"],
      trim: true,
    },
    description:{
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
    },
    category:{
      type: String,
      required: [true, "Complaint category is required"],
      enum:{
        values: [
          "academic",
          "classroom",
          "laboratory",
          "library",
          "examination",
          "fees",
          "hostel",
          "canteen",
          "cleanliness",
          "electricity",
          "water",
          "internet",
          "transport",
          "security",
          "maintenance",
          "sports",
          "events",
          "other"
        ],
        message: "{VALUE} is not a valid in Complaint category"
      }
    },
    priority:{
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status:{
      type: String,
      enum: ["pending", "assigned", "in-progress","resolved","rejected"],
      default: "pending",
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Complaint creator is required"],
    },
    assignedTo:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    location:{
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model("Complaint",complaintSchema);

export default Complaint;

