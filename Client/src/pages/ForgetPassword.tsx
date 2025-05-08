import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ForgetPasswordSend } from "../Api/AuthApi/AuthApi";
import Alert from "../components/ReUse/Alert";
import img from "../assets/signUp.jpg";

const ForgetPassword = () => {
  // Validation Schema
  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
  });

  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle Forgot Password Request
  const HandleSend = async (data: any) => {
    setLoading(true);

    try {
      const res = await ForgetPasswordSend(data);
      console.log("Full API Response:", res);

      // Fix: Check if response contains 'message' directly
      const message = res?.data?.message || res?.message;

      if (message) {
        alert(message);
        navigate("/reset-password");
      } else {
        console.error("Unexpected response structure:", res);
        // alert("Unexpected response format.");
        setAlertMessage("User not found. Please register first.");
        // Hide error message after 5 seconds
        setTimeout(() => {
          setAlertMessage(null);
        }, 5000);
      }
    } catch (error: any) {
      console.error("OTP Request Error:", error);
      alert(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29]">
      {/* Image (hidden on mobile/tablet) */}
      <div className="relative hidden w-1/2 bg-white lg:block">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>

        <img
          src={img}
          alt="signup"
          className="object-cover object-left w-full h-full"
        />
      </div>

      {/* Form Section */}
      <div className="flex flex-col items-center justify-center w-full h-full px-4 py-6 lg:w-1/2">
        {/* Icon */}
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <h1 className="text-3xl font-bold text-center text-white">Forget Password</h1>
          <form
            className="flex flex-col items-center w-full gap-4"
            onSubmit={handleSubmit(HandleSend)}
          >
            {/* Input Email */}
            <div className="flex flex-col w-full max-w-lg">
              <label className="font-bold text-white">Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
              />
              {errors.email && (
                <div className="text-xs text-red-600">
                  {errors.email?.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full max-w-lg p-2 my-2 font-semibold text-white bg-[#e67e22] rounded-md outline-none h-[60px] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Loading..." : "Send OTP"}
            </button>
          </form>
        </div>

        {/* Alert Message */}
        {alertMessage && (
          <div className="absolute top-0 right-0 p-4">
            <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
