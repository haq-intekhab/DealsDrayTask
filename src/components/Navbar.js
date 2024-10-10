import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const User = JSON.parse(localStorage.getItem("userInfo")) || {};
  // console.log(User.user);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
  };
  return (
    <div className="fixed top-0 bg-white  z-[1000] w-full h-[70px] flex justify-between items-center px-[1rem] border-b border-gray-300">
      <img
        onClick={() => {
          navigate("/dashboard");
        }}
        src="main-logo.png"
        alt="logo"
        className="h-full aspect-auto p-[.5rem] cursor-pointer"
      />

      <div className="w-[50%] flex items-center ">
        <div className="w-[50%] flex items-center justify-evenly">
          <NavLink
            className=" font-[600] text-[.9rem] leading-[1.6rem] p-2"
            to="/dashboard"
          >
            Home
          </NavLink>
          <NavLink
            className=" font-[600] text-[.9rem] leading-[1.6rem] p-2"
            to="/employeelist"
          >
            Employee List
          </NavLink>
        </div>
        {User && User?.user ? (
          <div className="w-[50%] items-center flex justify-evenly">
            <p className=" font-[600] text-[.9rem] leading-[1.6rem] p-2">
              {User.user.userName}
            </p>
            <NavLink to="/">
              <button
                onClick={handleLogout}
                className="text-[white] bg-[#3ad7d7] py-2 px-3 rounded-md flex w-full justify-center items-center font-[600] text-[.9rem] leading-[1.6rem]"
              >
                Logout
              </button>
            </NavLink>
          </div>
        ) : (
          <div className="w-[50%] items-center flex justify-evenly">
            <NavLink to="/register">
              <button className="text-[white] bg-[#3ad7d7] py-2 px-3 rounded-md flex w-full justify-center items-center font-[600] text-[.9rem] leading-[1.6rem]">
                Sign Up
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
