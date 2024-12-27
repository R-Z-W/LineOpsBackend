const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const WorkOrderSchema = new mongoose.Schema({
  carId: { type: String },
  userId: { type: String, required: true }, // Add userId field
  serviceType: { type: String, required: true },
  startDate: { type: Date, required: true },
  completionDate: { type: Date },
  technicianAssigned: { type: String },
  tasks: [TaskSchema],
  laborHours: { type: Number },
  costOfService: { type: Number },
  status: { type: String, default: "Pending" },
  serviceNotes: { type: String },
  warrantyOnWork: { type: String },
  department: { 
    type: String, 
    required: true,
    enum: ['Mechanical', 'Dent Repair', 'Paint Shop', 'Rim Repair', 
           'Upholstery', 'Detailing', 'Inspection'] // Restrict to these values
  },
  comments: [CommentSchema], // Add comments field
});

WorkOrderSchema.plugin(AutoIncrement, { inc_field: "workOrderId" });

const WorkOrder = mongoose.model("WorkOrder", WorkOrderSchema);
module.exports = { WorkOrder };


