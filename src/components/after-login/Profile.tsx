import React from "react";
import Sidebar from "../ui/Sidebar";


const Profile: React.FC = () => {


  return (
    <div className="flex h-screen mb-6">
      <Sidebar />
      <div className="flex-1 p-6 pt-20 md:ml-64 lg:ml-64 transition-all duration-300">
        <h2 className="text-2xl font-bold">Profile</h2>
        
      </div>
    </div>
  );
};

export default Profile;
