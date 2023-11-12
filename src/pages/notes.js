import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Input from '../components/Input';
import PopUpAlert from '../components/PopUpAlert';
import VehicleDropdown from '../components/VehicleDropdown';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump,faGauge,faMoneyBillWave,faOilCan,faCoins,faPenAlt, faPlus, faTimes, faChevronLeft, faBars, faDotCircle, faEllipsisVertical, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { helper } from "../context/helper";
import Api from "../context/api";
import { Spinner } from 'flowbite-react';

const Vehicles = () => {

    const navigate = useNavigate();
    const {authData} = useContext(authContext);
    const [vehicleActiveId, setVehicleActiveId] = useState(0);
    const { dateFormat,timeFormat,moneyFormat,numberFormat } = helper();
    const [notes, setNotes] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const [showModal,setShowModal]  = useState(false);
    const [error, setError] = useState('');
    const {alertConfirm, alertSuccess,alertError} = PopUpAlert();
    const [formData,setFormData]    = useState({
        id : '',
        odometer : '',
        maintenance_date : '',
        detail_maintenance : {}
    })

    const getNotes = async (id) => {
        if(id !== undefined && id !== 0){
            await Api.get('/maintenance/get/'+id)
            .then(function (response) {
                setNotes(response.data);
                setIsLoad(true);
            })
            .catch(function (error) {
                console.log(error.code);
            });
        }

    }

    const handleVehicleId   = (id) => {
        setIsLoad(false);
        setVehicleActiveId(id)
    }

    const resetForm = () => {
        setFormData({
            id : '',
            odometer : '',
            maintenance_date : '',
            detail_maintenance : {}
        });

    }

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleModal   = (show = null) => {
        resetForm();
        if(show !== null){
            setShowModal(show);
        }else{
            if(showModal){
                setShowModal(false);
            }else{
                setShowModal(true);
            }
        }
    }

    const handleFormModal = async () => {
        setIsSubmitForm(true);
        if(formData.id !== ''){
            await Api.post('/fuel/update/'+formData.id,formData)
            .then(function (response) {
                getNotes(vehicleActiveId)
                handleModal(false)
                setIsSubmitForm(false);
                alertSuccess(response.data.message);
            })
            .catch(function (error) {
                const data = error.response.data;
                setError(data.message);
            });    
        }else{
            await Api.post('/fuel/insert/'+vehicleActiveId,formData)
            .then(function (response) {
                getNotes(vehicleActiveId)
                handleModal(false)
                setIsSubmitForm(false);
                alertSuccess(response.data.message);
            })
            .catch(function (error) {
                const data = error.response.data;
                setError(data.message);
            });
        }
    }

    const handleDropdown    = (e) => {
        let parent  = e.target.closest('.dropdown');
        let drop    = parent.querySelector(".dropdown-menu");
        if(drop.classList.contains("hidden")){
            drop.classList.remove("hidden")
            document.getElementById("backdoor_dropdown").classList.remove("hidden");
        }else{
            drop.classList.add("hidden")
            document.getElementById("backdoor_dropdown").classList.add("hidden");
        }
    }

    const handleEditForm    = (e,fuel) =>{
        e.preventDefault();

        handleModal(true);
        setFormData({
            id : fuel.id,
            odometer : fuel.odometer,
            maintenance_date : fuel.maintenance_date,
            detail_maintenance : fuel.detail_maintenance
        });

        handleDropdown(e);
    }

    const handleDeleteForm    = async (e,id) =>{
        alertConfirm("Apakah kamu yakin akan menghapus data ini", async () => {
            await Api.post('/fuel/delete/'+id,formData)
            .then(function (response) {
                getNotes(vehicleActiveId)
                alertSuccess(response.data.message)
            })
            .catch(function (error) {
                const data = error.response.data;
                alertError(data.message);
            });
        })
        
        handleDropdown(e);
    }

    useEffect(() => {
        if(!authData.signedIn) {
            return navigate("/login")
        }
    }, []);

    useEffect(() => {
        getNotes(vehicleActiveId);
    }, [vehicleActiveId]);

    return (
        <>
            <Navbar page="notes" title="Catatan Lain">
                <VehicleDropdown handleVehicleId={handleVehicleId}/>

                <button type="button" onClick={e => handleModal(true)} className="text-white bg-sky-600 hover:bg-sky-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <FontAwesomeIcon fixedWidth icon={faPlus}/>
                    Tambah Catatan
                </button>
                <div>
                    {
                        isLoad && notes.map(maintenance => {
                            return (
                                <div key={`f_`+maintenance.id} className="rounded-lg mb-3 bg-white border border-gray-200 rounded-lg shadow">
                                    <div className="rounded-t-lg px-6 py-3 bg-sky-600 text-white grid grid-cols-2 items-center">
                                        <p className='font-semibold '>{dateFormat(maintenance.maintenance_date)} {timeFormat(maintenance.maintenance_date)}</p>
                                        <div className='flex justify-end relative dropdown'>
                                            <button onClick={handleDropdown} className="text-white dropdown-button font-semibold font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
                                                <FontAwesomeIcon icon={faEllipsisVertical}/>
                                            </button>

                                            <div className="z-10 hidden border-2 border-gray-200 dropdown-menu bg-white absolute right-[30px] rounded-lg shadow w-44 dark:bg-gray-700">
                                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <a href="#" onClick={e => {
                                                            handleEditForm(e,maintenance);
                                                        }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            <FontAwesomeIcon icon={faPenAlt} fixedWidth className='mr-2'/>
                                                            Edit
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#" onClick={e => {
                                                            handleDeleteForm(e,maintenance.id);
                                                        }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            <FontAwesomeIcon icon={faTrashAlt} fixedWidth className='mr-2'/>
                                                            Hapus
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" px-6 py-3">
                                        <div style={{ lineHeight:'30px' }} className='grid grid-cols-2 lg:grid-cols-3'>
                                            <div>
                                                <FontAwesomeIcon icon={faGauge} fixedWidth className='mr-5 text-sky-600'/>
                                                {numberFormat(maintenance.odometer)} Km
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    { (isLoad && notes.length === 0) && (<div className='text-center my-5 w-100 ring ring-sky-200 rounded-md p-8 text-sky-500'>
                        <p>Belum Ada Data</p>
                    </div>) }
                    { !isLoad && (<div className='text-center my-5 w-100'><Spinner/></div>) }
                </div>
            </Navbar>
        </>

    );
};
 
export default Vehicles;