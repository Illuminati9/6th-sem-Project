//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/layout.jsx
import * as React from 'react';
import { useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { HomeRounded, CalendarToday, SchoolOutlined, ArchiveOutlined, SettingsOutlined, ListAlt, Add } from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import ClassroomListElement, { RenderAvatar } from './components/classroomListElement/app';
import { Avatar, Tooltip, Box, Fab, IconButton, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from './middleware/userSlice';
import customNavbar from './components/navbar/app';
import axios from 'axios';
import CreateClass from './components/layout/createClass';

const Layout = ({ children }) => {
    const { classrooms, loading, error } = useSelector((state) => state.classrooms);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [toggleJoinClass, setToggleJoinClass] = useState(false);
    const [toggleCreateClass, setToggleCreateClass] = useState(false);

    const handleToggleJoinClass = () => {
        setToggleJoinClass((prev) => !prev);
    }

    const handleToggleCreateClass = ()=>{
        setToggleCreateClass((prev) => !prev);
    }


    function dialogJoinClass() {
        const [classroomCode, setClassroomCode] = useState('');
        const [loading, setLoading] = useState(false);

        const handleClassCodeChange = (event) => {
            setClassroomCode(event.target.value);
        };
        const handleJoinClass = async () => {
            // create me api call to join the classroom
            console.log("Joining class with code:", classroomCode);
            setLoading(true);
            // const state = getState();
            const token = localStorage.getItem('token');
            console.log(token);
            const response = await axios.post(`http://localhost:8000/api/classroom/join/${classroomCode}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data);
            setLoading(false);
            handleToggleJoinClass();
        }
        return (
            <Dialog open={toggleJoinClass} onClose={handleToggleJoinClass}>
                <DialogTitle>Join Class</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the class code to join the class.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="classCode"
                        label="Class Code"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleClassCodeChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggleJoinClass}>Cancel</Button>
                    <Button onClick={handleJoinClass}>Join</Button>
                </DialogActions>
            </Dialog>
        );
    }


    // User Profile menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        dispatch(logout());
        navigate('/');
    };

    // Join/Create Class menu state
    const [joinAnchorEl, setJoinAnchorEl] = useState(null);
    const handleJoinButtonClick = (event) => {
        setJoinAnchorEl(event.currentTarget);
    };
    const handleJoinMenuClose = () => {
        setJoinAnchorEl(null);
    };
    const handleJoinClass = () => {
        setToggleJoinClass(true);
        handleJoinMenuClose();
    };
    const handleCreateClass = () => {
        console.log("Create Class clicked");
        // Add your navigation or logic to create a class here
        setToggleCreateClass(true);
        handleJoinMenuClose();
    };

    const generateAvatarColor = useMemo(() => {
        const colors = [
            '#F44336', '#E91E63', '#9C27B0', '#673AB7',
            '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
            '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
            '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
        ];
        if (user && user.name) {
            const index = user.name.charCodeAt(0) % colors.length;
            return colors[index];
        }
        return '#000';
    }, [user]);

    const classroomList = () => {
        if (loading) {
            return [{
                segment: 'loading',
                title: 'Loading...',
                icon: <HomeRounded />,
            }];
        }
        if (error) {
            return [{
                segment: 'error',
                title: `Error: ${error}`,
                icon: <HomeRounded />,
            }];
        }
        if (classrooms && classrooms.length > 0) {
            return classrooms.map((classroom) => ({
                segment: `classroom/${classroom.classroomCode}`,
                title: <ClassroomListElement classroom={classroom} />,
                icon: <RenderAvatar avatar={classroom?.avatar} subject={classroom?.subject} />,
            }));
        }
        return [];
    };

    const NAVIGATION = [
        {
            segment: 'home',
            title: 'Home',
            icon: <HomeRounded />,
        },
        {
            segment: 'calender',
            title: 'Calender',
            icon: <CalendarToday />,
        },
        {
            kind: 'divider',
        },
        {
            segment: 'home',
            title: 'Enrolled',
            icon: <SchoolOutlined />,
            children: [
                {
                    segment: 'not-turned-in',
                    title: 'To-do',
                    icon: <ListAlt />,
                },
                ...classroomList(),
            ],
        },
        {
            kind: 'divider',
        },
        {
            segment: 'archivedClassrooms',
            title: 'Archived Classrooms',
            icon: <ArchiveOutlined />,
        },
        {
            segment: 'settings',
            title: 'Settings',
            icon: <SettingsOutlined />,
        }
    ];

    const theme = createTheme({
        cssVariables: {
            colorSchemeSelector: 'data-toolpad-color-scheme',
        },
        colorSchemes: { light: true, dark: false },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 600,
                lg: 1200,
                xl: 1536,
            },
        },
    });

    function customToolbarActions() {
        return (
            <Box
                // position={'absolute'}
                // maxWidth={'100%'}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    // flexGrow: 0
                }}
            // className="flex items-center gap-2"
            >
                <Tooltip title="Join or Create Class">
                    <Fab
                        onClick={handleJoinButtonClick}
                        sx={{
                            backgroundColor: '#fff',
                            color: '#000',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        <Add />
                    </Fab>
                </Tooltip>
                {/* <Menu
                    sx={{ mt: '45px', mr: '0px', display: 'absolute', flexDirection: 'column' }}
                    // className='flex items-right gap-2 w-full'
                    anchorEl={joinAnchorEl}
                    open={Boolean(joinAnchorEl)}
                    onClose={handleJoinMenuClose}
                    keepMounted
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    // anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    // transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                    <MenuItem onClick={handleJoinClass}>Join Class</MenuItem>
                    <MenuItem onClick={handleCreateClass}>Create Class</MenuItem>
                </Menu> */}
                <>
                    {
                        joinAnchorEl && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '70px',
                                    right: '80px',
                                    minWidth: '100px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
                                    zIndex: 1000,
                                }}
                            >
                                <MenuItem onClick={handleJoinClass}>Join Class</MenuItem>
                                <MenuItem onClick={handleCreateClass}>Create Class</MenuItem>
                            </div>
                        )
                    }
                    {
                        joinAnchorEl && (
                            <div
                                onClick={handleJoinMenuClose}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 999,
                                }}
                            />
                        )
                    }
                </>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Tooltip title={user && user.name ? user.name : "User Profile"}>
                        <IconButton
                            onClick={handleAvatarClick}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: user && user.avatar ? 'transparent' : generateAvatarColor,
                                }}
                                src={user && user.avatar ? user.avatar : undefined}
                            >
                                {user && !user.avatar && user.name ? user.name.charAt(0).toUpperCase() : null}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    <>
                        {open && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: 0,
                                    minWidth: '100px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
                                    zIndex: 1000,
                                }}
                            >
                                <div
                                    style={{
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        handleMenuClose();
                                        handleLogout();
                                    }}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                        {open && (
                            <div
                                onClick={handleMenuClose}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    zIndex: 999,
                                }}
                            />
                        )}
                    </>
                </Box>
            </Box>
        );
    }

    return (
        <AppProvider navigation={NAVIGATION} theme={theme}>
            <DashboardLayout
                slots={{
                    appTitle: customNavbar,
                    toolbarActions: customToolbarActions,
                }}
                sx={{ m: 0, p: 0 }}
            >
                <Box sx={{ m: 0, p: 0, width: '100%' }}>
                    {children}
                </Box>
            </DashboardLayout>
            {dialogJoinClass()}
            <CreateClass state={toggleCreateClass} setState={setToggleCreateClass}/>
        </AppProvider>
    );
};

export default Layout;