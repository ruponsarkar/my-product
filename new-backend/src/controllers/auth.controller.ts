import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================
   TOKEN HELPERS
============================ */

const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "access_secret", {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    { expiresIn: "7d" }
  );
};

/* ============================
   REGISTER
============================ */

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // password hashing is handled in model
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ============================
   LOGIN
============================ */

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.json({
      token: accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ============================
   REFRESH TOKEN
============================ */

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refresh_secret"
    );

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({
      token: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
