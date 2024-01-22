import axios from "axios";
import {config} from "../config/api_config";

export interface Cart {
    cart_id?: string;
    user_id?: string;
    product_id: string;
    quantity: number;
}

export const getCarts = async (user_id: string):Promise<Array<Cart> | null> => {
    let carts = null
    try {
        const request = await axios.get(`${config.api_base_url}/carts/${user_id}`);
        if(request.status === 200) carts = request.data
    } catch (error) {
        console.error(error);
    }
    return carts
};

export const postCart = async ({user_id, product_id, quantity}): Promise<Cart | null> => {
    let cart = null
    try {
        const request = await axios.post(`${config.api_base_url}/carts/create`, {user_id, product_id, quantity});
        if(request.status === 200) cart = request.data
    } catch (error) {
        console.error(error)
    }
    return cart
}

export const deleteCart = async (cart_id: string) => {
    try {
        const request = await axios.get(`${config.api_base_url}/carts/delete/${cart_id}`);
        if (request.status === 200) console.debug('cart supprimé')
    } catch (error) {
        console.error(error);
    }
}

export const updateCart = async (cart: Cart) => {
    let updatedCart: Cart | null = null
    try {
        const request = await axios.post(`${config.api_base_url}/carts/update/${cart.cart_id}`, cart);
        if (request.status === 200) updatedCart = request.data;
    } catch (error) {
        console.error(error)
    }
    return updatedCart
}
