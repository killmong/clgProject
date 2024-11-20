const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, username, email, password, bio, userProfile } = req.body;
   console.log("Request Body:", req.body);
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      email,
      password: hashedPassword, // Save hashed password
      bio,
      userProfile,
    });

    // Save user to the database
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// User login// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Debugging: Log the incoming request body
  console.log("Request Body:", req.body);

  // Check if email or password is missing
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide both email and password" });
  }

  try {
    // Find user by email
    const savedUser = await User.findOne({ email: email });

    if (!savedUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, savedUser.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // JWT token generation
    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 36000, // 1 hour
    });

    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ error: error.message });
  }
};

