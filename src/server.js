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
