import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends User {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // One week
    },
    store: storage.sessionStore,
  };

  // Set trust proxy if in production
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // Use session middleware
  app.use(session(sessionSettings));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Use LocalStrategy for authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        
        if (!(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Login endpoint
  app.post("/api/admin/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  // Registration endpoint - only for admin use
  app.post("/api/admin/register", async (req, res) => {
    // Check if user is authenticated and is an admin
    if (!req.isAuthenticated() || (req.user && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Current user endpoint
  app.get("/api/admin/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as User;
    res.json(userWithoutPassword);
  });

  // Check if user is admin middleware
  const isAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Unauthorized" });
  };

  // Admin check endpoint
  app.get("/api/admin/check", isAdmin, (req, res) => {
    res.json({ isAdmin: true });
  });

  // Return isAdmin middleware for use in other routes
  return { isAdmin };
}