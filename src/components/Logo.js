import { faGears } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Logo = ({color}) => {
    
    return (
        <>
            <div className="flex items-center">
                <FontAwesomeIcon icon={faGears} className="h-8 mr-3 text-sky-300" />
                <div className="h-8">
                    <p style={{lineHeight:'20px'}} className={`p-0 m-0 self-center text-md font-semibold whitespace-nowrap ${color}`}>Sistem Manajemen</p>
                    <p style={{lineHeight:'12px'}} className={`self-center text-sm whitespace-nowrap ${color}`}>Kendaraan</p>
                </div>
            </div>
        </>
    );
};

export default Logo;