const User = require("../models/signupModel");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const userLogIn = async(req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"plz fill all the blockes",
            });
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered",
            });
        }

        const payload = {
            email:user.email,
            id:user._id,
        };

        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                                    expiresIn:"30d",
                                }); 
        
        user = user.toObject();
        user.token = token;
        user.password = undefined;

        res.status(200).json({
            success:true,
            user,
            message:"login succesfull",
        });

        }
        else{
            res.status(403).json({
                success:false,
                messaage:"password Incorrect",
            });
        }

    } catch(err) {
        console.error(err);
        res.status(500).json({
            success:false,
            message:"login failed",
        });
    }
}

module.exports = {
    userLogIn,
};