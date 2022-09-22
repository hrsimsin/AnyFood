import ConfigService from "./config.service";
import axios from "axios";

export default class AuthService {
    static async login(email, password) {
        const response = await axios.post(`${ConfigService.apiUrl}/auth/login`, {email,password}).catch(err => {
            return err;
        });
        if(response?.data?.success) {
            localStorage.setItem("auth-token", response.data.data.accessToken);
            localStorage.setItem("user-name", response.data.data.name);
            return true;
        }
        return false;
    }

    static async signup(name, email, password) {
        const response = await axios.post(`${ConfigService.apiUrl}/auth/signup`, {name,email,password}).catch(err => {
            return err.response;
        });
        return response.data;
    }

    static logout() {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-name");
    }

    static get authToken() {
        return localStorage.getItem("auth-token") || "";
    }
    static get userName() {
        return localStorage.getItem("user-name") || "user";
    }
}