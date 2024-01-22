import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVerySatisfiedOutlinedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {Avatar, Fade, IconButton, ImageList, ImageListItem, Modal} from "@mui/material";
import '../css/SocialPost.css';
import type {Post, NombreReactions} from "../hook/social";
import {useNavigate} from "react-router";
import {useState} from "react";
import {updateReaction} from "../hook/social";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {relativeDateComment} from "../utils/Date";
import {UserAvatar} from "./UserAvatar";
import defaultPfp from "/asset/images/pfp.png";
import {EventItem} from "./EventItem";

interface props{
    post: Post
    sx?: {}
    onPostRemove?: Function
    onRepost?: Function
    fullSize?: boolean
    embedded?: boolean
    disabled?: boolean
}

export const SocialPost = ({post, sx={}, fullSize=false, embedded=false, onPostRemove=()=>null, onRepost=()=>null, disabled=false}: props) => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openedDesc, setOpenedDesc] = useState<boolean>(false);
    const maxDescLength = 255;
    const [bigDesc] = useState<boolean>(post.description.length > maxDescLength ? true : false);
    const [imgModal, setImgModal] = useState<string | null>(null);
    const [nombreReactions, setNombreReactions] = React.useState<NombreReactions>(post.nombreReactions);
    const [reactionUtilisateur, setReactionUtilisateur] = React.useState<Number|null>(post.reactionUtilisateur);
    const author = usersBase?.find(user=>user.id === post.idUtilisateur);

    const setUserReaction = (newReaction: number) => {
        const remove = newReaction === reactionUtilisateur;
        const newReactions = nombreReactions;
        Object.keys(nombreReactions).forEach((reaction, index) => {
            if (index + 1 === newReaction) {
                newReactions[reaction as keyof NombreReactions] += remove ? -1 : 1;
            } else if (index + 1 === reactionUtilisateur) {
                newReactions[reaction as keyof NombreReactions] += -1;
            }
        });
        setReactionUtilisateur(remove ? null : newReaction);
        setNombreReactions(newReactions);
        updateReaction(remove ? null : newReaction, post.id).then(() => null).catch(()=>null);
    };

    const toggleDescription = () => {
        setOpenedDesc(!openedDesc);
    };

    const smartTruncate = () => {
        if(openedDesc) {
            return post.description;
        }
        if (post.description.length > maxDescLength) {
            const lastSpaceIndex = post.description.lastIndexOf(' ', maxDescLength);
            if (lastSpaceIndex !== -1) {
                return post.description.substring(0, lastSpaceIndex) + ' ...';
            }
            return post.description.substring(0, maxDescLength) + ' ...';
        }
        return '';
    };

    return (
        <Card onClick={(event) => {
            event.stopPropagation();
            if(!disabled){
                navigate(`/post/${post.id}`);
            }
        }}
        sx={{boxShadow: embedded?'2':'10', borderRadius: '10px', width: '100%', '&:hover': {cursor: disabled?"inherit":"pointer"},...sx}}>
            <CardHeader
                avatar={author?<UserAvatar user={author}/>:<Avatar src={defaultPfp}/>}
                action={!embedded&&
                    <>
                        {fullSize&&<IconButton onClick={(event) => {
                            event.stopPropagation();
                            navigate("/social");
                        }}>
                            <ArrowBackIosNewIcon/>
                        </IconButton>}
                        {author?.id===currentUser?.id&&<IconButton aria-label="delete"
                            onClick={(event)=>{
                                event.stopPropagation();
                                onPostRemove(post);
                            }}>
                            <DeleteOutlineIcon color="error"/>
                        </IconButton>}
                        <IconButton aria-label="share" onClick={(event)=>{
                            event.stopPropagation();
                            onRepost(post);
                        }}>
                            <ShareIcon />
                        </IconButton>
                    </>
                }
                title={post.titre}
                subheader={relativeDateComment(new Date(post.dateDeCreation))}
            />
            {post.images.length>0&&<CardMedia>
                <ImageList sx={{ ml: 2, mr: 2}} cols={post.images.length===1?1:2} rowHeight={12 * parseFloat(getComputedStyle(document.documentElement).fontSize)}>
                    {post.images.map((image, index) => (
                        <ImageListItem key={image.id} rows={post.images.length===2||(index===0&&post.images.length%2!==0)?2:1}>
                            <img
                                alt='post'
                                src={image.url}
                                style={{borderRadius: '10px', height:"100%", objectFit: "cover"}}
                                loading="lazy"
                                onClick={(event)=> {
                                    event.stopPropagation();
                                    setImgModal(image.url);
                                    setOpenModal(true);
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </CardMedia>}
            <CardContent>
                <>
                    {!bigDesc ? <Typography variant="body2" color="text.secondary" mb={3}>
                        {post.description}
                    </Typography> :
                        <>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                {smartTruncate()}
                            </Typography>
                            <a onClick={(event) => {
                                toggleDescription();
                                event.stopPropagation();
                            }}
                            >
                                {openedDesc ? 'Afficher moins' : 'Afficher plus'}
                            </a>
                        </>
                    }
                    {post.evenement && <EventItem event={post.evenement}/>}
                    {post.repost&&<SocialPost post={post.repost} embedded disabled={disabled}/>}
                </>
            </CardContent>
            {!embedded&&<CardActions disableSpacing>
                <IconButton aria-label="like" onClick={(event) => {
                    event.stopPropagation();
                    setUserReaction(1);
                }}>
                    {nombreReactions.like || ''}
                    <FavoriteBorderOutlinedIcon sx={reactionUtilisateur === 1 ? {color: "#ff5656"} : {}}/>
                </IconButton>
                <IconButton aria-label="mdr" onClick={(event) => {
                    event.stopPropagation();
                    setUserReaction(2);
                }}>
                    {nombreReactions.mdr || ''}
                    <SentimentVerySatisfiedOutlinedIcon sx={reactionUtilisateur === 2 ? {color: "#efb81a"} : {}}/>
                </IconButton>
                <IconButton aria-label="Oo" onClick={(event) => {
                    event.stopPropagation();
                    setUserReaction(3);
                }}>
                    {nombreReactions.Oo || ''}
                    <SentimentVerySatisfiedIcon sx={reactionUtilisateur === 3 ? {color: "#efb81a"} : {}}/>
                </IconButton>
                <IconButton aria-label="snif" onClick={(event) => {
                    event.stopPropagation();
                    setUserReaction(4);
                }}>
                    {nombreReactions.snif || ''}
                    <SentimentDissatisfiedIcon sx={reactionUtilisateur === 4 ? {color: "#efb81a"} : {}}/>
                </IconButton>
                <IconButton aria-label="grr" onClick={(event) => {
                    event.stopPropagation();
                    setUserReaction(5);
                }}>
                    {nombreReactions.grr || ''}
                    <SentimentVeryDissatisfiedOutlinedIcon sx={reactionUtilisateur === 5 ? {color: "#ea7907"} : {}}/>
                </IconButton>
                <IconButton aria-label="ok" onClick={(event) => {
                    event.stopPropagation();
                    setUserReaction(6);
                }}>
                    {nombreReactions.ok || ''}
                    <ThumbUpOutlinedIcon sx={reactionUtilisateur === 6 ? {color: "#5085ee"} : {}}/>
                </IconButton>
                <IconButton aria-label="comment" sx={{marginLeft: 'auto'}}>
                    {post.ncommentaires || ''}
                    <ChatBubbleOutlineOutlinedIcon color="secondary"/>
                    {!fullSize && <ExpandMoreIcon/>}
                </IconButton>
            </CardActions>}
            <Modal
                open={openModal}
                onClose={(event: MouseEvent)=>{
                    event.stopPropagation();
                    setOpenModal(false);
                }}
                closeAfterTransition
                sx={{display: "flex", alignItems: "center", justifyContent: "center"}}
            >
                <Fade in={openModal}>
                    <img
                        src={imgModal ?? ""}
                        alt="modal"
                        onClick={(event)=>{
                            event.stopPropagation();
                            setOpenModal(false);
                        }}
                        style={{ height: "80%", maxWidth: "90%", outline: "none", objectFit: 'contain' }}
                    />
                </Fade>
            </Modal>
        </Card>
    );
};
