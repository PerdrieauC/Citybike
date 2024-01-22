import type {ChangeEvent} from "react";
import React, {useRef, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import {Alert, Grid, LinearProgress, Snackbar, styled, TextField} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import type {Image, Post} from "../hook/social";
import {addEvent, addPost, addPostImage} from "../hook/social";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {SocialPost} from "./SocialPost";
import EventForm from "./EventForm";

interface EditedPost{
    titre: string
    description: string
}

interface props{
  open: boolean
  handleClose: Function
  repost: Post | null
  onPost: Function
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export const NewEvent = ({open, handleClose, repost, onPost}: props) => {
    const [formData, updateFormData] = React.useState<EditedPost>({
        titre: "",
        description: "",
    });
    const [loading, setLoading] = useState<number>(-1);
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const fileRef = useRef<Array<(HTMLInputElement | null)>>(Array(4));
    const [files, setFiles] = useState<Array<(File | null)>>([null, null, null, null]);
    const [imgUrls, setImgUrls] = useState<Array<string>>(["", "", "", ""]);
    const [showEventForm, setShowEventForm] = useState<boolean>(false);
    const [event, setEvent] = useState<{titre: string, dateEvenement: Date, adresse: string}>(
        {titre: '', dateEvenement: new Date(), adresse: ''}
    );
    const maxTitleLength = 100;
    const remainingTitleChars = maxTitleLength - formData.titre.length; // Nombre de caractères restants

    const handleSubmit = async () => {
        let newEventId: string | null = null;
        if (!formData.titre) {
            setError(true);
            return;
        }
        setLoading(0);
        if (showEventForm) {
            console.log(showEventForm);
            await addEvent(event.titre, event.dateEvenement, event.adresse).then((e) => {
                newEventId = e.id ?? null;
                setEvent({titre: '', dateEvenement: new Date(), adresse: ''});
            }).catch(() => null);

        }
        let newPost: Post;
        addPost(formData.titre, formData.description, repost?.id ?? null, newEventId)
            .then((post) => {
                newPost = post;
                post.repost = repost;
                Promise.all(files.map(async (file): Promise<Image | null> => {
                    if (file) {
                        let img = null;
                        await addPostImage(post.id, file).then((r) => {
                            img = r;
                            setLoading(loading + 1);
                        });
                        return img;
                    }
                    return null;
                })).then((images) => {
                    newPost.images = images.filter(i => i !== null) as Array<Image>;
                    onPost(newPost);
                    setFiles([null, null, null, null]);
                    setImgUrls(["", "", "", ""]);
                    setLoading(-1);
                    fileRef.current.forEach(c => {
                        if (c !== null) {
                            c.value = "";
                        }
                    });
                    setSuccess(true);
                    handleClose();
                }).catch(() => null);
            })
            .catch((err) => {
                setLoading(-1);
                console.log(err);
            });
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLFormElement>) => {
        const { value } = event.target;
        if(event.target.name === "titre") {
            if(value !== '' && (value as string).length <= maxTitleLength) {
                updateFormData({
                    ...formData,
                    [event.target.name]: event.target.value as string,
                });
            }
        } else {
            updateFormData({
                ...formData,
                [event.target.name]: event.target.value as string,
            });
        }
    };

    const handleUploadClick = (index: number) => {
        fileRef.current[index]?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
        e.target.value = "";
        const filesCopy = [...files];
        filesCopy[index] = file;
        setFiles(filesCopy);
        const urlsCopy = [...imgUrls];
        urlsCopy[index] = URL.createObjectURL(file);
        setImgUrls(urlsCopy);
    };

    const handleShowForm = () => {
        setShowEventForm(!showEventForm);
    };

    return (
        <>
            <BootstrapDialog
                onClose={()=>{
                    setError(false);
                    handleClose();
                }}
                open={open}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle sx={{ m: 0, p: 2}}>
                    {repost!==null?"Respoter la publication":"Nouvelle publication"}
                    <IconButton
                        aria-label="close"
                        onClick={()=>{handleClose();}}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box component="form" onChange={handleFormChange}>
                        <TextField
                            name="titre"
                            margin="normal"
                            required
                            fullWidth
                            label="Titre"
                            error={error}
                            helperText={error ? "Titre obligatoire" : <span style={{ color: remainingTitleChars < 10 ? 'red' : 'inherit' }}>
                                {remainingTitleChars} caractères restants
                            </span>
                            }
                            inputProps={{
                                maxLength: maxTitleLength,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                            autoFocus
                        />
                        <TextField
                            name="description"
                            margin="normal"
                            multiline
                            rows={4}
                            fullWidth
                            label="Description"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="standard"
                            sx={{mb: 3}}
                        />
                        <EventForm e={event} setEvent={setEvent} showForm={showEventForm} setShowForm={handleShowForm}></EventForm>
                        {repost===null?<Grid container rowSpacing={{xs: 1, sm: 2, md: 3}} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            {imgUrls.map((img, i) => <Grid item xs={6} key={`img${i}`}>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    outline: "dashed #00000036 0.15em",
                                    height: "10rem"
                                }} onClick={() => {
                                    handleUploadClick(i);
                                }}>
                                    {img ? <img src={img} style={{height: "100%", width: "100%", objectFit: 'cover'}}
                                        alt='uploaded'/> : <AddPhotoAlternateIcon/>}
                                    <input
                                        name="image"
                                        onChange={(e) => {
                                            handleFileChange(e, i);
                                        }}
                                        style={{display: "none"}}
                                        type="file"
                                        ref={e => fileRef.current[i] = e}
                                    />
                                </Box>
                            </Grid>)}
                        </Grid>:<SocialPost post={repost} embedded disabled/>}
                        {loading!==-1&&<LinearProgress variant={loading?"determinate":"indeterminate"} value={loading*25} sx={{mt: 2}}/>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{handleSubmit().catch(()=>null);}}>
                    Publier
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <Snackbar open={success} autoHideDuration={3000} onClose={()=>{setSuccess(false);}}>
                <Alert onClose={()=>{setSuccess(false);}} severity="success" sx={{ width: '100%' }}>
                    La nouvelle publication a été postée !
                </Alert>
            </Snackbar>
        </>
    );
};
