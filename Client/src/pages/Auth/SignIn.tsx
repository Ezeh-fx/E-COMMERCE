import img from "../../assets/signUp.jpg";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserLogin } from "../../Api/AuthApi/AuthApi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setUser } from "../../global/useReducer";
import Dotspinner from "../../components/ReUse/Dotspinner";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [show, setShow] = useState(true);
  const toggle = () => {
    setShow((prevShow) => !prevShow);
  };
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required(),
  });

  // Form Hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    UserLogin(data).then((response) => {
      console.log(response);
      if (response.data) {
        setLoading(false);
        alert("Login successful. Welcome toyour easy online Shopping.")
        if (response.data?.token) {
          dispatch(setUser({ token: response.data.token }));
          console.log(jwtDecode(response.data.token));
          // Decode token manually (optional)
          const decoded: any = jwtDecode(response.data.token);
          console.log("User Role:", decoded.role);
  
          // Redirect based on role
          if (decoded.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/home");
          }
        }
      } else {
        setLoading(false);
        Swal.fire({
          title: "Email Dose Not Exists Register",
          width: 600,
          padding: "3em",
          color: "#716add",
          background: "#fff url(/images/trees.png)",
          backdrop: `
                    rgba(0,0,123,0.4)
                    url("/images/nyan-cat.gif")
                    left top
                    no-repeat
                  `,
        }).then(() => {
          navigate("/");
        });
      }
    })
    .catch((error) => {
      setLoading(false);
     console.log(error.data)
    });
  };

  return (
    <div className="w-full h-screen flex bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mobile:items-center mobile:justify-center mobile:h-auto">
      {/* Image */}
      <div className="w-1/2 bg-white mobile:hidden tablet:hidden ">
        <img
          src={img}
          alt="signup"
          className="object-cover object-left w-full h-full"
        />
      </div>

      {/* Form */}
      <div className="flex flex-col items-center justify-center w-1/2 h-full mobile:w-full mobile:h-screen tablet:w-full">
        {/* Icon */}
        <CgProfile color="white" size={70} />
        <form
          className="flex flex-col items-start justify-center w-auto h-auto gap-4 mobile:w-full mobile:h-auto mobile:px-4 mobile:gap-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Input Email */}
          <div className="flex flex-col w-[550px] mobile:w-full">
            <label className="font-bold text-white">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Email"
              className="w-full p-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px]"
            />

            {errors.email && (
              <div className="text-xs text-red-600">
                {errors.email?.message}
              </div>
            )}
          </div>

          {/* Password Container */}
          <div className="w-[100%]">
            <label className="font-bold text-white">Password</label>
            {/* Password */}
            <div className="w-[100%] px-2 my-2 bg-white font-semibold rounded-md outline-none h-[60px] flex items-center justify-between">
              {/* Password */}
              <input
                type={!show ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
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

            {/* Error */}
            {errors.password && (
              <div className="text-xs text-red-600">
                {errors.password?.message}
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex  items-center justify-between w-[100%] mobile:flex-col-reverse mobile:gap-4 mobile:w-full mobile:mt-5">
            {/* Login */}
            <p className="text-white">
              Don't have an account?{" "}
              <Link to="/">
                <span className="text-[#302b63] cursor-pointer hover:underline font-bold">
                  Sign Up
                </span>
              </Link>
            </p>
            {/* Sign Up */}
            <button className="relative px-6 py-2 text-white text-lg font-semibold bg-[#24243e] rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] transition duration-300 w-[200px] h-[60px]">
              {loading ? <div>{Dotspinner()} Loading...</div> : "Login"}
            </button>
          </div>

          {/* Forget Password */}
          <div className="flex justify-center w-full mt-5">
            <p className="font-bold text-white cursor-pointer hover:underline w-fit">
              Forget Password?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
