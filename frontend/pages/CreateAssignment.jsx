import { API_URL } from "../src/config";


export default function CreateAssignment({ assignmentId }) {


    const [form, setForm] = useState({
        title: '',
        statement: ''
    })
    const createProblem = async (e) => {
        e.preventDefault();


        console.log(form)

        await fetch(`${API_URL}/createproblem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ assignmentId, form })
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err))
    }

    return (
        <>

        </>
    )
}