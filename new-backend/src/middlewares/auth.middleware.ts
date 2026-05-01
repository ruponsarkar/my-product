import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "access_secret";

export const authMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token, authorization denied");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      tenantId?: string;
      role?: string;
      email?: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token is not valid");
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.length || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden" });
  };
};
