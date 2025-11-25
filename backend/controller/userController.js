import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import moment from 'moment';
import User from '../Models/User.js';
import Role from '../Models/Role.js';
import Customer from '../Models/Customer.js';
import { generateToken } from '../middleware/generateToken.js';

const login = asyncHandler(async (req, res) => {
  try {
    console.log('🔵 Login attempt started');
    const { email, password, deviceID, deviceInfo, fcmToken } = req.body;

    console.log('📧 Email:', email);
    console.log('🔑 Password provided:', !!password);
    console.log('📱 Device ID:', deviceID);

    // Find user by email
    const userFound = await User.findOne({
      email: email.toLowerCase(),
      status: true,
    }).populate('role');

    console.log('👤 User found:', !!userFound);

    if (!userFound) {
      console.log('❌ User not found in database');
      res.status(400);
      throw new Error('User not found');
    }

    console.log('✅ User found:', userFound.email);
    console.log('🔒 User role:', userFound.role?.name);

    // Check if login request is from app
    if (deviceID !== undefined && deviceInfo !== undefined) {
      console.log('📱 App login detected');
      // Check for app access
      if (userFound.role.appAccess === true) {
        console.log('✅ App access granted');
        // If no device id, update it
        if (!userFound.deviceID) {
          await User.findByIdAndUpdate(userFound._id, {
            deviceID,
            deviceInfo,
            fcmToken,
          });
          console.log('📱 Device ID updated');
        } else if (userFound.deviceID !== deviceID) {
          // If device id does not match
          console.log('❌ Device ID mismatch');
          res.status(400);
          throw new Error('Device ID mismatch');
        }
      } else {
        console.log('❌ App access denied');
        res.status(400);
        throw new Error('Not authorized to login via app');
      }
    } else {
      console.log('🌐 Web login detected');
      // Check for web access
      if (userFound.role.webAccess === true) {
        console.log('✅ Web access granted');
        // User is using the web version
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('🌐 Client IP:', ip);
        console.log('🌐 Allowed IP:', userFound.ipAddress);

        // Match IP Address
        if (userFound.ipAddress !== '0.0.0.0') {
          if (ip !== userFound.ipAddress) {
            console.log('❌ IP address mismatch');
            res.status(400);
            throw new Error('Not authorized to login from this IP address');
          }
        }
      } else {
        console.log('❌ Web access denied');
        res.status(400);
        throw new Error('Not authorized to login via web');
      }
    }

    console.log('🔐 Starting password verification');

    // Match password
    let match = await bcrypt.compare(password, userFound.password);
    console.log('🔐 Password match:', match);

    if (match) {
      console.log('✅ Password verified successfully');

      // Update last login
      await User.findByIdAndUpdate(userFound._id, {
        lastLogin: moment().format('YYYY-MM-DD HH:mm:ss'),
      });
      console.log('⏰ Last login updated');

      // Populate the customers
      console.log('👥 Populating customers...');
      let customers = [];
      await Promise.all(
        userFound.customers.map(async (item) => {
          const customerFound = await Customer.findById(item);
          customers.push(customerFound);
        })
      );
      console.log('👥 Customers populated:', customers.length);

      console.log('🎫 Generating token...');
      console.log('🔢 User token version:', userFound.tokenVersion);

      // Generate token with debug
      const tokenVersion = userFound.tokenVersion || 0;
      console.log('🔢 Using token version:', tokenVersion);

      const token = generateToken(userFound._id, tokenVersion);
      console.log('🎫 Token generated successfully');

      const responseData = {
        id: userFound._id,
        email: userFound.email,
        identifier: userFound.identifier,
        name: userFound.name,
        calling: userFound.calling,
        customers,
        role: userFound.role,
        token: token,
      };

      console.log('✅ Login successful for:', userFound.email);
      res.json(responseData);

    } else {
      console.log('❌ Password verification failed');
      res.status(401);
      throw new Error('Invalid login credentials');
    }

  } catch (error) {
    console.error('💥 Login error:', error.message);
    console.error('💥 Error stack:', error.stack);

    // If response hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({
        message: 'Login failed: ' + error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
});

// Force logout functionality
const forceLogoutUser = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const { id } = req.params;

  const userToLogout = await User.findById(id);

  if (!userToLogout) {
    res.status(400);
    throw new Error('User not found');
  }

  if (userToLogout._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot force logout yourself');
  }

  // Increment token version to invalidate all existing tokens
  await User.findByIdAndUpdate(userToLogout._id, {
    tokenVersion: userToLogout.tokenVersion + 1,
    lastForceLogout: new Date(),
  });

  res.json({
    msg: `User ${userToLogout.name} has been forced to logout successfully`,
    userId: userToLogout._id,
    userName: userToLogout.name
  });
});

