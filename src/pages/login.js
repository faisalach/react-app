import React, { useEffect, useState } from 'react';
import  { Link, useNavigate } from 'react-router-dom';
import Api from '../context/api';

import { useAuth } from '../context/useAuth';
import Spinner from "../components/Spinner";
import Logo from '../components/Logo';

 
const Login = () => {
	const navigate = useNavigate();
	const {setAsLogged,userData} = useAuth();
	useEffect(() => {
		if(userData.signedIn) {
			navigate('/');
		}
	}, [userData.signedIn,navigate]);

	const [error, setError] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoad, setLoad] = useState(false);

	const submit = (e) => {
		e.preventDefault();
		setError('');
		setLoad(true);
		Api.get('../sanctum/csrf-cookie').then(() => {
			Api.post('/login', {
				username: username,
				password: password
			})
			.then(function (response) {
				setLoad(false);
				const data = response.data;
				setAsLogged(data.user);
			})
			.catch(function (error) {
				setLoad(false);
				const data = error?.response?.data;
				setError(data?.message);
			});
		});
	}
	

	return (
		<div className='sm:p-5 p-3 bg-gray-100'>
			<div className="shadow-xl grid sm:grid-cols-12 bg-white">
				<img className='lg:col-span-8 sm:col-span-6 w-full h-full max-h-[200px] sm:max-h-full object-cover' src='/images/bg-depan.jpg' alt='' />
				<div className='lg:col-span-4 sm:col-span-6 sm:p-10 p-7'>
					<div className='md:mb-10 md:mt-10 mb-5 sm:mt-5 flex justify-center'>
						<Logo color={'text-gray-700'}/>
					</div>
					<p className="text-gray-500 md:text-md text-sm">Login to continue</p>
					{ error !== '' && (
						<div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
							{ error }
						</div>
					)}
					
					<div className=" mt-5">
						<form onSubmit={ submit }>
							<div className="mb-3">
								<label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username / Email</label>
								<input id='username' placeholder="Type your username / email" onChange={ e => setUsername(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
								<input id='password' placeholder="Type your password" onChange={ e => setPassword(e.target.value)} type="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
							</div>
							<p className="text-gray-500 text-sm"><Link to="/forgot_password" className='text-blue-700 hover:text-blue-500'>Lupa Password?</Link></p>
							<div className='h-[50px]'></div>
							
							<div className="d-grid gap-2 mt-5">
								<p className="text-gray-500 text-center">Create new account? <Link to="/register" className='text-blue-700 hover:text-blue-500'>Register</Link></p>
								<button type="submit" disabled={ isLoad } className="text-white w-full mt-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
									Login
									{ isLoad && (
										<Spinner className="inline w-4 h-4 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"/>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};
 
export default Login;