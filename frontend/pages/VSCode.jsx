import { API_URL } from "../src/config"

export default function VSCODE() {


    return (
        <>
            <iframe
                // src={`http://localhost:3000/ide/`}
                src={`http://localhost/ide/student1/?folder=/home/student1`}
                style={{ width: "100%", height: "100vh", border: "none" }}
                title="VS Code IDE"
            />

        </>
    )
}