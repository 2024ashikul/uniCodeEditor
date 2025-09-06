import PageTitle from "../src/components/SharedComponents/PageTitle";



export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <PageTitle text="My Profile" className="self-center"/>

      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-6">
        
        <div className="flex justify-center md:w-1/3">
          <img
            src="/default-avatar.png"
            alt="Profile avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        </div>

        
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            John Doe
          </h2>
          <p className="text-gray-600">@johndoe</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">john@example.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-gray-800">Jan 15, 2024</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">University</p>
              <p className="text-gray-800">Uni Code Lab</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <p className="text-gray-800">Computer Science</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course</p>
              <p className="text-gray-800">Computer Science</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Bio</p>
            <p className="text-gray-800">
              Passionate about coding challenges and building cool projects.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
