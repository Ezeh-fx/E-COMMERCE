import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTPAndUpdatePassword } from "../Api/AuthApi/AuthApi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const otp = location.state?.otp;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyOTPAndUpdatePassword(otp, password);
      navigate("/login");
    } catch (err) {
      setError("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Set New Password</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border"
          required
        />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;