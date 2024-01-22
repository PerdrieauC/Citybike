import React from 'react';
import { Typography } from '@mui/material';
import logo from "/asset/images/logo.svg";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import login from "/asset/images/login.svg";
import {Link} from "react-router-dom";

const PageNotFound = () => {
    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', lg: 'flex-start'}}}>
                <img style={{height: 200, width: 200}} src={logo} alt="logo"/>
            </Box>
            <Container component="main" maxWidth="md">
                <Typography component="h1" variant="h4" sx={{textAlign: 'center', marginTop: '10vh', fontWeight: 700}}>
                    Page Introuvable !
                </Typography>
                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: '5vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Link to={"/"} style={{textDecoration: "inherit"}}>
                            <Button
                                type="button"
                                variant="contained"
                                color="secondary"
                                size="large"
                                sx={{ mt: 3, mb: 2, borderRadius: 0 }}
                            >
                                Retourner à l'acceuil
                            </Button>
                        </Link>
                    </Box>
                </Container>
            </Container>
            <img src={login} alt="logo" className="bottom-illustration" />
        </>
    );
};

export default PageNotFound;
