# Auto Service Management System API

ExpressJS API with MongoDB for managing auto service operations.


## Installation

```bash
git clone <repository-url>
cd LineOpsBackend
npm install
```

Create a .env file with:
```
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8080
FRONT_URL=your_frontend_url
```



Models

User
```bash
{
  userId: UUID (auto-generated),
  firstName: String (required),
  lastName: String (required),
  jobTitle: String (required),
  department: String (required),
  email: String (required, unique),
  phoneNumber: String (required),
  hireDate: Date (required),
  salary: Number (required),
  dateOfBirth: Date (required),
  gender: String (required),
  address: String (required),
  employmentStatus: String (required),
  password: String (required, hashed),
  username: String (required, unique),
  isAdmin: Boolean (default: false)
}
```
Car
```bash
{
  carId: Number (auto-incremented),
  make: String (required),
  model: String (required),
  year: Number (required),
  vin: String (required, unique),
  licensePlate: String (required),
  color: String (required),
  engineType: String,
  transmissionType: String,
  mileage: Number,
  fuelType: String,
  price: Number,
  condition: String,
  seatingCapacity: Number,
  drivetrain: String,
  status: String (default: "For Sale"),
  location: String,
  boughtDate: Date,
  soldDate: Date
}
```

WorkOrder
```bash
{
  workOrderId: Number (auto-incremented),
  carId: String (required),
  userId: String (required),
  serviceType: String (required),
  startDate: Date (required),
  completionDate: Date,
  technicianAssigned: String,
  tasks: [{
    title: String (required),
    description: String
  }],
  laborHours: Number,
  costOfService: Number,
  status: String (default: "Pending"),
  serviceNotes: String,
  warrantyOnWork: String,
  department: String (required, enum: [
    'Mechanical', 
    'Dent Repair', 
    'Paint Shop', 
    'Rim Repair',
    'Upholstery', 
    'Detailing', 
    'Inspection'
  ]),
  comments: [{
    userId: String (required),
    text: String (required),
    createdAt: Date (default: now)
  }]
}
```

Routes
Auth Routes
```bash
POST /signup - Create new user
POST /login - User login
```
User Routes (Admin Only)
```bash
GET /api/users - Get all users
GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user
DELETE /api/users/:id - Delete user
```

Car Routes
```bash
GET /api/cars - Get all cars
GET /api/cars/:id - Get car by ID
POST /api/cars - Create car
PUT /api/cars/:id - Update car
DELETE /api/cars/:id - Delete car
```

WorkOrder Routes
```bash
GET /api/workorders - Get all work orders
GET /api/workorders/:id - Get work order by ID
POST /api/workorders - Create work order
PUT /api/workorders/:id - Update work order
DELETE /api/workorders/:id - Delete work order
```

Comment WorkOrder Routes
```bash
POST /api/workorders/:id/comments - Add comment
PUT /api/workorders/:workOrderId/comments/:commentId - Update comment
DELETE /api/workorders/:workOrderId/comments/:commentId - Delete comment
```
