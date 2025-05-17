import img from "../../assets/signUp.jpg";
import { CgProfile } from "react-icons/cg";
import { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserLogin } from "../../Api/AuthApi/AuthApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../global/useReducer";
import Dotspinner from "../../components/ReUse/Dotspinner";
import { jwtDecode } from "jwt-decode";
import { ThreeCircles } from "react-loader-spinner";

const SignIn = () => {
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(true);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggle = () => setShow((prev) => !prev);

  useEffect(() => {
    setTimeout(() => setStart(false), 2000);
  }, []);

  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data : any) => {
    setLoading(true);
    setServerError("");
    setServerSuccess("");
    
    try {
      const response = await UserLogin(data);
      console.log("Login response:", response);

      if (response.data?.token) {
        const { token, ...userInfo } = response.data;
        dispatch(setUser({ ...userInfo, token }));

        setServerSuccess("Login successful! Welcome to your easy online shopping.");
        
        // Navigate after brief delay to show success message
        setTimeout(() => {
          const decoded: any = jwtDecode(token);
          if (decoded.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setServerError("Email or password is incorrect.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      // Type guard for error object
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null
      ) {
        const errResponse = (error as any).response;
        if (errResponse.data && errResponse.data.message) {
          setServerError(errResponse.data.message);
        } else if (errResponse.status === 401) {
          setServerError("Invalid email or password. Please try again.");
        } else {
          setServerError("Login failed. Please check your credentials and try again.");
        }
      } else {
        setServerError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {start ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1a32]">
          <ThreeCircles visible={true} height="100" width="100" color="#e67e22" />
          <p className="mt-3 text-lg font-medium text-[#e67e22]">Loading...</p>
        </div>
      ) : (
        <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mobile:items-center mobile:justify-center mobile:h-auto">
          {/* Image */}
          <div className="relative w-1/2 bg-white mobile:hidden tablet:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-5"></div>
            <img src={img} alt="signup" className="object-cover object-left w-full h-full" />
          </div>

          {/* Form */}
          <div className="flex flex-col items-center justify-center w-1/2 h-full mobile:w-full mobile:h-auto tablet:w-full">
            <CgProfile color="white" size={70} className="mb-4" />
            
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-start justify-center w-auto h-auto gap-4 mobile:w-full mobile:px-4"
            >
              {/* Server Error Message */}
              {serverError && (
                <div className="w-full p-3 mb-2 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md">
                  <p className="font-medium">{serverError}</p>
                </div>
              )}

              {/* Server Success Message */}
              {serverSuccess && (
                <div className="w-full p-3 mb-2 text-white transition-all duration-300 bg-green-500 rounded-lg shadow-md">
                  <p className="font-medium">{serverSuccess}</p>
                </div>
              )}
              
              {/* Email */}
              <div className="flex flex-col w-[550px] mobile:w-full">
                <label className="font-bold text-white">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Email"
                  className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
                />
                {errors.email && (
                  <div className="px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="w-full">
                <label className="font-bold text-white">Password</label>
                <div className="w-full px-2 my-2 bg-white font-semibold rounded-md h-[60px] flex items-center justify-between">
                  <input
                    type={show ? "password" : "text"}
                    placeholder="Password"
                    {...register("password")}
                    className="w-full h-full p-3 bg-white outline-none"
                  />
                  <div onClick={toggle}>
                    {show ? (
                      <IoEyeOffSharp size={25} className="text-gray-400 cursor-pointer" />
                    ) : (
                      <IoEyeOutline size={25} className="text-gray-400 cursor-pointer" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <div className="px-2 py-1 mt-1 text-xs font-medium text-white bg-red-500 rounded">
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between w-full mobile:flex-col-reverse mobile:gap-4 mobile:mt-5">
                <p className="text-white">
                  Don't have an account?{" "}
                  <Link to="/register">
                    <span className="text-[#e67e22] cursor-pointer hover:underline font-bold">
                      Sign Up
                    </span>
                  </Link>
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    !loading ? "bg-[#e67e22]" : "opacity-50 bg-[#e67e22]"
                  } relative px-6 py-2 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300 w-[200px] h-[60px] flex items-center justify-center`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-4 text-[17px]">
                      {Dotspinner()} Loading...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>

              {/* Forget Password */}
              <div className="flex justify-center w-full mt-5">
                <Link to="/forgot-password">
                  <p className="font-bold text-white cursor-pointer hover:underline w-fit">
                    Forgot Password?
                  </p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;