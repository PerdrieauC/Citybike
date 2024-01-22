import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { slide as Menu } from 'react-burger-menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import logo from '/asset/images/logo.svg';
import '../css/SideBar.css';
import home from '/asset/images/home.svg';
import marketplace from '/asset/images/marketplace.svg';
import cart from '/asset/images/cart.svg';
import menuburger from '/asset/images/menuburger.svg';
import anglecircleleft from '/asset/images/anglecircleleft.svg';
import {Link} from "react-router-dom";
import {Divider} from "@mui/material";

interface SidebarItemProps{
    icon: string;
    text: string;
    url: string;
    location: string;
}

const SideBarItem = ({icon, text, url, location}: SidebarItemProps) => (
    <ListItem>
        <Link to={url} className={`sidebar-link ${location === url ? 'active-item' : ''}`}>
            <ListItemButton>
                <ListItemIcon sx={{ mr: 0.5, height: "2rem", aspectRatio: 1/1 }}><img src={icon} alt={text}/></ListItemIcon>
                <ListItemText primary={text}/>
            </ListItemButton>
        </Link>
    </ListItem>
);

interface SideBarProps {
    onToggle: (isOpen: boolean) => void;
    location: string;
}

const mediaQuery = window.matchMedia('(min-width: 1200px)');

export default function SideBar({onToggle, location}: SideBarProps ) {

    const [isOpen, setIsOpen] = useState(mediaQuery.matches);

    const handleStateChange = ({ isOpen }: { isOpen: boolean }) => {
        setIsOpen(isOpen);
        onToggle && onToggle(isOpen);
    };

    const drawer = (
        <>
            <Box sx={{display: 'flex', justifyContent: 'center',  mt: 2}}>
                <Link to="/"><img src={logo} alt="logo" className='sidebar-logo'/></Link>
            </Box>
            <List>
                <Divider sx={{mt: 1, mb: 1}} />
                <SideBarItem icon={home} text="Home" url="/" location={location}/>
                <SideBarItem icon={marketplace} text="Marketplace" url="/marketplace" location={location}/>
                <SideBarItem icon={cart} text="Cart" url="/cart" location={location}/>
            </List>
        </>
    );

    useEffect(() => {
        const buttonElement = document.getElementById('react-burger-menu-btn');
        const content = document.querySelector('.bm-menu-wrap') as HTMLElement;
        if (buttonElement) {
            buttonElement.style.width = '30px';
            buttonElement.style.height = '30px';
        }
        if (content) {
            content.style.zIndex = '999';
            content.style.transition = 'transform 1s ease';
        }
    }, []);

    const burgerIcon = isOpen ? anglecircleleft : menuburger;

    return (
        <Menu
            noOverlay
            customBurgerIcon={<img src={burgerIcon} alt="X"/>}
            customCrossIcon={false}
            menuClassName={ "side-bar" }
            burgerBarClassName={ "bm-burger-button" }
            isOpen={isOpen}
            onStateChange={handleStateChange}
        >
            {drawer}
        </Menu>
    );
}
