import { CircleX } from "lucide-react";
import { useState } from "react";


export default function PopUp({ form, name, setName, onSubmit, onChange, extraFields, title, buttonTitle, ManualEdit, ManualCode }) {

    // This useEffect is no longer needed as the parent component will manage the pop-up's state.
    // useEffect(() => {
    //     setPopUp(true);
    // }, [setPopUp])
    const [loading, setLoading] = useState(false);

    return (
        <div className={`
            ${name ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            fixed inset-0 flex items-center justify-center z-50 transition-all duration-500
        `}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setName(false) }}></div>

            <div className={`
                relative px-8 py-6 my-12 flex flex-col w-[90%] max-w-2xl 
                bg-white border border-gray-200 rounded-3xl shadow-2xl 
                z-50 transform transition-all duration-500
            `}>
                <button
                    className="ml-auto text-gray-400 hover:text-red-500 transition duration-300"
                    onClick={() => { setName(false) }}
                >
                    <CircleX size={24} />
                </button>

                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mb-6">{title}</h2>

                {ManualEdit ? ManualCode :
                    <form method="POST" onSubmit={async (e) => {
                        e.preventDefault();
                        setLoading(true);
                        await onSubmit(e);  
                        setLoading(false);
                    }}
                    className="flex flex-col gap-6"  >
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <label className="w-full sm:w-28 text-gray-700 font-medium" htmlFor="title">
                            Title
                        </label>
                        <input
                            required
                            value={form?.title || ""}
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Enter title"
                            onChange={onChange}
                            className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <label className="w-full sm:w-28 text-gray-700 font-medium pt-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            value={form?.description || ""}
                            id="description"
                            name="description"
                            placeholder="Enter description"
                            onChange={onChange}
                            className="flex-1 w-full h-28 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition duration-300"
                        />
                    </div>
                </div>

                {extraFields}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className={`relative flex items-center justify-center px-12 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-1"
                            }`}
                    >
                        {loading ?
                            <>
                                <span className="absolute left-6 animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                                Loading...
                            </>
                            : buttonTitle}
                    </button>
                </div>
            </form>
                }
        </div>
        </div >
    )
}
