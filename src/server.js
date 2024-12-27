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
