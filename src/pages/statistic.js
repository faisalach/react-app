import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import VehicleDropdown from '../components/VehicleDropdown';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const Statistic = () => {

	const navigate = useNavigate();
	const {authData} = useContext(authContext);

	const options = {
		title: {
		  text: 'My chart'
		},
		series: [{
		  data: [1, 2, 3]
		}]
	}

	useEffect(() => {
		if(!authData.signedIn) {
			return navigate("/login")
		}

		
	}, []);

	return (
		<>
			<Navbar page="statistic" title="Statistik">
				<HighchartsReact
					highcharts={Highcharts}
					options={options}
				/>
				<ul>
					<li>DATA JUMLAH JARAK TEMPUH</li>
					<li>DATA JUMLAH LITER BBM</li>
					<li>DATA RATA-RATA KONSUMSI BBM</li>
					<li>DATA PER BULAN, PER 3 BULAN, PER 6 BULAN, PER TAHUN</li>
					<li>DATA PER KENDARAAN / SEMUA KENDARAAN</li>
				</ul>
			</Navbar>
		</>

	);
};
 
export default Statistic;