const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure that emails are unique
        match: /.+\@.+\..+/ // Basic email format validation
    },
    phone: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other','Male','Female'], // Limit values to specific options
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
    },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
