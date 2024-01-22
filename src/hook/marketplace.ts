import axios, {GenericAbortSignal} from "axios";
import {config} from "../config/api_config";

export interface Product {
    product_id: string,
    seller_id: string,
    name: string,
    description: string,
    price: number,
    quantity_available: number,
    category: string,
    img: string
}

export const getProducts = async ():Promise<Array<Product> | null> => {
    let products = null
    try {
        const request = await axios.get(`${config.api_base_url}/products`);
        if(request.status === 200) products = request.data
    } catch (error) {
        console.error(error);
    }
    return products
};

export const getProduct = async (product_id: number):Promise<Product | null> => {
    let product = null
    try {
        const request = await axios.get(`${config.api_base_url}/product/${product_id}`);
        if(request.status === 200) product = request.data
    } catch (error) {
        console.error(error);
    }
    return product
};
