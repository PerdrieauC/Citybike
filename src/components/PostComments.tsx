import * as React from 'react';
import {
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from "@mui/material";
import type {Commentaire, Post} from "../hook/social";
import TextField from "@mui/material/TextField";
import defaultPfp from "/asset/images/pfp.png";
import Avatar from "@mui/material/Avatar";
import SendIcon from '@mui/icons-material/Send';
import {createRef, useEffect, useState} from "react";
import {deleteComment, postComment} from "../hook/social";
import {CommentLoading} from "./Loading";
import {relativeDateComment} from "../utils/Date";
import {UserAvatar} from "./UserAvatar";
interface props{
    post: Post
}

interface CommentProps{
    commentaire: Commentaire
}

export const PostComments = ({post}:props) => {
    const [newComment, setNewComment] = useState<string>("");
    const [responseToId, setResponseToId] = useState<string>("");
    const responseRef = createRef<HTMLInputElement>();
    const [localCommentaires, setLocalCommentaires] = useState<Array<Commentaire>>([]);
    const me = usersBase?.find(user=>user.id === currentUser?.id);

    useEffect(()=>{
        if(post.commentaires) {
            setLocalCommentaires(post.commentaires);
        }
    }, [post]);

    const handleNewComment = (event: React.FormEvent<HTMLDivElement | HTMLFormElement>) => {
        event.preventDefault();
        postComment(post.id, newComment, null).then(com=>{ setLocalCommentaires([com, ...localCommentaires]); }).catch(()=>null);
        setNewComment("");
    };

    const handleCommentDelete = (id: string) => {
        deleteComment(id).then(()=>{ setLocalCommentaires(localCommentaires.filter(c=>c.id !== id)); }).catch(()=>null);
    };

    const handleNewResponse = () => {
        if(responseRef.current && responseRef.current.value !== "") {
            postComment(post.id, responseRef.current.value, responseToId).then(com=>{ setLocalCommentaires([com, ...localCommentaires]); }).catch(()=>null);
            setResponseToId('');
        }
    };

    const Comment = ({commentaire}:CommentProps) => {
        const author = usersBase?.find(user=>user.id === commentaire.idUtilisateur);
        const subcomments = localCommentaires.filter(c=>c.idCommentaire===commentaire.id);
        const reponseId = commentaire.idCommentaire ?? commentaire.id;
        return(
            <>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                        {author?<UserAvatar user={author}/>:<Avatar src={defaultPfp}/>}
                    </ListItemAvatar>
                    <Box sx={{width: "100%"}}>
                        <ListItemText
                            sx={{wordWrap: 'break-word'}}
                            primary={commentaire.contenu}
                        />
                        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                            <Box>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {author?.nom_utilisateur}
                                </Typography>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {" — " + relativeDateComment(new Date(commentaire.dateDeCreation))}
                                </Typography>
                            </Box>
                            <Box>
                                {author?.id===me?.id?<Typography
                                    component="span"
                                    variant="body2"
                                    color="error"
                                    sx={{'&:hover': {cursor: "pointer"}}}
                                    onClick={()=>{handleCommentDelete(commentaire.id);}}
                                >
                                    supprimer
                                </Typography>:
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="secondary"
                                        sx={{'&:hover': {cursor: "pointer"}}}
                                        onClick={()=>{setResponseToId(reponseId === responseToId ? "" : reponseId);}}
                                    >
                                        {commentaire.id === responseToId ? "annuler" : "repondre"}
                                    </Typography>
                                }
                            </Box>
                        </Box>
                    </Box>
                </ListItem>
                <Divider component="li" variant="inset" />
                {commentaire.id===responseToId&&<ListItem alignItems="flex-start" sx={{ml: 5}} key={"responsediv"+commentaire.id}>
                    <ListItemAvatar>
                        <Avatar src={me?.photo ?? defaultPfp}/>
                    </ListItemAvatar>
                    <TextField
                        fullWidth
                        id={"response"}
                        variant="standard"
                        label="Ajouter un commentaire"
                        multiline
                        rows={1}
                        inputRef={responseRef}
                        autoFocus
                        onKeyDown={event=>{
                            if(event.key==='Enter' && !event.shiftKey) {
                                handleNewResponse();
                            }
                        }}
                    />
                    <IconButton color="secondary" onClick={handleNewResponse}>
                        <SendIcon/>
                    </IconButton>
                </ListItem>}
                <List sx={{ ml: 5 }}>
                    {subcomments.map(c=><Comment commentaire={c} key={c.id}/>)}
                </List>
            </>
        );
    };

    return(<>
        <Box component="form" sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 2}} onSubmit={handleNewComment}>
            <Avatar src={me?.photo ?? defaultPfp} sx={{mr:2}}/>
            <TextField
                fullWidth
                variant="standard"
                label="Ajouter un commentaire"
                multiline
                rows={2}
                value={newComment}
                onChange={(e)=> {
                    setNewComment(e.currentTarget.value);
                }}
                onKeyDown={event=>{
                    if(event.key==='Enter' && !event.shiftKey){
                        handleNewComment(event);
                    }
                }}
            />
            <IconButton color="secondary" type="submit">
                <SendIcon/>
            </IconButton>
        </Box>
        <List sx={{ bgcolor: 'background.paper', mr: 4 }}>
            {post.commentaires?localCommentaires.filter(commentaire=>commentaire.idCommentaire===null).map(commentaire=><Comment commentaire={commentaire} key={commentaire.id}/>):<CommentLoading ncommentaire={post.ncommentaires}/>}
        </List>
    </>);
};
