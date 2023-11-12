import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import VehicleDropdown from '../components/VehicleDropdown';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Vehicles = () => {

    const navigate = useNavigate();
    const {authData} = useContext(authContext);

    useEffect(() => {
        if(!authData.signedIn) {
            return navigate("/login")
        }

        
    }, []);

    return (
        <>
            <Navbar page="notes" title="Catatan Lain">
                <ul>
                    <li>GET CATATAN LAIN</li>
                    <li>INSERT CATATAN LAIN</li>
                    <li>UPDATE CATATAN LAIN</li>
                    <li>DELETE CATATAN LAIN</li>
                </ul>
            </Navbar>
        </>

    );
};
 
export default Vehicles;