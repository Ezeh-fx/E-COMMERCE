import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserOtpResend,
  UserVerifyRegistration,
} from "../../Api/AuthApi/AuthApi";
import Dotspinner from "../../components/ReUse/Dotspinner";
import img from "../../assets/signUp.jpg";

const Verify = () => {
  const [email] = useState(localStorage.getItem("email") || ""); // Persist email
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");


  // Handle OTP input (4-digit only)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 4) {
      setOtp(value);
    }
  };

  // Handle OTP verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
       setServerError("Please enter your OTP before verifying.");
      return;
    }

    setLoading(true);

    const requestData = {
      email: email,
      OtpCode: Number(otp),
    };

    UserVerifyRegistration(requestData)
      .then((response) => {
        console.log(response);
        setLoading(false);
        localStorage.removeItem("email");
         setServerSuccess("OTP verified successfully! You can now log in.");
        navigate("/Login");
      })
      .catch((error) => {
         setLoading(false);
        if (error.response?.data?.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Invalid OTP. Please try again or request a new code.");
        }
      });
  };

  // Handle Resend OTP
  const handleResend = async () => {
    try {
      localStorage.setItem("timer", "300"); // ✅ Persist new timer
      await UserOtpResend(email);
      alert("📩 OTP has been resent to your email.");
    } catch (error: any) {
      console.error("❌ Error resending OTP:", error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] w-full h-screen flex mobile:h-screen tablet:h-screen  mobile:items-center mobile:justify-center ">
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

      {/* From */}
      <div className="flex flex-col items-center justify-center w-1/2 h-full">
      <div>
        <h1 className="text-3xl font-bold text-center text-white">
          Verify Your Account
        </h1>
        <p className="mt-4 text-center text-white">
          We have sent an OTP to <b>{email}</b>. Please enter it below.
          <br /> OTP will expire in 5 min
        </p>
      </div>

         {/* Error Message */}
          {serverError && (
            <div className="w-full p-3 mt-4 text-white transition-all duration-300 bg-red-500 rounded-lg shadow-md">
              <p className="font-medium text-center">{serverError}</p>
            </div>
          )}

          {/* Success Message */}
          {serverSuccess && (
            <div className="w-full p-3 mt-4 text-white transition-all duration-300 bg-green-500 rounded-lg shadow-md">
              <p className="font-medium text-center">{serverSuccess}</p>
            </div>
          )}

      <form
        onSubmit={handleVerify}
        className="mt-8 w-[100%] mobile:w-full mobile:p-5 flex flex-col gap-6 items-center"
      >
        {/* OTP Input */}
           <div className="flex flex-col items-center w-full">
              <input
                type="text"
                value={otp}
                onChange={handleChange}
                maxLength={4}
                className="w-[70%] p-2 text-center text-2xl tracking-widest bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e67e22] h-[60px]"
                placeholder="0000"
              />
              <p className="mt-2 text-sm text-gray-300">Enter 4-digit code</p>
            </div>

        {/* Verify Button */}
        <button
          type="submit"
         className={`w-[70%] p-2 font-semibold text-white ${
                otp.length !== 4 || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#e67e22] hover:bg-[#d35400]"
              } rounded-md outline-none h-[60px] transition-colors duration-300`}
              disabled={otp.length !== 4 || loading}
        >
          {loading ? <div className="flex items-center justify-center gap-4 text-[17px]">{Dotspinner()} Verifying...</div> : "Verify OTP"}
        </button>

        {/* Resend OTP Button */}
        <p className="text-white">
            Did not receive code?{" "}
            <span
              onClick={handleResend}
              className="text-[#e67e22] cursor-pointer hover:underline"
            >
              Resend
            </span>
          </p>
      </form>
      </div>
    </div>
  );
};

export default Verify;
