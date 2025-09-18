import { useContext, useEffect, useState } from "react"
import PageTitle from "../../SharedComponents/PageTitle";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";
import PopUpLayout from "../../SharedComponents/PopUpLayout";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import Schedule from "../../Schedule";
import UpdateAssessmentInfo from "../../UpdateAssessmentInfo";
import IOSSwitch from "../../IOSSwitch";
import { APIRequest } from "../../../APIRequest";


export default function Settingss({ assessmentId }) {
    const [Assessment, setAssessment] = useState('');
    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);
    const {request} = APIRequest();

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const data = await request("assessment/fetchone",{body : {assessmentId}});
                console.log(data);
                setAssessment(data);
            } catch (err) {
                console.log("Failed to fetch assignemnet", err);
            }
        }
        if (assessmentId) {
            fetchAssessment();
        }
    }, [assessmentId, token])

    async function changeResultAcess() {
        try {
            const data = await request("/assessment/admin/changewhocanseeresults",{body : {assessmentId}});
            setMessage(data.message);
        }
        catch (err) {
            console.log(err);
            setMessage('Internal server error');
        }
    }

    async function changeAssigned() {
        try {
            const data = await request("/assessment/admin/changeassigned",{body : {assessmentId}});
            setMessage(data.message);
            setType('success');
        }
        catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error');
        }
    }
    

    return (
        <>
            <div className={`flex flex-col `}>
                <PopUpLayout>
                    <PageTitle
                        text={'Settings'}
                    />
                </PopUpLayout>

            </div>

            <div className="flex flex-col gap-4 mx-40">
                <div><Schedule
                    assessmentId={assessmentId}
                />
                </div>
                <div className="flex justify-between">
                    <p >Assigned</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.status == 'assigned' ? true : false}
                        onChange={changeAssigned}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />

                </div>
                <div>
                    <UpdateAssessmentInfo
                        title={Assessment.title}
                        description={Assessment.description}
                        assessmentId={assessmentId}
                    />
                </div>
                <div className="flex justify-between">
                    <p >Student can see each others submissoins</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                <div className="flex justify-between">
                    <p >RealTime Result</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Multiple Attempts Allowed</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Allow Late Submissions</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Multiple Attempts Allowed</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Shuffle Questions</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Grading Policy</p>
                    {/* {Best attempt / Latest attempt / First attempt counts.} */}
                    <IOSSwitch
                        className="scale-120"
                        checked={Assessment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
            </div>
        </>
    )
}