const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { User } = require("./models/UserModel");
const { WorkOrder } = require("./models/WorkOrderModel");
const { Car } = require("./models/CarModel");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    try {
      await Car.deleteMany({});
      await User.deleteMany({});
      await WorkOrder.deleteMany({});

      // Seed Cars
      const car1 = await Car.create({
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        vin: "123456789ABCDEFG",
        licensePlate: "ABC123",
        color: "Blue",
        engineType: "V4",
        transmissionType: "Automatic",
        mileage: 30000,
        fuelType: "Gasoline",
        price: 15000,
        condition: "Good",
        seatingCapacity: 5,
        drivetrain: "FWD",
        status: "For Sale",
        location: "Lot A",
        boughtDate: new Date("2023-01-15"),
      });

      const car2 = await Car.create({
        make: "Honda",
        model: "Civic",
        year: 2019,
        vin: "987654321HGFEDCBA",
        licensePlate: "XYZ567",
        color: "Red",
        engineType: "V6",
        transmissionType: "Manual",
        mileage: 45000,
        fuelType: "Diesel",
        price: 14000,
        condition: "Fair",
        seatingCapacity: 5,
        drivetrain: "RWD",
        status: "Sold",
        location: "Lot B",
        boughtDate: new Date("2023-03-10"),
        soldDate: new Date("2023-05-15"),
      });

      const car3 = await Car.create({
        make: "Ford",
        model: "Focus",
        year: 2021,
        vin: "567890123HIJKLMN",
        licensePlate: "LMN345",
        color: "White",
        engineType: "Electric",
        transmissionType: "Automatic",
        mileage: 12000,
        fuelType: "Electric",
        price: 20000,
        condition: "Excellent",
        seatingCapacity: 5,
        drivetrain: "AWD",
        status: "For Sale",
        location: "Lot C",
        boughtDate: new Date("2023-06-20"),
      });

      console.log("Cars seeded:", car1.make, car2.make, car3.make);

      // Seed Users
      const users = await User.create([
        {
          firstName: "John",
          lastName: "Doe",
          jobTitle: "Technician",
          department: "Reconditioning",
          email: "john.doe@example.com",
          phoneNumber: "123-456-7890",
          hireDate: new Date("2020-06-15"),
          salary: 45000,
          dateOfBirth: new Date("1990-01-01"),
          gender: "Male",
          address: "123 Main St, City, State, ZIP",
          employmentStatus: "Active",
          password: "password123",
          username: "admin",
          isAdmin: true  // Admin user
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          jobTitle: "Supervisor",
          department: "Sales",
          email: "jane.smith@example.com",
          phoneNumber: "987-654-3210",
          hireDate: new Date("2018-09-01"),
          salary: 60000,
          dateOfBirth: new Date("1985-05-15"),
          gender: "Female",
          address: "456 Elm St, City, State, ZIP",
          employmentStatus: "Active",
          password: "password123",
          username: "janesmith",
        },
        {
          firstName: "Alice",
          lastName: "Johnson",
          jobTitle: "Sales Associate",
          department: "Sales",
          email: "alice.johnson@example.com",
          phoneNumber: "555-123-4567",
          hireDate: new Date("2021-05-20"),
          salary: 40000,
          dateOfBirth: new Date("1995-04-10"),
          gender: "Female",
          address: "789 Pine St, City, State, ZIP",
          employmentStatus: "Active",
          password: "password123",
          username: "alicejohnson",
        },
      ]);

      console.log("Users seeded:", users.map((user) => user.firstName).join(", "));

      // Seed Work Orders
      const workOrders = await WorkOrder.create([
        {
          carId: car1._id,
          userId: users[0]._id, 
          department: "Mechanical",
          serviceType: "Oil Change",
          startDate: new Date("2024-01-05"),
          completionDate: new Date("2024-01-06"),
          technicianAssigned: users[0].firstName,
          status: "Pending",
          tasks: [
            { title: "Drain old oil", description: "Drained oil using vacuum pump." },
            { title: "Replace oil filter", description: "Using OEM filter." },
          ],
          laborHours: 2,
          costOfService: 150,
          comments: [
            {
              userId: users[0]._id,
              text: "Initial inspection complete. Oil very dirty, recommending premium synthetic oil.",
              createdAt: new Date("2024-01-05T10:00:00")
            },
            {
              userId: users[1]._id,
              text: "Approved for premium synthetic oil change.",
              createdAt: new Date("2024-01-05T11:30:00")
            }
          ]
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Brake Inspection",
          startDate: new Date("2024-01-07"),
          completionDate: null,
          technicianAssigned: users[1].firstName,
          status: "InProgress",
          tasks: [
            { title: "Inspect brake pads" },
            { title: "Test brake fluid levels" },
          ],
          laborHours: 1.5,
          costOfService: 75,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Rim Repair",
          serviceType: "Wheel Refurbishment",
          startDate: new Date("2024-01-10"),
          completionDate: new Date("2024-01-11"),
          technicianAssigned: users[2].firstName,
          status: "InProgress",
          tasks: [
            { title: "Remove old tires" },
            { title: "Install new tires" },
          ],
          laborHours: 3,
          costOfService: 400,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Paint Shop",
          serviceType: "Full Body Paint",
          startDate: new Date("2024-01-12"),
          completionDate: null,
          technicianAssigned: users[0].firstName,
          status: "InProgress",
          tasks: [
            { title: "Test old battery" },
            { title: "Install new battery" },
          ],
          laborHours: 1,
          costOfService: 120,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Upholstery",
          serviceType: "Seat Repair",
          startDate: new Date("2024-01-15"),
          completionDate: null,
          technicianAssigned: users[1].firstName,
          status: "Pending",
          tasks: [
            { title: "Inspect transmission fluid" },
            { title: "Run diagnostics" },
          ],
          laborHours: 4,
          costOfService: 300,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Detailing",
          serviceType: "Full Interior Detail",
          startDate: new Date("2024-01-20"),
          completionDate: new Date("2024-01-21"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { title: "Replace AC compressor" },
            { title: "Recharge refrigerant" },
          ],
          laborHours: 5,
          costOfService: 450,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Dent Repair",
          serviceType: "Door Dent Removal",
          startDate: new Date("2024-01-22"),
          completionDate: null,
          technicianAssigned: users[0].firstName,
          status: "InProgress",
          tasks: [
            { title: "Drain old coolant" },
            { title: "Fill with new coolant" },
          ],
          laborHours: 2,
          costOfService: 100,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Inspection",
          serviceType: "Pre-Purchase Inspection",
          startDate: new Date("2024-01-25"),
          completionDate: null,
          technicianAssigned: users[1].firstName,
          status: "InProgress",
          tasks: [
            { title: "Adjust camber angles" },
            { title: "Test alignment" },
          ],
          laborHours: 2,
          costOfService: 200,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Spark Plug Replacement",
          startDate: new Date("2024-01-27"),
          completionDate: new Date("2024-01-28"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { title: "Remove old spark plugs" },
            { title: "Install new spark plugs" },
          ],
          laborHours: 1,
          costOfService: 80,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Suspension Check",
          startDate: new Date("2024-01-30"),
          completionDate: new Date("2024-02-01"),
          technicianAssigned: users[0].firstName,
          status: "Pending",
          tasks: [
            { title: "Inspect shock absorbers" },
            { title: "Test suspension system" },
          ],
          laborHours: 3,
          costOfService: 250,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Exhaust System Repair",
          startDate: new Date("2024-02-02"),
          completionDate: new Date("2024-02-03"),
          technicianAssigned: users[0].firstName,
          status: "Complete",
          tasks: [
            { title: "Inspect exhaust pipes" },
            { title: "Replace damaged muffler" },
          ],
          laborHours: 4,
          costOfService: 350,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Fuel Injector Cleaning",
          startDate: new Date("2024-02-05"),
          completionDate: new Date("2024-02-06"),
          technicianAssigned: users[1].firstName,
          status: "Complete",
          tasks: [
            { title: "Clean fuel injectors" },
            { title: "Check fuel pressure" },
          ],
          laborHours: 3,
          costOfService: 180,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Timing Belt Replacement",
          startDate: new Date("2024-02-08"),
          completionDate: new Date("2024-02-09"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { title: "Remove old timing belt" },
            { title: "Install new timing belt" },
          ],
          laborHours: 5,
          costOfService: 500,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Power Steering Fluid Flush",
          startDate: new Date("2024-02-10"),
          completionDate: new Date("2024-02-11"),
          technicianAssigned: users[0].firstName,
          status: "Pending",
          tasks: [
            { title: "Drain old fluid" },
            { title: "Refill with new fluid" },
          ],
          laborHours: 2,
          costOfService: 120,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Windshield Wiper Replacement",
          startDate: new Date("2024-02-12"),
          completionDate: new Date("2024-02-13"),
          technicianAssigned: users[1].firstName,
          status: "Pending",
          tasks: [
            { title: "Remove old wiper blades" },
            { title: "Install new wiper blades" },
          ],
          laborHours: 1,
          costOfService: 30,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Alternator Replacement",
          startDate: new Date("2024-02-14"),
          completionDate: new Date("2024-02-15"),
          technicianAssigned: users[2].firstName,
          status: "Pending",
          tasks: [
            { title: "Remove old alternator" },
            { title: "Install new alternator" },
          ],
          laborHours: 4,
          costOfService: 350,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Brake Fluid Flush",
          startDate: new Date("2024-02-17"),
          completionDate: new Date("2024-02-18"),
          technicianAssigned: users[0].firstName,
          status: "Complete",
          tasks: [
            { title: "Drain brake fluid" },
            { title: "Refill with new brake fluid" },
          ],
          laborHours: 2,
          costOfService: 100,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Timing Chain Replacement",
          startDate: new Date("2024-02-20"),
          completionDate: new Date("2024-02-21"),
          technicianAssigned: users[1].firstName,
          status: "Complete",
          tasks: [
            { title: "Remove timing chain" },
            { title: "Install new timing chain" },
          ],
          laborHours: 6,
          costOfService: 550,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Differential Fluid Change",
          startDate: new Date("2024-02-23"),
          completionDate: new Date("2024-02-24"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { title: "Drain old differential fluid" },
            { title: "Refill with new fluid" },
          ],
          laborHours: 3,
          costOfService: 180,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Timing Belt Tensioner Replacement",
          startDate: new Date("2024-02-25"),
          completionDate: new Date("2024-02-26"),
          technicianAssigned: users[0].firstName,
          status: "InProgress",
          tasks: [
            { title: "Remove old tensioner" },
            { title: "Install new tensioner" },
          ],
          laborHours: 4,
          costOfService: 400,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Clutch Replacement",
          startDate: new Date("2024-02-28"),
          completionDate: new Date("2024-02-29"),
          technicianAssigned: users[1].firstName,
          status: "Pending",
          tasks: [
            { title: "Remove old clutch" },
            { title: "Install new clutch" },
          ],
          laborHours: 7,
          costOfService: 600,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Turbocharger Replacement",
          startDate: new Date("2024-03-01"),
          completionDate: new Date("2024-03-02"),
          technicianAssigned: users[2].firstName,
          status: "Pending",
          tasks: [
            { title: "Remove old turbocharger" },
            { title: "Install new turbocharger" },
          ],
          laborHours: 8,
          costOfService: 1200,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Wheel Bearing Replacement",
          startDate: new Date("2024-03-05"),
          completionDate: new Date("2024-03-06"),
          technicianAssigned: users[0].firstName,
          status: "Pending",
          tasks: [
            { title: "Remove old wheel bearings" },
            { title: "Install new wheel bearings" },
          ],
          laborHours: 5,
          costOfService: 350,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Fuel Pump Replacement",
          startDate: new Date("2024-03-08"),
          completionDate: new Date("2024-03-09"),
          technicianAssigned: users[1].firstName,
          status: "InProgress",
          tasks: [
            { title: "Remove old fuel pump" },
            { title: "Install new fuel pump" },
          ],
          laborHours: 4,
          costOfService: 300,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Windshield Replacement",
          startDate: new Date("2024-03-10"),
          completionDate: new Date("2024-03-11"),
          technicianAssigned: users[2].firstName,
          status: "InProgress",
          tasks: [
            { title: "Remove old windshield" },
            { title: "Install new windshield" },
          ],
          laborHours: 2,
          costOfService: 200,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Camshaft Replacement",
          startDate: new Date("2024-03-13"),
          completionDate: new Date("2024-03-14"),
          technicianAssigned: users[0].firstName,
          status: "InProgress",
          tasks: [
            { 
              title: "Remove old camshaft",
              description: "Carefully disassemble valve train and extract worn camshaft"
            },
            { 
              title: "Install new camshaft",
              description: "Install new camshaft with proper timing and torque specifications"
            }
          ],
          laborHours: 6,
          costOfService: 600,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Power Steering Fluid Flush",
          startDate: new Date("2024-02-10"),
          completionDate: new Date("2024-02-11"),
          technicianAssigned: users[0].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Drain old power steering fluid",
              description: "Remove old fluid from power steering system using extraction tool"
            },
            { 
              title: "Flush power steering system",
              description: "Clean system with flush solution and refill with new fluid"
            }
          ],
          laborHours: 2,
          costOfService: 120,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Paint Shop",
          serviceType: "Paint Touch-Up",
          startDate: new Date("2024-02-12"),
          completionDate: new Date("2024-02-13"),
          technicianAssigned: users[1].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Sand affected areas",
              description: "Prepare surface with progressive grit sandpaper for paint adhesion"
            },
            { 
              title: "Apply paint and clear coat",
              description: "Match and apply base coat color followed by protective clear coat"
            }
          ],
          laborHours: 3,
          costOfService: 250,
          comments: [
            {
              userId: users[1]._id,
              text: "Paint color match completed. Ready for repair.",
              createdAt: new Date("2024-02-12T09:15:00")
            }
          ]
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Upholstery",
          serviceType: "Seat Repair",
          startDate: new Date("2024-02-15"),
          completionDate: new Date("2024-02-16"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Repair torn seat fabric",
              description: "Patch and reinforce damaged upholstery material"
            },
            { 
              title: "Replace seat padding",
              description: "Install new foam padding to restore seat comfort and support"
            }
          ],
          laborHours: 4,
          costOfService: 300,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Mechanical",
          serviceType: "Power Steering Fluid Flush",
          startDate: new Date("2024-02-10"),
          completionDate: new Date("2024-02-11"),
          technicianAssigned: users[0].firstName,
          status: "Complete",
          tasks: [
            { title: "Drain old power steering fluid" },
            { title: "Flush power steering system" },
          ],
          laborHours: 2,
          costOfService: 120,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Paint Shop",
          serviceType: "Paint Touch-Up",
          startDate: new Date("2024-02-12"),
          completionDate: new Date("2024-02-13"),
          technicianAssigned: users[1].firstName,
          status: "Complete",
          tasks: [
            { title: "Sand affected areas" },
            { title: "Apply paint and clear coat" },
          ],
          laborHours: 3,
          costOfService: 250,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Upholstery",
          serviceType: "Seat Repair",
          startDate: new Date("2024-02-15"),
          completionDate: new Date("2024-02-16"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { title: "Repair torn seat fabric" },
            { title: "Replace seat padding" },
          ],
          laborHours: 4,
          costOfService: 300,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Rim Repair",
          serviceType: "Wheel Refinishing",
          startDate: new Date("2024-02-18"),
          completionDate: new Date("2024-02-19"),
          technicianAssigned: users[0].firstName,
          status: "Complete",
          tasks: [
            { title: "Sand and polish wheels" },
            { title: "Apply protective coating" },
          ],
          laborHours: 5,
          costOfService: 400,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Detailing",
          serviceType: "Full Detail",
          startDate: new Date("2024-02-20"),
          completionDate: new Date("2024-02-21"),
          technicianAssigned: users[1].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Interior deep clean",
              description: "Deep clean all interior surfaces including seats, carpets, and dashboard"
            },
            { 
              title: "Exterior polish and wax",
              description: "Machine polish paint and apply protective wax coating"
            }
          ],
          laborHours: 6,
          costOfService: 350,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Dent Repair",
          serviceType: "Door Dent Removal",
          startDate: new Date("2024-02-23"),
          completionDate: new Date("2024-02-24"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Assess dent damage",
              description: "Evaluate dent size, location and paint condition for repair method"
            },
            { 
              title: "Perform paintless dent repair",
              description: "Use specialized tools to massage dent from behind panel"
            }
          ],
          laborHours: 3,
          costOfService: 280,
        },
        {
          carId: car1._id,
          userId: users[0]._id,
          department: "Inspection",
          serviceType: "Safety Inspection",
          startDate: new Date("2024-02-25"),
          completionDate: new Date("2024-02-26"),
          technicianAssigned: users[0].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Check safety systems",
              description: "Inspect brakes, steering, suspension and lighting systems"
            },
            { 
              title: "Perform emissions test",
              description: "Test exhaust emissions against environmental standards"
            }
          ],
          laborHours: 2,
          costOfService: 150,
        },
        {
          carId: car2._id,
          userId: users[1]._id,
          department: "Mechanical",
          serviceType: "Fuel Injector Cleaning",
          startDate: new Date("2024-02-05"),
          completionDate: new Date("2024-02-06"),
          technicianAssigned: users[1].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Clean fuel injectors",
              description: "Use specialized cleaning solution to remove deposits from injectors"
            },
            { 
              title: "Check fuel pressure",
              description: "Verify fuel system pressure meets manufacturer specifications"
            }
          ],
          laborHours: 3,
          costOfService: 180,
        },
        {
          carId: car3._id,
          userId: users[2]._id,
          department: "Mechanical",
          serviceType: "Timing Belt Replacement",
          startDate: new Date("2024-02-08"),
          completionDate: new Date("2024-02-09"),
          technicianAssigned: users[2].firstName,
          status: "Complete",
          tasks: [
            { 
              title: "Remove old timing belt",
              description: "Remove covers and auxiliary components to access timing belt"
            },
            { 
              title: "Install new timing belt",
              description: "Install new belt ensuring correct timing marks alignment"
            }
          ],
          laborHours: 5,
          costOfService: 500,
        }
      ]);

      console.log(`Successfully seeded ${workOrders.length} work orders`);




      console.log("Data seeded successfully!");
    } catch (err) {
      console.error("Error seeding data:", err);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });
