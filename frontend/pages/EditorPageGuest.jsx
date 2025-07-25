
import CodeEditorTemp from "../src/components/CodeEditor";
import NavBar from "../src/components/NavBar";




export default function EditorPageGuest() {
    
   

    return (
        <>
            <div className="flex flex-col h-screen">
                <NavBar></NavBar>
                <CodeEditorTemp></CodeEditorTemp>
            </div>
        </>
    )
}