import ConfigService from "./config.service";
import axios from "axios";

export default class DataService {
    static async getRestaurantList() {
        const response = await axios.get(`${ConfigService.apiUrl}/restaurant`).catch(err => null);
        if(!response || !response?.data?.data)
            return [];
        return response?.data?.data;
    }
    static async getRestaurantDetails(restaurantId) {
        const response = await axios.get(`${ConfigService.apiUrl}/restaurant/${restaurantId}`).catch(err => null);
        if(!response || !response?.data?.data)
            return null;
        return response?.data?.data;
    }
    static async getCart() {
        const response = await axios.get(`${ConfigService.apiUrl}/user/cart`).catch(err => null);
        if(!response || !response?.data?.data)
            return null;
        return response?.data?.data;
    }
    static async getPastOrders() {
        const response = await axios.get(`${ConfigService.apiUrl}/user/past-orders`).catch(err => null);
        if(!response || !response?.data?.data)
            return null;
        return response?.data?.data;
    }
    static async updateCart(cart) {
        const response = await axios.post(`${ConfigService.apiUrl}/user/cart`, cart).catch(err => null);
        if(!response || !response?.data?.data)
            return null;
        return response?.data?.data;
    }
    static async checkout() {
        const response = await axios.post(`${ConfigService.apiUrl}/user/checkout`).catch(err => null);
        if(!response)
            return null;
        return response?.data?.data;
    }
    static async saveRestaurant(model) {
        const response = await axios.post(`${ConfigService.apiUrl}/restaurant`, model).catch(err => null);
        if(!response || !response?.data?.data)
            return null;
        return response?.data?.data;
    }
}