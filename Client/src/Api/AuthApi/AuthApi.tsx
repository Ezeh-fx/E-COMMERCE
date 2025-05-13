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

export const ForgetPasswordSend = async (email: string) => {
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

export const verifyOTPAndUpdatePassword = async (
  OtpCode: number,
  password: string
) => {
  try {
    const respone = await axios.post(
      "http://localhost:2343/api/reset-password",
      { OtpCode, password }
    );
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

export interface IUser {
  _id: string;
  firstname: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface IUserResponse {
  length: number;
  message: string;
  data: IUser[] | null;
}

export const getAllUsers = async (token : string): Promise<IUser[]> => {

  const response = await axios.get<IUserResponse>("http://localhost:2343/api/getAll", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data.data || []
}


export const getOneUser = async (userId: string, token: string) => {
 try {
  const response = await axios.get(
    `http://localhost:2343/api/getOne/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data; // the `user` object
} catch (error: unknown) {
  const axiosError = error as AxiosError;
  console.error(
    "OTP Request Error:",
    axiosError.response?.data || axiosError.message
  );
  return axiosError.response?.data || { message: "An error occurred" };
}
};

export const deleteUser = async (userId: string, token: string) => {
  try {
    const response = await axios.delete(
      `http://localhost:2343/api/delete/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error(
      "Delete User Error:",
      axiosError.response?.data || axiosError.message
    );
    return axiosError.response?.data || { message: "An error occurred" };
  }
};


export const promoteUserToAdmin = async (userId: string, token: string) => {
try {  return await axios.patch(
  `http://localhost:2343/api/update-to-admin/${userId}`,
  {}, // PATCH body is empty
  {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ token must be here
    },
  }
);
} catch (error: unknown) {
  const axiosError = error as AxiosError;
  console.error(
    "Delete User Error:",
    axiosError.response?.data || axiosError.message
  );
  return axiosError.response?.data || { message: "An error occurred" };
}
};