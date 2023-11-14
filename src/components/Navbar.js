import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faBell, faChartSimple, faGasPump, faGears, faHomeAlt, faMotorcycle, faNoteSticky, faRightFromBracket, faRoute, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/useAuth";
import Api from "../context/api";
import { Link } from "react-router-dom";
import Logo from "./Logo";
 
const Navbar = ({children,page,title}) => {

	const {setLogout} = useAuth();
	const [sidebarIsHidden,setSidebarIsHidden] = useState(true);

	const handleSidebar = () => {
		if(sidebarIsHidden){
			setSidebarIsHidden(false);
		}else{
			setSidebarIsHidden(true);
		}
	}

	const handleLogout = () => {
		Api.post('/logout',{},{
			withCredentials: true
		}).then(response => {
			setLogout();
		}).catch(err => {
			console.log(err);
		})
	}

	const handleCloseAllDropdown    = () => {
		let drops    = document.querySelectorAll(".dropdown-menu");
		
		drops.forEach(drop => {
			drop.classList.add("hidden")
		})
		document.getElementById("backdoor_dropdown").classList.add("hidden");
	}

	return (
		<>
			<nav className="fixed sm:w-64 z-50 top-0 left-0 right-0 bg-sky-600 border-emerald-200 dark:bg-emerald-900 dark:border-emerald-700 sm:shadow-none shadow">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<Link to="/">
						<Logo color={"text-white"}/>
					</Link>
					<button onClick={handleSidebar} type="button" className="inline-flex sm:hidden items-center text-sm text-white ">
						<span className="sr-only">Open sidebar</span>
						<FontAwesomeIcon fixedWidth icon={faBarsStaggered} className="text-xl"/>
					</button>
				</div>
			</nav>
			<aside className={`fixed top-[64px] left-0 z-40 w-64 bg-blue-100 dark:bg-gray-800 transition-transform ${sidebarIsHidden ? '-translate-x-full' : 'translate-x-0'} sm:translate-x-0`} aria-label="Sidebar" style={{height:"calc(100vh - 64px)"}}>
				<div className="h-full px-3 py-4 overflow-y-auto">
					<button type="button" onClick={handleSidebar} className="text-gray-400 sm:hidden bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
						<FontAwesomeIcon icon={faXmark} fixedWidth className="text-xl" />
						<span className="sr-only">Close menu</span>
					</button>
					<ul className="space-y-3 font-medium sm:mt-0 mt-7 ">
						<li>
							<Link to="/" className={`flex items-center p-2 rounded-lg ${page === "home" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faHomeAlt} className={`${page === "home" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Beranda</span>
							</Link>
						</li>
						<li>
							<Link to="/fuel" className={`flex items-center p-2 rounded-lg ${page === "fuel" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faGasPump} className={`${page === "fuel" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Catatan BBM</span>
							</Link>
						</li>
						<li>
							<Link to="/reminder" className={`flex items-center p-2 rounded-lg ${page === "reminder" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faBell} className={`${page === "reminder" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Pengingat</span>
							</Link>
						</li>
						<li>
							<Link to="/statistic" className={`flex items-center p-2 rounded-lg ${page === "statistic" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faChartSimple} className={`${page === "statistic" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Statistik</span>
							</Link>
						</li>
						<li>
							<Link to="/notes" className={`flex items-center p-2 rounded-lg ${page === "notes" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faNoteSticky} className={`${page === "notes" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Catatan Lain</span>
							</Link>
						</li>
						<li>
							<Link to="/vehicles" className={`flex items-center p-2 rounded-lg ${page === "vehicles" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faMotorcycle} className={`${page === "vehicles" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Kendaraan</span>
							</Link>
						</li>
						<li>
							<Link to="#" onClick={handleLogout} className={`flex items-center p-2 rounded-lg ${page === "" ? 'text-white bg-sky-600 hover:bg-sky-900' : "text-gray-900 hover:bg-gray-100"} group`}>
								<FontAwesomeIcon fixedWidth icon={faRightFromBracket} className={`${page === "" ? 'text-white' : "text-gray-500 "} text-xl`} />
								<span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
							</Link>
						</li>
					</ul>
				</div>
			</aside>

			<div className="p-4 sm:pb-14 sm:ml-64 sm:mt-0 mt-[64px] bg-gray-50 min-h-screen">
				{
					title && (
						<h1 className="lg:text-3xl sm:text-2xl text-xl font-bold mb-5 text-gray-700 ml-5">{title}</h1>
					)
				}
				{children}
			</div>
			<div className="h-14 bg-white border-t-2 sm:fixed sm:bottom-0 sm:left-64 sm:right-0 border-gray-200 flex items-center">
				<p className="p-3">&copy; Copyright <a href="https://github.com/faisalach" className="font-bold" rel="noreferrer" target="_blank">Muhammad Faisal</a> {new Date().getFullYear()}.</p>
			</div>
			<div onClick={handleCloseAllDropdown} id='backdoor_dropdown' className='fixed hidden top-0 left-0 right-0 bottom-0'></div>
		</>
	);
};
 
export default Navbar;