import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserOtpResend,
  UserVerifyRegistration,
} from "../../Api/AuthApi/AuthApi";
import Dotspinner from "../../components/ReUse/Dotspinner";

const Verify = () => {
  const [email] = useState(localStorage.getItem("email") || ""); // Persist email
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(
    parseInt(localStorage.getItem("timer") || "300", 10) // Persist timer
  );
  const [loading, setLoading] = useState(false);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          localStorage.setItem("timer", newTime.toString()); // ✅ Persist timer
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      localStorage.removeItem("timer"); // ✅ Clear timer when it hits 0
    }
  }, [timer]);

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
      alert("Please enter your OTP before verifying.");
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
        localStorage.removeItem("timer"); // ✅ Clear timer after success
        alert("OTP Verified. You can now log in.");
        navigate("/Login");
      })
      .catch((error) => {
        setLoading(false);
        alert(error.response?.data?.message || "OTP verification failed.");
      });
  };

  // Handle Resend OTP
  const handleResend = async () => {
    try {
      setTimer(300); // ✅ Reset timer to 5 minutes
      localStorage.setItem("timer", "300"); // ✅ Persist new timer
      await UserOtpResend(email);
      alert("📩 OTP has been resent to your email.");
    } catch (error: any) {
      console.error("❌ Error resending OTP:", error.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] w-full h-screen flex justify-center items-center flex-col mobile:h-screen tablet:h-screen  mobile:items-center mobile:justify-center ">
      <div>
        <h1 className="text-3xl font-bold text-center text-white">
          Verify Your Account
        </h1>
        <p className="mt-4 text-center text-white">
          We have sent an OTP to <b>{email}</b>. Please enter it below.
          <br /> OTP will expire in{" "}
          <b>
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </b>
        </p>
      </div>

      <form
        onSubmit={handleVerify}
        className="mt-8 w-[50%] mobile:w-full mobile:p-5 flex flex-col gap-6 items-center"
      >
        {/* OTP Input */}
        <input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength={4}
          className="w-[60%] p-2 text-4xl font-bold text-center bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mobile:w-{100%} tablet:w-[100%]"
          placeholder="____"
        />

        {/* Verify Button */}
        <button
          type="submit"
          className="p-2 mt-4 text-white bg-blue-500 rounded-md focus:outline-none w-[100%] font-bold text-[30px] flex items-center justify-center"
          disabled={otp.length !== 4 || loading}
        >
          {loading ? <div className="flex gap-4">{Dotspinner()} Verifying...</div> : "Verify OTP"}
        </button>

        {/* Resend OTP Button (Visible only when timer reaches 0) */}
        {timer === 30 && (
          <p className="text-white">
            Did not receive code?{" "}
            <span
              onClick={handleResend}
              className="text-blue-800 cursor-pointer"
            >
              Resend
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Verify;
