import img from "../../assets/signUp.jpg";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { UserRegister } from "../../Api/AuthApi/AuthApi";
import Dotspinner from "../../components/ReUse/Dotspinner";

const SignUp = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showStrengthBar, setShowStrengthBar] = useState(false); // Hide initially

  // Yup Schema for validation
  const schema = yup.object().shape({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Form Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Function to determine password strength
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Update password strength
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordStrength(getPasswordStrength(newPassword));

    if (newPassword.length > 0) {
      setShowStrengthBar(true); // Show strength bar when user types
      setPasswordStrength(getPasswordStrength(newPassword));
    } else {
      setShowStrengthBar(false); // Hide when empty
    }
  };

  // Submit Handler
  const onSubmit = async (data: any) => {
    setLoading(true);
    UserRegister(data)
      .then((response) => {
        console.log(response);
        if (response.data) {
          setLoading(false);
          alert("Registration successful. You can now login.");
          navigate("/Login");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };

  const toggle = () => {
    setShow((prevShow) => !prevShow);
  };
  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mobile:items-center mobile:justify-center mobile:h-auto">
      {/* Image */}
      <div className="w-1/2 bg-white mobile:hidden tablet:hidden">
        <img
          src={img}
          alt="signup"
          className="object-cover object-left w-full h-full"
        />
      </div>
      {/* Form Container */}
      <div className="flex flex-col items-center justify-center w-1/2 h-full mobile:w-full mobile:h-auto tablet:w-full">
        <form
          className="flex flex-col items-start justify-center w-auto h-full gap-4 mobile:w-full mobile:h-auto mobile:px-4 mobile:py-10 mobile:gap-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex w-auto gap-4 mobile:flex-col mobile:gap-4 mobile:w-full">
            {/* Input Frist name */}
            <div className="flex flex-col">
              <label className="font-bold text-white">First name</label>
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstname")}
                  className="w-[300px] p-2 my-2 bg-white font-semibold rounded-md outline-none h-[50px] mobile:w-full"
                />
                {errors.firstname && (
                  <div className="text-xs text-red-600">
                    {errors.firstname?.message}
                  </div>
                )}
              </div>
            </div>
            {/* Input Last name */}
            <div className="flex flex-col">
              <label className="font-bold text-white">Last name</label>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastname")}
                  className="w-[300px] p-2 my-2 bg-white font-semibold rounded-md outline-none h-[50px]  mobile:w-full"
                />
                {errors.lastname && (
                  <div className="text-xs text-red-600">
                    {errors.lastname?.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input User name */}
          <div className="flex flex-col w-[100%]">
            <label className="font-bold text-white">User name</label>
            <input
              type="text"
              placeholder="User Name"
              {...register("username")}
              className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />
            <div>
              {errors.username && (
                <div className="text-xs text-red-600">
                  {errors.username?.message}
                </div>
              )}
            </div>
          </div>

          {/* Input Email */}
          <div className="flex flex-col w-[100%]">
            <label className="font-bold text-white">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />
            {errors.email && (
              <div className="text-xs text-red-600">
                {errors.email?.message}
              </div>
            )}
          </div>

          {/* Password Container */}
          <div className="w-[100%]">
            <label className="font-bold text-white">Password</label>
            {/* Password */}
            <div className="w-[100%] px-2 my-2 bg-white font-semibold rounded-md outline-none h-[50px] flex items-center justify-between">
              {/* Password */}
              <input
                type={!show ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                onChange={handlePasswordChange}
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
           {/* Animated Password Strength Bar (Only appears when user types) */}
{showStrengthBar && (
  <div className="w-full h-2 mt-2 overflow-hidden bg-gray-300 rounded-full">
    <div
      className={`h-full transition-all duration-500 ${
        passwordStrength === 1
          ? "w-1/3 bg-red-500"
          : passwordStrength === 2
          ? "w-2/3 bg-yellow-500"
          : passwordStrength === 3
          ? "w-full bg-green-500"
          : "w-0"
      }`}
    ></div>
  </div>
)}

{/* Strength Text (Only shows when typing) */}
{showStrengthBar && (
  <p
    className={`mt-1 text-sm font-semibold ${
      passwordStrength === 1
        ? "text-red-500"
        : passwordStrength === 2
        ? "text-yellow-500"
        : passwordStrength === 3
        ? "text-green-500"
        : "text-gray-400"
    }`}
  >
    {passwordStrength === 1
      ? "Weak"
      : passwordStrength === 2
      ? "Medium"
      : passwordStrength === 3
      ? "Strong" : ""}
  </p>
)}
            {errors.password && (
              <div className="text-xs text-red-600">
                {errors.password?.message}
              </div>
            )}
          </div>
          {/* Comfirm Password Container */}
          <div className="w-[100%]">
            <label className="font-bold text-white">Confirm password</label>
            {/* Password */}
            <div className="w-[100%] px-2 my-2 bg-white font-semibold rounded-md outline-none h-[50px] flex items-center justify-between">
              {/* Password */}
              <input
                type={!show ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
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
            {errors.confirmPassword && (
              <div className="text-xs text-red-600">
                {errors.confirmPassword?.message}
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex  items-center justify-between w-[100%] mobile:flex-col-reverse mobile:gap-4 mobile:w-full mobile:mt-5">
            {/* Login */}
            <p className="text-white">
              Already have an account?{" "}
              <Link to="/Login">
                <span className="text-[#302b63] cursor-pointer hover:underline font-bold">
                  Login
                </span>
              </Link>
            </p>
            {/* Sign Up */}
            <button
              disabled={loading}
              className={`${
                !loading ? "bg-[#24243e] " : "opacity-50 bg-[#24243e] "
              }relative px-6 py-2 text-white text-lg font-semibold bg-[#24243e] rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[200px] h-[60px] justify-center flex items-center`}
              type="submit"
            >
              {loading ? Dotspinner() : "Sign Up"}
            </button>
          </div>
        </form>
        {/* Google SignIn
        <div className="flex items-center justify-center w-[100%]  mb-5">
          <button className="relative px-6 py-2 text-white text-lg font-semibold bg-[#4285f4] rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[200px] h-[60px]">
            Sign in with Google
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default SignUp;
