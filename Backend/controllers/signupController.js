const User = require("../models/signupModel");
const bcrypt = require("bcrypt");

const newUser = async (req, res) => {
    try {
        const { email,userName, password} = req.body;
        console.log(email,userName, password);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            });
        }

        let hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,userName, password: hashPassword
        });

        return res.status(200).json({
            user: user,
            success: true,
            message: "User created successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User registration failed, please try again",
        });
    }
}

module.exports = { newUser };