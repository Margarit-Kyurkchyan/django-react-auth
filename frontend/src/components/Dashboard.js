import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, CircularProgress } from '@mui/material';

function Dashboard() {
  const navigate = useNavigate();
  const { authTokens, setAuthTokens } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/user/`, {
        headers: {
          Authorization: `Token ${authTokens.key}`,
        },
      })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [authTokens]);

  const handleLogout = () => {
    setAuthTokens(null);
    localStorage.removeItem('tokens');
    navigate('/login');
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 600 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            User Dashboard
          </Typography>
          {userData ? (
            <>
              <Typography variant="h6" component="p" gutterBottom>
                Welcome, {userData.email}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <CircularProgress />
              <Typography variant="body1" ml={2}>Loading...</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard;
