import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import VehicleDropdown from '../components/VehicleDropdown';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Api from '../context/api';
import { faBell, faBellConcierge, faClock, faGauge } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'flowbite-react';
import { helper } from '../context/helper';

const Reminder = () => {

    const navigate = useNavigate();
    const {authData} = useContext(authContext);
    const { dateFormat,numberFormat } = helper();
    const [vehicleActiveId, setVehicleActiveId] = useState(0);
    const [reminders, setReminders] = useState([]);
    const [isLoad, setIsLoad] = useState(false);

    const handleVehicleId   = (id) => {
        setIsLoad(false);
        setVehicleActiveId(id)
    }

    const getReminder = async (id) => {
        if(id !== undefined && id !== 0){
            await Api.get('/maintenance/reminder/'+id)
            .then(function (response) {
                setReminders(response.data);
                setIsLoad(true);
            })
            .catch(function (error) {
                console.log(error.code);
            });
        }

    }

    useEffect(() => {
        if(!authData.signedIn) {
            return navigate("/login")
        }   
    }, []);

    useEffect(() => {
        getReminder(vehicleActiveId)
    }, [vehicleActiveId]);

    return (
        <>
            <Navbar page="reminder" title="Pengingat">
                <VehicleDropdown handleVehicleId={handleVehicleId}/>

                <div className='grid xl:grid-cols-3 lg:grid-cols-2 gap-2 mt-3'>
                    {
                        isLoad && reminders.map(reminder => {
                            return (
                                <div  key={"r_"+reminder.id} className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg overflow-hidden'>
                                    <div className='bg-yellow-300 p-5 rounded-lg'>
                                        <FontAwesomeIcon fixedWidth icon={faBell} className={`text-white text-3xl`} />
                                    </div>
                                    <div className='ml-3'>
                                        <h1 className='text-xl font-semibold text-gray-800'>{reminder.title}</h1>
                                        {
                                            reminder.reminder_on_date && (
                                                <p className='text-sm text-gray-500'>
                                                    <FontAwesomeIcon fixedWidth icon={faClock} className='mr-3'/>
                                                    {dateFormat(reminder.reminder_on_date)}
                                                </p>
                                            )
                                        }
                                        {
                                            reminder.reminder_on_kilometer && (
                                                <p className='text-sm text-gray-500'>
                                                    <FontAwesomeIcon fixedWidth icon={faGauge} className='mr-3'/>
                                                    {numberFormat(reminder.reminder_on_kilometer)} Km
                                                </p>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                { (isLoad && reminders.length === 0) && (<div className='text-center my-5 w-100 ring ring-sky-200 rounded-md p-8 text-sky-500'>
                    <p>Belum Ada Data</p>
                </div>) }
                { !isLoad && (<div className='text-center my-5 w-100'><Spinner/></div>) }

            </Navbar>
        </>

    );
};
 
export default Reminder;