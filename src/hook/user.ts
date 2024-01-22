import axios from "axios";
import {config} from "../config/api_config";

export interface User{
    user_id?: string;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

export const getUser = async (user_id: string):Promise<User | null> => {
    let user = null
    try {
        const request = await axios.get(`${config.api_base_url}/user/${user_id}`);
        if(request.status === 200) user = request.data
    } catch (error) {
        console.error(error);
    }
    return user
};

export const loginUser = async (username: string, password: string):Promise<User | null> => {
    let user = null
    try {
        const request = await axios.post(`${config.api_base_url}/login`, {username, password});
        if(request.status === 200) user = request.data
    } catch (error) {
        console.error(error);
    }
    return user
};
