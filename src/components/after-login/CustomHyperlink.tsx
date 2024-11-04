import React, { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";
import Swal from "sweetalert2";
import { FaEdit, FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const CustomHyperlink: React.FC = () => {
  const { id: idProject } = useParams();
  const [isBioModalOpen, setBioModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setlink] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [menuLinks, setmenuLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLinkId, setCurrentLinkId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [userDomain, setUserDomain] = useState<string | null>(null);
  const [mainDomain, setMainDomain] = useState<string | null>(null);

  const fetchPhotoBio = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-photo-bio/${idProject}`
      );
      const data = await response.json();
      if (data.success) {
        console.log(data);
        setPhoto(data.data[0].photo);
        setBio(data.data[0].bio);
        setUserDomain(data.data[0].sub_domain);
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

  const toggleMenu = (id: string) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
      setMainDomain(parsedUserData.domain_user);
    }
  }, []);

  const fetchmenuLinks = async () => {
    if (userId) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/main/get-link-menu/${idProject}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch menu links");
        }

        const data = await response.json();
        if (data.success) {
          console.log("data", data.data);
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

  const handleAddLink = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/add-link-menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            link,
            project_id: idProject,
            user_sub_domain: userDomain,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add link");
      } else {
        Swal.fire("Success!", "Berhasil menambahkan menu", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      // Fetch updated menu links
      const updatedResponse = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-link-menu/${userId}`
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.success) {
        setmenuLinks(updatedData.data);
      }

      setTitle("");
      setlink("");
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLink = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/edit-link-menu/${currentLinkId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, link }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit link");
      }

      Swal.fire("Success!", "Berhasil mengedit menu", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      // Fetch updated menu links
      const updatedResponse = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-link-menu/${userId}`
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.success) {
        setmenuLinks(updatedData.data);
      }

      setTitle("");
      setlink("");
      setEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_PREFIX_BACKEND
            }/api/main/delete-link-menu/${id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete link");
          }

          Swal.fire("Deleted!", "Your menu link has been deleted.", "success");

          await fetchmenuLinks();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  const handlePhotoEdit = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axios.put(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/edit-photo-project/${idProject}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Swal.fire("Success", "Photo updated successfully", "success");
      fetchPhotoBio();
    } catch (error) {
      console.error("Failed to update photo", error);
    }
  };

  const handleBioEdit = async () => {
    try {
      await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/edit-bio-project/${idProject}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bio }),
        }
      );
      Swal.fire("Success", "Bio updated successfully", "success");
      setBioModalOpen(false);
    } catch (error) {
      console.error("Failed to update bio", error);
    }
  };

  const generatedLink = `https://sellinkit.shop/${mainDomain}/${userDomain}`;

  return (
    <div className="flex h-screen mb-6 overflow-x-hidden overflow-y-auto pr-4">  
      <Sidebar />
      <div className="flex-1 p-6 pt-20 md:ml-64 lg:ml-64 transition-all duration-300">
        <div className="bg-white pr-4 shadow-md rounded-md mb-4 flex items-center justify-between">
          <span className="text-blue-500 font-semibold">
            <a href={generatedLink} target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
          </span>
          <button
            className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigator.clipboard.writeText(generatedLink)}
          >
            <FaCopy className="inline-block mr-1" /> Copy link
          </button>
        </div>
        <h2 className="text-2xl font-bold">Add Menu</h2>
        {/* Photo and Bio Display with Edit Icons */}
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <img
              src={`${import.meta.env.VITE_PHOTO_PREFIX}/${photo}`}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <button
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => document.getElementById("photoInput")?.click()}
            >
              <FaEdit />
            </button>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handlePhotoEdit(e.target.files[0]);
                  e.target.value = ""; // reset input to allow re-selection of same file if needed
                } else {
                  console.log("No file selected or failed to retrieve file.");
                }
              }}
            />
          </div>

          <div className="flex items-center">
            <p>{bio}</p>
            <button
              className="ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setBioModalOpen(true)}
            >
              <FaEdit />
            </button>
          </div>
        </div>

        {/* Bio Edit Modal */}
        {isBioModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Edit Bio</h3>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border border-gray-300 rounded w-full px-3 py-2"
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleBioEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setBioModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Menu
          </button>

          <button
            onClick={() => navigate(`/view-output/${idProject}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View Output
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Add New menu</h3>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="link"
                >
                  link
                </label>
                <textarea
                  id="link"
                  value={link}
                  onChange={(e) => setlink(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddLink}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Submit
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Edit menu</h3>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="edit-title"
                >
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="edit-link"
                >
                  link
                </label>
                <textarea
                  id="edit-link"
                  value={link}
                  onChange={(e) => setlink(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleEditLink}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <p>Loading...</p>
          ) : menuLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-white p-4 border rounded shadow-md relative"
                  // Navigasi hanya jika elemen utama diklik
                  onClick={() => navigate(`/custom-hyperlink/${link.id}`)}
                >
                  <h3 className="text-lg font-semibold overflow-hidden">
                    {link.title}
                  </h3>
                  <p className="text-gray-600 overflow-hidden">{link.link}</p>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah navigasi saat tombol edit diklik
                        toggleMenu(link.id);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaEdit />
                    </button>
                    {menuOpenId === link.id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah navigasi saat edit diklik
                            setCurrentLinkId(link.id);
                            setTitle(link.title);
                            setlink(link.link);
                            setEditModalOpen(true);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah navigasi saat delete diklik
                            handleDeleteLink(link.id);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center w-full px-3 py-2 text-red-500 hover:bg-gray-100"
                        >
                          <i className="fas fa-trash mr-2"></i>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No menu links found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomHyperlink;
