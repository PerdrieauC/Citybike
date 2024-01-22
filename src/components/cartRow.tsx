import {useEffect, useState} from "react";
import {getProduct} from "../hook/marketplace";
import {Product} from "../../../Backend/src/entities/product";
import {Box, Typography} from "@mui/material";

interface CartProps{
    product_id: number
}

export const CartRow = ({productId}: CartProps) => {
    const [product, setProduct] = useState<Product|null>(null);

    useEffect(() => {
        getProduct(productId).then((res) => {
            setProduct(res);
        }).catch(()=> null);
    }, [])

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: "10px", borderBottom: 1, borderColor: "text.secondary"}}>
            <Typography variant="body2">{product?.name}</Typography>
            <Typography variant="body2">{product?.price} €</Typography>
        </Box>
    )
}
