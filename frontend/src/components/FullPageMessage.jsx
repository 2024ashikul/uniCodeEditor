

export default function FullPageMessage({ message, icon }) {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white w-120 p-6 rounded-xl shadow-xl text-center flex flex-col items-center gap-4">

                    <div className="flex items-center justify-center">
                        {icon}
                    </div>

                    <p className="text-lg font-medium text-gray-800">
                        {message}
                    </p>


                </div>
            </div>
        </>
    )
}