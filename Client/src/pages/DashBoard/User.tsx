"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, RotateCcw,X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../global/store";
import { getAllUsers, IUser, getOneUser, deleteUser, promoteUserToAdmin  } from "../../Api/AuthApi/AuthApi";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.user.user?.token);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleViewUser = async (userId: string) => {
    try {
      const user = await getOneUser(userId, token as string);
      setSelectedUser(user);
      setShowDetails(true);
      console.log(user);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
      try {
        await deleteUser(userId, token as string);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    };

  const confirmAndDelete = async (userId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      await handleDeleteUser(userId);
    }
  };
  
  const handlePromoteClick = async (userId: string) => {
    try {
      const result = await promoteUserToAdmin(userId, token as string);
      if (result) {
        alert("User promoted to admin successfully");
        fetchUsers(); // Refresh the user list
      } else {
        alert("Failed to promote user");
      }
    } catch (error: any) {
      console.error("Promote Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(token as string);
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          onClick={fetchUsers}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500">No users available.</p>
      ) : (
        <>
          {/* TABLE VIEW */}
          <div className="overflow-hidden bg-white rounded-lg shadow mobile:hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.username}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-500 hover:text-blue-700"
                          onClick={() => handlePromoteClick(user._id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:text-red-700"
                          onClick={() => confirmAndDelete(user._id)}
                        >
                          <Trash2 size={18} />
                        </button>

                        <button
                      className="p-1 text-green-500 hover:text-green-700"
                      onClick={() => handleViewUser(user._id)}
                    >
                      View
                    </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARD VIEW FOR MOBILE */}
          <div className="hidden space-y-4 mobile:block">
            {users.map((user) => (
              <div key={user._id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700"
                      onClick={() => handlePromoteClick(user._id)}
                      >
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => confirmAndDelete(user._id)}
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      className="p-1 text-green-500 hover:text-green-700"
                      onClick={() => handleViewUser(user._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span className="text-gray-500">
                    Joined:
                    {new Date(user.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* TABLET VIEW */}
          <div className="hidden overflow-x-auto bg-white rounded-lg shadow tablet:block mobile:hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-500 hover:text-blue-700"
                          onClick={() => handlePromoteClick(user._id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="p-1 text-red-500 hover:text-red-700"
                          onClick={() => confirmAndDelete(user._id)}
                        >
                          <Trash2 size={18} />
                        </button>

                        <button
                      className="p-1 text-green-500 hover:text-green-700"
                      onClick={() => handleViewUser(user._id)}
                    >
                      View
                    </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

{showDetails && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg mobile:mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedUser.firstname}
                  disabled
                  className="w-full px-3 py-2 mt-1 text-sm bg-gray-100 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  disabled
                  className="w-full px-3 py-2 mt-1 text-sm bg-gray-100 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={selectedUser.role}
                  disabled
                  className="w-full px-3 py-2 mt-1 text-sm bg-gray-100 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Joined</label>
                <input
                  type="text"
                  value={new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  disabled
                  className="w-full px-3 py-2 mt-1 text-sm bg-gray-100 border rounded"
                />
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Users;
