const Spinner = ({id,name,onChange,value,type,placeholder,title,disabled}) => {
    value = value !== undefined ? value : ""
    return (
        <>
            <div className="mb-6">
                <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{title}</label>
                <input type={type} disabled={disabled} value={value} onChange={onChange} placeholder={placeholder} name={name} id={id} className="bg-gray-50 border disabled:bg-gray-300 disabled:cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
            </div>
        </>
    );
};

export default Spinner;