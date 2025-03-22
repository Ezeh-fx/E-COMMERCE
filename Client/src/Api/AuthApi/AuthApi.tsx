import axios, { AxiosError } from "axios";

interface RegisterCredentials {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export const UserRegister = async (credentials: RegisterCredentials) => {
  console.log("Sending Data to API:", credentials); // ✅ Check if field names are correct
  try {
    const response = await axios.post("http://localhost:2343/api/register", credentials);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("Registration Error:", axiosError.response?.data || axiosError.message);
    return axiosError.response?.data || { message: "An error occurred" };
  }
};