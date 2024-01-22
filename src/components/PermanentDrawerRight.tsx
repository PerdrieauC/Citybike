import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import { Button, Fab, TextField } from '@mui/material';
import type { User } from '../hook/user';
import type { GroupRoom } from '../hook/messagerie';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { createGroup } from "../hook/messagerie";

const drawerWidth = 240;

interface Props {
    chattingWith: User | GroupRoom | null;
	friends: Array<User>;
    groups: Array<GroupRoom>;
    onSelectFriend: Function;
    onSelectGroup: Function;
    onCreateGroup: Function;
}

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

const getStyles = (name: string, personName: Array<string>, theme: Theme) => {
    return {
        fontWeight:
            !personName.includes(name)
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
};


export default function PermanentDrawerRight({friends, chattingWith, groups, onSelectFriend, onCreateGroup, onSelectGroup}: Props) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);
    const [groupName, setGroupName] = React.useState<string>('');
    const [personName, setPersonName] = React.useState<string[]>([]);
    const theme = useTheme();

    const [searchFilter, setSearchFilter] = React.useState(null);

    const handleNewGroupChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleNewGroupCreation = async ( name: string, members: Array<string> ) => {
        // call backend to create group, add group to right panel
        const prepared = members;
        if(currentUser) {
            prepared.push(currentUser.id);
        }
        await createGroup(name, prepared);

        setPersonName([]);
        setModalOpen(false);
        onCreateGroup({ name, idUtilisateurs: prepared });
    };

    const friendFromId = (id : string) => friends.find(f => f.id === id);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="right"
            >
                <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }} color='#64675A' textAlign={'center'}>Messagerie</Typography>
                <TextField
                    sx={{ margin: '10px' }}
                    type="text"
                    placeholder='Rechercher'
                    value={searchFilter}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
                    onChange={e => setSearchFilter(e.target.value)}
                />

                <Button variant='outlined' onClick={handleModalOpen}>
                    <AddIcon />
                    Créer un groupe
                </Button>
                <Modal
                    open={modalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description">
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Nouveau groupe
                        </Typography>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            {/* <InputLabel id="new_group_name">Nom</InputLabel> */}
                            <TextField
                                type='text'
                                label='Nom'
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="members-label">Membres</InputLabel>
                            <Select
                                labelId="members-label"
                                id="members-select"
                                multiple
                                value={personName}
                                onChange={handleNewGroupChange}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={`${friendFromId(value)?.nom || ''} ${friendFromId(value)?.prenom || ''}`} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {friends.map((friend, index) => (
                                    <MenuItem
                                        key={index}
                                        value={friend.id}
                                    >
                                        {friend.nom} {friend.prenom}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 20 }}>
                            {/* eslint-disable-next-line @typescript-eslint/promise-function-async, @typescript-eslint/no-misused-promises */}
                            <Button variant='contained' onClick={() => handleNewGroupCreation(groupName, personName)}>Créer</Button>
                        </FormControl>

                    </Box>
                </Modal>
                <List>
                    {
                        (searchFilter ?
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            groups.filter(g => g.name.toLowerCase().includes(searchFilter.toLowerCase())) :
                            groups
                        ).map((group, index) => (
                            <ListItem
                                key={group.name}
                                disablePadding
                                onClick={() => {onSelectGroup(group);}}
                                style={
                                    chattingWith?.id === group.id ? {
                                        backgroundColor: '#eee'
                                    } : {}
                                }
                            >
                                <ListItemButton>
                                    <img
                                        style={{
                                            marginRight: '10px',
                                            clipPath: 'circle()',
                                            borderRadius: '100%',
                                            border: '1.5px solid black'
                                        }}
                                        src={'https://cdn-icons-png.flaticon.com/128/1769/1769041.png'}
                                        alt={group.name}
                                        width={30}
                                    />
                                    <ListItemText primary={group.name} />
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                    {(searchFilter ?
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                        friends.filter(f => (f.prenom && f.prenom.toLowerCase().includes(searchFilter.toLowerCase()))) : friends
                    ).map((friend, index) => (
                        <ListItem
                            key={friend.nom}
                            disablePadding
                            onClick={() => {onSelectFriend(friend);}}
                            style={
                                chattingWith?.id === friend.id ? {
                                    backgroundColor: '#eee'
                                } : {}
                            }
                        >
                            <ListItemButton>
                                <img
                                    style={{ marginRight: '10px', clipPath: 'circle()' }}
                                    src={friend.photo || 'https://cdn-icons-png.flaticon.com/128/1144/1144760.png'}
                                    alt={friend.nom}
                                    width={30}
                                />
                                <ListItemText primary={`${friend.nom || ''} ${friend.prenom || ''}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
