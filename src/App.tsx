import React from 'react';
import {
    Routes,
    Route
} from 'react-router';

import {
    Marketplace,
    PageNotFound,
    Acceuil,
} from './views';

import {AuthenticatedLayout} from './views/AuthenticatedLayout';
import {createTheme, ThemeProvider} from "@mui/material";
import Store from "./views/Store";
import {AuthProvider} from "./hook/authContext";
import Login from "./views/Login";
import {CartProvider} from "./hook/cartContext";


const theme = createTheme({
    typography: {
        fontFamily: 'Raleway',
        body: {
            color: "#64675A"
        },
        body2: {
            color: "#64675A"
        },
        h1: {
            color: "#64675A"
        },
        h2: {
            color: "#64675A"
        },
        h3: {
            color: "#64675A"
        },
        h4: {
            color: "#64675A"
        },
        h5: {
            color: "#64675A"
        }
    },
    palette: {
        primary: {main: "#64675A"},
        secondary: {main: "#879472"}
    }
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route index element={<AuthenticatedLayout><Acceuil /></AuthenticatedLayout>} />
                        <Route path="marketplace" element={<AuthenticatedLayout><Marketplace /></AuthenticatedLayout>} />
                        <Route path="cart" element={<AuthenticatedLayout><Store /></AuthenticatedLayout>} />
                        <Route path="*" element={<PageNotFound />} />
                        <Route path="login" element={<Login />} />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};


export default App;
