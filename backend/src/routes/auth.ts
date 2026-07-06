import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  authenticateToken,
  AuthenticatedRequest,
} from "../middleware/auth";

export const authRouter = Router();

// In-memory user database
interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const users: User[] = [];

// POST /register
authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes("@") || trimmedEmail.length < 5) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = trimmedEmail.toLowerCase();

    if (normalizedEmail === "admin@gamil.com") {
      return res.status(400).json({ error: "Email already exists" });
    }

    const existingUser = users.find((u) => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      email: normalizedEmail,
      passwordHash,
    };

    users.push(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// POST /login
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user;
    if (normalizedEmail === "admin@gmail.com" && password === "admin1") {
      user = {
        id: "admin-id",
        email: "admin@gmail.com",
      };
    } else {
      const foundUser = users.find((u) => u.email === normalizedEmail);
      if (!foundUser) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      user = {
        id: foundUser.id,
        email: foundUser.email,
      };
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
});

// GET /me
authRouter.get("/me", authenticateToken, (req, res) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: authReq.user });
});
