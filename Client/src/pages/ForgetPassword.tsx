import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ForgetPasswordSend } from "../Api/AuthApi/AuthApi";
import Alert from "../components/ReUse/Alert";

const ForgetPassword = () => {
  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const HandleSend = async (data: any) => {
    setLoading(true);
    ForgetPasswordSend(data)
      .then((res) => {
        console.log(res);
        if (res.data) {
          setLoading(false);
          alert("Otp code sent to gmail proceed to reset password");
          navigate("/verify-otp");
        }else {
          setLoading(false);
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <Alert message="Username must contain only ASCII characters!" />
        </div>
        }
      })
      .catch((error) => {
        setLoading(false);
        alert(error.response?.data?.message || "OTP verification failed.");
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29]">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-white text-[40px] font-bold">Forget Password</h1>

        {/* From */}
        <form onSubmit={handleSubmit(HandleSend)} className="flex flex-col items-center w-auto gap-5">
          <div>
            <input
              type="text"
              placeholder="Email"
              {...register("email")}
              className="w-[700px] p-2 my-2 bg-white font-semibold rounded-md outline-none h-[50px] mobile:w-full"
            />
            {errors.email && (
              <div className="text-xs text-red-600">
                {errors.email?.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-[70%] p-2 text-white bg-blue-500 rounded"
          >
            {loading ? "Loading..." : "Send Otp"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
