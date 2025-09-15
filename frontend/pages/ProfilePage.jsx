import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../src/Contexts/AuthContext/AuthContext";
import { API_URL } from "../src/config";
import { AlertContext } from "../src/Contexts/AlertContext/AlertContext";


const PageTitle = ({ text }) => (
  <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight text-center">
    {text}
  </h1>
);

const useNavigate = () => (path) => console.log(`Navigating to ${path}`);


const ProfileField = ({ label, value, name, isEditing, onChange, type = "text", isTextarea = false }) => (
  <div>
    <label className="text-sm font-medium text-gray-500">{label}</label>
    {isEditing ? (
      isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={4}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      )
    ) : (
      <p className="text-gray-900 font-semibold text-lg">{value ? value : <span className="font-normal">Not specified</span>}</p>
    )}
  </div>
);


export default function ProfilePage() {
  const { setMessage } = useContext(AlertContext);
  const [user, setUser] = useState(null);
  const { token, userId, setToken } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState({ file: null, preview: "" });

  const navigate = useNavigate();

  console.log(userId);
  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      try {

        const res = await fetch(`${API_URL}/auth/getprofile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setUser(data.user);
          setFormData(data.user)
          console.log(user)

        } else {
          setMessage("Failed to update photo.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Network error, please try again.");
      }
    }

    fetchUserData();
    // setFormData({ ...user });

  }, [userId, token]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage({
        file: file,
        preview: URL.createObjectURL(file),
      });
    }
  };



  const handlePhotoUpdate = async (e) => {
    e.preventDefault();
    if (!profileImage.file) {
      setMessage("Please select a photo to upload.");
      return;
    }
    console.log("Uploading photo:", profileImage.file.name);

    const uploadData = new FormData();
    uploadData.append('profilePhoto', profileImage.file);


    try {

      const res = await fetch(`${API_URL}/auth/user/uploadprofilephoto`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });
      if (res.ok) {
        setMessage("Photo updated successfully!");
        const data = await res.json();
        setUser(prev => ({ ...prev, avatarUrl: data.profilePhotoUrl }));
        setProfileImage({ file: data.profilePhotoUrl, preview: null });
        localStorage.setItem("profile_pic", data.profilePhotoUrl);
      } else {
        setMessage("Failed to update photo.");
      }

    } catch (err) {
      console.error(err);
      setMessage("Network error, please try again.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating profile with:", formData);

    try {

      const res = await fetch(`${API_URL}/auth/editprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ formData }),
      });
      const data = await res.json();
      if (res.ok && data.token) {

        localStorage.setItem("token", data.token);

        setUser(data.updatedUser);
        setToken(data.token);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setMessage("Failed to update profile.");
      }
      setUser(formData);
      setMessage("Profile updated successfully! (mocked)");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("Network error, please try again.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    console.log("Updating password...");

    try {

      const res = await fetch(`${API_URL}/auth/user/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passwordData }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage("Failed to update password. Check your current password.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error, please try again.");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({ ...user });
  };

  const logOut = () => {
    setUser(null);
    setMessage("Logged out successfully!");
    navigate("/login");
  };

  if (!user) {
    return <PageTitle text="User not found." />;
  }


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-12">
      <PageTitle text="My Profile" />


      <form onSubmit={handlePhotoUpdate} className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 flex flex-col sm:flex-row items-center gap-8">
        {
          
        user.profile_pic ? 
          
          <img
          src={`${API_URL}/profilephotos/${user.profile_pic}`}
          alt="Profile avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />

        : 
         <img
          src={profileImage.preview }
          alt="Profile avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
        />
        }
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-900">Profile Photo</h3>
          <p className="text-gray-600 mb-4">Upload a new photo. It will be public.</p>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium">
              Choose File
              <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
            </label>
            {profileImage.file && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Save Photo
              </button>
            )}
          </div>
        </div>
      </form>


      <form onSubmit={handleProfileUpdate} className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Profile Details</h3>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Edit Profile
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} />
            <ProfileField label="Username" name="username" value={formData.username} isEditing={isEditing} onChange={handleInputChange} />
            <ProfileField label="Email" name="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} type="email" />
            <ProfileField label="University" name="university" value={formData.institution} isEditing={isEditing} onChange={handleInputChange} />
          </div>
          <ProfileField label="Bio" name="bio" value={formData.bio} isEditing={isEditing} onChange={handleInputChange} isTextarea />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileField label="GitHub" name="github" value={formData.github} isEditing={isEditing} onChange={handleInputChange} />
            <ProfileField label="LinkedIn" name="linkedin" value={formData.linkedin} isEditing={isEditing} onChange={handleInputChange} />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button type="button" onClick={cancelEdit} className="px-5 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </form>





      <form onSubmit={handlePasswordUpdate} className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Change Password</h3>
        <div>
          <label className="block text-sm font-medium text-gray-600">Current Password</label>
          <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">New Password</label>
          <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Confirm New Password</label>
          <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Update Password
          </button>
        </div>
      </form>


      <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Log Out</h3>
          <p className="text-gray-600">You will be returned to the login page.</p>
        </div>
        <button onClick={logOut} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
          Log Out
        </button>
      </div>
    </div>
  );
}