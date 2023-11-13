import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Input from '../components/Input';
import PopUpAlert from '../components/PopUpAlert';
import VehicleDropdown from '../components/VehicleDropdown';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGasPump,faGauge,faMoneyBillWave,faOilCan,faCoins,faPenAlt, faPlus, faTimes, faEllipsisVertical, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { helper } from "../context/helper";
import Api from "../context/api";
import { Spinner } from 'flowbite-react';


const Fuel = () => {

	const navigate = useNavigate();
	const {authData} = useContext(authContext);
	const [vehicleActiveId, setVehicleActiveId] = useState(0);
	const { dateFormat,timeFormat,moneyFormat,numberFormat } = helper();
	const [vehicleLogs, setVehicleLogs] = useState([]);
	const [isLoad, setIsLoad] = useState(false);
	const [isSubmitForm, setIsSubmitForm] = useState(false);
	const [showModal,setShowModal]  = useState(false);
	const [error, setError] = useState('');
	const {alertConfirm, alertSuccess,alertError} = PopUpAlert();
	const [formData,setFormData]    = useState({
		id : '',
		fuel_name : '',
		price_per_liter : '',
		total_price : '',
		odometer : '',
		filling_date : '',
	})

	const getLogs = async (id) => {
		if(id !== undefined && id !== 0){
			await Api.get('/fuel/get/'+id)
			.then(function (response) {
				setVehicleLogs(response.data);
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
		const d     = new Date();
		let year    = d.getFullYear();
		let month   = (d.getMonth() + 1);
		let date    = d.getDate();
		let hour    = d.getHours();
		let minute  = d.getMinutes();

		month       = month > 9 ? month : "0"+month;
		date        = date > 9 ? date : "0"+date;
		hour        = hour > 9 ? hour : "0"+hour;
		minute      = minute > 9 ? minute : "0"+minute;

		let currentDate     = `${year}-${month}-${date} ${hour}:${minute}:00`;

		setFormData({
			id : '',
			fuel_name : '',
			price_per_liter : '',
			total_price : '',
			odometer : '',
			filling_date : currentDate,
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
				getLogs(vehicleActiveId)
				handleModal(false)
				setIsSubmitForm(false);
				alertSuccess(response.data.message);
			})
			.catch(function (error) {
				const data = error.response.data;
				setError(data.message);
				setIsSubmitForm(false);
			});    
		}else{
			await Api.post('/fuel/insert/'+vehicleActiveId,formData)
			.then(function (response) {
				getLogs(vehicleActiveId)
				handleModal(false)
				setIsSubmitForm(false);
				alertSuccess(response.data.message);
			})
			.catch(function (error) {
				const data = error.response.data;
				setError(data.message);
				setIsSubmitForm(false);
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
			fuel_name : fuel.fuel_name,
			price_per_liter : fuel.price_per_liter,
			total_price : fuel.total_price,
			odometer : fuel.odometer,
			filling_date : fuel.filling_date,
		});

		handleDropdown(e);
	}

	const handleDeleteForm    = async (e,id) =>{
		alertConfirm("Apakah kamu yakin akan menghapus data ini", async () => {
			await Api.post('/fuel/delete/'+id,formData)
			.then(function (response) {
				getLogs(vehicleActiveId)
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
		getLogs(vehicleActiveId);
	}, [vehicleActiveId]);


	return (
		<>
			<Navbar page="fuel" title="Catatan Perjalanan">
				<VehicleDropdown handleVehicleId={handleVehicleId}/>

				<button type="button" onClick={e => handleModal(true)} className="fixed bottom-10 z-10 right-10 text-white bg-sky-600 hover:bg-sky-800 font-medium text-2xl rounded-full px-4 py-[15px] ring-2 ring-gray-300 shadow-lg sm:ring-0 sm:shadow-none sm:py-2.5 mr-2 mt-2 mb-2 sm:rounded-lg sm:static sm:text-sm">
					<FontAwesomeIcon fixedWidth icon={faPlus}/>
					<span className='sm:inline hidden'>Tambah Catatan</span>
				</button>
				<div>
					{
						isLoad && vehicleLogs.map(fuel => (
							<div key={`f_`+fuel.id} className="rounded-lg mb-3 bg-white border border-gray-200 rounded-lg shadow">
								<div className="rounded-t-lg px-6 py-3 bg-sky-600 text-white grid grid-cols-2 items-center">
									<p className='font-semibold '>{dateFormat(fuel.filling_date)} {timeFormat(fuel.filling_date)}</p>
									<div className='flex justify-end relative dropdown'>
										<button onClick={handleDropdown} className="text-white dropdown-button font-semibold font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
											<FontAwesomeIcon icon={faEllipsisVertical}/>
										</button>

										<div className="z-10 hidden border-2 border-gray-200 dropdown-menu bg-white absolute right-[30px] rounded-lg shadow w-44 dark:bg-gray-700">
											<ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
												<li>
													<a href="/#" onClick={e => {
														handleEditForm(e,fuel);
													}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
														<FontAwesomeIcon icon={faPenAlt} fixedWidth className='mr-2'/>
														Edit
													</a>
												</li>
												<li>
													<a href="/#" onClick={e => {
														handleDeleteForm(e,fuel.id);
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
											<FontAwesomeIcon icon={faPenAlt} fixedWidth className='mr-5 text-sky-600'/>
											{fuel.fuel_name}
										</div>
										<div>
											<FontAwesomeIcon icon={faGasPump} fixedWidth className='mr-5 text-sky-600'/>
											{numberFormat(fuel.number_of_liter)}ltr
										</div>
										<div>
											<FontAwesomeIcon icon={faGauge} fixedWidth className='mr-5 text-sky-600'/>
											{numberFormat(fuel.odometer)} Km
										</div>
										<div>
											<FontAwesomeIcon icon={faCoins} fixedWidth className='mr-5 text-sky-600'/>
											{moneyFormat(fuel.price_per_liter)}/ltr
										</div>
										<div>
											<FontAwesomeIcon icon={faOilCan} fixedWidth className='mr-5 text-sky-600'/>
											{numberFormat(fuel.fuel_consumption)} Km/l
										</div>
										<div>
											<FontAwesomeIcon icon={faMoneyBillWave} fixedWidth className='mr-5 text-sky-600'/>
											{moneyFormat(fuel.total_price)}
										</div>
									</div>
								</div>
							</div>
						))
					}
					{ (isLoad && vehicleLogs.length === 0) && (<div className='text-center my-5 w-100 ring ring-sky-200 rounded-md p-8 text-sky-500'>
						<p>Belum Ada Data</p>
					</div>) }
					{ !isLoad && (<div className='text-center my-5 w-100'><Spinner/></div>) }
				</div>
			</Navbar>
			
			<div tabIndex="-1" className={`fixed top-0 left-0 right-0 z-50 ${!showModal && 'hidden'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full`}>
				<div onClick={e => handleModal(false)} className='fixed top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-50'></div>
				<div className="relative mx-auto w-full max-w-2xl max-h-full">
					<form id='formSubmit' onSubmit={handleFormModal}>
						<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
							<div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									{formData.id ? "Edit Catatan" : "Tambah Catatan"}
								</h3>
								<button type="button" onClick={e => handleModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
									<FontAwesomeIcon icon={faTimes}/>
									<span className="sr-only">Close modal</span>
								</button>
							</div>
							<div className="p-6 space-y-6">
								{ error !== '' && (
									<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
										{ error }
									</div>
								)}
								<Input 
									id="fuel_name" 
									title="Nama Bahan Bakar" 
									type="text" 
									value={formData.fuel_name} 
									onChange={handleChange} 
									placeholder="Type Fuel Name" 
									name="fuel_name"/>
									
								<Input 
									id="price_per_liter" 
									title="Harga/l" 
									type="number" 
									value={formData.price_per_liter} 
									onChange={handleChange} 
									placeholder="Rp"
									name="price_per_liter"/>
									
								<Input 
									id="total_price" 
									title="Jumlah Pembelian" 
									type="number" 
									value={formData.total_price} 
									onChange={handleChange} 
									placeholder="Rp"
									name="total_price"/>

								<Input 
									id="odometer" 
									title="Odometer" 
									type="number" 
									value={formData.odometer} 
									onChange={handleChange} 
									placeholder="Km"
									name="odometer"/>
									
								<Input 
									id="filling_date" 
									title="Tanggal" 
									type="datetime-local" 
									value={formData.filling_date} 
									onChange={handleChange} 
									placeholder="dd/mm/YYYY hh:ii"
									name="filling_date"/>

							</div>
							<div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 justify-end">
								<button onClick={e => handleModal(false)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Tutup</button>
								<button disabled={isSubmitForm} onClick={handleFormModal} type="button" className="text-white bg-blue-700 disabled:bg-blue-500 disabled:cursor-wait hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
									Submit
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>

	);
};
 
export default Fuel;