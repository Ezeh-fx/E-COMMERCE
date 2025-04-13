import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ForgetPasswordSend } from "../Api/AuthApi/AuthApi";
import Alert from "../components/ReUse/Alert";

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
        navigate("/verify-otp");
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mobile:h-screen tablet:h-screen  mobile:items-center mobile:justify-center">
      <div className="flex flex-col items-center gap-8 mobile:w-full">
        <h1 className="text-white text-[40px] font-bold">Forget Password</h1>
        {/* Form */}
        <form
          onSubmit={handleSubmit(HandleSend)}
          className="flex flex-col items-center w-auto gap-5 mobile:w-full mobile:p-5"
        >
          {/* <div> */}
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className="w-[700px] p-2  font-bold  bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mobile:w-full tablet:w-[100%]"
            />
            {errors.email && (
              <div className="text-xs text-red-600">
                {errors.email?.message}
              </div>
            )}
          {/* </div> */}

          <button
            type="submit"
            className="w-[70%] p-2 text-white bg-blue-500 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Send OTP"}
          </button>
        </form>
      </div>
      {/* Show Alert If There Is an Error */}
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage("")} />}
    </div>
  );
};

export default ForgetPassword;
