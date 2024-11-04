import React, { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subDomain, setSubDomain] = useState("");
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userDomain, setUserDomain] = useState<string | null>(null);
  const [catalogLinks, setcatalogLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLinkId, setCurrentLinkId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setMenuOpenId(menuOpenId === id ? null : id);
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
      setUserDomain(parsedUserData.domain_user);
    }
  }, []);

  const fetchcatalogLinks = async () => {
    if (userId) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_PREFIX_BACKEND
          }/api/main/get-catalog/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch catalog links");
        }

        const data = await response.json();
        if (data.success) {
          setcatalogLinks(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchcatalogLinks();
  }, [userId]);

  const handleAddLink = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/add-catalog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, user_id: userId, sub_domain: subDomain, user_domain: userDomain }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add link");
      } else {
        Swal.fire("Success!", "Berhasil menambahkan catalog", "success");
        setEditModalOpen(false);
        setTimeout(() => {
            window.location.reload();
          }, 1000);
     
      }

      // Fetch updated catalog links
      const updatedResponse = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-link-catalog/${userId}`
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.success) {
        setcatalogLinks(updatedData.data);
      }

      setTitle("");
      setDescription("");
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
        }/api/main/edit-catalog/${currentLinkId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, subDomain }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit link");
      }

      Swal.fire("Success!", "Berhasil mengedit catalog", "success");

      // Fetch updated catalog links
      const updatedResponse = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-link-catalog/${userId}`
      );
      const updatedData = await updatedResponse.json();
      if (updatedData.success) {
        setcatalogLinks(updatedData.data);
      }

      setTitle("");
      setDescription("");
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
            }/api/main/delete-catalog/${id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete link");
          }

          Swal.fire(
            "Deleted!",
            "Your catalog link has been deleted.",
            "success"
          );

          await fetchcatalogLinks();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="flex h-screen mb-6">
      <Sidebar />
      <div className="flex-1 p-6 pt-20 md:ml-64 lg:ml-64 transition-all duration-300">
        <h2 className="text-2xl font-bold">Add Catalog</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Catalog
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Add New Catalog</h3>
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
                  htmlFor="description"
                >
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="sub_domain"
                >
                  Sub Domain
                </label>
                <input
                  id="sub_domain"
                  type="text"
                  value={subDomain}
                  onChange={(e) => setSubDomain(e.target.value)}
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
              <h3 className="text-lg font-bold mb-4">Edit Catalog</h3>
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
                  htmlFor="edit-description"
                >
                  Description
                </label>
                <input
                  id="edit-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="edit-sub-domain"
                >
                  Sub Domain
                </label>
                <input
                  id="edit-sub-domain"
                  type="text"
                  value={subDomain}
                  onChange={(e) => setSubDomain(e.target.value)}
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
          ) : catalogLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-white p-4 border rounded shadow-md relative"
                  onClick={() => navigate(`/custom-catalog/${link.id}`)}
                >
                  <h3 className="text-lg font-semibold">{link.title}</h3>
                  <p className="text-gray-600">{link.description}</p>
                  <p className="text-gray-600">/{link.sub_domain}</p>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation(); // Prevents navigation when FaEdit is clicked
                        toggleMenu(link.id);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaEdit />
                    </button>
                    {menuOpenId === link.id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={(event) => {
                            event.stopPropagation(); 
                            setCurrentLinkId(link.id);
                            setTitle(link.title);
                            setDescription(link.description);
                            setSubDomain(link.sub_domain)
                            setEditModalOpen(true);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Edit
                        </button>
                        <button
                          onClick={(event) => {
                            event.stopPropagation(); 
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
            <p>No catalog links found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
