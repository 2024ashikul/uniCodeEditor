

export default function History({history}){

    return(
                                <div
                            className={` w-full  flex flex-col `}

                        >


                            {history.map(item => (
                                <div className='flex flex-col py-1 px-8'>

                                    <div className='flex'>
                                        <p className='px-2 text-[14px]'>{item.currentTime}</p>
                                        <p className='px-2 text-[14px]'>{item.status} </p>

                                        <p className='px-2 text-[14px]'>{item.time}</p>

                                    </div>

                                    {
                                        item.stderr == null ? (
                                            <p className='px-10 m-0'>{item.stdout}</p>
                                        ) : (
                                            <p className="text-red-500 p-0 m-0">{item.stderr}</p>

                                        )
                                    }

                                </div>))
                            }

                        </div>
    )
}