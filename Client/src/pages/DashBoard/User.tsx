import { Edit, Trash2 } from 'lucide-react';
import { mockUsers } from '../../components/data/mockData';
import { useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState(mockUsers);

  const deleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Users</h1>
      
      <div className="overflow-hidden bg-white rounded-lg shadow">
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
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{user.joined}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button 
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => deleteUser(user.id)}
                    >
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
  );
};

export default Users;