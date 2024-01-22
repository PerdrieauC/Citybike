import {TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import type { Event } from "../hook/social";
import '../css/EventItem.css';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

interface props {
    event: Event;
    sx?: {}
}

export const EventItem = ({event, sx}: props) => {


    return(
        <TableContainer className="EventContainer">
            <TableHead className="EventHeader">
                <TableRow className="EventRow" sx={{width: "100%"}}>
                    <TableCell size="small" align="center" sx={{color: '#FAFAFB'}}>
                        {event.titre}
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow className="EventRow">
                    <TableCell size="small">
                        <CalendarMonthOutlinedIcon className="EventIcon" fontSize="small" htmlColor="#64675A"/>
                        {new Date(event.dateEvenement).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        })}
                    </TableCell>
                </TableRow>
                <TableRow className="EventRow">
                    <TableCell size="small">
                        <LocationOnOutlinedIcon className="EventIcon" fontSize="small" htmlColor="#64675A"/>
                        {event.adresse}
                    </TableCell>
                </TableRow>
            </TableBody>
        </TableContainer>
    );
};