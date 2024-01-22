import * as React from 'react';
import SideBar from "../components/SideBar";
import Box from "@mui/material/Box";
import {Navigate, useLocation} from "react-router";
import { useState } from 'react';
import {useAuth} from "../hook/authContext";

interface Props{
    children: JSX.Element | string
}

const mediaQuery = window.matchMedia('(min-width: 1200px)');

export const AuthenticatedLayout = ({ children }: Props) => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] = useState(mediaQuery.matches);
    const handleSidebarToggle = (isOpen: boolean) => {
        setIsSidebarOpen(isOpen);
    };

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <Box sx={{display: 'flex'}}>
            <Box
                component="nav"
                sx={{
                    width: isSidebarOpen ? { xs: 150, sm: 250, md: 287 } : 50,
                    flexShrink: { sm: 0 },
                }}
            >
                <SideBar onToggle={handleSidebarToggle} location={location.pathname}/>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};
