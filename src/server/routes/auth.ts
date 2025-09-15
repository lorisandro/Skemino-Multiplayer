import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseManager } from '../database/DatabaseManager';
import { logger } from '../utils/logger';

const router = Router();

interface GuestUser {
  id: string;
  username: string;
  rating: number;
  isGuest: true;
  createdAt: number;
  expiresAt: number;
}

// In-memory store for guest sessions (in production, use Redis)
const guestSessions = new Map<string, GuestUser>();

// Clean up expired guest sessions every hour
setInterval(() => {
  const now = Date.now();
  for (const [id, guest] of guestSessions.entries()) {
    if (guest.expiresAt < now) {
      guestSessions.delete(id);
    }
  }
}, 60 * 60 * 1000);

// Guest login endpoint
router.post('/guest', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    // Generate guest user
    const guestId = 'guest_' + uuidv4();
    const guestUsername = username || `Guest_${Math.floor(Math.random() * 10000)}`;
    const now = Date.now();

    const guestUser: GuestUser = {
      id: guestId,
      username: guestUsername,
      rating: 1200, // Default guest rating
      isGuest: true,
      createdAt: now,
      expiresAt: now + (24 * 60 * 60 * 1000), // Expires in 24 hours
    };

    // Store guest session
    guestSessions.set(guestId, guestUser);

    // Generate JWT token for guest
    const token = jwt.sign(
      {
        userId: guestId,
        username: guestUsername,
        isGuest: true,
        rating: 1200,
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '24h' }
    );

    logger.info(`👤 Guest user created: ${guestUsername} (${guestId})`);

    res.json({
      success: true,
      token,
      user: {
        id: guestId,
        username: guestUsername,
        rating: 1200,
        isGuest: true,
      },
      message: 'Guest session created successfully'
    });

  } catch (error) {
    logger.error('Error creating guest session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create guest session'
    });
  }
});

// Regular user login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user from database
    const user = await DatabaseManager.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash!);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        rating: user.rating,
        isGuest: false,
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    // Update last login
    await DatabaseManager.updateUserLastLogin(user.id);

    logger.info(`🔐 User logged in: ${user.username} (${user.id})`);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        rating: user.rating,
        level: user.level,
        isGuest: false,
      },
      message: 'Login successful'
    });

  } catch (error) {
    logger.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// User registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await DatabaseManager.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const existingUsername = await DatabaseManager.getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await DatabaseManager.createUser({
      username,
      email,
      passwordHash: passwordHash,
      rating: 1200, // Default starting rating
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        rating: newUser.rating,
        isGuest: false,
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    logger.info(`✨ New user registered: ${username} (${newUser.id})`);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        rating: newUser.rating,
        level: newUser.level,
        isGuest: false,
      },
      message: 'Registration successful'
    });

  } catch (error) {
    logger.error('Error during registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout
router.post('/logout', (_req: Request, res: Response) => {
  try {
    // In a more sophisticated setup, we'd invalidate the JWT token
    // For now, we just return success and let the client handle token removal
    return res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Error during logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user (from token)
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as any;

    if (decoded.isGuest) {
      // Return guest user info
      const guestUser = guestSessions.get(decoded.userId);
      if (!guestUser || guestUser.expiresAt < Date.now()) {
        return res.status(401).json({
          success: false,
          message: 'Guest session expired'
        });
      }

      return res.json({
        success: true,
        user: {
          id: guestUser.id,
          username: guestUser.username,
          rating: guestUser.rating,
          isGuest: true,
        }
      });
    } else {
      // Return registered user info
      const user = await DatabaseManager.getUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          rating: user.rating,
          level: user.level,
          isGuest: false,
        }
      });
    }

  } catch (error) {
    logger.error('Error getting current user:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Convert guest to registered user
router.post('/convert-guest', async (req: Request, res: Response) => {
  try {
    const { email, password, currentGuestToken } = req.body;

    if (!email || !password || !currentGuestToken) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and current guest token are required'
      });
    }

    // Verify guest token
    const decoded = jwt.verify(currentGuestToken, process.env.JWT_SECRET || 'dev_secret') as any;

    if (!decoded.isGuest) {
      return res.status(400).json({
        success: false,
        message: 'Token is not a guest token'
      });
    }

    const guestUser = guestSessions.get(decoded.userId);
    if (!guestUser) {
      return res.status(401).json({
        success: false,
        message: 'Guest session not found or expired'
      });
    }

    // Check if email is already taken
    const existingUser = await DatabaseManager.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered'
      });
    }

    // Hash password - TODO: implement bcrypt
    const passwordHash = 'temp_hash'; // await bcrypt.hash(password, 12);

    // Create registered user with guest's current rating
    const newUser = await DatabaseManager.createUser({
      username: guestUser.username,
      email,
      passwordHash: passwordHash,
      rating: guestUser.rating, // Preserve guest rating
    });

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }

    // Clean up guest session
    guestSessions.delete(decoded.userId);

    // Generate new token for registered user
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        rating: newUser.rating,
        isGuest: false,
      },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    logger.info(`🔄 Guest converted to registered user: ${guestUser.username} → ${newUser.id}`);

    return res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        rating: newUser.rating,
        level: newUser.level,
        isGuest: false,
      },
      message: 'Guest account converted successfully'
    });

  } catch (error) {
    logger.error('Error converting guest account:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to convert guest account'
    });
  }
});

// Get guest user by ID (for WebSocket authentication)
export const getGuestUser = (guestId: string): GuestUser | null => {
  const guest = guestSessions.get(guestId);
  if (guest && guest.expiresAt > Date.now()) {
    return guest;
  }
  return null;
};

export default router;
export { router as authRouter };