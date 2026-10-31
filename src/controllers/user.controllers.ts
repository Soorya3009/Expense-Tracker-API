import type{Request,Response}from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/response.js";

export const registerUser=async(req:Request,res:Response)=>{
    try{
        const{name,email,password}=req.body;
        const existingUser=await User.findOne({email});

        if(existingUser)
        {
            return errorResponse(res, "Email already registered", 409);
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        });

        return successResponse( 
          res, 
          "User registered successfully", 
          { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            createdAt: user.createdAt, 
          }, 
          201 
        );
    } catch (error) {
    console.error("Error registering user:", error);

    return errorResponse(res, "Failed to register user");
}
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 401);
    }
    const secret=process.env.JWT_SECRET;

    if(!secret){
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    const token=jwt.sign(
      {userId:user._id.toString()},
      secret,
      {expiresIn:"1d"}
    );

    return successResponse( 
      res, 
      "Login successful", 
      { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        token, 
      } 
    );
  } catch (error) {
    console.error("Error logging in:", error);

    return errorResponse(res, "Failed to login");
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.user as { userId: string };

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "Profile fetched successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return errorResponse(res, "Failed to fetch profile");
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const { userId } = res.locals.user as { userId: string };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = res.locals.user as { userId: string };

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
    });
  }
};


