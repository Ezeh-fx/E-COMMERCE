"use client"

import { Edit } from "lucide-react"
import { mockOrders } from "../../components/data/mockData"

const Orders = () => {
  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">Orders</h1>

      {/* Desktop view - full table */}
      <div className="overflow-hidden bg-white rounded-lg shadow tablet:hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-50">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.items}</td>
                <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet view - simplified table */}
      <div className="hidden overflow-x-auto bg-white rounded-lg shadow tablet:block mobile:hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">#{order.id}</div>
                    <div className="text-sm text-gray-500">{order.customer}</div>
                    <div className="text-xs text-gray-400">{order.date}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">${order.total.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{order.items} items</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - card layout */}
      <div className="hidden space-y-4 mobile:block">
        {mockOrders.map((order) => (
          <div key={order.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">Order #{order.id}</h3>
                <p className="text-sm text-gray-600">{order.customer}</p>
              </div>
              <button className="p-1 text-blue-500 hover:text-blue-700">
                <Edit size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm">
                <span className="text-gray-500">Items:</span> {order.items}
              </div>
              <div className="font-medium">${order.total.toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "Shipped"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {order.status}
              </span>
              <span className="text-gray-500">{order.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
