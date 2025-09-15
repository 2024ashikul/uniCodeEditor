import { useContext, useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import MDEditor from "@uiw/react-md-editor";
import { AlertContext } from "../Contexts/AlertContext/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import TopBar from "./SharedComponents/TopBar";
import PageTitle from "./SharedComponents/PageTitle";
import FloatingAIBox from "./SharedComponents/FloatingAIBox";
import { sendAIRequest } from "../AIRequest";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";

export default function CreateLesson() {
    const { roomId } = useParams();
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [active, setActive] = useState("text");
    const [content, setContent] = useState("");
    const [contents, setContents] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [title, setTitle] = useState(null);
    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    async function handleSend(input) {
            const res = await sendAIRequest('generate/problem', input);
            console.log(res);
            setContent(res);
        }


    const createLesson = async () => {
        try {
            const res = await fetch(`${API_URL}/lesson/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, contents, roomId })
            })
            const data = res.json();
            console.log(data)
            if (res.ok) {
                setMessage('Lesson Created Succesfully')
                setType('success')
                navigate(`/room/${roomId}/lessons`)
            } else {
                setMessage('Could not create new lesson')
                setType('error')
            }
        } catch (err) {
            console.log(err);
            setMessage('Could not connect to server')
            setType('warning')
        }
    }



    const handleAdd = () => {
        if (!content.trim()) return;

        if (editingIndex !== null) {
            const updated = [...contents];
            updated[editingIndex] = { type: active, content };
            setContents(updated);
            setEditingIndex(null);
        } else {
            setContents((prev) => [...prev, { type: active, content }]);
        }
        setContent("");
    };

    const handleDelete = (index) => {
        setContents(contents.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setEditingIndex(null);
            setContent("");
        }
    };

    const handleEdit = (index) => {
        const item = contents[index];
        setActive(item.type);
        setContent(item.content);
        setEditingIndex(index);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = contents.findIndex((_, idx) => `${idx}` === active.id);
            const newIndex = contents.findIndex((_, idx) => `${idx}` === over.id);
            setContents((items) => arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <>

            <div className="flex justify-between gap-20 mx-20 my-4">
                <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-1 flex-1 rounded-md px-4 py-1"
                    placeholder="Title of the lesson" />
                <button onClick={createLesson} className="px-4 py-1 bg-blue-500 text-white cursor-pointer rounded-md">Create lesson</button>
            </div>
            <div className="mb-4 space-y-2 mx-20">
                <div className="font-semibold border-b-2">Add Contents to the lesson</div>
                <div className="flex gap-4 items-center">
                    <label>
                        <input
                            type="radio"
                            name="field"
                            checked={active === "text"}
                            onChange={() => setActive("text")}
                        />{" "}
                        Text
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="field"
                            checked={active === "video"}
                            onChange={() => setActive("video")}
                        />{" "}
                        Video
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="field"
                            checked={active === "image"}
                            onChange={() => setActive("image")}
                        />{" "}
                        Image
                    </label>
                    <button
                        onClick={handleAdd}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                        {editingIndex !== null ? "Update" : "Add"}
                    </button>
                    {active === 'text' && <button type="button" onClick={() => setIsAIOpen(true)}>use AI </button>}
                    <FloatingAIBox
                        isOpen={isAIOpen}
                        onClose={() => setIsAIOpen(false)}
                        onSend={handleSend}
                    />
                    
                </div>

                <div>
                    {active === "text" && (
                        <MDEditor
                            className="border p-1"
                            value={content}
                            onChange={(value) => setContent(value || "")}
                        />

                    )}
                    {active === "video" && (
                        <input
                            className="border p-1 w-full"
                            type="text"
                            value={content}
                            placeholder="YouTube URL"
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}
                    {active === "image" && (
                        <input
                            className="border p-1 w-full"
                            type="text"
                            value={content}
                            placeholder="Image URL"
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}
                </div>
            </div>

            <div className="mt-6 mx-20">
                {contents.length === 0 ? (
                    <p className="text-gray-500">Nothing added yet.</p>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={contents.map((_, i) => `${i}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {contents.map((item, i) => (
                                <SortableItem
                                    key={i}
                                    id={`${i}`}
                                    item={item}
                                    index={i}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </>
    );
}



function getYouTubeVideoId(url) {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
        if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
    } catch {
        return null;
    }
    return null;
}

function SortableItem({ item, id, index, onDelete, onEdit }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="p-2 border mb-2 rounded bg-white shadow  relative"
        >
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded"
                    onClick={() => onEdit(index)}
                >
                    Edit
                </button>
                <button
                    className="bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                    onClick={() => onDelete(index)}
                >
                    Delete
                </button>
            </div>

            {item.type === "text" && (
                <MDEditor.Markdown source={item.content} />
            )}

            {item.type === "video" && (() => {
                const videoId = getYouTubeVideoId(item.content);
                return videoId ? (
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                ) : (
                    <p className="text-red-500">Invalid video URL</p>
                );
            })()}

            {item.type === "image" && (
                <img
                    src={item.content}
                    alt={`lesson-${index}`}
                    className="w-full rounded max-h-52 max-w-52"
                />
            )}
        </div>
    );
}
