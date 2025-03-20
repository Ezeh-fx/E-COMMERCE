import axios from "axios"



interface RegisterData {
    Firstname : string;
    Lastname: string;
    Username: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    data: any;
}

export const AuthApiRegister = async (data: RegisterData): Promise<RegisterResponse | Error> => {
    try {
        const response: RegisterResponse = await axios.post("http://localhost:2343/api/register", data).then((res) => {
            return res.data;
        }).catch((err) => {
            return err;
        });
        return response;
    } catch (error) {
        return error as Error;
    }
}