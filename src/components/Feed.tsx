import React, {useEffect, useState} from "react";
import {Box, Skeleton} from "@mui/material";
import { SocialPost } from "./SocialPost";
import type { Post } from "../hook/social";
import InfiniteScroll from "react-infinite-scroller";

interface props{
    posts: Array<Post>
    handlePostRemove?: Function
    handleRepost?: Function
}

const Feed = ({posts, handlePostRemove=()=>null, handleRepost=()=>null}: props) => {
    const itemsPerPage = 5;
    const [hasMore, setHasMore] = useState(true);
    const [records, setrecords] = useState(0);
    const [localPosts, setLocalPosts] = useState(posts);

    useEffect(()=>{
        if(posts.length!==localPosts.length){
            setLocalPosts(posts);
            setrecords(records+(posts.length-localPosts.length));
        }
    }, [posts, localPosts, records]);

    const loadMore = () => {
        const dataLength = posts.length;
        if (records === posts.length) {
            setHasMore(false);
        } else {
            setrecords(records + itemsPerPage > dataLength ? dataLength : records + itemsPerPage);
        }
    };
    
    const renderPosts = () => {
        const items = [];
        let post;
        for (let i = 0; i < records; i++) {
            post = localPosts[i];
            items.push(<SocialPost post={post} sx={{ mb: 3 }} key={post.id} onPostRemove={handlePostRemove} onRepost={handleRepost}/>);
        }
        return items;
    };

    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            style={{width: "100%"}}
            loader={<Box key="loader" sx={{ width: '100%' }}><Skeleton height={50}/></Box>}
        >
            {renderPosts()}
        </InfiniteScroll>
    );
};

export default Feed;
