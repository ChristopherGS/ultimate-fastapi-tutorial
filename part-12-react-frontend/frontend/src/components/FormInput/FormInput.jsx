import React from 'react';

function FormInput({label, name, error, value, onChange, type = "text"}) {
  return <div>
            <label className="block mb-2 text-teal-500" htmlFor={name}>{label}</label>
            <input
                type={type} 
                name={name}
                value={value} 
                onChange={onChange}
                className={`rounded w-full p-2 border-b-2 ${!error ? "mb-6 border-teal-500 " : "border-red-500 "} text-teal-700 outline-none focus:bg-gray-300`}
            />
            {error && <span className='mb-3 text-red-500' >{error}</span>}
        </div>
}

export default FormInput;
