import img from "../assets/signUp.jpg";
import { useState } from "react";
import axios from "axios";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
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
    // handleSubmit,
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
        navigate("/Login")
      } else {
        console.log("❌ Error occurred while changing password.");
      }
    } catch (error: any) {
      console.error("❌ Error:", error.message);
    }
  };

  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mobile:items-center mobile:justify-center mobile:h-auto">
      <div className="relative w-1/2 bg-white mobile:hidden tablet:hidden">
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
        <img
          src={img}
          alt="signup"
          className="object-cover object-left w-full h-full"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-1/2 h-full mobile:w-full mobile:h-screen tablet:w-full">
        <form
          className="flex flex-col items-center justify-center w-auto gap-4 text-white mobile:px-4"
          onSubmit={(e) => {
            e.preventDefault();
            step === "otp" ? handleVerifyOtp() : handleResetPassword();
          }}
        >
          <h1 className="font-bold text-[40px]">Reset Password</h1>

          {step === "otp" ? (
            <>
              <label className="text-[20px] font-semibold text-center">
                Enter the 4-digit OTP sent to your email
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength={4}
                placeholder="____"
                className="w-[300px] text-center bg-white h-[50px] rounded-md text-black text-[20px]"
              />
              <button
                type="submit"
                className="px-6 py-2 mt-2 text-white bg-blue-500 rounded"
              >
                Verify OTP
              </button>
            </>
          ) : (
            <>
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
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      handlePasswordChange(e);
                    }}
                    className="h-full p-3 focus:outline-none w-[100%] bg-white text-black"
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
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-full p-3 focus:outline-none w-[100%] text-black bg-white"
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
              <button
                type="submit"
                className="px-6 py-2 mt-2 text-white bg-green-500 rounded"
              >
                Reset Password
              </button>
            </>
          )}

          {/* {message && <p className="mt-4 text-yellow-300">{message}</p>} */}
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
