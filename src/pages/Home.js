import React from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div id="home" className="w-full">
      <Navbar />
      <div className="w-full h-[100vh] flex justify-center items-center">
        <p className="text-2xl font-semibold">Welcome to Admin Dashboard</p>
      </div>
    </div>
  );
};

export default Home;
