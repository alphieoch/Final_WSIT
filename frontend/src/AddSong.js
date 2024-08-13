import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardMedia,
    CardContent,
    Snackbar,
    Alert,
} from '@mui/material';

console.log("Welcome to the master's chambers... Add your favorite tunes!");

const DISCOGS_CONSUMER_KEY = 'IfZjDushPdQvLMxAbZFW';
const DISCOGS_CONSUMER_SECRET = 'OnMeqvyCRYijaHWMhAXcKxxXnDbrfCrK';

function AddSong() {
    const [song, setSong] = useState({ title: '', artist: '', genre: '' });
    const [songs, setSongs] = useState([]);
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cancelTokenRef = useRef(null);

    useEffect(() => {
        return () => {
            if (cancelTokenRef.current) {
                cancelTokenRef.current.cancel('Operation cancelled due to new request.');
            }
        };
    }, []);

    const handleChange = (event) => {
        console.log(`Changing ${event.target.name}: ${event.target.value}`);
        setSong({ ...song, [event.target.name]: event.target.value });
    };

    const searchDiscogs = async () => {
        setLoading(true);
        setError(null);

        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel('Operation cancelled due to new request.');
        }
        cancelTokenRef.current = axios.CancelToken.source();

        try {
            console.log("Searching for song details... 'How they dance in the courtyard'");
            const response = await axios.get('https://api.discogs.com/database/search', {
                params: {
                    q: `${song.title} ${song.artist}`,
                    type: 'release',
                    key: DISCOGS_CONSUMER_KEY,
                    secret: DISCOGS_CONSUMER_SECRET,
                },
                cancelToken: cancelTokenRef.current.token,
            });

            if (response.data.results.length > 0) {
                const releaseId = response.data.results[0].id;
                const releaseDetails = await axios.get(`https://api.discogs.com/releases/${releaseId}`, {
                    params: {
                        key: DISCOGS_CONSUMER_KEY,
                        secret: DISCOGS_CONSUMER_SECRET,
                    },
                    cancelToken: cancelTokenRef.current.token,
                });

                // "Mirrors on the ceiling..." - Fetching album art
                setMetadata({
                    title: releaseDetails.data.title,
                    artist: releaseDetails.data.artists[0].name,
                    year: releaseDetails.data.year,
                    genres: releaseDetails.data.genres,
                    styles: releaseDetails.data.styles,
                    tracklist: releaseDetails.data.tracklist,
                    images: releaseDetails.data.images,
                    credits: releaseDetails.data.extraartists,
                });
                console.log("Song details found. 'Sweet summer sweat'");
            } else {
                setMetadata(null);
                setError('No results found on Discogs');
            }
        } catch (error) {
            // "We are all just prisoners here, of our own device" - Error handling
            if (axios.isCancel(error)) {
                console.log('Request cancelled:', error.message);
            } else if (error.response) {
                if (error.response.status === 429) {
                    // "They stab it with their steely knives, but they just can't kill the beast" - Rate limiting
                    setError('Rate limit exceeded. Please try again later.');
                } else {
                    setError(`Error: ${error.response.data.message || 'An unexpected error occurred'}`);
                }
            } else {
                setError('An unexpected error occurred');
            }
            setMetadata(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Trying to add a new song to our collection...");
        if (song.title && song.artist) {
            await searchDiscogs();
            if (metadata) {
                setSongs([...songs, { ...song, metadata }]);
                setSong({ title: '', artist: '', genre: '' });
                setMetadata(null);
                console.log("New song added to the list. We haven't had that spirit here since 1969!");
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                {/* Song List */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Song List
                        </Typography>
                        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {songs.map((s, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={s.title}
                                        secondary={`${s.artist} - ${s.genre}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                {/* Add Song Form and Metadata */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Add New Song
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Song Title"
                                name="title"
                                value={song.title}
                                onChange={handleChange}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="artist"
                                label="Artist"
                                name="artist"
                                value={song.artist}
                                onChange={handleChange}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="genre-label">Genre</InputLabel>
                                <Select
                                    labelId="genre-label"
                                    id="genre"
                                    name="genre"
                                    value={song.genre}
                                    label="Genre"
                                    onChange={handleChange}
                                >
                                    {/* Add genre options here */}
                                </Select>
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Add Song'}
                            </Button>
                        </Box>
                        {/* "Pink champagne on ice" - Displaying song metadata */}
                        {metadata && (
                            <Card sx={{ mt: 2 }}>
                                {metadata.images && metadata.images[0] && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={metadata.images[0].uri}
                                        alt={metadata.title}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{metadata.title}</Typography>
                                    <Typography variant="subtitle1">{metadata.artist}</Typography>
                                    <Typography variant="body2">Year: {metadata.year}</Typography>
                                    <Typography variant="body2">Genres: {metadata.genres.join(', ')}</Typography>
                                    <Typography variant="body2">Styles: {metadata.styles.join(', ')}</Typography>
                                    <Typography variant="h6" sx={{ mt: 2 }}>Tracklist:</Typography>
                                    <List>
                                        {metadata.tracklist.map((track, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={track.title} secondary={track.duration} />
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Typography variant="h6" sx={{ mt: 2 }}>Credits:</Typography>
                                    <List>
                                        {metadata.credits.map((credit, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={credit.name} secondary={credit.role} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
}

console.log("Remember: you can check-out any time you like, but you can never leave the music behind!");

export default AddSong;