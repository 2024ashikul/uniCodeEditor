import { useContext, useEffect, useState } from "react";
import { API_URL } from "../config";
import { AuthContext } from "../Contexts/AuthContext/AuthContext";
import { AlertContext } from "../Contexts/AlertContext/AlertContext";
import DatePicker from "react-datepicker";
import { Calendar, Clock, Edit, Save, XCircle } from 'lucide-react';


export default function Schedule({ assessmentId }) {
  const { setMessage, setType } = useContext(AlertContext);
  const { token, userId } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const [schedule, setSchedule] = useState({
    datetime: null, 
    duration: 60,
    isAssigned: false,
  });

  
  const [form, setForm] = useState({
    datetime: new Date(),
    duration: '',
    assigned: 'false',
  });

 
  useEffect(() => {
  
    const fetchedSchedule = {
      datetime: new Date(),
      duration: 60,
      isAssigned: true,
    };
    setSchedule(fetchedSchedule);
    setForm({
      datetime: fetchedSchedule.datetime,
      duration: fetchedSchedule.duration,
      assigned: String(fetchedSchedule.isAssigned),
    });
  }, [assessmentId]);


  const handleEdit = () => {
    setForm({
      datetime: schedule.datetime || new Date(),
      duration: schedule.duration,
      assigned: String(schedule.isAssigned),
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const selectedTime = new Date(form.datetime).getTime();
    const now = new Date().getTime();
    if (selectedTime < now) {
      setMessage("Scheduled time cannot be in the past");
      setType("warning");
      setIsLoading(false);
      return;
    }

    try {
      const scheduleTimeUTC = new Date(form.datetime).toISOString();
      const payload = {
        assessmentId,
        userId,
        form: { ...form, datetime: scheduleTimeUTC },
      };

      const res = await fetch(`${API_URL}/assessment/admin/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      
      setSchedule({
        datetime: new Date(form.datetime),
        duration: form.duration,
        isAssigned: form.assigned === 'true',
      });

      setMessage("Schedule updated successfully");
      setType("success");
      setIsEditing(false);

    } catch (err) {
      console.error("Failed to update schedule", err);
      setMessage("Failed to update schedule. Please try again.");
      setType("error");
    } finally {
      setIsLoading(false);
    }
  };


  if (!isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Assessment Schedule</h2>
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit size={16} />
            Edit Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Date & Time</p>
              <p className="font-semibold text-gray-700">
                {schedule.datetime
                  ? schedule.datetime.toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : "Not Set"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="text-gray-500" size={20} />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold text-gray-700">{schedule.duration} minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div
              className={`w-3 h-3 rounded-full ${schedule.isAssigned ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-gray-700">
                {schedule.isAssigned ? "Assigned" : "Not Assigned"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1">
              Set Time
            </label>
            <DatePicker
              selected={form.datetime}
              onChange={(date) => setForm({ ...form, datetime: date })}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              timeIntervals={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
              wrapperClassName="w-full"
            />
          </div>

          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Set Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
              placeholder="e.g., 60"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
        </div>
        
        
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Status
            </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="assigned"
                value="true"
                checked={form.assigned === 'true'}
                onChange={(e) => setForm({ ...form, assigned: e.target.value })}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span>Assign</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="assigned"
                value="false"
                checked={form.assigned === 'false'}
                onChange={(e) => setForm({ ...form, assigned: e.target.value })}
                className="w-4 h-4 text-red-600 focus:ring-red-500"
              />
              <span>Not Assign</span>
            </label>
          </div>
        </div>

        
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
             <XCircle size={16} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}