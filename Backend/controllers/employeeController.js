const Employee = require("../models/employeeModel"); // Adjust the path as necessary
const cloudinary = require("cloudinary").v2;

// Create a new employee entry
exports.createEmployee = async (req, res) => {
  try {
    // Check if the employee with the same email already exists
    const existingEmployee = await Employee.findOne({ email: req.body.email });
    console.log(existingEmployee);

    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    const savedEmployee = await Employee.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      gender: req.body.gender,
      course: req.body.course,
      imgUrl: req.body.img,
    });
    res.status(201).json({
      message: "Employee created successfully",
      savedEmployee,
    });
  } catch (error) {
    console.error("Error creating employee:", error); // Log the complete error for debugging
    res.status(500).json({
      message: "Error creating employee",
      error: error.message || "An unexpected error occurred",
    });
  }
};

// Get all employee entries
exports.getAllEmployees = async (req, res) => {
  try {
    const employeeList = await Employee.find();
    res.status(200).json(employeeList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};

// Update employee by ID
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({
      message: "Employee updated successfully",
      updatedEmployee,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating employee", error });
  }
};

// Delete employee by ID
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

// Search employees by name or email
// controllers/employeeController.js

// const Employee = require('../models/employeeModel');

// Search employees by name or email
exports.searchEmployees = async (req, res) => {
    const { search } = req.params; // Extract the search parameter from request parameters
    console.log(search);

    // Create search criteria to check if the search term matches either name or email
    const searchCriteria = {
        $or: [
            { name: { $regex: search, $options: "i" } },  // Match by name (case-insensitive)
            { email: { $regex: search, $options: "i" } }  // Match by email (case-insensitive)
        ]
    };

    try {
        // Find employees matching the search criteria
        const employees = await Employee.find(searchCriteria);

        if (employees.length === 0) {
            return res.status(200).json({ message: 'No employees found.' });
        }

        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};
