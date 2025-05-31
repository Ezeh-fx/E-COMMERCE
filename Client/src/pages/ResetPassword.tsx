import img from "../assets/signUp.jpg";
import { useState } from "react";
import axios from "axios";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validOtp, setValidOtp] = useState<number | null>(null); // store verified OTP
  const [show, setShow] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState<{
    text: string;
    color: string;
    width: string;
  }>({ text: "", color: "text-gray-400", width: "w-0" });
  const [showStrengthBar, setShowStrengthBar] = useState(false); // Hide initially
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
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

  const schema = yup.object().shape({
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toggle = () => {
    setShow((prevShow) => !prevShow);
  };

  // Update password strength on input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPasswordStrength(getPasswordStrength(newPassword));
    setShowStrengthBar(newPassword.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setOtp(value);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:2343/api/reset-password",
        {
          OtpCode: Number(otp),
          password: "", // empty on purpose
        }
      );

      if (response.data.message === "OTP is valid") {
        setValidOtp(Number(otp));
        setStep("password");
        console.log("✅ OTP verified. Please enter your new password.");
      } else {
        setOtp(""); // Reset OTP input on failure
      }
    } catch (err: any) {
      setOtp(""); // Reset OTP input on error
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      console.log("❌ Passwords do not match.");
    }

    try {
      const response = await axios.post(
        "http://localhost:2343/api/reset-password",
        {
          OtpCode: validOtp,
          password: newPassword,
        }
      );

      if (response.data.message === "Password Changed") {
        console.log("✅ Password successfully changed!");
        navigate("/Login");
      } else {
        console.log("❌ Error occurred while changing password.");
      }
    } catch (error: any) {
      console.error("❌ Error:", error.message);
    }
  };

  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] items-center justify-center">
      {/* Image */}
      <div className="relative w-[50%] bg-white mobile:hidden tablet:hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>

        <img
          src={img}
          alt="signup"
          className="object-cover object-left w-full h-full"
        />
      </div>

      {/* Form Section */}
      <div className="flex flex-col items-center justify-center w-[50%] h-full px-4 py-6 lg:w-1/2">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <h1 className="mb-10 text-3xl font-bold text-white">
            {step === "otp" ? "Verify OTP" : "Reset Password"}
          </h1>

          {step === "otp" ? (
            <div className="flex flex-col items-center w-full gap-4">
              <input
                type="text"
                value={otp}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                className="w-full sm:w-4/5 lg:w-1/2 p-2 bg-white border rounded-md focus:outline-none h-[60px]"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full sm:w-4/5 lg:w-1/2 p-2 my-2 font-semibold text-white bg-[#e67e22] rounded-md outline-none h-[60px]"
              >
                Verify OTP
              </button>
            </div>
          ) : (
            <>
              {/* Password Field */}
              <div className="w-full mb-6 sm:w-4/5 lg:w-1/2">
                <label
                  htmlFor="password"
                  className="block mb-1 font-bold text-white"
                >
                  Password
                </label>

                <div className="flex items-center w-full h-[50px] px-2 bg-white rounded-md shadow-sm">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password")}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      handlePasswordChange(e);
                    }}
                    className="w-full h-full p-2 text-black bg-white outline-none"
                  />
                  <div onClick={toggle} className="ml-2 cursor-pointer">
                    {show ? (
                      <IoEyeOffSharp size={22} className="text-gray-500" />
                    ) : (
                      <IoEyeOutline size={22} className="text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Password Strength Bar */}
                {showStrengthBar && (
                  <>
                    <div className="w-full h-2 mt-2 overflow-hidden bg-gray-300 rounded-full">
                      <div
                        className={`h-full transition-all duration-500 ${passwordStrength.width}`}
                      ></div>
                    </div>
                    <p
                      className={`mt-1 text-sm font-semibold ${passwordStrength.color}`}
                    >
                      {passwordStrength.text}
                    </p>
                  </>
                )}

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="w-full mb-6 sm:w-4/5 lg:w-1/2">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-bold text-white"
                >
                  Confirm Password
                </label>

                <div className="flex items-center w-full h-[50px] px-2 bg-white rounded-md shadow-sm">
                  <input
                    id="confirmPassword"
                    type={show ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-full p-2 text-black bg-white outline-none"
                  />
                  <div onClick={toggle} className="ml-2 cursor-pointer">
                    {show ? (
                      <IoEyeOffSharp size={22} className="text-gray-500" />
                    ) : (
                      <IoEyeOutline size={22} className="text-gray-500" />
                    )}
                  </div>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={handleResetPassword}
                className="w-full sm:w-4/5 lg:w-1/2 p-2 my-2 font-semibold text-white bg-[#e67e22] rounded-md outline-none h-[60px]"
              >
                Reset Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
