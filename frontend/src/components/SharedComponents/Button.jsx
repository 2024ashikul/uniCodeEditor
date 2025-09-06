
export default function Button({ onClickAction, buttonLabel }) {

    return (
        <>
            <div className=" justify-center flex items-center px-6 py-2 rounded-xl bg-slate-500 shadow-2xs my-1 ml-2
                                text-white
                                hover:bg-rose-500 hover:text-gray-50 
                                 transition-all ease-in-out duration-200 hover:font-bold
                                cursor-pointer
                              focus:bg-yellow-200
                              :bg-yellow-200
                              
                              hover:scale-110
                              "
                onClick={onClickAction}
            >
                {buttonLabel}
            </div>
        </>
    )
}
