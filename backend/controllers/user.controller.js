import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Some of the fields are empty",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({
        message: "User is already registered with this email id",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Some of the fields are missing",
        success: false,
      });
    }
    const user = await User.findOne({
      email,
    });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        if (role != user.role) {
          return res.status(400).json({
            message: "Incorrect role is entered",
            success: false,
          });
        } else {
          //since all the three details are correct, we will generate the token
          //creating a unique token data
          const tokenData = {
            userId: user._id,
          };
          //creating the token using unique token data, secret key, configurations
          const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });
          //storing the token into the cookie
          const userReturned = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
          };
          return res
            .status(200)
            .cookie("token", token, {
              maxAge: 1 * 24 * 60 * 60 * 1000,
              httpsOnly: true,
              sameSite: "strict",
            })
            .json({
              message: `Welcome back ${user.fullname}`,
              user: userReturned,
              success: true,
            });
        }
      } else {
        return res.status(400).json({
          message: "Incorrect password",
          success: false,
        });
      }
    } else {
      return res.status(400).json({
        message: "Email is not registered",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout is successfully done",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User is not found",
        success: false,
      });
    }
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();
    const userReturned = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile is updated successfully",
      user: userReturned,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
