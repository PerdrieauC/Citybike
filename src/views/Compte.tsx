import type {ChangeEvent} from 'react';
import React, { useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, CircularProgress, Skeleton, TextField, Typography} from '@mui/material';
import type {User} from "../hook/user";
import {getUser, updateUser} from "../hook/user";
import {CompteLoading} from "../components/Loading";
import '../css/Compte.css';
import {deleteFile, renewFileUrl, uploadFile} from "../hook/file";
import defaultPfp from "/asset/images/pfp.png";

const Compte = () => {
    const [userInfo, setUserInfo] = useState<User|null>(null);
    const [edited, setEdited] = useState<boolean>(false);
    const [alert, setAlert] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>("loading");

    const clearForm = () => {
        setEdited(false);
        loadUserInfo();
    };

    const loadUserInfo =  useCallback(() => {
        const controller = new AbortController();
        if(currentUser) {
            getUser(currentUser.id, controller.signal).then(res => {
                setUserInfo(res);
                if(res?.photo !== undefined) {
                    if(res.photo === "null") {
                        setImgUrl(null);
                    }else{
                        setImgUrl(res.photo);
                    }
                }
            }).catch(()=>{
                controller.abort();
            });
        }
        return () => {
            controller.abort();
        };
    },[currentUser]);

    useEffect(()=>{
        return loadUserInfo();
    }, [currentUser, loadUserInfo]);

    const handleFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        setEdited(true);
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value as string
        });
    };

    const updateUserInfo = async (): Promise<boolean> => {
        if(userInfo) {
            const userData = userInfo;
            if(imgUrl === null && userInfo.photo !== undefined && userInfo.photo !== "null"){
                await deleteFile(userInfo.photo);
                userData.photo = "null";
            }
            if (file) {
                let filename = currentUser?.id ?? '';
                filename += "_pfp.";
                filename += file.name.split('.').pop();
                userData.photo = await uploadFile(filename, file);
                setUserInfo(userData);
            }
            const result = await updateUser(userData);
            return result;
        }
        return false;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setAlert("");
        updateUserInfo().then((result)=>{
            setLoading(false);
            setEdited(false);
            setAlert(result?"success":"error");
        }).catch(()=>{
            setAlert("error");
            setLoading(false);
        });
    };

    const handleUploadClick = () => {
        fileRef.current?.click();
    };

    const handleImgError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
        renewFileUrl(error.currentTarget.src).then(fileUrl=>{
            setImgUrl(fileUrl);
            if(userInfo) {
                const userData = userInfo;
                userInfo.photo = fileUrl;
                updateUser(userData).then(()=>null).catch(()=>null);
            }
        }).catch(()=> {
            setImgUrl(null);
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        e.target.value = "";
        setFile(file);
        setImgUrl(URL.createObjectURL(file));
        setEdited(true);
    };

    const handleDelete = () => {
        setEdited(true);
        setImgUrl(null);
    };

    if(!userInfo){
        return <CompteLoading />;
    }
    return (
        <Box ml={5}>
            <Typography variant="h5">
                <b>Mon compte</b>
                <br/>
                Gérer les paramètres de votre profil.
            </Typography>
            <Box mt={5} ml={2} sx={{ display: 'flex', alignItems: 'center' }}>
                {imgUrl === "loading"?
                    <Skeleton variant="circular" sx={{width: "20vh", height: "20vh", minHeight: "200px", minWidth: "200px", aspectRatio: "1/1"}}/>
                    :
                    <img src={imgUrl ?? defaultPfp}
                        className="pfp"
                        style={{aspectRatio:'1/1', objectFit: 'cover'}}
                        alt="profile"
                        onError={handleImgError}
                    />}
                <input
                    style={{ display: 'none' }}
                    ref={fileRef}
                    type="file"
                    onChange={handleFileChange}
                />
                <Box ml={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button type="button"
                        variant="contained"
                        color="secondary"
                        size="large" sx={{borderRadius: 0, mb: 2, justifyContent: 'left' }}
                        onClick={handleUploadClick}
                    >
                        <b>Changer la photo</b>
                    </Button>
                    <Button type="button"
                        variant="contained"
                        color="error"
                        size="large" sx={{borderRadius: 0, justifyContent: 'left', backgroundColor: '#FFDCDC', color: "#FF5656" }}
                        onClick={handleDelete}
                    >
                        <b>Supprimer</b>
                    </Button>
                </Box>
            </Box>
            <Box component="form" onChange={handleFormChange} onSubmit={handleSubmit} sx={{ mt: 10, maxWidth: 'md' }}>
                <TextField label="Nom" variant="outlined" value={userInfo.nom} name="nom" fullWidth sx={{mb:3}}/>
                <TextField label="Prenom" variant="outlined" value={userInfo.prenom} name="prenom" fullWidth sx={{mb:3}}/>
                <TextField label="Téléphone" variant="outlined" value={userInfo.telephone}  name="telephone" fullWidth sx={{mb:3}}/>
                <TextField label="Adresse Email" variant="outlined" value={userInfo.email} disabled fullWidth sx={{mb:3}}/>
                <Box sx={{ display: 'flex'}}>
                    <Box sx={{ position: 'relative' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            size="large" sx={{ mr: 2}}
                            disabled={!edited || loading}
                        >
                            <b>Valider</b>
                        </Button>
                        {loading && (
                            <CircularProgress
                                size="30px"
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-15px',
                                    marginLeft: '-20px',
                                }}
                            />
                        )}
                    </Box>
                    {edited&&<Button type="button"
                        variant="text"
                        size="large"
                        onClick={clearForm}
                    >
                        <b>annuler</b>
                    </Button>}
                </Box>
            </Box>
            {alert==="error"&&<Alert severity="error" sx={{mt: 2}}>Erreur</Alert>}
            {alert==="success"&&<Alert severity="success" sx={{mt: 2}}>Les champs ont été mis à jour avec succès</Alert>}
        </Box>
    );
};

export default Compte;
