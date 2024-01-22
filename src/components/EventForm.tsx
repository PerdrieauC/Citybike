import React, {useCallback, useEffect, useState} from "react";
import type {Event} from '../hook/social';
import {Checkbox, FormGroup, FormControlLabel, Collapse, TextField, Box} from "@mui/material";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

interface props {
    e?: Event,
    setEvent: Function,
    showForm: boolean,
    setShowForm: Function,
    sx?: {}
}

const EventForm = ({e, setEvent, showForm=false, setShowForm, sx}: props) => {
    const [show, setShow] = useState<boolean>(false);

    const [eventTitle, setEventTitle] = useState<string>('');
    const [eventDate, setEventDate] = useState<dayjs.Dayjs | null>(dayjs('2014-08-18T21:11:54'));
    const [eventAdresse, setEventAdresse] = useState<string>('');
    const [eventNumber, setEventNumber] = useState<string>('');
    const [eventRue, setEventRue] = useState<string>('');
    const [eventCodePostal, setEventCodePostal] = useState<string>('');
    const [eventVille, setEventVille] = useState<string>('');
    const maxTitleLength = 100;


    const [error] = useState<boolean>(false);

    useEffect(() => {
        if(e) {
            setEventTitle(e.titre ?? '');
            setEventDate(dayjs(e.dateEvenement?? ''));
            setEventAdresse(e.adresse ?? '');
        }
    }, [e]);

    const sendEvent = useCallback(() => {
        if (eventTitle !== '') {
            if (eventAdresse !== '') {
                setEvent({titre: eventTitle, dateEvenement: eventDate, adresse: eventAdresse});
            }
        }
    }, [eventAdresse, eventDate, eventTitle, setEvent]);

    useEffect(() => {
        sendEvent();
    }, [eventDate, sendEvent]);

    useEffect(() => {
        if(eventNumber !== '' && eventRue !== '' && eventCodePostal !== '' && eventVille !== '') {
            setEventAdresse(`${eventNumber} ${eventRue}, ${eventCodePostal} ${eventVille}`);
            sendEvent();
        }
    }, [eventRue, eventNumber, eventCodePostal, eventVille, sendEvent]);

    useEffect(() => {
        setShow(showForm);
    }, [showForm]);

    const handleTitreChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        if(value !== '' && value.length <= maxTitleLength) {
            setEventTitle(value);
            sendEvent();
        }
    };

    const remainingTitleChars = maxTitleLength - eventTitle.length; // Nombre de caractères restants

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventNumber(event.target.value);
    };

    const handleRueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventRue(event.target.value);
    };

    const handleCodePostalChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventCodePostal(event.target.value);
    };

    const handleVilleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEventVille(event.target.value);
    };



    return (

        <FormGroup>
            <FormControlLabel control={<Checkbox value={show} onChange={() =>{ setShowForm();}}/>} label="Ajouter un événement" />
            <Collapse in={show} timeout="auto">
                <Box component="form">
                    <TextField
                        name="titre"
                        margin="normal"
                        onChange={handleTitreChange}
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Date de l'évènement"
                            inputFormat="DD/MM/YYYY"
                            value={eventDate}
                            onChange={setEventDate}
                            renderInput={(params) => <TextField
                                margin="normal"
                                required
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                {...params} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        name="number"
                        margin="normal"
                        required
                        fullWidth
                        inputProps={{ inputMode: 'text', pattern: '[0-9]*' }}
                        label="Numéro de logement"
                        onChange={handleNumberChange}
                        error={error}
                        helperText={error&&"Numéro de logement obligatoire"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        autoFocus
                    />
                    <TextField
                        name="rue"
                        margin="normal"
                        onChange={handleRueChange}
                        required
                        fullWidth
                        label="Nom de rue"
                        error={error}
                        helperText={error&&"Rue obligatoire"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        autoFocus
                    />
                    <TextField
                        name="codePostale"
                        margin="normal"
                        onChange={handleCodePostalChange}
                        required
                        fullWidth
                        inputProps={{ inputMode: 'text', pattern: '[0-9]{5,6}' }}
                        label="Code Postale"
                        error={error}
                        helperText={error&&"Code postale obligatoire"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        autoFocus
                    />
                    <TextField
                        name="ville"
                        margin="normal"
                        onChange={handleVilleChange}
                        required
                        fullWidth
                        label="Nom de la ville"
                        error={error}
                        helperText={error&&"Ville obligatoire"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        autoFocus
                    />
                </Box>
            </Collapse>

        </FormGroup>
    );
};

export default EventForm;