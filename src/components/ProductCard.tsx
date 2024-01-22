import {Product} from "../hook/marketplace";
import {useEffect, useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";
import {red} from "@mui/material/colors";
import {useCart} from "../hook/cartContext";

interface ProductProps{
    product: Product
}

export const ProductCard = ({product}: ProductProps) => {
    const [localProduct, setLocalProduct] = useState<Product | null>(null);
    const { carts, addProduct, removeProduct } = useCart();

    const remove = () => {
        removeProduct(product)
    }

    const add = () => {
        addProduct(product)
    }

    useEffect(()=>{
        if(product) {
            setLocalProduct(product);
        }
    }, [product]);

    return (
        <Card sx={{width: '300px', height: '420px'}}>
            <CardHeader title={localProduct?.name || product.name}/>
            <CardMedia component="img" height="230" image={localProduct?.img || product.img}/>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {localProduct?.description || product.description}
                </Typography>
            </CardContent>
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "10px"}}>
                {carts.find((cart) => cart.product_id === product.product_id) &&
                    <Button variant="contained" disabled={product.quantity_available===0} onClick={remove}>Remove item</Button>
                }{!carts.find((cart) => cart.product_id === product.product_id) &&
                    <Button variant="contained" disabled={product.quantity_available===0} onClick={add}>Add item</Button>
                }
                {product.quantity_available>0 &&
                <Typography variant="body1" color="text.primary">
                    {product.price} €
                </Typography>
                }
                {product.quantity_available===0 &&
                <Typography variant="body1" fontWeight="bold" color={red[600]}>
                    Sold Out!
                </Typography>
                }
            </Box>
        </Card>
    )
}
