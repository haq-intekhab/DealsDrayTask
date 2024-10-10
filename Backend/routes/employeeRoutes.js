const express = require('express');
const router = express.Router();
const { createEmployee, getAllEmployees,getEmployeeById,updateEmployee,deleteEmployee,searchEmployees} = require('../controllers/employeeController');

// Define routes
router.post('/createemployee', createEmployee);
router.get('/getemployee', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/editemployee/:id', updateEmployee);
router.delete('/deleteemployee/:id', deleteEmployee);
router.get('/employee/:search', searchEmployees);

module.exports = router;
