const express = require("express");
const router = express.Router();

const { newUser } = require("../controllers/signupController");
const { userLogIn } = require("../controllers/loginController");

router.post("/signup", newUser);
router.post("/login",userLogIn);

module.exports = router;