// Force logout multiple users
const forceLogoutMultipleUsers = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const { userIds } = req.body;

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    res.status(400);
    throw new Error('Please provide an array of user IDs');
  }

  const results = [];
  const errors = [];

  for (const userId of userIds) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        errors.push(`User with ID ${userId} not found`);
        continue;
      }

      if (user._id.toString() === req.user._id.toString()) {
        errors.push(`Cannot force logout yourself (${user.name})`);
        continue;
      }

      await User.findByIdAndUpdate(user._id, {
        tokenVersion: user.tokenVersion + 1,
        lastForceLogout: new Date(),
      });

      results.push({
        userId: user._id,
        userName: user.name,
        status: 'logged out'
      });
    } catch (error) {
      errors.push(`Error processing user ${userId}: ${error.message}`);
    }
  }

  res.json({
    message: `Force logout operation completed`,
    results,
    errors: errors.length > 0 ? errors : undefined
  });
});

// Get force logout history
const getForceLogoutHistory = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const users = await User.find({
    lastForceLogout: { $exists: true, $ne: null }
  })
    .select('name email lastForceLogout')
    .sort({ lastForceLogout: -1 });

  res.json(users);
});

// Blacklist current token
const blacklistCurrentToken = asyncHandler(async (req, res) => {
  // Increment token version to invalidate current token
  await User.findByIdAndUpdate(req.user._id, {
    tokenVersion: req.user.tokenVersion + 1,
  });

  res.json({ message: 'Current token has been invalidated' });
});

// Add user
const addUser = asyncHandler(async (req, res) => {
  if (req.user.role.usersAdd === false) {
    res.status(400)
    throw new Error('Your are not authorized to perform this request')
  }

  const { email, name, identifier, role, customers, ipAddress } = req.body

  // * Find user by email
  const userFound = await User.findOne({ email })

  // * Find user by identifier
  const userFoundByIdentifier = await User.findOne({ identifier })

  if (!userFound && !userFoundByIdentifier) {
    // Define character sets
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_+=~';

    // Combine character sets
    const allCharacters = alphabets + numbers + specialChars;

    // Generate password length between 8 and 12
    const passwordLength = Math.floor(Math.random() * (12 - 8 + 1)) + 8;

    // Generate password
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(12);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      password: hash,
      identifier,
      name,
      role,
      customers,
      joinedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
      ipAddress,
    });

    if (newUser) {
      await newUser.save();

      // const user = await User.findById(newUser._id).select('-password')

      res.json(password);
    } else {
      res.status(400);
      throw new Error('Error creating user');
    }
  } else {
    res.status(409);
    throw new Error('User already exists');
  }
});


// Get all users
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.role.usersRead === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const { search } = req.query;

  let query = {};

  // Add search functionality
  if (search && search.trim()) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { identifier: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const users = await User.find(query).select('-password').populate('role');

  res.json(users);
});

