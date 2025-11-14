import { useParams } from "react-router-dom"
import { API_URL } from "../src/config"

export default function Lab() {
    const {labId} =  useParams();
    console.log(labId)
    return (
        <>
            <iframe
                // src={`http://localhost:3000/ide/`}
                src={`http://localhost/labs/${labId}/`}
                style={{ width: "100%", height: "100vh", border: "none" }}
                title="VS Code IDE"
            />

        </>
    )
}