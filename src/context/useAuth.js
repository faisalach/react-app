import { useState } from "react";
import {Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Api from "./api";

export const useAuth = () => {
    let navigate = useNavigate();
    const cookie = new Cookies();
    const [userData, setUserData] = useState({signedIn: cookie.get("is_auth")});

    const getAuthCookieExpiration = () => {
        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));  // 7 days
        return date;
    }
    const setAsLogged = (user) => {
        cookie.set('is_auth', true, {path: '/', expires: getAuthCookieExpiration(), sameSite: 'lax', httpOnly: false});
        setUserData({signedIn: true});
    }
    const setLogout = () => {
        cookie.remove('is_auth', {path: '/', expires: getAuthCookieExpiration(), sameSite: 'lax', httpOnly: false});
        setUserData({signedIn: false});
        localStorage.removeItem("vehicleActive")
        navigate('/login');
    }
    const loginUserOnStartup = async () => {
        const pageNoCredential  = ["/login","/register","/forgot_password","/reset_password"];

        if(cookie.get('is_auth')) {
            await Api.post('/user',{},{
                withCredentials: true
            }).then(response => {
                setUserData({signedIn: true});
                if(pageNoCredential.find(o => o === document.location.pathname)){
                    navigate('/');
                }
            }).catch(error => {
                setUserData({signedIn: false});
                setLogout();
            });
        } else {
            setUserData({signedIn: false});
            
            if(!pageNoCredential.find(o => o === document.location.pathname)){
                navigate('/login');
            }
        }
    }

    return {
        userData,
        setAsLogged,
        setLogout,
        loginUserOnStartup
    }
};