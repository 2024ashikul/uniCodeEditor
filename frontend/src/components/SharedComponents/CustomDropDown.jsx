
import { ChevronDown, Check, LayoutGrid } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';


export default function CustomDropDown({ options, value, onChange, label }) {
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>

            <div ref={dropdownRef} className='items-center inline-block text-left w-auto '>
                <div className='flex gap-2  items-center'>
                    <span className='w-auto'>{label}</span>
                    <div className='relative'>
                        <button onClick={() => setOpen(!open)}
                            className="relative inline-flex justify-between w-30 rounded-2xl bg-white border border-gray-300 px-4 py-1 text-sm font-medium text-gray-700 shadow-sm 
                            hover:bg-gray-50 focus:outline-none"
                        >
                            {value} <ChevronDown />
                        </button>
                        {open &&
                            <div className='absolute z-10 w-30 rounded-2xl justify-end bg-white'>
                                <ul className='w-full border border-gray-300 rounded-xl'>
                                    {options.map(option => (
                                        <li
                                            onClick={() => { setOpen(false); onChange(option); }}
                                            className='flex gap-2 px-4 py-1 rounded-2xl items-center
                                                hover:bg-blue-400  hover:rounded-2xl hover:text-white
                                                focus:bg-blue-400 focus:outline-none'
                                        >
                                            {option}
                                            {value === option && <Check className=" text-blue-500" />}

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>

        </>
    )
}