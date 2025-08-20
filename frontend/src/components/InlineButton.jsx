
export default function InlineButton({ onClickAction, buttonLabel }) {

    return (
        <>
            <div className=" justify-center flex items-center px-4 py-1 rounded-xl bg-green-400 shadow-2xs my-1 ml-2
                                hover:bg-rose-500 hover:text-gray-50 
                                 transition-all ease-in-out duration-200 hover:font-bold
                                cursor-pointer
                                text-md
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