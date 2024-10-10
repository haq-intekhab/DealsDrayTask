import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

import { Link } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { PiEyeSlashLight } from "react-icons/pi";
import { PiEyeLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  const submitHandler = async (e) => {
    if (formData.password !== formData.cpassword) {
      alert("Password and Confirm Password do not match");
      return;
    }
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post(
        "http://localhost:4000/api/signup",
        formData
        ,
        config
      );
      console.log(data);
      const user = localStorage.setItem("userInfo", JSON.stringify(data));
      console.log(user);
      navigate("/");

    } catch (error) {
      console.log(error);
      // toast.error("An error occurred");
    }
  };
    // event.preventDefault();
    // setFormData({
    //   username: "",
    //   email: "",
    //   password: "",
    //   cpassword: "",
    // });
    // setLoading(true);
    // setIsLoggedIn(true);
    // toast.success("Logged In");
    // console.log("Printing the formData ");
    // console.log(formData);
    // navigate("/");
  

  return (
    <div id="register" className="w-full flex justify-center items-center">
      <Navbar />
      <div className="md:w-[50%] w-full px-8 py-4 mt-[70px]">
        <div className="w-full mt-4">
          <form
            onSubmit={submitHandler}
            className="flex flex-col border-2 rounded-md p-4 w-full gap-y-4"
          >
            <h2 className="text-[#1C2434] text-left text-[24px] font-semibold">
              Register
            </h2>

            <div className="flex flex-col gap-1">
              <label className="w-full text-left text-m flex flex-col gap-2">
                <p className="font-semibold">Admin Username</p>
                <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                  <FiUser className="size-[25px]" />
                  <input
                    required
                    type="text"
                    placeholder="Enter UserName"
                    name="userName"
                    value={formData.userName}
                    onChange={changeHandler}
                    className="w-full h-full text-richblack-5 outline-none"
                  />
                </div>
              </label>

              <label className="w-full text-left text-m flex flex-col gap-2">
                <p className="font-semibold">Admin mail</p>
                <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3">
                  <CiMail className="size-[25px]" />
                  <input
                    required
                    type="email"
                    placeholder="Enter your email address"
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    className="w-full h-full text-richblack-5 outline-none"
                  />
                </div>
              </label>

              <div className="flex gap-2 items-center justify-center">
                <label className=" w-full text-left text-m flex flex-col gap-2">
                  <p className="font-semibold ">Password</p>
                  <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3 relative">
                    <RiLockPasswordLine className="size-[25px]" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      name="password"
                      value={formData.password}
                      onChange={changeHandler}
                      className="w-full h-full text-richblack-5 outline-none"
                    />
                    <span
                      className="absolute right-3 top-[13px] cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <PiEyeLight fontSize={24} />
                      ) : (
                        <PiEyeSlashLight fontSize={24} />
                      )}
                    </span>
                  </div>
                </label>
                <label className=" w-full text-left text-m flex flex-col gap-2">
                  <p className="font-semibold ">Confirm Password</p>
                  <div className="flex w-full h-[3rem] border rounded-[0.5rem] pl-[12px] items-center gap-3 relative">
                    <RiLockPasswordLine className="size-[25px]" />
                    <input
                      required
                      type={showCPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="cpassword"
                      value={formData.cpassword}
                      onChange={changeHandler}
                      className="w-full h-full text-richblack-5 outline-none"
                    />
                    <span
                      className="absolute right-3 top-[13px] cursor-pointer"
                      onClick={() => setShowCPassword((prev) => !prev)}
                    >
                      {showCPassword ? (
                        <PiEyeLight fontSize={24} />
                      ) : (
                        <PiEyeSlashLight fontSize={24} />
                      )}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button className="bg-[#3ad7d7] rounded-[8px] text-white font-medium text-richblack-900 px-[12px] py-[8px] mt-2">
              Sign Up
            </button>
            <div className="flex gap-2 md:mt-1 mt-[30px] justify-center">
              <p>Already have an account?</p>
              <Link to="/">
                <span className="text-[#3ad7d7] font-bold">Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
