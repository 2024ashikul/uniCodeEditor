
export default function Button({onClickAction, buttonLabel}) {

    return (
        <>
            <div className=" justify-center flex items-center px-4 py-1 rounded-3xl bg-blue-400 shadow-2xs my-1 
                                hover:bg-neutral-400 transition hover:text-gray-50 
                                cursor-pointer"

                onClick={onClickAction} 
                >
                    {buttonLabel}
            </div>
        </>
    )
}