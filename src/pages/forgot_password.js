import React, { useContext, useEffect, useState } from 'react';
import  { Link, useNavigate } from 'react-router-dom';
import Api from '../context/api';

import { useAuth } from '../context/useAuth';
import AuthContext from "../context/authContext";
import Spinner from "../components/Spinner";
import PopUpAlert from '../components/PopUpAlert';
import Logo from '../components/Logo';

 
const ForgotPassword = () => {
	const navigate = useNavigate();
	const {setAsLogged} = useAuth();
	const {authData} = useContext(AuthContext);
	useEffect(() => {
		if(authData.signedIn) {
			navigate('/');
		}
	}, []);

	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [isLoad, setLoad] = useState(false);
    const {alertSuccess}    = PopUpAlert();

	const submit = (e) => {
		e.preventDefault();
		setError('');
		setLoad(true);
        Api.post('/forgot_password', {
            email: email,
        })
        .then(function (response) {
            const data = response.data;
            alertSuccess(data.message);
            setTimeout(function(){
                navigate("/login");
            },2000)
            setLoad(false);
        })
        .catch(function (error) {
            const data = error.response.data;
            setError(data.message);
            setLoad(false);
        });
	}
	

	return (
		<div className="grid sm:grid-cols-12">
			<img className='md:col-span-8 sm:col-span-6 w-full h-full max-h-[200px] sm:max-h-full object-cover' src='/images/bg-depan.jpg' alt='' />
			<div className='md:col-span-4 sm:col-span-6 sm:min-h-screen sm:p-10 p-7'>
				<div className='md:mb-10 md:mt-10 mb-5 sm:mt-5 flex justify-center'>
					<Logo color={'text-gray-700'}/>
				</div>
				<p className="text-gray-500 md:text-md text-sm">Forgot for setup new password</p>
				{ error !== '' && (
					<div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
						{ error }
					</div>
				)}
				
				<div className="mt-5">
					<form onSubmit={ submit }>
						<div className="mb-3">
							<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
							<input id='email' placeholder="Type your email" onChange={ e => setEmail(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
						</div>
						<div className='h-[70px]'></div>
						
						<div className="d-grid gap-2 mt-5">
							<p className="text-gray-500 text-center">Have an account? <Link to="/login" className='text-blue-700 hover:text-blue-500'>Login</Link></p>
							<button type="submit" disabled={ isLoad } className="text-white w-full mt-3 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-500 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
								Forgot Password
								{ isLoad && (
									<Spinner className="inline w-4 h-4 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"/>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};
 
export default ForgotPassword;