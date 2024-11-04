import React, { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";
import Swal from "sweetalert2";
import { FaEdit, FaCopy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";

const CustomCatalog: React.FC = () => {
  const { id: idProject } = useParams();
  const [isBioModalOpen, setBioModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setlink] = useState("");
  const [product, setProduct] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [menuLinks, setmenuLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLinkId, setCurrentLinkId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");
  const [userDomain, setUserDomain] = useState<string | null>(null);
  const [mainDomain, setMainDomain] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [photoProduct, setPhotoProduct] = useState<File | null>(null);

  const fetchPhotoBio = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-photo-bio-product/${idProject}`
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
          }/api/main/get-product/${idProject}`
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
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);
      if (idProject) formData.append("project_id", idProject);
      if (userDomain) formData.append("user_sub_domain", userDomain);
      formData.append("price", price);
      if (photoProduct) formData.append("photo", photoProduct);

      // Send request with Axios
      const response = await axios.post(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/add-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        Swal.fire("Success!", "Berhasil menambahkan menu", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Failed to add link");
      }

      // Fetch updated menu links
      const updatedResponse = await axios.get(
        `${
          import.meta.env.VITE_PREFIX_BACKEND
        }/api/main/get-link-menu/${userId}`
      );
      if (updatedResponse.data.success) {
        setmenuLinks(updatedResponse.data.data);
      }

      // Reset input fields
      setTitle("");
      setlink("");
      setPrice("");
      setPhotoProduct(null);
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLink = async () => {
    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("link", link);
      if (price) formData.append("price", price); // Add price if it exists
      if (photoProduct) formData.append("photo", photoProduct); // Add photo if it exists
  
      const response = await axios.put(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/edit-product/${currentLinkId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error("Failed to edit link");
      }
  
      Swal.fire("Success!", "Berhasil mengedit menu", "success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
  
      // Fetch updated menu links
      const updatedResponse = await axios.get(
        `${import.meta.env.VITE_PREFIX_BACKEND}/api/main/get-link-menu/${userId}`
      );
      if (updatedResponse.data.success) {
        setmenuLinks(updatedResponse.data.data);
      }
  
      // Reset input fields
      setTitle("");
      setlink("");
      setPrice("");
      setPhotoProduct(null);
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
        }/api/main/edit-photo-catalog/${idProject}`,
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
        }/api/main/edit-bio-catalog/${idProject}`,
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

  const generatedLink = `https://sellinkit.shop/${mainDomain}/catalog/${userDomain}`;

  return (
    <div className="flex flex-grow h-screen mb-6">
      <Sidebar />
      <div className="flex-1 p-6 pt-20 md:ml-64 lg:ml-64 transition-all duration-300">
        <div className="bg-white p-4 shadow-md rounded-md mb-4 flex items-center justify-between">
          <span className="text-blue-500 font-semibold">
            <a href={generatedLink} target="_blank" rel="noopener noreferrer">
              {generatedLink}
            </a>
          </span>
          <button
            className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => navigator.clipboard.writeText(generatedLink)}
          >
            <FaCopy className="inline-block mr-1" /> Copy link to clipboard
          </button>
        </div>
        <h2 className="text-2xl font-bold">Add Product</h2>
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
            onClick={() => navigate(`/view-catalog/${idProject}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            View Catalog
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Add New menu</h3>

              {/* Title Field */}
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

              {/* Link Field */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="link"
                >
                  Link
                </label>
                <textarea
                  id="link"
                  value={link}
                  onChange={(e) => setlink(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>

              {/* Photo Field */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="photoProduct"
                >
                  Photo
                </label>
                <input
                  id="photoProduct"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoProduct(e.target.files[0]); // Assign the file
                    }
                  }}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>

              {/* Buttons */}
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
        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-96">
              <h3 className="text-lg font-bold mb-4">Edit Menu</h3>

              {/* Title Field */}
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

              {/* Link Field */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="edit-link"
                >
                  Link
                </label>
                <textarea
                  id="edit-link"
                  value={link}
                  onChange={(e) => setlink(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>

              {/* Price Field */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="edit-price"
                >
                  Price
                </label>
                <input
                  id="edit-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                  required
                />
              </div>

              {/* Photo Field */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="edit-photoProduct"
                >
                  Photo
                </label>

                {/* Display existing photo if available */}
                <div className="mb-2">
                    <img
                      src={`${import.meta.env.VITE_PHOTO_PREFIX}/${product}`}
                      alt="Existing Product"
                      className="w-15 h-15 object-cover rounded mb-2"
                    />
                  </div>

                <input
                  id="edit-photo-product"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoProduct(e.target.files[0]); // Assign the new file
                    }
                  }}
                  className="border border-gray-300 rounded w-full px-3 py-2"
                />
              </div>

              {/* Buttons */}
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

        <div className="mt-6 mb-6">
          {loading ? (
            <p>Loading...</p>
          ) : menuLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 lg:mb-6 md:mb-6">
              {menuLinks.map((link) => (
                <div
                  key={link.id}
                  className="bg-white p-4 border rounded shadow-md relative"
                  // Navigasi hanya jika elemen utama diklik
                  onClick={() => navigate(`/custom-Catalog/${link.id}`)}
                >
                  {/* Display photo */}
                  <img
                    src={`${import.meta.env.VITE_PHOTO_PREFIX}/${link.photo}`}
                    alt={link.title}
                    className="w-full h-48 object-cover rounded mb-4" // Adjust styles as needed
                  />
                  <h3 className="text-lg font-semibold overflow-hidden">
                    {link.title}
                  </h3>
                  <p className="text-gray-600 overflow-hidden">{link.link}</p>
                  {/* Display price */}
                  <p className="text-gray-800 font-bold">{`Price: Rp ${link.price}`}</p>
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
                            setProduct(link.photo), 
                            setPrice(link.price);
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

export default CustomCatalog;
