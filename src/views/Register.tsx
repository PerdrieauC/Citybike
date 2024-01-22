import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import logo from "/asset/images/logo.svg";
import CountrySelect from "../components/CountrySelect";
import {CircularProgress, Grid, MenuItem} from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {useState} from "react";
import {Link} from "react-router-dom";
import {Navigate} from "react-router";
import {register} from "../hook/auth";


interface formDataType{
    lastname: string,
    firstname: string,
    username: string,
    country: {
        code: string,
        label: string,
        phone: string
    } | null,
    number: string,
    sex: string,
    email: string,
    password: string,
    password2: string,
}

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const [birthday, setBirthday] = useState<dayjs.Dayjs | null>(
        dayjs('2014-08-18T21:11:54')
    );
    const [formData, updateFormData] = React.useState<formDataType>({
        lastname: '',
        firstname: '',
        username: '',
        country: null,
        number: '',
        sex: '',
        email: '',
        password: '',
        password2: '',
    });

    if(isLoggedIn()){
        return <Navigate to="/" />;
    }

    const handleFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value as string
        });
    };

    const handleSelecthange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(formData.password !== formData.password2){
            setPasswordError(true);
            return;
        }
        setLoading(true);
        register(
            formData.firstname,
            formData.lastname,
            formData.sex,
            formData.username,
            birthday ? birthday.toISOString(): '',
            formData.email,
            formData.password,
            formData.number,
            formData.country ? formData.country.code : '',
            ""
        ).then((token)=>{
            onRegister(token);
        }).catch(()=>{
            setLoading(false);
            setRegisterError(true);
        });
    };

    return (
        <>
            <img src={logo} alt="logo"/>
            <Container component="main" maxWidth="md">
                <Typography component="h1" variant="h4" sx={{textAlign: 'center', marginTop: '10vh', fontWeight: 700}}>
                Bienvenue sur Neighbook, le réseau social de proximité !
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
                                name="lastname"
                                margin="normal"
                                required
                                fullWidth
                                label="Nom"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                autoComplete="family-name"
                            />
                            <TextField
                                name="firstname"
                                margin="normal"
                                required
                                fullWidth
                                label="Prenom"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                autoComplete="given-name"
                            />
                            <TextField
                                name="username"
                                margin="normal"
                                required
                                fullWidth
                                label="Nom d'utilisateur"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                autoComplete="username"
                                error={registerError}
                                helperText={registerError&&"nom d'utilisateur dejà utilisé"}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <TextField
                                        name="sex"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Sexe"
                                        select
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        onChange={handleSelecthange}
                                        value={formData.sex}
                                        autoComplete="sex"
                                    >
                                        <MenuItem value="M">M</MenuItem>
                                        <MenuItem value="F">F</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={9}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DesktopDatePicker
                                            label="Anniversaire"
                                            inputFormat="DD/MM/YYYY"
                                            value={birthday}
                                            onChange={setBirthday}
                                            renderInput={(params) => <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="standard"
                                                {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CountrySelect onChange={handleSelecthange} value={formData.country} name="country"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="number"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Téléphone"
                                        type="tel"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        autoComplete="tel"
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                name="email"
                                margin="normal"
                                required
                                fullWidth
                                label="Email"
                                type="email"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                autoComplete="email"
                                error={registerError}
                                helperText={registerError&&"email dejà utilisé"}
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        name="password"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Mot de Passe"
                                        type="password"
                                        error={passwordError}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        autoComplete="new-password"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        name="password2"
                                        margin="normal"
                                        required
                                        error={passwordError}
                                        fullWidth
                                        label="Verification du mot de Passe"
                                        type="password"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        variant="standard"
                                        autoComplete="new-password"
                                        helperText={passwordError&&"mot de passes différents."}
                                    />
                                </Grid>
                            </Grid>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <Link to="/login" style={{color: "#64675A"}}>Se connecter</Link>
                                <Box sx={{ position: 'relative' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        disabled={loading}
                                        sx={{ mt: 3, mb: 2, borderRadius: 0 }}
                                    >
                                        Inscription
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
        </>
    );
}
