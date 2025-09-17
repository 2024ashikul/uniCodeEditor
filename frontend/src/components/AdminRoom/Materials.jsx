import { useState, useContext, useEffect, useRef } from "react";
import JSZip from "jszip"; // ⚡ install if not already: npm i jszip
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import PageTitle from "../SharedComponents/PageTitle";
import { MoreVertical, FileText, FileImage, File, FileArchive, Download } from "lucide-react";
import LoadingParent from "../SharedComponents/LoadingParent";
import NullComponent from "../SharedComponents/NullComponent";



export default function Uploader({ roomId }) {
    const { token } = useContext(AuthContext);
    const { setMessage, setType } = useContext(AlertContext);
    const [zipProgress, setZipProgress] = useState(0);
    const [mode, setMode] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [materials, setMaterials] = useState(null);



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


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setSelectedFiles(null);
        resetState();
    };

    const handleFolderChange = (e) => {
        setSelectedFiles(e.target.files);
        setFile(null);
        resetState();
    };

    const resetState = () => {
        setUploadStatus("idle");

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ mode, selectedFiles, uploadStatus });
        try {
            setUploadStatus('zipping');
            const formData = new FormData();
            const zip = new JSZip();
            if (mode === "file" && file) {
                formData.append("file", file, file.name);

                console.log('uploading file')
                formData.append("roomId", roomId);
                formData.append("mode", mode);

                const res = await fetch(`${API_URL}/material/upload/file`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
                const data = await res.json();
                console.log(data);
                setUploadStatus("success");
                setMessage("Upload successful!");
                setMaterials((prev) => [...prev, data.newMaterial])
                setType("success");
                setFile(null);
                setMode(null);
            }
            else if (mode === "folder" && selectedFiles) {
                setUploadStatus('zipping');
                Array.from(selectedFiles).forEach(file => {
                    zip.file(file.webkitRelativePath, file);
                });

                const zipBlob = await zip.generateAsync(
                    { type: "blob", streamFiles: true },
                    (metadata) => {
                        setZipProgress(metadata.percent.toFixed(0));
                    }
                );


                formData.append('files', zipBlob, `${selectedFiles[0].webkitRelativePath.split('/')[0]}.zip`);
                formData.append("roomId", roomId);
                formData.append("mode", mode);

                setUploadStatus("uploading");

                const res = await fetch(`${API_URL}/material/upload/folder`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
                const data = await res.json();
                console.log(data);
                setSelectedFiles(null);
                setMode(null);
                setMaterials((prev) => [...prev, data.newMaterial])
                setUploadStatus("success");
                setMessage("Upload successful!");
                setType("success");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            setUploadStatus("error");
            setMessage("Upload failed");
            setType("error");
        }
    };



    return (

        <>
            <div className="flex flex-col">
                <div className="flex justify-between">
                    <div>
                        <PageTitle text={'Materials'} />
                    </div>
                    <div className="w-full max-w-3xl bg-white py-1 px-2 flex rounded-xl shadow-lg border border-gray-200">
                        <form onSubmit={handleSubmit} className="w-full flex items-center justify-between gap-4">


                            <div className="flex items-center flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setMode("file")}
                                    className={`text-md px-5 py-1 rounded-l-lg font-medium transition-colors duration-200 ${mode === "file"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    File
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("folder")}
                                    className={`text-md px-5 py-1 rounded-r-lg font-medium transition-colors duration-200 border-l border-gray-300 ${mode === "folder"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    Folder
                                </button>
                            </div>


                            <div className="w-px h-6 bg-gray-200"></div>


                            <div className="flex-grow flex items-center gap-3 min-w-0">
                                {mode === "file" && (
                                    <>
                                        <label
                                            htmlFor="file-upload"
                                            className="text-md cursor-pointer inline-block px-4 py-1 bg-gray-100 text-gray-600 font-medium rounded-full shadow-sm hover:bg-gray-200 transition"
                                        >
                                            Choose File
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-gray-500 truncate">
                                            {file ? file.name : "No file selected"}
                                        </span>
                                    </>
                                )}

                                {mode === "folder" && (
                                    <>
                                        <label
                                            htmlFor="folder-upload"
                                            className="text-md cursor-pointer inline-block px-4 py-1 bg-gray-100 text-gray-600 font-medium rounded-full shadow-sm hover:bg-gray-200 transition"
                                        >
                                            📂 Choose Folder
                                        </label>
                                        <input
                                            id="folder-upload"
                                            type="file"
                                            webkitdirectory="true"
                                            directory="true"
                                            multiple
                                            onChange={handleFolderChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-gray-500 truncate">
                                            {selectedFiles?.length > 0
                                                ? `${selectedFiles?.length} files in folder`
                                                : "No folder selected"}
                                        </span>
                                    </>
                                )}
                            </div>


                            <button
                                type="submit"
                                disabled={
                                    uploadStatus === "uploading" ||
                                    uploadStatus === "zipping" ||
                                    (!file && !selectedFiles)
                                }
                                className="text-md flex-shrink-0 px-6 py-1 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {uploadStatus === "zipping"
                                    ? `Zipping... ${zipProgress}`
                                    : uploadStatus === "uploading"
                                        ? "Uploading..."
                                        : "Upload"}
                            </button>

                        </form>
                    </div>
                </div>
                <div className="grid grid-cols-12 mt-4 bg-gray-100 rounded-xl font-semibold text-gray-700  py-3 shadow-sm">
                    <div className="px-2">ID</div>
                    <div className="px-2 col-span-5">Title</div>
                    <div className="px-2 col-span-2">Type</div>
                    <div className="px-2 col-span-2">Created</div>
                    <div className="px-2 text-center">Actions</div>
                </div>
                <div className="flex flex-col">
                    {
                        materials === null ?
                            <LoadingParent /> :
                            materials.length === 0 ?
                                <NullComponent text={'No materials found'} />
                                :

                                materials?.map((file, index) => (

                                    <FileCard file={file} key={index} index={index} setMessage={setMessage} token={token} roomId={roomId} />

                                ))}
                </div>
            </div>
        </>
    );
}



const FileCard = ({ file, index, setMessage, token, roomId }) => {


    const getFileIcon = (extension) => {
        switch (extension) {
            case "pdf":
                return <FileText className="w-8 h-8 text-red-500" />;
            case "jpg":
            case "png":
                return <FileImage className="w-8 h-8 text-blue-500" />;
            case "zip":
            case "rar":
                return <FileArchive className="w-8 h-8 text-yellow-500" />;
            default:
                return <File className="w-8 h-8 text-gray-500" />;
        }
    };
    const [menuOpen, setMenuOpen] = useState(false);
    const extension = name.split(".").pop().toLowerCase();

    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.click();
        setMenuOpen(false);
    };

    const handleDelete = async (materialId) => {
        setMenuOpen(false);
        try {
            const res = await fetch(`${API_URL}/material/delete`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ materialId, roomId }),
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            const data = await res.json();

            setMessage(data.message);
        } catch (err) {
            console.log(err)
            setMessage("Could not delete file")
        }

    };

    const handleRename = () => {
        alert(`Rename ${name}`);
        setMenuOpen(false);
    };

    return (<div className="grid grid-cols-12 items-center border-b py-2 text-sm">
        <div className="px-2  ">{index + 1}</div>
        <div className="px-2 col-span-5  text-blue-700">{file.filename}</div>
        <div className="px-2 col-span-2 ">{file.type}</div>
        <div className="px-2 col-span-2 ">{file.createdAt.slice(0, 10)}</div>

        <div className="flex gap-2 justify-center col-span-2 px-2 ">

            <button
                onClick={() => navigate(`/assessment/${item.id}`)}
                className="px-3 py-1  text-sm text-black "
            >
                <Download />
            </button>
            <div className="relative" ref={menuRef}>
                <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-54 bg-white border-green-100 rounded-xl shadow-lg top-8 z-10">
                        <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={handleDownload}
                        >
                            Download
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={handleRename}
                        >
                            Rename
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                            onClick={() => handleDelete(file.id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
    );
};