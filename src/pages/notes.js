import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import Input from '../components/Input';
import PopUpAlert from '../components/PopUpAlert';
import VehicleDropdown from '../components/VehicleDropdown';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge,faPenAlt, faPlus, faTimes, faEllipsisVertical, faTrashAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { helper } from "../context/helper";
import Api from "../context/api";
import { Spinner } from 'flowbite-react';
import FormDetailMaintenance from '../components/FormDetailMaintenance';

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
		detail_maintenance : []
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
			odometer : '',
			maintenance_date : currentDate,
			detail_maintenance : []
		});

		addDetailMaintenance()
	}

	const handleChange = e => {
		const { name, value } = e.target;
		let isArray 	= false;
		let newArr 		= [];

		let split_name 	= name.split("|");
		if(split_name.length > 1){
			let arr_name 	= split_name[0];
			let index 		= parseInt(split_name[1]);
			let key 		= split_name[2];
			let array 		= [];

			array 		= formData[arr_name];
			
			if(array[index] === undefined){
				array[index] 	= {};
			}
			
			array[index][key] 	= value;

			newArr[arr_name] 	= array
			isArray 	= true
		}
		
		if(isArray){
			setFormData(prevState => ({
				...prevState,
				...newArr
			}));
		}else{
			setFormData(prevState => ({
				...prevState,
				[name]: value
			}));
		}
	};

	const handleModal   = (show = null) => {
		if(show === true){
			resetForm();
		}
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
			await Api.post('/maintenance/update/'+formData.id,formData)
			.then(function (response) {
				getNotes(vehicleActiveId)
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
			await Api.post('/maintenance/insert/'+vehicleActiveId,formData)
			.then(function (response) {
				getNotes(vehicleActiveId)
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

	const handleEditForm    = (e,maintenance) =>{
		e.preventDefault();

		handleDropdown(e);
		
		Api.get('/maintenance/get_by_id/'+maintenance.id)
		.then(function (response) {
			setFormData(response.data)
			setShowModal(true);
		})
		.catch(function (error) {
			const data = error.response.data;
			alertError(data.message);
		});
	}

	const handleDeleteForm    = async (e,id) =>{
		alertConfirm("Apakah kamu yakin akan menghapus data ini", async () => {
			await Api.post('/maintenance/delete/'+id,formData)
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

	const addDetailMaintenance = () => {
		formData.detail_maintenance.push({
			title : "",
			price : "",
		});

		let name 	= "detail_maintenance";
		let value 	= formData.detail_maintenance;

		setFormData(prevState => ({
			...prevState,
			[name]: value
		}));
	}

	const deleteDetailMaintenance = (e,index) => {
		e.preventDefault();

		alertConfirm("Apakah kamu yakin akan menghapus data ini", () => {
			formData.detail_maintenance.splice( index, 1 )
		
			let name 	= "detail_maintenance";
			let value 	= formData.detail_maintenance;

			setFormData(prevState => ({
				...prevState,
				[name]: value
			}));
		})
		
		
	}

	const contentFormDetailMaintenance = () => {
		let content 	= []
		formData.detail_maintenance.map((data,index) => {
			content.push(<FormDetailMaintenance index={index} formData={data} length={formData.detail_maintenance.length} handleChange={handleChange}  deleteDetailMaintenance={deleteDetailMaintenance}/>)
		})
		return content
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
						isLoad && notes.map(maintenance => (
							<div key={`n_`+maintenance.id} className="rounded-lg mb-3 bg-white border border-gray-200 rounded-lg shadow">
								<div className="rounded-t-lg px-6 py-3 bg-sky-600 text-white grid grid-cols-2 items-center">
									<p className='font-semibold '>{dateFormat(maintenance.maintenance_date)} {timeFormat(maintenance.maintenance_date)}</p>
									<div className='flex justify-end relative dropdown'>
										<button onClick={handleDropdown} className="text-white dropdown-button font-semibold font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button">
											<FontAwesomeIcon icon={faEllipsisVertical}/>
										</button>

										<div className="z-10 hidden border-2 border-gray-200 dropdown-menu bg-white absolute right-[30px] rounded-lg shadow w-44 dark:bg-gray-700">
											<ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
												<li>
													<a href="/#" onClick={e => {
														handleEditForm(e,maintenance);
													}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
														<FontAwesomeIcon icon={faPenAlt} fixedWidth className='mr-2'/>
														Edit
													</a>
												</li>
												<li>
													<a href="/#" onClick={e => {
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
									<div className='mt-3'>
										<FontAwesomeIcon icon={faGauge} fixedWidth className='mr-5 text-sky-600'/>
										{numberFormat(maintenance.odometer)} Km
									</div>

									<div className="relative mb-3 shadow rounded-lg overflow-x-auto mt-5">
										<table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
											<thead className="text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
												<tr>
													<th className="px-6 py-3 border border-gray-200">
														Judul
													</th>
													<th className="px-6 py-3 border border-gray-200">
														Pengingat
													</th>
													<th className="px-6 py-3 border border-gray-200">
														Harga
													</th>
												</tr>
											</thead>
											<tbody>
												{
													maintenance.detail_maintenance.map(dm => (
														<tr key={"dm_"+dm.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
															<td className="px-6 py-4 border border-gray-200 font-medium text-gray-900 whitespace-nowrap dark:text-white">
																{dm.title}
															</td>
															<td className="px-6 py-4 border border-gray-200 font-medium text-gray-900 whitespace-nowrap dark:text-white">
																{
																	dm.reminder_on_date && (
																		<p className='text-sm text-gray-500'>
																			<FontAwesomeIcon fixedWidth icon={faClock} className='mr-3'/>
																			{dateFormat(dm.reminder_on_date)}
																		</p>
																	)
																}
																{
																	dm.reminder_on_kilometer && (
																		<p className='text-sm text-gray-500'>
																			<FontAwesomeIcon fixedWidth icon={faGauge} className='mr-3'/>
																			{numberFormat(dm.reminder_on_kilometer)} Km
																		</p>
																	)
																}
																{ (!dm.reminder_on_date && !dm.reminder_on_kilometer) && (<span>-</span>) }
															</td>
															<td className="px-6 py-4 border border-gray-200">
																{moneyFormat(dm.price)}
															</td>
														</tr>
													))
												}
											</tbody>
											<tfoot className="text-gray-700 dark:text-gray-400">
												<tr>
													<th colSpan={2} className="px-6 py-3 border border-gray-200">
														Total
													</th>
													<th className="px-6 py-3 border border-gray-200">
														{moneyFormat(maintenance.total_price)}
													</th>
												</tr>
											</tfoot>
										</table>
									</div>

								</div>
							</div>
						))
					}
					{ (isLoad && notes.length === 0) && (<div className='text-center my-5 w-100 ring ring-sky-200 rounded-md p-8 text-sky-500'>
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
								</button>
							</div>
							<div className="p-6 space-y-6">
								{ error !== '' && (
									<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
										{ error }
									</div>
								)}

								<Input 
									id="odometer" 
									title="Odometer" 
									type="number" 
									value={formData.odometer} 
									onChange={handleChange} 
									placeholder="Km"
									name="odometer"/>
									
								<Input 
									id="maintenance_date" 
									title="Tanggal" 
									type="datetime-local" 
									value={formData.maintenance_date} 
									onChange={handleChange} 
									placeholder="dd/mm/YYYY hh:ii"
									name="maintenance_date"/>

								<div className='grid grid-cols-2 items-center'>
									<h1 className='text-xl font-bold'>Rincian Catatan</h1>
									<button type="button" onClick={addDetailMaintenance} className="ml-auto text-white bg-sky-600 hover:bg-sky-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
										<FontAwesomeIcon fixedWidth icon={faPlus}/>
										Tambah Detail
									</button>
								</div>
								
								{contentFormDetailMaintenance()}
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