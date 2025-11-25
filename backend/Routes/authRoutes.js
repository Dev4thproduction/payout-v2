import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  {generateToken}  from "../middleware/generateToken.js";
import User from "../Models/User.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Helper function to check if user is admin
const isAdminUser = (user) => {
  if (!user || !user.role) return false;
  
  const roleName = user.role.name;
  return roleName === 'Admin' || roleName === 'SuperAdmin' || roleName === 'admin' || roleName === 'superadmin';
};

// GET /api/auth/users - Get users based on logged-in user's role
router.get("/users", generateToken, async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const loggedInUser = req.user;
    
    let query = {};

    // If search query exists, add search conditions
    if (searchQuery) {
      query.$or = [
        { fullName: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Check if logged-in user is admin
    const isAdmin = isAdminUser(loggedInUser);

    if (!isAdmin) {
      // If not admin, only show users assigned to this supervisor
      if (searchQuery) {
        query = {
          $and: [
            { supervisor: loggedInUser._id }, // Only users supervised by logged-in user
            {
              $or: [
                { fullName: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
              ]
            }
          ]
        };
      } else {
        query.supervisor = loggedInUser._id; // Only users supervised by logged-in user
      }
    }

    const users = await User.find(query)
      .select("-password")
      .populate("role", "name permissions")
      .populate("supervisor", "fullName email _id");
    
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/register - Register a new user
router.post("/register", generateToken, async (req, res) => {
  const { fullName, identifier, email, password, status, role, type, supervisor } = req.body;
  const loggedInUser = req.user;

  try {
    // Fixed validation - removed the duplicate 'type' and incorrect 'supervisor' check
    if (!fullName || !identifier || !email || !password || !role || !type) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const isAdmin = isAdminUser(loggedInUser);
    let finalSupervisor = null;

    // Handle supervisor assignment logic
    if (supervisor && supervisor.trim() !== '') {
      if (isAdmin) {
        // Admin can assign any valid supervisor
        const supervisorExists = await User.findById(supervisor);
        if (!supervisorExists) {
          return res.status(400).json({ message: "Invalid supervisor ID" });
        }
        finalSupervisor = supervisor;
      } else {
        // Non-admin can only assign themselves as supervisor
        finalSupervisor = loggedInUser._id.toString();
      }
    } else {
      // If no supervisor specified and user is not admin, assign logged-in user as supervisor
      if (!isAdmin) {
        finalSupervisor = loggedInUser._id.toString();
      }
      // If admin and no supervisor specified, leave as null (no supervisor)
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email },
        { identifier: identifier }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      if (existingUser.identifier === identifier) {
        return res.status(400).json({ message: "User with this identifier already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      identifier,
      email,
      password: hashedPassword,
      status: status || 'Active',
      role,
      type,
      supervisor: finalSupervisor,
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/auth/user/:id - Update user (with supervisor restrictions)
router.put("/user/:id", generateToken, async (req, res) => {
  const { fullName, identifier, email, role, password, status, type, supervisor } = req.body;
  const userId = req.params.id;
  const loggedInUser = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isAdmin = isAdminUser(loggedInUser);
    
    // Check permissions
    if (!isAdmin && user.supervisor?.toString() !== loggedInUser._id.toString()) {
      return res.status(403).json({ message: "You can only update users assigned to you" });
    }

    // Check for duplicate email (excluding current user)
    if (email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Check for duplicate identifier (excluding current user)
    if (identifier !== user.identifier) {
      const identifierExists = await User.findOne({ identifier, _id: { $ne: userId } });
      if (identifierExists) {
        return res.status(400).json({ message: "Identifier already in use" });
      }
    }

    // Handle supervisor assignment for updates
    let finalSupervisor = user.supervisor; // Keep existing supervisor by default
    
    if (supervisor !== undefined) { // Only update if supervisor field is provided
      if (supervisor === '' || supervisor === null) {
        // Removing supervisor
        if (isAdmin) {
          finalSupervisor = null;
        } else {
          // Non-admin cannot remove supervisor, keep existing
          finalSupervisor = user.supervisor;
        }
      } else {
        // Assigning a supervisor
        if (isAdmin) {
          const supervisorExists = await User.findById(supervisor);
          if (!supervisorExists) {
            return res.status(400).json({ message: "Invalid supervisor ID" });
          }
          finalSupervisor = supervisor;
        } else {
          // Non-admin can only assign themselves
          finalSupervisor = loggedInUser._id.toString();
        }
      }
    }

    // Update user fields
    user.fullName = fullName || user.fullName;
    user.identifier = identifier || user.identifier;
    user.email = email || user.email;
    user.status = status || user.status;
    user.type = type || user.type;
    user.role = role || user.role;
    user.supervisor = finalSupervisor;

    if (password && password.trim() !== '') {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/auth/user/:id - Delete user (with supervisor restrictions)
router.delete("/user/:id", generateToken, async (req, res) => {
  const userId = req.params.id;
  const loggedInUser = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    const isAdmin = isAdminUser(loggedInUser);

    // If not admin, they can only delete users assigned to themselves
    if (!isAdmin && user.supervisor?.toString() !== loggedInUser._id.toString()) {
      return res.status(403).json({ 
        message: "You can only delete users assigned to you" 
      });
    }

    await User.findByIdAndDelete(userId);
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/supervisors - Get list of potential supervisors (for dropdown)
router.get("/supervisors", generateToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    
    // Check if user is admin
    const isAdmin = isAdminUser(loggedInUser);

    let supervisors;
    
    if (isAdmin) {
      // Admin can see all users as potential supervisors
      supervisors = await User.find({})
        .select("fullName email _id")
        .sort({ fullName: 1 });
    } else {
      // Non-admin can only assign themselves as supervisor
      supervisors = [{
        _id: loggedInUser._id,
        fullName: loggedInUser.fullName,
        email: loggedInUser.email
      }];
    }

    res.json(supervisors);
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login - User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email })
      .populate("role", "name permissions")
      .populate("supervisor", "fullName email");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return res.json({
      token,
      expiresAt: expiresAt.toISOString(),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        type: user.type,
        supervisor: user.supervisor,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;