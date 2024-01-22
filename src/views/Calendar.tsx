import React, { useEffect, useState } from "react";

import {Box, Button, Container} from "@mui/material";
import { SocialPost } from "../components/SocialPost";
import type { Post } from "../hook/social";
import {getFeed, getPost, removePost, getEvents,getEvent } from "../hook/social";
import {useNavigate, useParams} from "react-router";
import { PostComments } from "../components/PostComments";
import {FeedLoading} from "../components/Loading";
import {NewEvent} from "../components/NewEvent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Feed from "../components/Feed";
import FullCalendar from "@fullcalendar/react";
// eslint-disable-next-line @typescript-eslint/no-duplicate-imports
import EventInput from  "@fullcalendar/react";
import FrLocales from "@fullcalendar/core/locales/fr";
import DayGridPlugin  from "@fullcalendar/daygrid";

import '../css/MyCalendar.css'; // Import your custom CSS

const Calendar = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [repost, setRepost] = useState<Post | null>(null);
    const [newPostModal, setNewPostModal] = useState(false);
    const [feed, setFeed] = useState<Array<Post> | null>(null);
    const navigate = useNavigate();
    const [even, setEven] = useState<object[]>([]);
    const calendarRef = React.useRef<FullCalendar>(null);


    useEffect(() => {
        const controller = new AbortController();
        getFeed(controller.signal)
            .then((res) => {
                const  eventArray: object[] = [];
                res?.forEach(post=>{
                    if (calendarRef.current && post.evenement !== null){
                        eventArray.push({title: post.evenement?.titre , start: post.evenement?.dateEvenement});
                    }
                });
                setEven(eventArray);
            })
            .catch(() => null);
        return () => {
            controller.abort();
        };
    }, []);

    return (
        <div>
            <FullCalendar
                plugins={[DayGridPlugin]}
                locales={[FrLocales]}
                initialView='dayGridMonth'
                weekends={false}
                events={even}
                ref={calendarRef}
            />
        </div>
    );

};

export default Calendar;
