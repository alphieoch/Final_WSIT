import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import SignInSide from './SignInSide';
import AddSong from './AddSong';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    const handleLogin = (guest = false) => {
        setIsAuthenticated(true);
        setIsGuest(guest);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setIsGuest(false);
    };

    return (
        <Router>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            "What Song is this" Music Library
                        </Typography>
                        {(isAuthenticated || isGuest) && (
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        )}
                    </Toolbar>
                </AppBar>
                <Routes>
                    <Route path="/" element={
                        isAuthenticated || isGuest ?
                            <Navigate to="/add-song" replace /> :
                            <SignInSide onLogin={handleLogin} />
                    } />
                    <Route path="/add-song" element={
                        isAuthenticated || isGuest ?
                            <AddSong /> :
                            <Navigate to="/" replace />
                    } />
                </Routes>
            </Box>
        </Router>
    );
}

export default App;