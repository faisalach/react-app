import React, { useEffect, useState } from 'react';
import Api from '../context/api';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faL, faMotorcycle } from '@fortawesome/free-solid-svg-icons';

function VehicleDropdown(props) {
    const [vehicles, setVehicles] = useState([]);
    const [vehicleActive,setVehicleActive]  = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [dropIsShow, setDropIsShow] = useState(false);

    const getVehicles = async () => {        
        await Api.get('/vehicle/get',{
            withCredentials: true
        })
        .then(function (response) {
            setVehicles(response.data);

            if(response.data.length > 0){
                if(localStorage.getItem("vehicleActive")){
                    const v_active  = localStorage.getItem("vehicleActive");
                    let v_active_id     = 0;
                    response.data.forEach(row => {
                        if(parseInt(v_active) === parseInt(row.id)){
                            v_active_id = row.id;
                        }
                    })
                    if(v_active_id !== 0){
                        handleActiveVehicle(v_active)
                    }else{
                        handleActiveVehicle(response.data[0].id)
                    }
                }else{
                    handleActiveVehicle(response.data[0].id)
                }
            }
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

    const handleDropShow = () => {
        if(dropIsShow){
            setDropIsShow(false);
        }else{
            setDropIsShow(true);
        }
    }

    const handleActiveVehicle = async (vehicle_id) => {
        if(vehicle_id !== null && vehicle_id !== undefined && vehicle_id !== "undefined"){
            await Api.get('/vehicle/get/'+vehicle_id,{
                withCredentials: true
            })
            .then(function (response) {
                localStorage.setItem("vehicleActive",response.data.id);
                if(response.data.id !== vehicleActive.id){
                    setVehicleActive(response.data);
                    props.handleVehicleId(response.data.id);
                    setIsLoad(true);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    useEffect(() => {
        getVehicles();
    },[])

    return (
        <>
            <div className='relative dropdown'>
                <button onClick={handleDropShow} className="w-full text-blue-600 border-2 border-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center" type="button">
                    <span className='mr-4 flex items-center'>
                        <FontAwesomeIcon icon={faMotorcycle} className='text-4xl text-gray-600 mr-5'/>
                        {
                            (isLoad && vehicleActive) ? (
                                <div className='text-left'>
                                    <h3 className='text-gray-600 text-lg font-bold'>{vehicleActive && vehicleActive.vehicle_brand} {vehicleActive && vehicleActive.vehicle_model}</h3>
                                    <p className='text-gray-600 text-sm'>{vehicleActive && vehicleActive.number_plate}</p>
                                </div>
                            ) : (
                                <div className='text-left'>
                                    <h3 className='load-wraper h-[25px] mb-2 w-[120px]'></h3>
                                    <p className='load-wraper h-[20px] w-[70px]'></p>
                                </div>
                            )
                        }
                    </span>
                    <svg className="w-2.5 h-2.5 ml-auto" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                </button>

                <div className={`z-10 bg-white ${!dropIsShow && 'hidden'} absolute border-2 border-blue-300 top-full left-0 right-0 rounded-lg shadow w-full mt-1 dark:bg-gray-700 `}>
                    <ul className=" text-sm text-gray-600 dark:text-gray-200">
                        {
                            vehicles.map((vehicle) => {
                                return (
                                    <li key={"v_"+vehicle.id}>
                                        <a href="#" onClick={e => {handleActiveVehicle(vehicle.id);handleDropShow();}} data-id={vehicle} className={`block px-4 py-2 rounded-md ${vehicle.id === vehicleActive.id ? "text-white text-gray-600 bg-sky-600 hover:bg-sky-800" : 'hover:bg-gray-100'} `}>
                                            <span className='mr-4 flex items-center'>
                                                <FontAwesomeIcon icon={faMotorcycle} className='text-4xl mr-5'/>
                                                <div className='text-left'>
                                                    <h3 className='text-lg font-bold'>{vehicle.vehicle_brand} {vehicle.vehicle_model}</h3>
                                                    <p className='text-sm'>{vehicle.number_plate}</p>
                                                </div>
                                            </span>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}

export default VehicleDropdown;
