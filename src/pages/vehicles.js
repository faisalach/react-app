import React, { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faGauge, faHashtag, faMotorcycle, faPenAlt, faPlus, faTimes, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { helper } from '../context/helper';
import Api from '../context/api';
import { Spinner } from 'flowbite-react';
import PopUpAlert from '../components/PopUpAlert';
import { useAuth } from '../context/useAuth';

const Vehicles = () => {

	const navigate 		= useNavigate();
	const {userData} 	= useAuth();
	useEffect(() => {
		if(!userData.signedIn) {
			navigate('/login');
		}
	}, [userData.signedIn,navigate]);

	const [vehicles, setVehicles] = useState([]);
	const { numberFormat } = helper();
	const [isLoad, setIsLoad] = useState(false);
	const [isSubmitForm, setIsSubmitForm] = useState(false);
	const [showModal,setShowModal]  = useState(false);
	const [error, setError] = useState('');
	const {alertConfirm, alertSuccess,alertError} = PopUpAlert();
	const [formData,setFormData]    = useState({
		id : '',
		vehicle_brand : '',
		vehicle_model : '',
		number_plate : '',
		odometer : '',
		last_odometer : {},
	})
	
	const getVehicles = async () => {
		await Api.get('/vehicle/get/')
		.then(function (response) {
			setVehicles(response.data);
			setIsLoad(true);
		})
		.catch(function (error) {
			console.log(error.code);
		});
	}

	const resetForm = () => {
		setFormData({
			id : '',
			vehicle_brand : '',
			vehicle_model : '',
			number_plate : '',
			odometer : '',
			last_odometer : {},
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
			await Api.post('/vehicle/update/'+formData.id,formData)
			.then(function (response) {
				getVehicles()
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
			await Api.post('/vehicle/insert/',formData)
			.then(function (response) {
				getVehicles()
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

	const handleEditForm    = (e,vehicle) =>{
		e.preventDefault();

		handleModal(true);
		setFormData({
			id : vehicle.id,
			vehicle_brand : vehicle.vehicle_brand,
			vehicle_model : vehicle.vehicle_model,
			number_plate : vehicle.number_plate,
			odometer : vehicle.last_odometer && vehicle.last_odometer.odometer,
			last_odometer : vehicle.last_odometer
		});

		handleDropdown(e);
	}

	const handleDeleteForm    = async (e,id) =>{
		alertConfirm("Apakah kamu yakin akan menghapus data ini", async () => {
			await Api.post('/vehicle/delete/'+id,formData)
			.then(function (response) {
				getVehicles()
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
		getVehicles();
	}, []);

	return (
		<>
			<Navbar page="vehicles" title="Kendaraan">
				<button type="button" onClick={e => handleModal(true)} className="fixed bottom-10 z-10 right-10 text-white bg-sky-600 hover:bg-sky-800 font-medium text-2xl rounded-full px-4 py-[15px] ring-2 ring-gray-300 shadow-lg sm:ring-0 sm:shadow-none sm:py-2.5 mr-2 mt-2 mb-2 sm:rounded-lg sm:static sm:text-sm">
					<FontAwesomeIcon fixedWidth icon={faPlus}/>
					<span className='sm:inline hidden'>Tambah Catatan</span>
				</button>
				<div className='grid xl:grid-cols-2 lg:grid-cols-2 gap-2 mt-3'>
					{
						isLoad && vehicles.map(vehicle => (
							<div key={"v_"+vehicle.id} className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg relative'>
								<div className='bg-blue-500 p-5 rounded-lg'>
									<FontAwesomeIcon fixedWidth icon={faMotorcycle} className={`text-white text-3xl`} />
								</div>
								<div className='ml-3'>
									<div className='flex justify-end absolute top-0 right-0 dropdown'>
										<button onClick={handleDropdown} className="dropdown-button font-semibold font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
											<FontAwesomeIcon icon={faEllipsisVertical}/>
										</button>

										<div className="z-10 hidden border-2 border-gray-200 dropdown-menu bg-white absolute right-[30px] rounded-lg shadow w-44 dark:bg-gray-700">
											<ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
												<li>
													<a href="/#" onClick={e => {
														handleEditForm(e,vehicle);
													}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
														<FontAwesomeIcon icon={faPenAlt} fixedWidth className='mr-2'/>
														Edit
													</a>
												</li>
												{ vehicles.length > 1 && (
													<li>
														<a href="/#" onClick={e => {
															handleDeleteForm(e,vehicle.id);
														}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
															<FontAwesomeIcon icon={faTrashAlt} fixedWidth className='mr-2'/>
															Hapus
														</a>
													</li>
												) }
											</ul>
										</div>
									</div>
									<h1 className='text-xl font-semibold text-gray-800'>{vehicle.vehicle_brand} {vehicle.vehicle_model}</h1>
									<p className='text-sm text-gray-500'>
										<FontAwesomeIcon fixedWidth icon={faHashtag} className='mr-2'/>
										{vehicle.number_plate}
									</p>
									<p className='text-sm text-gray-500'>
										<FontAwesomeIcon fixedWidth icon={faGauge} className='mr-2'/>
										{vehicle.last_odometer ? numberFormat(vehicle.last_odometer.odometer) : 0} Km
									</p>
								</div>
							</div>
						))
					}
				</div>

				{ (isLoad && vehicles.length === 0) && (<div className='text-center my-5 w-100 ring ring-sky-200 rounded-md p-8 text-sky-500'>
					<p>Belum Ada Data</p>
				</div>) }
				{ !isLoad && (<div className='text-center my-5 w-100'><Spinner/></div>) }
			</Navbar>


			<div className={`fixed top-0 left-0 right-0 z-50 ${!showModal && 'hidden'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full`}>
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
									id="vehicle_brand" 
									title="Merek Kendaraan" 
									type="text" 
									value={formData.vehicle_brand} 
									onChange={handleChange} 
									placeholder="Type the brand" 
									name="vehicle_brand"/>
									
								<Input 
									id="vehicle_model" 
									title="Model Kendaraan" 
									type="text" 
									value={formData.vehicle_model} 
									onChange={handleChange} 
									placeholder="Type the model" 
									name="vehicle_model"/>

								<Input 
									id="number_plate" 
									title="Plat Nomor" 
									type="text" 
									value={formData.number_plate} 
									onChange={handleChange} 
									placeholder="Type the number plate" 
									name="number_plate"/>

								<Input
									id="odometer" 
									title="Odometer" 
									type="number"
									disabled={formData.last_odometer && Object.keys(formData.last_odometer).length > 0}
									value={formData.odometer} 
									onChange={handleChange} 
									placeholder="Type the odometer (Km)" 
									name="odometer"/>
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
 
export default Vehicles;