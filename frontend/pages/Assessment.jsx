import { useParams } from "react-router-dom";
import { UIContext } from "../src/Contexts/UIContext/UIContext";
import { useContext, useEffect, useState } from "react";
import { AccessContext } from "../src/Contexts/AccessContext/AccessContext";
import LoadingFullscreen from "../src/components/SharedComponents/LoadingScreen";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { Dot } from "lucide-react";
import TopBanner from "../src/components/SharedComponents/TopBanner";
import CodeAssignmentUser from "../src/components/CodeAssignment/User/CodeAssignmentUser";
import CodeAssignmentAdmin from "../src/components/CodeAssignment/Admin/CodeAssignmentAdmin";
import ProjectAssignmentUser from "../src/components/ProjectAssignment/User/ProjectAssignmentUser";
import ProjectAssignmentAdmin from "../src/components/ProjectAssignment/Admin/ProjectAssignmentAdmin";
import QuizAdmin from "../src/components/Quiz/Admin/QuizAdmin";
import QuizUser from "../src/components/Quiz/User/QuizUser";



export default function Assessment() {

    const { assessmentId } = useParams();
    const { checkAccess } = useContext(AccessContext);
    const { userId ,token} = useContext(AuthContext);
    const [authorized, setAuthorized] = useState(null);
    const [role, setRole] = useState(null);

    
    const [assessmentType, setAssessmentType] = useState(null);
    const [scheduledTime, setScheduledTime] = useState(null);
    const [duration, setDuration] = useState(null);
    const [assessmentStatus, setAssessmentStatus] = useState(null); 
    const [assessmentTitle, setAssessmentTitle] = useState('');


    const [phase, setPhase] = useState("loading"); // "loading", "Not Scheduled", "Scheduled", "Ongoing", "Finished"
    const [countdown, setCountdown] = useState("");
    const [durationLeft , setDurationLeft] = useState('');

    useEffect(() => {
        if (!userId || !token) {
            return;
        }

        const verifyAccess = async () => {
            try {
                const auth = await checkAccess({ assessmentId,userId,token });
                if (auth && auth.allowed) {
                    setAuthorized(true);
                    setRole(auth.role);
                    setAssessmentType(auth.type);
                    setScheduledTime(auth.scheduleTime ? new Date(auth.scheduleTime) : null);
                    setDuration(auth.duration);
                    setAssessmentStatus(auth.status);
                    setAssessmentTitle(auth.title);
                } else {
                    setAuthorized(false);
                    setRole(null);
                    setPhase("unauthorized");
                }
            } catch (error) {
                console.error("Failed to verify access:", error);
                setAuthorized(false);
                setPhase("unauthorized");
            }
        };
        if(userId && token){
            verifyAccess();
        }
        

        return () => {
            setAuthorized(null);
            setRole(null);
            setPhase("loading");
        };
    }, [checkAccess, userId,token, assessmentId]);

    
    const formatTimeDifference = (diffMs) => {
        if (diffMs <= 0) return "less than a minute";

        const totalMins = Math.floor(diffMs / (1000 * 60));
        const totalHrs = Math.floor(totalMins / 60);
        const days = Math.floor(totalHrs / 24);
        const mins = totalMins % 60;
        const hrs = totalHrs % 24;

        let msg = "";
        if (days > 0) msg += `${days} day${days > 1 ? 's' : ''} `;
        if (hrs > 0) msg += `${hrs} hr${hrs > 1 ? 's' : ''} `;
        if (mins > 0) msg += `${mins} min${mins > 1 ? 's' : ''} `;

        return msg.trim() || "less than a minute";
    };

    
    useEffect(() => {
        const updateAssessmentState = () => {
            if (!scheduledTime) {
                setPhase("Not Scheduled");
                setCountdown("");
                return;
            }

            const now = new Date().getTime();
            const start = scheduledTime.getTime();
            const end = start + (duration || 0) * 60 * 1000;
            setDurationLeft(end-now);

            if (now < start) {
                setPhase("Scheduled");
                const timeLeft = formatTimeDifference(start - now);
                setCountdown(`${timeLeft} left to start`);
            } else if (now >= start && now < end) {
                setPhase("Ongoing");
                const timeLeft = formatTimeDifference(end - now);
                setCountdown(`Ongoing... ${timeLeft} left`);
            } else {
                setPhase("Finished");
                setCountdown("This assessment has ended.");
            }
        };

        updateAssessmentState();
        const intervalId = setInterval(updateAssessmentState, 1000 * 30); // Update every 30 seconds

        return () => clearInterval(intervalId);
    }, [scheduledTime, duration]);

    if (phase === "loading" || authorized === null) {
        return <LoadingFullscreen />;
    }
    if (!authorized) {
        return (<p className="text-center text-red-500 mt-10">You are not authorized to view this assessment.</p>);
    }

    
    const infoConfig = {
        "Not Scheduled": {
            label: "NOT SCHEDULED",
            message: "This assessment has not been scheduled yet.",
        },
        "Scheduled": {
            label: assessmentStatus?.toUpperCase() || "SCHEDULED",
            message: countdown,
        },
        "Ongoing": {
            label: assessmentStatus?.toUpperCase() || "ONGOING",
            message: countdown,
        },
        "Finished": {
            label: assessmentStatus?.toUpperCase() || "FINISHED",
            message: countdown,
        },
    };

    const currentPhaseInfo = infoConfig[phase] || { label: "STATUS", message: "Calculating..." };

    const extraInfo = (
        <div className="flex items-center justify-center gap-2 text-md">
            <div>{currentPhaseInfo.label}</div>
            <Dot />
            <div>{currentPhaseInfo.message}</div>
            {(phase === "Scheduled" || phase === "Ongoing" || phase === "Finished") && duration && (
                <>
                    <Dot />
                    <div className="flex">Duration: {duration} mins</div>
                </>
            )}
        </div>
    );

    
    const renderContent = () => {
        const memberMap = {
            CodeAssignment: <CodeAssignmentUser phase={phase} assessmentId={assessmentId} />,
            ProjectAssignment: <ProjectAssignmentUser phase={phase} assessmentId={assessmentId} />,
            Quiz: <QuizUser assessmentId={assessmentId} phase={phase} durationLeft={durationLeft} />,
        };

        const adminMap = {
            CodeAssignment: <CodeAssignmentAdmin phase={phase} assessmentId={assessmentId} />,
            ProjectAssignment: <ProjectAssignmentAdmin phase={phase} assessmentId={assessmentId} />,
            Quiz: <QuizAdmin phase={phase} assessmentId={assessmentId} />,
        };

        const roleMap = {
            member: memberMap,
            admin: adminMap,
        };

        return roleMap[role]?.[assessmentType] ?? <LoadingFullscreen />;
    };

    return (
        <>
            <div>
                <TopBanner
                title={`${assessmentType} : ${assessmentTitle}`}
                extraInfo={extraInfo} />
            </div>
            {renderContent()}
        </>
    );
}

