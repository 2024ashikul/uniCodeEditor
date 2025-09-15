import { useContext, useEffect, useState } from "react";
import { UIContext } from "../Contexts/UIContext/UIContext";
import { API_URL } from "../config";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";
import PopUp from "./SharedComponents/PopUp";
import PopUpLayout from "./SharedComponents/PopUpLayout";
import { AlertContext } from "../Contexts/AlertContext/AlertContext";

export default function Schedule({ assessmentId }) {
  const { setMessage, setType } = useContext(AlertContext);
  const { token, userId } = useContext(AuthContext);
  const [assigned, setAssigned] = useState(null);
  const [dateTimeEdit, setDateTimeEdit] = useState(false);
  const [form, setForm] = useState({
    datetime: "",
    duration: "",
    assigned: null,
  });
  const { setPopUp } = useContext(UIContext);

  useEffect(() => {
    // Correctly validate that the selected time is not in the past
    if (form.datetime) {
      const selectedTime = new Date(form.datetime).getTime();
      const now = new Date().getTime();
      if (selectedTime < now) {
        setMessage("Scheduled time cannot be in the past");
        setType("warning");
      }
    }
  }, [form.datetime, setMessage, setType]);

  async function applyScehdule(e) {
    e.preventDefault();
    try {
      // *** THE MOST IMPORTANT CHANGE IS HERE ***
      // Convert the local datetime string to a full UTC ISO String
      const scheduleTimeUTC = new Date(form.datetime).toISOString();

      const payload = {
        assessmentId,
        userId,
        form: {
          ...form,
          datetime: scheduleTimeUTC, // Send the UTC string to the server
        },
      };

      const res = await fetch(`${API_URL}/assessment/admin/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // Send the payload with the UTC time
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setAssigned(data.status);
      setDateTimeEdit(false);
      setPopUp(false);
      setMessage("Schedule updated successfully");
      setType("success");
    } catch (err) {
      console.error("Failed to update schedule", err);
      setMessage("Internal server error");
      setType("error");
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const PopUpCode = (
    <form
      method="POST"
      onSubmit={applyScehdule}
      className="flex flex-col gap-6 px-6 py-4"
    >
      {/* Date & Time */}
      <div className="flex flex-col gap-2">
        <label htmlFor="datetime" className="text-sm font-medium text-gray-700">
          Set Time
        </label>
        <input
          id="datetime"
          name="datetime"
          type="datetime-local"
          value={form.datetime} // Bind to form.datetime
          onChange={handleChange} // Use the single handler
          required
          className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <label htmlFor="duration" className="text-sm font-medium text-gray-700">
          Set Duration (minutes)
        </label>
        <input
          id="duration"
          name="duration"
          type="number"
          value={form.duration} // Bind to form.duration
          onChange={handleChange} // Use the single handler
          required
          placeholder="Enter duration"
          className="px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      {/* ... (rest of the form is fine, but use handleChange for radios too) */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="assigned" value="true" onChange={handleChange} className="w-4 h-4" />
          <span>Assign</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="assigned" value="false" onChange={handleChange} className="w-4 h-4" />
          <span>Not Assign</span>
        </label>
      </div>


      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 mt-2 text-white bg-green-500 rounded-xl shadow-md hover:bg-green-600 hover:scale-[1.02] transition duration-200"
      >
        Save Schedule
      </button>
    </form>
  );

  return (
    <>
      <PopUpLayout>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Status</span>
            <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-gray-100">
              {assigned ?? "Not set"}
            </span>
            <button
              onClick={() => setDateTimeEdit(true)}
              className="px-4 py-2 w-50 text-white bg-green-500 rounded-xl shadow-md hover:bg-green-600 hover:scale-[1.05] transition"
            >
              Change Schedule
            </button>
          </div>
        </div>
      </PopUpLayout>

      {dateTimeEdit && (
        <PopUp
          name={dateTimeEdit}
          setName={setDateTimeEdit}
          onSubmit={applyScehdule}
          onChange={handleChange}
          title="Edit Schedule"
          buttonTitle="Change Schedule"
          ManualCode={PopUpCode}
          ManualEdit={true}
        />
      )}
    </>
  );
}
