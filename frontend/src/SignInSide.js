import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

console.log("Welcome to the Hotel California... I mean, WSIT Music Library!");

// This little guy takes care of our copyright info
function Copyright(props) {
    console.log('Rendering Copyright component');
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Created by Alphonce Ochieng'}
        </Typography>
    );
}

// Set up our default theme - nothing fancy, just the basics
const defaultTheme = createTheme();

// The star of the show - our SignInSide component
export default function SignInSide({ onLogin }) {
    console.log('Rendering SignInSide component');
    const navigate = useNavigate();
    // We'll store our cool background image URL here
    const [backgroundImage, setBackgroundImage] = useState('');

    // Time to fetch a random music image! This runs when our component mounts
    useEffect(() => {
        console.log('Fetching background image');
        const fetchBackgroundImage = async () => {
            const API_KEY = '2164218-a660e6d3883800d89a77a4886';
            const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent('music')}&image_type=photo&orientation=horizontal&per_page=200`;

            try {
                const response = await fetch(URL);
                const data = await response.json();
                if (data.hits.length > 0) {
                    // Let's pick a random image to keep things interesting
                    const randomIndex = Math.floor(Math.random() * data.hits.length);
                    setBackgroundImage(data.hits[randomIndex].largeImageURL);
                    console.log('Background image set successfully');
                }
            } catch (error) {
                console.error('Oops! Error fetching image from Pixabay:', error);
            }
        };

        fetchBackgroundImage();
    }, []); // This empty array means we only run this once when the component mounts

    // What happens when someone tries to sign in
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        console.log('Sign-in attempt with:', {
            email: email,
            password: password,
        });

        // Check if the credentials are for the admin user
        if (email === 'admin' && password === 'password') {
            console.log('Admin access granted');
            onLogin(); // Let the parent component know we're logged in
            navigate('/add-song'); // Off to the add-song page we go!
        } else {
            console.error('Invalid credentials');
            alert('Invalid credentials. Please try again.');
        }
    };

    // For our more casual users who want to browse as guests
    const handleGuestAccess = () => {
        console.log("Such a lovely place, such a lovely face... Guest access granted!");
        onLogin(true); // True here means we're a guest
        console.log('Navigating to add-song page as guest');
        navigate('/add-song'); // Same destination, different journey
    };

    // Time to show our beautiful sign-in page to the world
    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                {/* Left side - our musical eye-candy */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Right side - where the magic happens */}
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            {/* Where you type in your email */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            {/* Super secret password goes here */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            {/* In case you're forgetful */}
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            {/* The big moment - hitting that sign-in button */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            {/* For our shy users who prefer to stay incognito */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleGuestAccess}
                                sx={{ mb: 2 }}
                            >
                                Continue as Guest
                            </Button>
                            {/* Forgot your password? No worries! */}
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            {/* and done :) */}
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

console.log("You can log out any time you like, but you can never leave!");