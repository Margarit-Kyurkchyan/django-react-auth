import React from 'react';
// import React, {useEffect, useState} from 'react';
// import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegistrationPage/>}/>
                {/* Private routes */}
                <Route element={<PrivateRoute/>}>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    {/* Add more private routes here */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
