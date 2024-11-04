import React, { useState, useEffect, useRef  } from "react";
import { useParams } from "react-router-dom";
import { scale } from "../../assets";
import axios from "axios";


const Output: React.FC = () => {
  const { id: idProject } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [menuLinks, setmenuLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");

  const hasSentDate = useRef(false);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sendDateToApi = async () => {
    const formattedDate = getCurrentDate();
    try {
      const response = await axios.post(`${import.meta.env.VITE_PREFIX_BACKEND}/api/main/total-visit-hyperlink`, {
        date: formattedDate,
        sub_domain: idProject
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error sending date:", error);
    }
  };

  useEffect(() => {
    if (!hasSentDate.current) {
      sendDateToApi();
      hasSentDate.current = true;
    }
    document.title = "Sellinkit";
  }, []);

  

  const fetchPhotoBio = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/get-photo-bio-output/${idProject}`
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
          `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/get-link-menu-output/${idProject}`
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
    <div className="flex-1 p-6 pt-20 flex flex-col items-center transition-all duration-300">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        {/* Photo and Bio */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={`${import.meta.env.VITE_PHOTO_PREFIX}/${photo}`}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-4"
          />
          <p className="text-center text-gray-700">{bio}</p>
        </div>

        {/* Menu Links */}
        <div className="w-full">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : menuLinks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {menuLinks.map((link) => (
                <div
                  key={link.id}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center cursor-pointer transition-all shadow-md hover:shadow-lg" // Tambahkan shadow pada setiap card
                  onClick={() => (window.location.href = link.link)}
                >
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{link.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No menu links found.</p>
          )}
        </div>

        {/* Scale Logo */}
        <div className="flex justify-center mt-6">
          <img src={scale} alt="Scale Logo" className="w-16 h-16" />
        </div>
      </div>
    </div>
  );
};

export default Output;
