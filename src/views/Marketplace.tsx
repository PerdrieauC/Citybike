import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import {getProducts, Product} from "../hook/marketplace";
import {ProductCard} from "../components/ProductCard";

const Marketplace = () => {

    const [products, setProducts] = useState<Array<Product> | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        getProducts().then((res) => {
            setProducts(res);
        }).catch(()=> null);
        return () => {
            controller.abort();
        }
    }, [])

    return (
        <>
            <Typography variant="h1">
                Marketplace
            </Typography>
            <Box sx={{display: "flex", flexDirection: "row", gap: "15px", marginTop: "2%"}}>
                {products && products.map((product, idx) => (
                    <ProductCard key={product.product_id} product={product} />
                ))}
            </Box>
        </>
    )
};

export default Marketplace;
