import React, { useEffect, useState } from "react";
import CardFuel from '../components/CardFuel';
import CardMaintenance from '../components/CardMaintenance';
import Api from "../context/api";
import { Spinner } from "flowbite-react";

const CardList = () => {
    const [vehicleLogs, setVehicleLogs] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [vehicleId]   = useState(1);

    const getLogs = async (id) => {
        await Api.get('/fuel/get/'+id,{
            withCredentials: true
        })
        .then(function (response) {
            setVehicleLogs(response.data);
            setIsLoad(true);
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

    useEffect(() => {
        getLogs(vehicleId);
    },[vehicleId])

    return (
        <>
        {
            isLoad ? (
                <>
                    {
                        vehicleLogs.map((log) => {
                            if(log.type === "fuel"){
                                return (
                                    <CardFuel key={"f_"+log.detail.id} fuel={log.detail}/>
                                )
                            }else if(log.type === "maintenance"){
                                return (
                                    <CardMaintenance key={"m_"+log.detail.id} maintenance={log.detail}/>
                                )
                            }
                        })
                    }
                    
                </>
            ) : (
                <div className='text-center my-5 w-100'>
                    <Spinner>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )
        }
           
            
        </>
    );
};
 
export default CardList;