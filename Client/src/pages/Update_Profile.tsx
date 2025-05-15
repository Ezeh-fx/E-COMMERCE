import React, { useState } from "react";
import axios from "axios";
import { UserType } from "../global/useReducer";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../global/useReducer";
import { RootState, AppDispatch } from "../global/store";

interface Props {
  user: UserType;
  onClose: () => void;
}

const UpdateProfileModal: React.FC<Props> = ({ user, onClose }) => {
  const [firstname, setFirstname] = useState(user.firstname || "");
  const [email, setEmail] = useState(user.email || "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(user.profileImages || null);
const dispatch = useDispatch<AppDispatch>();
const currentUser = useSelector((state: RootState) => state.user.user);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImage(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

const handleUpdate = async () => {
  setLoading(true);
  try {
    // Update name and email
    await axios.patch(`http://localhost:2343/api/update/${currentUser?.id}`, {
      firstname,
      email,
    });

    let updatedUser = { ...user, firstname, email };

    // Upload profile image
    if (image) {
      const formData = new FormData();
      formData.append("profileImage", image);

      const imageResponse = await axios.patch(
        `http://localhost:2343/api/changeProfileImage/${currentUser?.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // ✅ Correct access to updated image
      if (imageResponse.data?.user?.profileImages) {
        updatedUser = {
          ...updatedUser,
          profileImages: imageResponse.data.user.profileImages,
        };
      }
    }

    // ✅ Update Redux
    dispatch(updateUser(updatedUser));
    alert("Profile updated successfully");
    onClose();
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-[#1c1a32]">Update Profile</h2>
        
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <img 
              src={preview || user.profileImages || "/default-avatar.png"} 
              alt="Profile Preview" 
              className="w-24 h-24 rounded-full object-cover border-2 border-[#e67e22]" 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e67e22] bg-white"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e67e22] bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
              onChange={handleImageChange}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 transition-colors bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-[#e67e22] text-white rounded hover:bg-[#d35400] transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;