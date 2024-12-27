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


// Car Routes
app.get("/api/cars", validateUserAuth, async (req, res) => {
    try {
      const cars = await Car.find();
      res.json(cars);
    } catch (err) {
      res.status(500).json({ message: "Error fetching cars" });
    }
  });
  
app.get("/api/cars/:id", validateUserAuth, async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
        console.log('Car not found:', req.params.id);
        return res.status(404).json({ message: "Car not found" });
        }
        res.json(car);
    } catch (err) {
        console.error('Error in /api/cars/:id:', err);
        res.status(500).json({ message: "Error fetching car", error: err.message });
    }
    });

app.post("/api/cars", validateUserAuth, async (req, res) => {
    try {
        console.log('Creating car:', req.body);
        const newCar = await Car.create(req.body);
        console.log('Created car:', newCar);
        res.status(201).json(newCar);
    } catch (err) {
        console.error('Car creation error:', err);
        res.status(400).json({ 
        message: "Error creating car",
        error: err.message 
        });
    }
    });


// Work Order Routes
app.get("/api/workorders", validateUserAuth, async (req, res) => {
    try {
      const workOrders = await WorkOrder.find();
      res.json(workOrders);
    } catch (err) {
      res.status(500).json({ message: "Error fetching work orders" });
    }
  });
  
app.get("/api/workorders/:id", validateUserAuth, async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.id);
        if (!workOrder) return res.status(404).json({ message: "Work order not found" });
        res.json(workOrder);
    } catch (err) {
        res.status(500).json({ message: "Error fetching work order" });
    }
    });

app.post("/api/workorders", validateUserAuth, async (req, res) => {
    try {
        console.log('Creating work order:', req.body);
        const newWorkOrder = await WorkOrder.create(req.body);
        console.log('Created work order:', newWorkOrder);
        res.status(201).json(newWorkOrder);
    } catch (err) {
        console.error('Work order creation error:', err);
        res.status(400).json({ 
        message: "Error creating work order",
        error: err.message 
        });
    }
    });

app.put("/api/workorders/:id", validateUserAuth, async (req, res) => {
    try {
        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
        if (!updatedWorkOrder) return res.status(404).json({ message: "Work order not found" });
        res.json(updatedWorkOrder);
    } catch (err) {
        res.status(400).json({ message: "Error updating work order" });
    }
    });

app.delete("/api/workorders/:id", validateUserAuth, async (req, res) => {
    try {
        const deletedWorkOrder = await WorkOrder.findByIdAndDelete(req.params.id);
        if (!deletedWorkOrder) return res.status(404).json({ message: "Work order not found" });
        res.json({ message: "Work order deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting work order" });
    }
    });
  
// Additional Routes for Work Order
app.post("/api/workorders/:id/comments", validateUserAuth, async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.id);
        if (!workOrder) return res.status(404).json({ message: "Work order not found" });
        
        workOrder.comments.push({
        userId: req.body.userId,
        text: req.body.text
        });
        
        await workOrder.save();
        res.status(201).json(workOrder);
    } catch (err) {
        res.status(400).json({ message: "Error adding comment" });
    }
    });

app.delete("/api/workorders/:workOrderId/comments/:commentId", validateUserAuth, async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.workOrderId);
        if (!workOrder) return res.status(404).json({ message: "Work order not found" });
        
        workOrder.comments.id(req.params.commentId).remove();
        await workOrder.save();
        
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Error deleting comment" });
    }
    });

app.put("/api/workorders/:workOrderId/comments/:commentId", validateUserAuth, async (req, res) => {
    try {
        const workOrder = await WorkOrder.findById(req.params.workOrderId);
        if (!workOrder) return res.status(404).json({ message: "Work order not found" });
        
        const comment = workOrder.comments.id(req.params.commentId);
        comment.text = req.body.text;
        
        await workOrder.save();
        res.json(workOrder);
    } catch (err) {
        res.status(400).json({ message: "Error updating comment" });
    }
    });

module.exports = { app };
