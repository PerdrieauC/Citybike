import type {SyntheticEvent} from 'react';
import React, { useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Box, CircularProgress} from "@mui/material";
import type {User} from "../hook/user";
import {useNavigate, useParams} from "react-router";
import defaultPfp from "/asset/images/pfp.png";

export const UserSearch = () => {
    const loading = usersBase?.length === 0;
    const navigate = useNavigate();
    const { userId } = useParams();
    const [value, setValue] = useState<User|string>("");

    useEffect(()=>{
        if(userId !== undefined && usersBase){
            setValue(usersBase.find(user=>user.id===userId) ?? "");
        }else{
            setValue("");
        }
    }, [userId, usersBase]);

    return (
        <Autocomplete
            disablePortal
            freeSolo
            id="combo-box-demo"
            options={usersBase ?? []}
            fullWidth
            loading={loading}
            value={value}
            getOptionLabel={(option) => (typeof option === "string" ? "" : option.nom_utilisateur ?? "")}
            onChange={(event: SyntheticEvent<Element, Event>, value: User | string | null)=>{
                if(value !== null && typeof value === "object" && "id" in value) {
                    navigate(`/user/${value.id ?? ''}`);
                }
            }}
            renderInput={(params) =>
                <TextField {...params} fullWidth id="outlined-basic"
                    label="Rechercher utilisateur"
                    variant="outlined" size="small"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />}
            renderOption={(props, user) => (
                <Box component="li" {...props}>
                    <img alt={user.nom_utilisateur} src={user.photo} onError={({currentTarget})=>currentTarget.src=defaultPfp} style={{width: "3rem", marginRight: "1rem", borderRadius: '50%',aspectRatio:'1/1', objectFit: 'cover'}}/>
                    {user.nom_utilisateur}
                </Box>
            )}
        />
    );
};
