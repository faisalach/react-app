import React, { useEffect, useState } from "react";
import { helper } from "../context/helper";
import Api from "../context/api";
import { Spinner } from "flowbite-react";
 
const Reminder = () => {
    const { dateFormat,numberFormat } = helper()

    const [vehicleReminder, setVehicleReminder] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [vehicleId]   = useState(1);

    const getReminder = async (id) => {
        await Api.get('/maintenance/reminder/'+id,{
            withCredentials: true
        })
        .then(function (response) {
            setVehicleReminder(response.data);
            setIsLoad(true);
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

    useEffect(() => {
        getReminder(vehicleId);
    },[])

    return (
        <>
            <div className="card loading">
                <div className="card-header bg-primary bg-gradient text-white" data-bs-toggle="collapse" href="#collapsePengingat" >
                    Pengingat
                </div>
                <div className="card-body collapse show" id="collapseExample">
                    {
                        isLoad ? (
                            <>
                                {
                                    vehicleReminder.length > 0 ? (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Nama Part</th>
                                                    <th>Waktu Pergantian</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    vehicleReminder.map((reminder) => {
                                                        return (
                                                            <tr key={'r_'+reminder.id}>
                                                                <td>{reminder.part_name}</td>
                                                                <td>
                                                                    {reminder.change_on_date && dateFormat(reminder.change_on_date)}
                                                                    <br/>
                                                                    {reminder.change_on_kilometer && numberFormat(reminder.change_on_kilometer) + " KM"}
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-center">Tidak Ada Pengingat</p>
                                    )
                                }
                            </>
                        ) : (
                            <div className='text-center my-2 w-100'>
                                <Spinner>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};
 
export default Reminder;