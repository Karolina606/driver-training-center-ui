import { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const pages = [
    <Button textAlign="center" component={Link} to="/users">
        Użytkownicy
    </Button>,
    <Button textAlign="center" component={Link} to="/courses">
        Kursy
    </Button>,
    <Button textAlign="center" component={Link} to="/lessons">
        Lekcje
    </Button>,
    <Button textAlign="center" component={Link} to="/categories">
        Kategorie
    </Button>
];
const settings = [
    <Button textAlign="center" component={Link} to="/user-profile">
        Profile
    </Button>
    , 'Account', 'Dashboard', 'Logout'];

const Navbar = () => {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [selectedUserOption, setSelectedUserOption] = React.useState(-1);
    const history = useHistory();


    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        console.log({ anchorElUser });
        setAnchorElUser(null);
    };


    useEffect(() => {
        console.log({ selectedUserOption });
        if (selectedUserOption === 0) {
            history.push('/user-profile');
        } else if (selectedUserOption === 3) {
            console.log({ user })
            logoutUser();
        }
        handleCloseUserMenu();
        setSelectedUserOption(-1);

    }, [selectedUserOption]
    );

    const onMenuItemClick = (event, index) => {
        console.log({ index });
        setSelectedUserOption(index);
    }

    const { user, logoutUser } = useContext(AuthContext);


    let menu_variants;
    if (user == null) {
        menu_variants = <></>
    } else {
        menu_variants =
            <>
                {pages?.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                        {page}
                    </MenuItem>
                ))}
            </>
    }

    let user_buttons;
    if (user == null) {
        user_buttons = <>
            <Button textAlign="center" component={Link} to="/login">
                Login
            </Button>
            <Button textAlign="center" component={Link} to="/register">
                Zarejestruj
            </Button>
        </>
    } else {
        user_buttons =
            <>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">

                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        </IconButton>

                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting, index) => (
                            <MenuItem key={setting} onClick={(event) => onMenuItemClick(event, index)}
                                selectedUserOption={index === selectedUserOption}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </>
    }


    return (
        <AppBar position="static" >
            <Container maxWidth="x4">
                <Toolbar disableGutters>
                    <Link to="/" className="icon">
                        <DirectionsCarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {menu_variants}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {menu_variants}
                    </Box>

                    {user_buttons}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;