import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType, insertUserSchema } from "@shared/schema";
import { AuthenticateCallback } from "passport";

// Extend Express types to include user in the Request
declare global {
  namespace Express {
    // Using interface extension to avoid type collision
    interface User extends UserType {}
  }
}

// Promisify scrypt for async/await usage
const scryptAsync = promisify(scrypt);

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Helper function to compare passwords
export async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Helper function to log user activity
export async function logUserActivity(
  userId: number, 
  action: string, 
  entityType: string = "auth", 
  entityId?: number, 
  details?: string,
  req?: Request
) {
  try {
    await storage.createActivityLog({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req?.ip,
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

export function setupAuth(app: Express) {
  // Generate a random session secret if not provided
  const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");

  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  // Enable secure cookies in production
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // Setup session middleware
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy for authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Try to look up by username first
        let user = await storage.getUserByUsername(username);
        
        // If not found, try email (so users can login with either)
        if (!user) {
          user = await storage.getUserByEmail(username);
        }
        
        // If no user found or password doesn't match
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        
        // If user exists but is inactive
        if (!user.active) {
          return done(null, false, { message: "Account has been deactivated" });
        }
        
        // Update last login timestamp
        await storage.updateUserLastLogin(user.id);
        
        // Log login activity
        await logUserActivity(user.id, "login");
        
        // Login successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Tell Passport how to serialize/deserialize the user
  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      if (!user.active) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // User registration endpoint
  app.post("/api/auth/register", async (req, res, next) => {
    try {
      // Validate form data
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ 
          success: false,
          message: "Username already taken" 
        });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ 
          success: false,
          message: "Email already registered" 
        });
      }

      // Hash the password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create new user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Log registration
      await logUserActivity(user.id, "registration");

      // Strip sensitive data from user object
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      };

      // Log the user in automatically
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          success: true,
          message: "Registration successful",
          user: safeUser,
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid registration data",
      });
    }
  });

  // User login endpoint
  app.post(
    "/api/auth/login",
    (req, res, next) => {
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({
            success: false,
            message: info?.message || "Invalid username or password",
          });
        }
        req.login(user, (err: any) => {
          if (err) {
            return next(err);
          }
          
          // Return safe user object (without password)
          const safeUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
          
          return res.status(200).json({
            success: true,
            message: "Login successful",
            user: safeUser,
          });
        });
      })(req, res, next);
    }
  );

  // User logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      // Log the logout activity
      logUserActivity(userId, "logout");
    }
    
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error during logout",
        });
      }
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });

  // Get current user information
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    
    // Return safe user object (without password)
    const user = req.user;
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    
    res.json({
      success: true,
      user: safeUser,
    });
  });

  // Middleware to check if user is authenticated
  app.use("/api/cms/*", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    next();
  });

  // Middleware to check if user has admin role
  app.use("/api/cms/admin/*", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin privileges required",
      });
    }
    
    next();
  });
}