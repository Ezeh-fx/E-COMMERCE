import axios, { AxiosError } from "axios";

interface RegisterCredentials {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}
interface VerifyCredentials {
  email: string;
  OtpCode: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const UserRegister = async (credentials: RegisterCredentials) => {
  console.log("Sending Data to API:", credentials); // ✅ Check if field names are correct
  try {
    const response = await axios.post(
      "http://localhost:2343/api/register",
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Registration Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};

export const UserVerifyRegistration = async (
  credentials: VerifyCredentials
) => {
  try {
    const response = await axios.post(
      "http://localhost:2343/api/verify",
      credentials
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Registration Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};

export const UserOtpResend = async (email: string) => {
  try {
    const response = await axios.post(
      "http://localhost:2343/api/resendotp",
      email
    );

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Registration Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};

export const UserLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(
      "http://localhost:2343/api/Login",
      credentials
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Login Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};

export const ForgetPasswordSend = async (email : string) => {
  try {
    const response = await axios.post(
      "http://localhost:2343/api/forgot-password",
      email
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "OTP Request Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};

export const verifyOTPAndUpdatePassword = async (OtpCode : number, password : string) => {
   try {
    const respone = await axios.post(
      "http://localhost:2343/api/reset-password",
      { OtpCode, password }
    )
    return respone.data;
   } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Password Update Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};