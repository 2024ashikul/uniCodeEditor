
export default function InlineButton({ onClickAction, buttonLabel }) {

    return (
        <>
            <div className=" justify-center flex items-center px-4 py-1 rounded-xl bg-stone-300 shadow-2xs my-2 ml-2
                                hover:bg-blue-500 hover:text-gray-50 
                                 transition-all ease-in-out duration-200 hover:font-bold
                                cursor-pointer
                                text-md
                              focus:bg-yellow-200
                              :bg-yellow-200
                              
                              hover:scale-x-102
                                "
                onClick={onClickAction}
            >
                {buttonLabel}
            </div>
        </>
    )
}