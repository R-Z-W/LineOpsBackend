const express = require("express");
const { User } = require("./models/UserModel");
const { WorkOrder } = require("./models/WorkOrderModel");
const { Car } = require("./models/CarModel");
const { generateJWT, validateUserAuth, validateAdminAuth } = require("./functions/jwtFunctions");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());
app.use(cors());

let corsOptions = {
	origin: [
		"http://localhost:3000", 
		"http://127.0.0.1:5173", 
		process.env.FRONT_URL], // Replace with domain
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Server Health Check Route
app.get("/api/health", (req, res) => { //accessed with backendurl/api/health
	res.status(200).json({ message: "Backend is working!" });
});

// Authentication Routes
app.post("/signup", async (req, res) => {
	const { username, password } = req.body;
  
	if (!username || !password) {
	  return res.status(400).json({
		message: "Incorrect or missing sign-up credentials provided.",
	  });
	}
  
	// Password strength (8 characters, 1 number)
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	if (!passwordRegex.test(password)) {
		return res.status(400).json({
			message: "Password must be at least 8 characters long and contain at least one number.",
		});
	}

	const hashedPassword = await bcrypt.hash(password, 10);  // Hash password before saving
	let newUser = await User.create({ username, password: hashedPassword });
	let newJwt = generateJWT(newUser.id, newUser.username);
  
	res.json({
	  jwt: newJwt,
	  user: {
		id: newUser.id,
		username: newUser.username,
	  },
	});
});

// Login Route
app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const token = generateJWT(user._id, user.username, user.isAdmin);
      console.log('Generated token for user:', {
        username: user.username,
        isAdmin: user.isAdmin
      });
      
      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });


// User Routes
app.get("/api/users", validateAdminAuth, async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude password
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
  app.get("/api/users/:id", validateAdminAuth, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
  
  app.post("/api/users", validateAdminAuth, async (req, res) => {
    try {
      // Validate required fields
      const requiredFields = [
        'firstName', 'lastName', 'username', 'password',
        'email', 'phoneNumber', 'jobTitle', 'department',
        'dateOfBirth', 'gender', 'address', 'salary'
      ];
  
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }
  
      const userData = {
        ...req.body,
        dateOfBirth: new Date(req.body.dateOfBirth),
        hireDate: new Date(),
        password: await bcrypt.hash(req.body.password, 10)
      };
  
      const newUser = await User.create(userData);
      
      // Remove password from response
      const userResponse = newUser.toObject();
      delete userResponse.password;
      
      res.status(201).json(userResponse);
    } catch (err) {
      console.error('User creation error:', err);
      res.status(400).json({
        message: "Error creating user",
        error: err.message
      });
    }
  });
  
  app.put("/api/users/:id", validateAdminAuth, async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).select('-password');
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: "Error updating user" });
    }
  });
  
  app.delete("/api/users/:id", validateAdminAuth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });