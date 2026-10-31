import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing",
      });
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || !("userId" in decoded)) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.locals.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};