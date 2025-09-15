import { useState, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import JSZip from "jszip";
import LoadingParent from "../../SharedComponents/LoadingParent";
import { AlertContext } from "../../../Contexts/AlertContext/AlertContext";

export default function Problems({ assessmentId }) {
  const [problem, setProblem] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [submission, setSubmission] = useState(null);
  const { token } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [zipProgress, setZipProgress] = useState(0);
  const { setMessage } = useContext(AlertContext);

  const handleFolderChange = (event) => {
    setUploadStatus('idle');
    setSelectedFiles(event.target.files);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      if (!assessmentId) return;
      try {
        const res = await fetch(`${API_URL}/problem/fetchone/project`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ assessmentId })
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        console.log(data)
        setProblem(data.problem);
        setSubmitted(data.submitted);
        if(data.submitted){
          setSubmission(data.submission);
        }
      } catch (err) {
        console.error("Failed to fetch problem:", err);
      }
    };
    fetchProblem();
  }, [assessmentId, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("No folder selected!");
      return;
    }

    setUploadStatus('zipping');
    console.log('zipping');
    const zip = new JSZip();

    Array.from(selectedFiles).forEach(file => {
      zip.file(file.webkitRelativePath, file);
    });
    console.log('zipped');
    try {
      const zipBlob = await zip.generateAsync(
        { type: "blob", streamFiles: true },
        (metadata) => {
          setZipProgress(metadata.percent.toFixed(0));
        }
      );

      setUploadStatus('uploading');
      console.log('uploaded');
      const formData = new FormData();
      formData.append('projectZip', zipBlob, `${selectedFiles[0].webkitRelativePath.split('/')[0]}.zip`);
      formData.append('problemId', problem.id);
      formData.append('assessmentId', assessmentId);

      const response = await fetch(`${API_URL}/submission/upload/project`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      console.log(response);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setMessage(data.message);
      setSubmitted(true);
      setUploadStatus('success');

    } catch (error) {
      console.error("Zipping or upload failed:", error);
      setUploadStatus('error');
    }
  };

  const renderStatus = () => {
    switch (uploadStatus) {
      case 'zipping':
        return `Zipping folder... ${zipProgress}%`;
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return '✅ Project submitted successfully!';
      case 'error':
        return '❌ An error occurred.';
      default:
        return selectedFiles ? `${selectedFiles.length} files selected.` : 'Select files to submit';
    }
  };


  return (
    <>
      <div className={`flex flex-col `}>


        {problem === null ? <LoadingParent /> :
          <div className="p-6 bg-white shadow-md rounded-lg mt-4">
            <div className="flex justify-between items-start pb-6 border-b border-gray-200">
              {/* Problem Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{problem?.title}</h2>
                <p className="text-sm text-gray-500 mt-1">Full Marks: {problem?.fullmarks}</p>
              </div>


              <div className="w-[480px] bg-gray-50 p-4 rounded-xl shadow-inner">
                <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-3">
                  {!submitted && selectedFiles === null && (
                    <>
                      <label
                        htmlFor="folder-upload"
                        className="cursor-pointer inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        📂 Choose Project Folder
                      </label>
                      <input
                        id="folder-upload"
                        type="file"
                        webkitdirectory="true"
                        directory="true"
                        onChange={handleFolderChange}
                        className="hidden"
                      />
                    </>
                  )}


                  {!submitted && (
                    <p className="text-sm font-medium text-gray-700">
                      {renderStatus()}
                    </p>
                  )}


                  {selectedFiles && !submitted && (
                    <button
                      type="submit"
                      disabled={!selectedFiles || uploadStatus === 'zipping' || uploadStatus === 'uploading'}
                      className="w-full px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                    >
                      {uploadStatus === 'zipping'
                        ? 'Zipping...'
                        : uploadStatus === 'uploading'
                          ? 'Uploading...'
                          : 'Submit Project'}
                    </button>
                  )}


                  {submitted && (
                    <div className="flex gap-4 justify-center items-center">
                    <p className="text-green-600 font-semibold">✅ Submitted</p>
                    <a href={`${API_URL}/download/assessment-${assessmentId}/${submission?.file}`} className="px-3 py-1 justify-center rounded-full text-sm bg-green-500 text-white hover:bg-green-600" >Download Files</a>
                    </div>

                  )}
                </form>
              </div>
            </div>

            <div className="pt-4">
              <MDEditor.Markdown source={problem?.statement} style={{ padding: 15 }} />
            </div>
          </div>
        }
      </div>
    </>
  );
}