import mongoose from "mongoose";

const notficationSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  complaint:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Complaint",
    required: true,
  },

  title:{
    type:String,
    required:true,
  },

  type:{
    type:String,
    required:true,
  },

  message:{
    type: String,
    required: true,
  },
  isRead:{
    type:Boolean,
    default: false,
  },
},{timestamps: true,});

const Notification = mongoose.model("Notification",notficationSchema);

export default Notification;
