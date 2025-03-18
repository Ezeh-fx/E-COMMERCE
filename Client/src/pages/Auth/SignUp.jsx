import React from "react";
import img from "../../assets/signUp.jpg";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(true);
  {
    /* Toggle Function */
  }
  const toggle = () => {
    setShow((prevShow) => !prevShow);
  };
  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29]">
      {/* Image */}
      <div className="w-1/2 bg-white md:flex">
        <img
          src={img}
          alt="signup"
          className="object-cover object-left w-full h-full"
        />
      </div>
      {/* Form Container */}
      <div className="flex items-center justify-center w-1/2 h-full">
        <form className="flex flex-col items-start justify-center w-auto h-full gap-4">
          <div className="flex w-auto gap-4">
            {/* Input Frist name */}
           <div className="flex flex-col">
           <label className="font-bold text-white" >First name</label>
            <input
              type="text"
              placeholder="First Name"
              className="w-[300px] p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />
           </div>
            {/* Input Last name */}
            <div className="flex flex-col">
           <label className="font-bold text-white" >Last name</label>
            <input
              type="text"
              placeholder="Last Name"
              className="w-[300px] p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />
           </div>
          </div>

          {/* Input User name */}
          <div className="flex flex-col w-[100%]">
           <label className="font-bold text-white" >User name</label>
            <input
              type="text"
              placeholder="User Name"
              className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />
           </div>

          {/* Input Email */}
          <div className="flex flex-col w-[100%]">
           <label className="font-bold text-white" >Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />
           </div>

          {/* Password Container */}
         <div className="w-[100%]">
          <label className="font-bold text-white" >Password</label>
            {/* Password */}
            <div className="w-[100%] px-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px] flex items-center justify-between">
            {/* Password */}
            <input
              type={!show ? "text" : "password"}
              placeholder="Password"
              className="h-full p-3 focus:outline-none w-[100%] bg-white"
            />

            {/* Toggle Function */}
            <div onClick={toggle}>
              {show ? (
                <IoEyeOffSharp
                  size={25}
                  className="text-gray-400 cursor-pointer"
                />
              ) : (
                <IoEyeOutline
                  size={25}
                  className="text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>
         </div>
          {/* Comfirm Password Container */}
          <div className="w-[100%]">
          <label className="font-bold text-white" >Confirm password</label>
            {/* Password */}
            <div className="w-[100%] px-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px] flex items-center justify-between">
            {/* Password */}
            <input
              type={!show ? "text" : "password"}
              placeholder="Confirm Password"
              className="h-full p-3 focus:outline-none w-[100%] bg-white"
            />

            {/* Toggle Function */}
            <div onClick={toggle}>
              {show ? (
                <IoEyeOffSharp
                  size={25}
                  className="text-gray-400 cursor-pointer"
                />
              ) : (
                <IoEyeOutline
                  size={25}
                  className="text-gray-400 cursor-pointer"
                />
              )}
            </div>
          </div>
         </div>

          {/* Button */}
          <div className="flex  items-center justify-between w-[100%]">
            {/* Login */}
            <p className="text-white">
              Already have an account?{" "}
             <Link  to="/Login">
             <span className="text-[#302b63] cursor-pointer hover:underline font-bold">
                Login
              </span>
             </Link>
            </p>
            {/* Sign Up */}
            <button className="relative px-6 py-2 text-white text-lg font-semibold bg-[#24243e] rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[200px] h-[60px]">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
