import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useCart} from "../hook/cartContext";
import {CartRow} from "../components/cartRow";

const Store = () => {
    const { carts, price, clearCart } = useCart();

    const buy = () => {
        clearCart();
    }

    return (
        <>
            <Typography sx={{marginBottom: '30px'}} variant="h1">
                Cart
            </Typography>
            {carts.length === 0 &&
                <Typography variant="h3">
                    Your cart is empty !
                </Typography>
            }
            {carts.length >0 &&
                <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                    {carts && carts.map((cart) => (
                        <CartRow key={cart.product_id} productId={cart.product_id}/>
                    ))}
                    <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px"}}>
                        <Typography sx={{fontWeight: "bold"}} variant="body"> Total Price: {price} €</Typography>
                        <Button variant="outlined" onClick={buy}>Buy</Button>
                    </Box>
                </Box>
            }

        </>
    )
};

export default Store;
