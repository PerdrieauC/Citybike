import * as React from 'react';
import Box from '@mui/material/Box';
import {ListItem, ListItemAvatar, ListItemText, Skeleton, Typography} from "@mui/material";

export const CompteLoading = () => (
    <Box ml={5} mr={5}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: "200px", mb: 0.2}} />
        <Skeleton variant="text" sx={{ fontSize: '1.3rem', width: "500px", mb: 5}} />
        <Skeleton variant="circular" sx={{width: "20vh", height: "20vh", minHeight: "200px", minWidth: "200px", mb: 10, ml: 2, aspectRatio: "1/1"}}/>
        <Skeleton variant="rectangular" sx={{width:"650px", height: "60px", mb: 3}} />
        <Skeleton variant="rectangular" sx={{width:"650px", height: "60px", mb: 3}} />
        <Skeleton variant="rectangular" sx={{width:"650px", height: "60px", mb: 3}} />
        <Skeleton variant="rectangular" sx={{width:"650px", height: "60px", mb: 3}} />
    </Box>
);

export const UserLoading = () => (
    <Box ml={5} mr={5}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: "100px", mb: 0.2}} />
        <Skeleton variant="text" sx={{ fontSize: '1.3rem', width: "90px", mb: 5}} />
        <Skeleton variant="circular" sx={{width: "20vh", height: "20vh", minHeight: "200px", minWidth: "200px", mb: 10, ml: 2, aspectRatio: "1/1"}}/>
    </Box>
);

export const FeedLoading = () => (
    <Box sx={{width:"100%"}}>
        <Skeleton variant="rectangular" sx={{height: "12rem", mb: 3, borderRadius: '10px'}} />
        <Skeleton variant="rectangular" sx={{height: "30rem", mb: 3, borderRadius: '10px'}} />
        <Skeleton variant="rectangular" sx={{height: "30rem", mb: 3, borderRadius: '10px'}} />
        <Skeleton variant="rectangular" sx={{height: "12rem", mb: 3, borderRadius: '10px'}} />
    </Box>
);

interface CommentLoadingProps{
    ncommentaire: number
}
export const CommentLoading = ({ncommentaire}: CommentLoadingProps) => {
    const res = [];
    for (let i = 0; i < ncommentaire; i++) {
        res.push(<ListItem alignItems="flex-start" key={`laodingcom${i}`}>
            <ListItemAvatar>
                <Skeleton variant="circular" sx={{width: "50px", height: "50px"}}/>
            </ListItemAvatar>
            <Box sx={{width: "100%"}}>
                <ListItemText
                    primary={<Skeleton/>}
                />
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Box>
                        <Typography>
                            <Skeleton width={100}/>
                        </Typography>
                    </Box>
                    <Box>
                        <Skeleton width={40}/>
                    </Box>
                </Box>
            </Box>
        </ListItem>);
    }
    return <>{res}</>;
};