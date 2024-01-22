import React, { useEffect, useState } from "react";
import {Box, Button, Container, Slider, Tab, Tabs} from "@mui/material";
import { SocialPost } from "../components/SocialPost";
import type { Post } from "../hook/social";
import {getFeed, getLocationFeed, getPost, removePost} from "../hook/social";
import {useNavigate, useParams} from "react-router";
import { PostComments } from "../components/PostComments";
import {FeedLoading} from "../components/Loading";
import {NewEvent} from "../components/NewEvent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Feed from "../components/Feed";
import Typography from "@mui/material/Typography";

const Social = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [repost, setRepost] = useState<Post | null>(null);
    const [newPostModal, setNewPostModal] = useState(false);
    const [feed, setFeed] = useState<Array<Post> | null>(null);
    const [localisationFeed, setLocalisationFeed] = useState<Array<Post> | null>(null);
    const navigate = useNavigate();
    const [location, setLocation] = useState<{longitude: number, latitude: number} | null>(null);
    const [distance, setDistance] = useState<number>(500);
    const [showedDistance, setShowedDistance] = useState<number>(500);
    const [tabValue, setTabValue] = useState<number>(0);

    useEffect(() => {
        if("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((geoLoc) => {
                setLocation({longitude: geoLoc.coords.longitude, latitude: geoLoc.coords.latitude});
            });
        } else {
            setTabValue(1);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if(location !== null) {
            getLocationFeed(distance, location.longitude, location.latitude, controller.signal)
                .then((res) => {
                    setLocalisationFeed(res);
                })
                .catch(() => null);
        } else {
            setTabValue(1);
        }
        return () => {
            controller.abort();
        };
    }, [distance, location]);

    useEffect(() => {
        const controller = new AbortController();
        getFeed(controller.signal)
            .then((res) => {
                setFeed(res);
            })
            .catch(() => null);
        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        setPost(null);
        if(postId !== "" && postId !== undefined && feed){
            setPost(feed.find(post=>post.id===postId) ?? null);
            getPost(postId, controller.signal).then(p=>{ setPost(p); }).catch(()=>null);
        }
        return () => {
            controller.abort();
        };
    }, [postId, feed]);

    const handlePostRemove = (post: Post) => {
        setFeed(feed?.filter(p=>p.id!==post.id) ?? null);
        removePost(post).then(()=>null).catch(()=>null);
    };

    const handleRepost = (post: Post) => {
        setRepost(post);
        setNewPostModal(true);
    };

    const handleNewPost = (post: Post) => {
        if(feed) {
            const copyFeed = [...feed];
            copyFeed.unshift(post);
            setFeed(copyFeed);
        }
    };

    const renderPost = (post: Post) => {
        return (
            <Box sx={{width: "100%"}}>
                <SocialPost post={post} sx={{mb: 2}} fullSize onPostRemove={(post: Post)=>{
                    setPost(null);
                    handlePostRemove(post);
                    navigate('/social');
                }} onRepost={handleRepost}/>
                <PostComments post={post}/>
            </Box>
        );
    };

    const onTabValueChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const onDistanceChange = (event: Event | React.SyntheticEvent, newValue: Array<number> | number) => {
        if(!Array.isArray(newValue))
            setDistance(newValue*10);
    };

    const onShowedDistanceChange = (event: Event | React.SyntheticEvent, newValue: Array<number> | number) => {
        if(!Array.isArray(newValue))
            setShowedDistance(newValue*10);
    };

    return (
        <Container component="main" maxWidth="lg">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Tabs value={tabValue} onChange={onTabValueChange} variant="fullWidth">
                    <Tab label="Aux Alentours" disabled={location === null}/>
                    <Tab label="Utilisateurs suivis" />
                </Tabs>
                {tabValue === 0 &&
                    <>
                        <Typography sx={{marginTop: "10px"}} gutterBottom>
                           Distance de détection des évènements : {showedDistance} m
                        </Typography>
                        <Slider
                            aria-label="Temperature"
                            value={showedDistance/10}
                            onChange={onShowedDistanceChange}
                            onChangeCommitted={onDistanceChange}
                            color="secondary"
                        />
                        <>{!localisationFeed && <FeedLoading/>}</>
                        {localisationFeed && <Feed posts={localisationFeed} handlePostRemove={handlePostRemove}
                            handleRepost={handleRepost}/>}
                    </>
                }
                {tabValue === 1 &&
                    <>
                        <>{!feed && <FeedLoading/>}</>
                        {
                            post?renderPost(post):
                                feed&&<Feed posts={feed} handlePostRemove={handlePostRemove} handleRepost={handleRepost}/>
                        }
                    </>
                }

            </Box>
            <div>
                {!post&&!newPostModal&&<Button
                    onClick={() => {
                        setRepost(null);
                        setNewPostModal(true);
                    }}
                    sx={{
                        position: "fixed",
                        bottom: '1rem',
                        right: '1rem',
                        borderRadius: '50%',
                    }}
                >
                    <AddCircleIcon sx={{fontSize: '4rem'}}/>
                </Button>}
                <NewEvent open={newPostModal} handleClose={() => {setNewPostModal(false);}} repost={repost} onPost={handleNewPost}/>
            </div>
        </Container>);
};

export default Social;
