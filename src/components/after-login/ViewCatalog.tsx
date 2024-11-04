import React, { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";
import { useParams } from "react-router-dom";
import { scale } from "../../assets";

const ViewCatalog: React.FC = () => {
  const { id: idProject } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [menuLinks, setmenuLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [device, setDevice] = useState<"mobile" | "desktop">("desktop");

  const fetchPhotoBio = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-photo-bio-product/${idProject}`
      );
      const data = await response.json();
      if (data.success) {
        setPhoto(data.data[0].photo);
        setBio(data.data[0].bio);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotoBio();
  }, [idProject]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
  }, []);

  const fetchmenuLinks = async () => {
    if (userId) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/main/get-product/${idProject}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu links");
        }
        const data = await response.json();
        if (data.success) {
          setmenuLinks(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchmenuLinks();
  }, [userId]);

  return (
    <div className="flex h-screen mb-6">
      <Sidebar />
      <div className="flex-1 p-6 pt-20 lg:ml-64 transition-all duration-300 flex flex-col items-center">
        {/* Device Toggle */}
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setDevice("mobile")}
            className={`px-4 py-2 rounded ${
              device === "mobile" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Mobile
          </button>
          <button
            onClick={() => setDevice("desktop")}
            className={`px-4 py-2 rounded ${
              device === "desktop" ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
          >
            Desktop
          </button>
        </div>

        {/* Device Wrapper Card */}
        <div
          className={`border rounded-lg p-4 shadow-md flex flex-col justify-between ${
            device === "mobile"
              ? "w-80 h-[500px]"
              : "w-full max-w-screen-lg h-[600px]"
          } overflow-y-scroll`}
        >
          {/* Photo and Bio */}
          <div className="flex flex-col justify-center items-center mb-4">
            <img
              src={`${import.meta.env.VITE_PHOTO_PREFIX}/${photo}`}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <p className="ml-4 mt-4">{bio}</p>
          </div>

          {/* Menu Links */}
          <div className="mt-6 flex-grow">
            {loading ? (
              <p>Loading...</p>
            ) : menuLinks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`bg-white p-4 border rounded shadow-md text-center ${
                      device === "mobile" ? "w-62 h-62" : "w-92 h-92"
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_PHOTO_PREFIX}/${link.photo}`}
                      alt={link.title}
                      className="mb-4 rounded w-32 h-32 object-cover mx-auto"
                    />
                    <h3 className="text-lg font-semibold overflow-hidden">
                      {link.title}
                    </h3>
                    <p className="text-gray-700 mt-2">Rp {link.price}</p>
                    <button
                      className="mt-2 px-4 py-2 bg-green-500 bottom-0 text-white rounded hover:bg-green-600"
                      onClick={() => (window.location.href = link.link)}
                    >
                      buy
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No menu links found.</p>
            )}
          </div>

          {/* Scale Logo */}
          <div className="mt-4 flex justify-center">
            <img src={scale} alt="Scale Logo" className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCatalog;
