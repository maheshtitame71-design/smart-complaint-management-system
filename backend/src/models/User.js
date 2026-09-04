import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email:{
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password:{
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  phone:{
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
  },
  role:{
    type: String,
    required: [true, 'Role is required'],
    enum:{
      values: ['user','admin','staff'],
      message: '{VALUE} is not a valid role',
    },
    default: "user"
  },
},{timestamps: true,});


const User = mongoose.model('User',userSchema);

export default User;

