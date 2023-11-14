import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import authContext from '../context/authContext';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Api from '../context/api';

const Statistic = () => {

	const navigate = useNavigate();
	const {authData} = useContext(authContext);
	const [chartKilometer,setChartKilometer] = useState([]);
	const [chartFuel,setChartFuel] = useState([]);
	const [chartFc,setChartFc] = useState([]);
	const [chartPrices,setChartPrices] = useState([]);

	const getDataForChartKilometer = async () => {        
        await Api.get('/chart/get_data_chart_kilometer',{
            withCredentials: true
        })
        .then(function (response) {
            setChartKilometer(getOptionChart("Jarak Tempuh","Km",response.data));
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

	const getDataForChartFuel = async () => {        
        await Api.get('/chart/get_data_chart_fuel',{
            withCredentials: true
        })
        .then(function (response) {
            setChartFuel(getOptionChart("Jumlah Liter BBM","liter",response.data));
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

	const getDataForChartFc = async () => {        
        await Api.get('/chart/get_data_chart_fc',{
            withCredentials: true
        })
        .then(function (response) {
            setChartFc(getOptionChart("Rata-rata Konsumsi BBM","Km/l",response.data));
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

	const getDataForChartPrices = async () => {        
        await Api.get('/chart/get_data_chart_total_prices',{
            withCredentials: true
        })
        .then(function (response) {
            setChartPrices(getOptionChart("Jumlah Pengeluaran","Rp",response.data));
        })
        .catch(function (error) {
            console.log(error.code);
        });
    }

	
	const getOptionChart 	= (title,yAxisTitle,data) => {
		const option = {
			title: {
			  text: title
			},
			xAxis: {
				categories: data.month
			},
			series: data.data,
			yAxis: {
				title: {
					text: yAxisTitle
				}
			},
		}

		return option;
	}

	useEffect(() => {
		if(!authData.signedIn) {
			return navigate("/login")
		}

		getDataForChartKilometer();
		getDataForChartFuel();
		getDataForChartFc();
		getDataForChartPrices();
	}, []);

	return (
		<>
			<Navbar page="statistic" title="Statistik">
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5'>
					<div className='bg-white shadow p-3 rounded-lg'>
						<HighchartsReact
							highcharts={Highcharts}
							options={chartKilometer}
						/>
					</div>
					<div className='bg-white shadow p-3 rounded-lg'>
						<HighchartsReact
							highcharts={Highcharts}
							options={chartFuel}
						/>
					</div>
					<div className='bg-white shadow p-3 rounded-lg'>
						<HighchartsReact
							highcharts={Highcharts}
							options={chartFc}
						/>
					</div>
					<div className='bg-white shadow p-3 rounded-lg'>
						<HighchartsReact
							highcharts={Highcharts}
							options={chartPrices}
						/>
					</div>
				</div>
			</Navbar>
		</>

	);
};
 
export default Statistic;