import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../SharedComponents/PageTitle";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import NullComponent from "../SharedComponents/NullComponent";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import LoadingParent from "../SharedComponents/LoadingParent";
import { Download } from "lucide-react";

export default function Materials({ roomId }) {
    const { popUp } = useContext(UIContext);
    const [materials, setMaterials] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchMaterials = async () => {
            if (!roomId) return;
            try {
                const res = await fetch(`${API_URL}/material/fetchall`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ roomId })
                });

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                console.log(data)
                setMaterials(data);

            } catch (err) {
                console.error("Failed to fetch problem:", err);
            }
        };
        fetchMaterials();
    }, [roomId, token]);

    const filteredMaterials = materials?.filter((material) =>
        material?.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className={`flex flex-col ${popUp && 'transition duration-500 blur pointer-events-none'} `}>
                <div className="flex mt-2 justify-between items-center">
                    <PageTitle text={'Materials'} />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-64"
                    />
                </div>
                <div className="min-w-full pt-4 flex flex-col gap-2 rounded-2xl transition duration-500">
                

                    <div className="grid grid-cols-12 mt-4 bg-gray-100 rounded-xl font-semibold text-gray-700  py-3 shadow-sm">
                        <div className="px-2">ID</div>
                        <div className="px-2 col-span-5">Title</div>
                        <div className="px-2 col-span-2">Type</div>
                        <div className="px-2 col-span-2">Created</div>
                        <div className="px-2 text-center">Actions</div>
                    </div>

                    <div className=" min-w-full pt-4  flex flex-col gap-2  rounded-2xl transition duration-1000">
                        {
                            materials === null ?
                                <LoadingParent />
                                :
                                filteredMaterials?.length === 0 ?
                                    <NullComponent text={'No materials uploaded'} />
                                    : filteredMaterials?.map((file, index) => (
                                        <div key={index} className="grid grid-cols-12 items-center border-b py-2 text-sm">
                                            <div className="px-2  ">{index + 1}</div>
                                            <div className="px-2 col-span-5  text-blue-700">{file.filename}</div>
                                            <div className="px-2 col-span-2 ">{file.type}</div>
                                            <div className="px-2 col-span-2 ">{file.createdAt.slice(0, 10)}</div>

                                            <div className="flex gap-2 justify-center col-span-2 px-2 ">
                                        <div className="px-4 gap-2 flex">
                                            <a href={`${API_URL}/material/${roomId}/${file.filename}`}
                                                className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600" target="_blank">View</a>


                                            <a href={`${API_URL}/materials/download/${roomId}/${file.filename}`} className="px-3 py-1 rounded-full text-sm bg-green-500 text-white hover:bg-green-600" >Download</a>
                                        </div>
                                                
                                            </div>
                                        </div>
                                    ))}
                                    
                    </div>
                </div>
            </div>
        </>
    )
}