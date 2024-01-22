import React from 'react';
import { Typography } from '@mui/material';
import Home_Picture from "/asset/images/Home_Picture.svg";
import '../css/Home.css';

const Acceuil = () => (
    <>
        <Typography variant="h1">
            City Bike
        </Typography>
        <Typography variant="h3">
            Buy all your equipments !
        </Typography>
        <img src={Home_Picture} alt="Home_Picture" className="home-illustration" />
    </>
);

export default Acceuil;
