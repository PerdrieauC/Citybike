import React, {useEffect, useState} from 'react';
import {Box, Button, Container, Divider, Typography} from '@mui/material';
import type {User} from "../hook/user";
import {UserLoading} from "../components/Loading";
import '../css/Compte.css';
import defaultPfp from "/asset/images/pfp.png";
import {useParams} from "react-router";
import {unfollow, follow, getFollowers} from "../hook/follow";
import {getUserPosts} from "../hook/social";
import type { Post } from "../hook/social";
import Feed from "../components/Feed";

const UserView = () => {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState<User|null>(null);
    const [followers, setFollowers] = useState<number|null>(null);
    const [feed, setFeed] = useState<Array<Post> | null>(null);

    const isFollowing = follows?.find(follow=>follow.id === userId);


    useEffect(() => {
        const controller = new AbortController();
        setFollowers(null);
        setFeed(null);
        if(userId !== undefined) {
            getFollowers(userId, controller.signal).then(res=> {
                setFollowers(res.length);
            }).catch(()=>null);
            getUserPosts(userId, controller.signal).then(res=> {
                setFeed(res);
            }).catch(()=>null);
        }
        return () => {
            controller.abort();
        };
    },[userId]);

    useEffect(()=>{
        if(userId !== undefined && usersBase){
            setUserInfo(usersBase.find(user=>user.id===userId) ?? null);
        }
    }, [userId, usersBase]);

    const handleFollow = () => {
        if(userId !== undefined && followers !== null) {
            let promise;
            if (isFollowing) {
                promise = unfollow(userId);
                setFollowers(followers-1);
            } else {
                promise = follow(userId);
                setFollowers(followers+1);
            }
            promise.then(()=> {
                reloadFollows();
            }).catch(()=>null);
        }
    };

    if(!userInfo){
        return <UserLoading />;
    }
    return (
        <Box ml={5}>
            <Typography variant="h5">
                <b>{userInfo.nom_utilisateur}</b><br/>
                {followers} Followers
            </Typography>
            <Box mt={5} ml={2} sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={userInfo.photo ?? defaultPfp}
                    className="pfp"
                    style={{aspectRatio:'1/1', objectFit: 'cover'}}
                    alt="profile"
                    onError={({currentTarget})=>currentTarget.src=defaultPfp}
                />
                <Box ml={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button type="button"
                        variant="contained"
                        color="secondary"
                        size="large" sx={{borderRadius: 0, mb: 2, justifyContent: 'left' }}
                        disabled={currentUser?.id === userId}
                        onClick={handleFollow}
                    >
                        <b>{isFollowing?"✓ Suivi":"+ Suivre"}</b>
                    </Button>
                    <Button type="button"
                        variant="contained"
                        color="error"
                        disabled={currentUser?.id === userId}
                        size="large" sx={{borderRadius: 0, justifyContent: 'left', backgroundColor: '#FFDCDC', color: "#FF5656" }}
                    >
                        <b>Bloquer</b>
                    </Button>
                </Box>
                <Divider/>
            </Box>
            <Container component="main" maxWidth="md" sx={{mt: 5}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {feed&&<Feed posts={feed}/>}
                </Box>
            </Container>
        </Box>
    );
};

export default UserView;
