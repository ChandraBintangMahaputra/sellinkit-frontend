import React from "react";
import Sidebar from "../ui/Sidebar";
// import { useNavigate } from "react-router-dom";

const Statistik: React.FC = () => {
//   const navigate = useNavigate();

//   const handleHyperlinkClick = () => {
//     navigate("/statistic-hyperlink");
//   };

//   const handleCatalogClick = () => {
//     navigate("/statistic-catalog");
//   };

  return (
    <div className="flex h-screen mb-6">
      <Sidebar />
      <div className="flex-1 p-6 pt-20 md:ml-64 lg:ml-64 transition-all duration-300">
        <h2 className="text-2xl font-bold">Statistik</h2>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          <div
            onClick={handleHyperlinkClick}
            className="cursor-pointer p-4 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            <h3 className="text-lg font-semibold">Statistik Hyperlink</h3>
          </div>

          <div
            onClick={handleCatalogClick}
            className="cursor-pointer p-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
          >
            <h3 className="text-lg font-semibold">Statistik Catalog</h3>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Statistik;
