import React, { useContext, useEffect } from 'react';

import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChartSimple, faMotorcycle, faNoteSticky, faRoute } from '@fortawesome/free-solid-svg-icons';

const Home = () => {

	const navigate = useNavigate();
	const {authData} = useContext(authContext);

	useEffect(() => {
		if(!authData.signedIn) {
			return navigate("/login")
		}

		
	}, []);

	return (
		<>
			<Navbar page="home" title="Beranda">
				<div className='grid xl:grid-cols-3 lg:grid-cols-2 gap-2'>

					<Link to="/fuel" className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg overflow-hidden'>
						<div className='bg-gray-500 p-5 rounded-lg'>
							<FontAwesomeIcon fixedWidth icon={faRoute} className={`text-white text-3xl`} />
						</div>
						<div className='ml-3'>
							<h1 className='text-xl font-semibold text-gray-800'>Catatan Perjalanan</h1>
							<p className='text-sm text-gray-500'>
								Catat pengisian bahan bakarmu!
							</p>
						</div>
					</Link>

					<Link to="/reminder" className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg overflow-hidden'>
						<div className='bg-emerald-500 p-5 rounded-lg'>
							<FontAwesomeIcon fixedWidth icon={faBell} className={`text-white text-3xl`} />
						</div>
						<div className='ml-3'>
							<h1 className='text-xl font-semibold text-gray-800'>Pengingat</h1>
							<p className='text-sm text-gray-500'>
								Lihat pengingat yang sudah kamu atur!
							</p>
						</div>
					</Link>

					<Link to="/statistik" className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg overflow-hidden'>
						<div className='bg-yellow-300 p-5 rounded-lg'>
							<FontAwesomeIcon fixedWidth icon={faChartSimple} className={`text-white text-3xl`} />
						</div>
						<div className='ml-3'>
							<h1 className='text-xl font-semibold text-gray-800'>Statistik</h1>
							<p className='text-sm text-gray-500'>
								Lihat statistik kendaraanmu!
							</p>
						</div>
					</Link>

					<Link to="/notes" className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg overflow-hidden'>
						<div className='bg-red-500 p-5 rounded-lg'>
							<FontAwesomeIcon fixedWidth icon={faNoteSticky} className={`text-white text-3xl`} />
						</div>
						<div className='ml-3'>
							<h1 className='text-xl font-semibold text-gray-800'>Catatan Lain</h1>
							<p className='text-sm text-gray-500'>
								Catat pengeluaran kendaraanmu!
							</p>
						</div>
					</Link>

					<Link to="/vehicles" className='flex bg-white aligns p-2 shadow border border-gray-200 rounded-lg overflow-hidden'>
						<div className='bg-sky-500 p-5 rounded-lg'>
							<FontAwesomeIcon fixedWidth icon={faMotorcycle} className={`text-white text-3xl`} />
						</div>
						<div className='ml-3'>
							<h1 className='text-xl font-semibold text-gray-800'>Kendaraan</h1>
							<p className='text-sm text-gray-500'>
								Atur jumlah kendaraanmu!
							</p>
						</div>
					</Link>

				</div>
			</Navbar>
		</>

	);
};
 
export default Home;