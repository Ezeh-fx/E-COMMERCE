import { useEffect, useState } from "react";

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulating API call to fetch orders
    const fetchedOrders = [
      { id: "1", customer: "John Doe", amount: 120, status: "Pending" },
      { id: "2", customer: "Jane Smith", amount: 250, status: "Shipped" },
      { id: "3", customer: "Mike Johnson", amount: 90, status: "Delivered" },
    ];
    setOrders(fetchedOrders);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Orders</h2>
      <table className="min-w-full border border-collapse border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">ID</th>
            <th className="p-2 border border-gray-300">Customer</th>
            <th className="p-2 border border-gray-300">Amount ($)</th>
            <th className="p-2 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="p-2 border border-gray-300">{order.id}</td>
              <td className="p-2 border border-gray-300">{order.customer}</td>
              <td className="p-2 border border-gray-300">${order.amount}</td>
              <td
                className={`border border-gray-300 p-2 ${
                  order.status === "Pending"
                    ? "text-yellow-600"
                    : order.status === "Shipped"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;