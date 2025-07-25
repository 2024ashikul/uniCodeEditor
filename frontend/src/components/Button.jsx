
export default function Button({ onClickAction, buttonLabel }) {

    return (
        <>
            <div className=" justify-center flex items-center px-6 py-1 rounded-2xl bg-green-400 shadow-2xs my-1 ml-2
                                hover:bg-purple-400 hover:text-gray-50 
                                 transition-all ease-in-out duration-200 hover:font-medium
                                cursor-pointer
                                font-medium
                              focus:bg-yellow-200
                              :bg-yellow-200
                                "


                onClick={onClickAction}
            >


                    {buttonLabel}
                
                    
                
                
            </div>
        </>
    )
}