import {axiosInstance} from "@/lib/axios";

export class AuthService {

    constructor(baseUrl: string) {
        axiosInstance.defaults.baseURL = baseUrl;
        axiosInstance.defaults.timeout = 3000;
    }

    login = async (username: string, password: string) => {
        await axiosInstance.post('/login', {
            username: username,
            password: password
        }).then((response) => {
           //set token in cookie using

        });
    }
}