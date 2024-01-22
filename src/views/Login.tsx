import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import logo from "/asset/images/logo.svg";
import loginIcon from "/asset/images/login.svg";
import '../css/Login.css';
import {Link, useNavigate } from "react-router-dom";
import {useState} from "react";
import {useAuth} from "../hook/authContext";
import {Navigate} from "react-router";
import {CircularProgress} from "@mui/material";
import {loginUser} from "../hook/user";


export default function Login() {
    const [authError, setAuthError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, updateFormData] = React.useState({
        username: '',
        password: ''
    });
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate ();

    if(isLoggedIn === true){
        return <Navigate to="/" />;
    }

    const handleFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value as string
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const controller = new AbortController();
        setLoading(true);
        loginUser(formData.username, formData.password).then((res) => {
            if(res) login(res);
            setLoading(false);
            navigate("/");
        }).catch(() => {
            setAuthError(true);
            setLoading(false);
        });
    };

    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: {xs: 'center', lg: 'flex-start'}}}>
                <img style={{height: 200, width: 200}} src={logo} alt="logo"/>
            </Box>
            <Container component="main" maxWidth="md">
                <Typography component="h1" variant="h4" sx={{textAlign: 'center', marginTop: '10vh', fontWeight: 700}}>
                    Welcome on City Bike !
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
                        <Box component="form" onSubmit={handleSubmit} onChange={handleFormChange} sx={{ mt: 1 }}>
                            <TextField
                                name="username"
                                margin="normal"
                                required
                                fullWidth
                                label="Username"
                                type="text"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                autoFocus
                            />
                            <TextField
                                name="password"
                                margin="normal"
                                error={authError}
                                helperText={authError&&"The username and the password are not corresponding"}
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                autoComplete="email"
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Link to="/register" style={{color: "#64675A"}}>Register</Link>
                                <Box sx={{ position: 'relative' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        disabled={loading}
                                        sx={{ mt: 3, mb: 2, borderRadius: 0 }}
                                    >
                                        Connexion
                                    </Button>
                                    {loading && (
                                        <CircularProgress
                                            size="30px"
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-15px',
                                            }}
                                        />
                                    )}
                                </Box>

                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Container>
            <img src={loginIcon} alt="logo" className="bottom-illustration" />
        </>
    );
}
