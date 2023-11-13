import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "./Input";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FormDetailMaintenance = ({formData,handleChange,index,deleteDetailMaintenance,length}) => {
    
    return (
        <>
            <div key={"fdm_"+index} className='p-3 border border-gray-200 rounded-lg relative'>
                {
                    length > 1 && (
                        <button onClick={e => deleteDetailMaintenance(e,index)} className="absolute top-3 right-3">
                            <FontAwesomeIcon icon={faTimes} fixedWidth className="text-lg font-bold"/>
                        </button>
                    )
                }
                <div className='grid grid-cols-2 gap-x-2'>
                    <Input 
                        id={`title_${index}`} 
                        title="Judul *" 
                        type="text" 
                        value={formData && formData["title"]} 
                        onChange={handleChange} 
                        placeholder="(Perbaikan/Nama Part/Cuci Steam)"
                        name={`detail_maintenance|${index}|title`}/>
                    <Input 
                        id={`price_${index}`} 
                        title="Harga *" 
                        type="number" 
                        value={formData && formData["price"]} 
                        onChange={handleChange} 
                        placeholder="Rp"
                        name={`detail_maintenance|${index}|price`}/>
                    <Input 
                        id={`reminder_km_${index}`} 
                        title="Ingatkan pada kilometer?" 
                        type="number" 
                        value={formData && formData["reminder_on_kilometer"]} 
                        onChange={handleChange} 
                        placeholder="Km"
                        name={`detail_maintenance|${index}|reminder_on_kilometer`}/>
                    <Input 
                        id={`reminder_date_${index}`} 
                        title="Ingatkan pada tanggal?" 
                        type="date" 
                        value={formData && formData["reminder_on_date"]} 
                        onChange={handleChange} 
                        placeholder="YYYY-MM-DD"
                        name={`detail_maintenance|${index}|reminder_on_date`}/>
                </div>
            </div>
        </>
    );
};

export default FormDetailMaintenance;