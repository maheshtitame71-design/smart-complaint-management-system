import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const register = async (req,res) => {
  try {

    const { name, email, password, phone, role } = req.body;

    // check required fields
    if(!name || !email || !password || !phone){
      return res.status(400).json({
        success : false,
        message: "All fields are required",
      });
    }

    // normalize input
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();


    // check if email or phone already exists 
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
    });

    if(existingUser){
      if(existingUser.email === normalizedEmail){
        return res.status(409).json({
          success: false,
          message: 'Email already registered',
        });
      }

    if(existingUser.phone === normalizedPhone){
      return res.status(409).json({
        success: false,
        message: 'Phone number already registered',
      });
    }}

    // hash password
    const hashedPassword = await bcrypt.hash(password,10);

    // create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone,
      role: role || "user",
    });

    // send response
    return res.status(201).json({
      success: true,
      message: "User registered Successfully",
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
    
  } catch (error) {
    console.error("Registration error",error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const login = async (req,res) => {

  try{
    const { email, password} = req.body;

    // validate required fields
    if(!email || !password){
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // normalize email 
    const normalizedEmail = email.toLowerCase().trim();

    // find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if(!user){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password with hashedPassword
    const isPasswordCorrect = await bcrypt.compare(password,user.password);

    if (!isPasswordCorrect){
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // generate jwt
    const token = jwt.sign(
      {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"1d",
    });

    // send response
    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      token,
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  }catch(error){
    console.error("Login error:",error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });  
  }
}

export const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authentication Successful",
      user,
    });

  } catch (error) {

    console.error("Get me error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("Change password request received");
    console.log("REQ USER:", req.user);
    console.log("REQ BODY:", req.body);

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    console.log("Password changed successfully");

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Change Password error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getStaffMembers = async (req,res) => {
  try {
    const staffMembers = await User.find(
      {role:"staff"},
      "name email phone role"
    );

    return res.status(200).json({
      success:true,
      count:staffMembers.length,
      staffMembers,
    });
  } catch (error) {
    console.error("Get staff member error:",error);
    
    return res.status(500).json({
      success: false,
      message: "Intenral server errror",
    });
  }
};

export const getAllUser = async (req,res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success:true,
      users,
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message: error.message,
    });
  }
}

export const getUserById = async (req,res) => {
  try{
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found",
      });
    }

    return res.status(200).json({
      success:true,
      user,
    });
  }catch(error){
    console.error("Get user by ID error:",error);
    return res.status(500).json({
      success:false,
      message:"Internal Server errror",
    });
  }
};

export const deleteUser = async (req,res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if(!user){
      return res.status(404).json({
        success:false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success:true,
      message:"User deletes Successfully",
    });

  } catch (error) {
    console.error("Delete User Error:",error);

    return res.status(500).json({
      success:false,
      message:"Failed to delete user",
    });
    
  }
};