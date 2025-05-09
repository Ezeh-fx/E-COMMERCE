"use client"

import { Edit, Trash2 } from "lucide-react"
import { mockUsers } from "../../components/data/mockData"
import { useState } from "react"

const Users = () => {
  const [users, setUsers] = useState(mockUsers)

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">Users</h1>

      {/* Table view for larger screens */}
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
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{user.joined}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700" onClick={() => deleteUser(user.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for tablet and mobile */}
      <div className="hidden space-y-4 mobile:block">
        {users.map((user) => (
          <div key={user.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 text-blue-500 hover:text-blue-700">
                  <Edit size={18} />
                </button>
                <button className="p-1 text-red-500 hover:text-red-700" onClick={() => deleteUser(user.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {user.status}
              </span>
              <span className="text-gray-500">Joined: {user.joined}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet view - simplified table with horizontal scroll */}
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
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700" onClick={() => deleteUser(user.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
