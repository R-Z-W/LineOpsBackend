const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true },
  color: { type: String, required: true },
  engineType: { type: String },
  transmissionType: { type: String },
  mileage: { type: Number },
  fuelType: { type: String },
  price: { type: Number },
  condition: { type: String },
  seatingCapacity: { type: Number },
  drivetrain: { type: String },
  status: { type: String, default: "For Sale" },
  location: { type: String },
  boughtDate: { type: Date },
  soldDate: { type: Date },
});

// Auto-increment carId
CarSchema.plugin(AutoIncrement, { inc_field: "carId" });

const Car = mongoose.model("Car", CarSchema);
module.exports = { Car };