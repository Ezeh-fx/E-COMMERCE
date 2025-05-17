import img from "../../assets/signUp.jpg";
import { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { UserRegister } from "../../Api/AuthApi/AuthApi";
import Dotspinner from "../../components/ReUse/Dotspinner";
import { ThreeCircles } from "react-loader-spinner";

const SignUp = () => {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState({
    text: "",
    color: "text-gray-400",
    width: "w-0"
  });
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(true);
  const [showStrengthBar, setShowStrengthBar] = useState(false);
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  useEffect(() => {
    setTimeout(() => setStart(false), 2000);
  }, []);

  // Yup Schema for validation
  const schema = yup.object().shape({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    username: yup.string().required("Username is required"),
    email: yup.string().email().required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
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
  const getPasswordStrength = (password : string) => {
    let strength = {
      text: "Weak",
      color: "text-red-500",
      width: "w-1/3 bg-red-500",
    };

    if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      strength = {
        text: "Medium",
        color: "text-yellow-500",
        width: "w-2/3 bg-yellow-500",
      };
    }
    if (password.length >= 8 && /[^A-Za-z0-9]/.test(password)) {
      strength = {
        text: "Strong",
        color: "text-green-500",
        width: "w-full bg-green-500",
      };
    }

    return strength;
  };

  // Update password strength on input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordStrength(getPasswordStrength(newPassword));
    setShowStrengthBar(newPassword.length > 0);
  };

  // Submit Handler
  const onSubmit = async (data : any) => {
    setLoading(true);
    setServerError("");
    setServerSuccess("");
    
    UserRegister(data)
      .then((response) => {
        console.log(response);
        if (response.data) {
          setLoading(false);
          setServerSuccess("Registration successful! You can now verify your account.");
          // Save email to localStorage
          localStorage.setItem("email", email);
          
          // Navigate after a brief delay to show success message
          setTimeout(() => {
            navigate("/verify");
          }, 2000);
        } else {
          setLoading(false);
          setServerError("Email already exists. Please login or use a different email.");
        }
      })
      .catch((error) => {
        setLoading(false);
        // Display error from backend if available
        if (error.response && error.response.data && error.response.data.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("An error occurred. Please try again later.");
        }
        console.log(error);
      });
  };

  const toggle = () => {
    setShow((prevShow) => !prevShow);
  };

  return (
    <div className="w-full">
      {start ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1a32]">
          <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color="#e67e22"
            ariaLabel="three-circles-loading"
          />
          <p className="mt-3 text-lg font-medium text-[#e67e22]">Loading...</p>
        </div>
      ) : (
        <>
          <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mobile:items-center mobile:justify-center mobile:h-auto">
            {/* Image */}
            <div className="relative w-1/2 bg-white mobile:hidden tablet:hidden">
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-5"></div>

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
                {/* Server Error Message */}
                {serverError && (
                  <div className="w-full p-3 mb-4 text-white bg-red-500 rounded-lg shadow-md">
                    <p className="font-medium">{serverError}</p>
                  </div>
                )}

                {/* Server Success Message */}
                {serverSuccess && (
                  <div className="w-full p-3 mb-4 text-white bg-green-500 rounded-lg shadow-md">
                    <p className="font-medium">{serverSuccess}</p>
                  </div>
                )}

                <div className="flex w-auto gap-4 mobile:flex-col mobile:gap-4 mobile:w-full">
                  {/* Input First name */}
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
                        <div className="px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
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
                        className="w-[300px] p-2 my-2 bg-white font-semibold rounded-md outline-none h-[50px] mobile:w-full"
                      />
                      {errors.lastname && (
                        <div className="px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
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
                      <div className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
                  />
                  {errors.email && (
                    <div className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded">
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
                  {/* Password Strength Bar (Only appears when typing) */}
                  {showStrengthBar && (
                    <div className="w-full h-2 mt-2 overflow-hidden bg-gray-300 rounded-full">
                      <div
                        className={`h-full transition-all duration-500 ${passwordStrength.width}`}
                      ></div>
                    </div>
                  )}

                  {/* Strength Text */}
                  {showStrengthBar && (
                    <p
                      className={`mt-1 text-sm font-semibold ${passwordStrength.color}`}
                    >
                      {passwordStrength.text}
                    </p>
                  )}

                  {errors.password && (
                    <div className="px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
                      {errors.password?.message}
                    </div>
                  )}
                </div>
                {/* Confirm Password Container */}
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
                    <div className="px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
                      {errors.confirmPassword?.message}
                    </div>
                  )}
                </div>

                {/* Button */}
                <div className="flex items-center justify-between w-[100%] mobile:flex-col-reverse mobile:gap-4 mobile:w-full mobile:mt-5">
                  {/* Login */}
                  <p className="text-white">
                    Already have an account?{" "}
                    <Link to="/Login">
                      <span className="text-[#e67e22] cursor-pointer hover:underline font-bold">
                        Login
                      </span>
                    </Link>
                  </p>
                  {/* Sign Up */}
                  <button
                    disabled={loading}
                    className={`${
                      !loading ? "bg-[#e67e22] " : "opacity-50 bg-[#e67e22] "
                    }relative px-6 py-2 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-[200px] h-[60px] justify-center flex items-center`}
                    type="submit"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-4 text-[17px]">{Dotspinner()} Loading ...</div>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignUp;