import { useContext, useEffect, useState } from "react"
import PageTitle from "../SharedComponents/PageTitle";
import { UIContext } from "../../Contexts/UIContext/UIContext";
import PopUp from "../SharedComponents/PopUp";
import Button from "../SharedComponents/Button";
import { AlertContext } from "../../Contexts/AlertContext/AlertContext";
import Schedule from "./Settings/Schedule";
import UpdateAssignmentInfo from "./Settings/UpdateAssignmentInfo";
import PopUpLayout from "../SharedComponents/PopUpLayout";
import { API_URL } from "../../config";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';


export default function Settingss({ assignmentId }) {
    const [Assignment, setAssignment] = useState('');
    const { setMessage, setType } = useContext(AlertContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const res = await fetch(`${API_URL}/Assignment/fetchone`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ assignmentId })
                })

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log(data);
                setAssignment(data);
            } catch (err) {
                console.log("Failed to fetch assignemnet", err);
            }
        }
        if (assignmentId) {
            fetchAssignment();
        }
    }, [assignmentId, token])

    async function changeResultAcess() {
        try {
            const res = await fetch(`${API_URL}/Assignment/admin/changewhocanseeresults`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId })
            });


            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            setMessage(data.message);
            setType('success');
        }
        catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error');
        }
    }

    async function changeAssigned() {
        try {
            const res = await fetch(`${API_URL}/Assignment/admin/changeassigned`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId })
            });


            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();

            setMessage(data.message);
            setType('success');
        }
        catch (err) {
            console.log(err);
            setMessage('Internal server error');
            setType('error');
        }
    }
    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#65C466',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));


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
                    assignmentId={assignmentId}
                />
                </div>
                <div className="flex justify-between">
                    <p >Assigned</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.status == 'assigned' ? true : false}
                        onChange={changeAssigned}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />

                </div>
                <div>
                    <UpdateAssignmentInfo
                        title={Assignment.title}
                        description={Assignment.description}
                        assignmentId={assignmentId}
                    />
                </div>
                <div className="flex justify-between">
                    <p >Student can see each others submissoins</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                <div className="flex justify-between">
                    <p >RealTime Result</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Multiple Attempts Allowed</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Allow Late Submissions</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Multiple Attempts Allowed</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Shuffle Questions</p>
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
                 <div className="flex justify-between">
                    <p >Grading Policy</p>
                    {/* {Best attempt / Latest attempt / First attempt counts.} */}
                    <IOSSwitch
                        className="scale-120"
                        checked={Assignment.everyoneseesresult === true ? true : false}
                        onChange={changeResultAcess}
                        inputProps={{ 'aria-label': 'iOS design switch' }}
                    />
                </div>
            </div>
        </>
    )
}