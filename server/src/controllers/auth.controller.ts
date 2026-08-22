import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev-only';

// Zod schemas for request validation
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});

/**
 * Handles user registration
 */
export const register = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not available. Please configure DATABASE_URL.'
      });
    }

    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors
      });
    }

    const { name, email, password } = parseResult.data;

    // Check if email already exists
    const existingUsers = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [newUser] = await db.insert(users).values({
      name,
      email: email.toLowerCase(),
      passwordHash
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: newUser
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Handles user login and session generation
 */
export const login = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not available. Please configure DATABASE_URL.'
      });
    }

    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors
      });
    }

    const { email, password } = parseResult.data;

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Sign JWT access token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin
      }
    });

  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'Database connection is not available. Please configure DATABASE_URL.'
      });
    }

    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.errors
      });
    }

    const { email, name, newPassword } = parseResult.data;

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!user || user.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(404).json({
        success: false,
        message: 'No account matches these credentials'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ passwordHash: hashedPassword }).where(eq(users.email, email.toLowerCase()));

    return res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during password reset',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
