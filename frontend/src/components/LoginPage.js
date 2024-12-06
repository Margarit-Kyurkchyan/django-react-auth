import React, {useState, useContext} from 'react';
import {axios} from '../utils/helpers';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import {Button, Container, TextField, Paper, Typography, Box, IconButton, InputAdornment, Link} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginPage(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setAuthTokens} = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        setLoading(true);
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/auth/login/`, {email, password})
            .then((res) => {
                setAuthTokens(res.data);
                navigate('/dashboard');
            })
            .catch((err) => {
                console.log(err);
                setError('Invalid email or password');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleGoogleLogin = (response) => {
        if (response.credential) {
            const formData = new FormData();
            formData.append('credential', response.credential);

            axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/auth/google/login/token/`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true, // Important for handling cookies if needed
                })
                .then((res) => {
                    console.log('Login successful', res.data);
                    // Assuming you have some function like setAuthTokens to store the token or user data
                    setAuthTokens(res.data);
                    // Navigate to the dashboard or any authenticated route
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.error('Login failed:', err.response?.data || err.message);
                    setError('Google login failed: ' + (err.response?.data?.detail || 'Unknown error'));
                });
        } else {
            setError('Google login failed: Invalid response');
        }
    };


    const handleGoogleFailure = (response) => {
        console.log('handleGoogleFailure', response);
        setError('Google login failed');
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Paper elevation={3} sx={{padding: 4}}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Login
                    </Typography>
                    {error && <Typography color="error" gutterBottom>{error}</Typography>}
                    <TextField
                        label="Email"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box mt={2} mb={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </Box>
                    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={handleGoogleFailure}
                            cookiePolicy={'single_host_origin'}
                            render={renderProps => (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                    startIcon={<img src="https://developers.google.com/identity/images/g-logo.png"
                                                    alt="Google logo" style={{width: 20, marginRight: 8}}/>}
                                >
                                    Sign in with Google
                                </Button>
                            )}
                        />
                    </GoogleOAuthProvider>
                    <Box mt={2}>
                        <Typography variant="body2" align="center">
                            Don't have an account?{' '}
                            <Link component={RouterLink} to="/register">
                                Register here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;
