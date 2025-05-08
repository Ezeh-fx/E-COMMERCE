import { useState } from "react";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Settings</h1>

      <div className="p-6 bg-white rounded-lg shadow">
        {/* General Settings */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium">General Settings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-gray-700">Store Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="E-Shop Store"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Store Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="contact@eshop.com"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Currency</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>NGN (₦)</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Language</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium">Notifications</h2>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-gray-700">
              Enable email notifications
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-right">
          <button className="px-6 py-2 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
