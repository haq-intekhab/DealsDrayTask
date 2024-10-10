import React, { useState } from "react";
import Navbar from "../components/Navbar";

import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { PiEyeSlashLight } from "react-icons/pi";
import { PiEyeLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event) {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  }

  // function submitHandler(event) {
  //   event.preventDefault();
  //   setFormData({
  //     email: "",
  //     password: "",
  //   });
  //   setLoading(true);
  //   setIsLoggedIn(true);
  //   toast.success("Logged In");
  //   console.log("Printing the formData ");
  //   console.log(formData);
  //   navigate("dashboard");
  // }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const { data } = await axios.post(
            "http://localhost:4000/api/logIn",
            formData,
            config
        );
        console.log(data);
        if (data.success) {
            
            toast.success("Login successful!");

            localStorage.setItem("userInfo", JSON.stringify(data));
            navigate("/dashboard");
            
        } else {
            toast.error("User Not exists!");
        }
    } catch (error) {
        toast.error("An error occurred");
    }
};

  return (
    <div
      id="login"
      className="w-full h-[100vh] flex justify-center items-center"
    >
      <Navbar />
      <div className="w-[50%] px-8 py-4 my-4">
        <div className="w-full mt-4">
          <form
            onSubmit={submitHandler}
            className="flex flex-col border-2 rounded-md p-4 w-full gap-y-4"
          >
            <h2 className="text-[#1C2434] text-left text-[24px] font-semibold">
              Login
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
                    name="email"
                    value={formData.email}
                    onChange={changeHandler}
                    className="w-full h-full text-richblack-5 outline-none"
                  />
                </div>
              </label>

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
            </div>

            <button className="bg-[#3ad7d7] rounded-[8px] text-white font-medium text-richblack-900 px-[12px] py-[8px] mt-2">
              Login
            </button>
            <div className="flex gap-2 md:mt-2 mt-[30px] justify-center">
            <p>Don't have an account?</p>
            <Link to="/register">
              <span className="text-[#3ad7d7] font-bold">Register Now</span>
            </Link>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