// Get user by ID
const getUserByID = asyncHandler(async (req, res) => {
  if (req.user.role.usersRead === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const user = await User.findById(req.params.id).select('-password').populate('role');

  if (user) {
    res.json(user);
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Update user
const updateUser = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const { name, email, role, customers, ipAddress, calling, distanceForCalling } = req.body;

  const userFound = await User.findById(req.params.id);

  if (userFound) {
    userFound.name = name || userFound.name;
    userFound.email = email ? email.toLowerCase() : userFound.email;
    userFound.role = role || userFound.role;
    userFound.customers = customers || userFound.customers;
    userFound.ipAddress = ipAddress !== undefined ? ipAddress : userFound.ipAddress;
    userFound.calling = calling !== undefined ? calling : userFound.calling;
    userFound.distanceForCalling = distanceForCalling !== undefined ? distanceForCalling : userFound.distanceForCalling;

    const updatedUser = await userFound.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      customers: updatedUser.customers,
      ipAddress: updatedUser.ipAddress,
      calling: updatedUser.calling,
      distanceForCalling: updatedUser.distanceForCalling,
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const userFound = await User.findById(req.params.id);

  if (userFound) {
    // Define character sets
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()-_+=~';

    // Combine character sets
    const allCharacters = alphabets + numbers + specialChars;

    // Generate password length between 8 and 12
    const passwordLength = Math.floor(Math.random() * (12 - 8 + 1)) + 8;

    // Generate password
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(12);
    const hash = bcrypt.hashSync(password, salt);

    await User.findByIdAndUpdate(userFound._id, {
      password: hash,
    });

    res.json(password);
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Add customer to user
const addCustomerInUser = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const { customer } = req.body;

  const userFound = await User.findById(req.params.id);

  if (userFound) {
    if (userFound.customers.includes(customer)) {
      res.status(400);
      throw new Error('Customer already exists');
    }

    await User.findByIdAndUpdate(userFound._id, {
      $push: {
        customers: customer,
      },
    });

    const user = await User.findById(userFound._id).select('-password');

    res.json(user);
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Remove customer from user
const removeCustomerFromUser = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const { customer } = req.body;

  const userFound = await User.findById(req.params.id);

  if (userFound) {
    await User.findByIdAndUpdate(userFound._id, {
      $pull: {
        customers: customer,
      },
    });

    const user = await User.findById(userFound._id).select('-password');

    res.json(user);
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Reset device ID
const resetDeviceID = asyncHandler(async (req, res) => {
  if (req.user.role.usersUpdate === false) {
    res.status(400);
    throw new Error('You are not authorized to perform this request');
  }

  const userFound = await User.findById(req.params.id);

  if (userFound) {
    await User.findByIdAndUpdate(userFound._id, {
      deviceID: '',
    });

    const user = await User.findById(userFound._id).select('-password');

    res.json(user);
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Update FCM token
const updateFCMToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.fcmToken = fcmToken;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fcmToken: updatedUser.fcmToken,
    });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// Get all supervisors (users with role name "Supervisor", exclude Super Admin)
const getSupervisors = asyncHandler(async (req, res) => {
  const users = await User.find({ status: true })
    .select('-password')
    .populate('role');

  // Filter users where role name is "Supervisor" and exclude "Super Admin"
  const supervisors = users.filter(user => {
    const roleName = user.role?.name?.toLowerCase();
    return roleName === 'supervisor' && roleName !== 'super admin';
  });

  res.json(supervisors);
});

// Get all team members (exclude supervisors, admins, and super admins)
const getTeamMembers = asyncHandler(async (req, res) => {
  const users = await User.find({ status: true })
    .select('-password')
    .populate('role');

  // Filter out supervisors, admins, and super admins
  const teamMembers = users.filter(user => {
    const roleName = user.role?.name?.toLowerCase();
    return roleName !== 'supervisor' && roleName !== 'admin' && roleName !== 'super admin';
  });

  res.json(teamMembers);
});

export {
  login,
  addUser,
  getUsers,
  getUserByID,
  updateUser,
  changePassword,
  addCustomerInUser,
  removeCustomerFromUser,
  resetDeviceID,
  updateFCMToken,
  forceLogoutUser,
  forceLogoutMultipleUsers,
  getForceLogoutHistory,
  blacklistCurrentToken,
  getSupervisors,
  getTeamMembers
};