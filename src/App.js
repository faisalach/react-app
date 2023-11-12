import React, { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Fuel from './pages/fuel';
import Reminder from './pages/reminder';
import Notes from './pages/notes';
import Statistic from './pages/statistic';
import Vehicles from './pages/vehicles';
import Login from './pages/login';
import Register from './pages/register';
import { Layout } from './components/Layout';
import AuthContext from './context/authContext';
import { useAuth } from "./context/useAuth";
 
function App() {
    const {userData} = useAuth();
    const [authData, setAuthData] = useState({signedIn: userData.signedIn});
    return (
        <AuthContext.Provider value={{authData, setAuthData }}>
            <Layout>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route path='/fuel' element={<Fuel />} />
                    <Route path='/reminder' element={<Reminder />} />
                    <Route path='/notes' element={<Notes />} />
                    <Route path='/statistic' element={<Statistic />} />
                    <Route path='/vehicles' element={<Vehicles />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Routes>
            </Layout>
        </AuthContext.Provider>
    );
}
 
export default App;