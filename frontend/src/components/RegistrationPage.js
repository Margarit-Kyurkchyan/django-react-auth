import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
    Container, TextField, Paper, Typography, Button, Box, IconButton, InputAdornment, Link
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function RegistrationPage(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        if (!email || !password1 || !password2) {
            setError('All fields are required');
            return false;
        }
        if (password1 !== password2) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleRegistration = () => {
        if (!validateForm()) {
            return;
        }
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/auth/registration/`, {
                email, password1, password2,
            })
            .then((res) => {
                navigate('/login');
            })
            .catch((err) => {
                setError('Registration failed');
            });
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Paper elevation={3} sx={{ padding: 4 }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Register
                    </Typography>
                    {error && (
                        <Typography color="error" gutterBottom>
                            {error}
                        </Typography>
                    )}
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleRegistration}
                        >
                            Register
                        </Button>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/login">
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default RegistrationPage;
