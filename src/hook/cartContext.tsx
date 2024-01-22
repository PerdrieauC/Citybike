import React, {useContext, useState} from "react";
import {Product} from "./marketplace";
import {Cart} from "./cart";

const cartContext = React.createContext(null);

export const CartProvider = ({ children }) => {
    const [carts, setCarts] = useState<Array<Cart>>([]);
    const [price, setPrice] = useState<number>(0)

    const addProduct = (product: Product) => {
        let cartsArray = carts;
        cartsArray.push({quantity: 1, product_id: product.product_id})
        setCarts(cartsArray)
        setPrice(price + product.price)
    }

    const removeProduct = (product: Product) => {
        setPrice(price - product.price)
        setCarts(carts.filter((cart) => cart.product_id != product.product_id))
    }

    const clearCart = () => {
        setCarts([])
        setPrice(0)
    }

    return (
        <cartContext.Provider value={{ carts, price, addProduct, removeProduct, clearCart }}>
            {children}
        </cartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(cartContext);
};
