import React, {useContext, useEffect} from "react";
import {Cookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import AuthContext from "./authContext";
import Api from "./api";

export const useAuth = () => {
    let navigate = useNavigate();
    const cookieGlobal = new Cookies();
    
    const [userData, setUserData] = React.useState({signedIn: cookieGlobal.get("is_auth")});
    const {setAuthData} = useContext(AuthContext);

    useEffect(() => {
        setAuthData(userData);
    }, [userData.signedIn]);

    const getAuthCookieExpiration = () => {
        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));  // 7 days
        return date;
    }
    const setAsLogged = (user) => {
        const cookie = new Cookies();
        cookie.set('is_auth', true, {path: '/', expires: getAuthCookieExpiration(), sameSite: 'lax', httpOnly: false});
        setUserData({signedIn: true});
        navigate('/');
    }
    const setLogout = () => {
        const cookie = new Cookies();
        cookie.remove('is_auth', {path: '/', expires: getAuthCookieExpiration(), sameSite: 'lax', httpOnly: false});
        setUserData({signedIn: false});
        localStorage.removeItem("vehicleActive")
        navigate('/login');
    }
    const loginUserOnStartup = async () => {
        const cookie = new Cookies();
        const pageNoCredential  = ["/login","/register"];

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