import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

export const Layout = ({ children }) => {

    const { loginUserOnStartup } = useAuth();

    useEffect(() => {
        loginUserOnStartup();
    }, []);

    return (
            <div>
                { children }
            </div>
    );
};