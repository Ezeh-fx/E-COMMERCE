import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { mockStats, mockOrders, mockProducts } from '../../components/data/mockData';

const Dashboard = () => {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">{stat.title}</h3>
            <div className="flex items-end mt-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className={`ml-2 text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Orders */}
      <div className="p-4 mb-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-blue-500 hover:text-blue-700">View All</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Order ID</th>
              <th className="pb-2">Customer</th>
              <th className="pb-2">Items</th>
              <th className="pb-2">Total</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.slice(0, 3).map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="py-3">{order.id}</td>
                <td className="py-3">{order.customer}</td>
                <td className="py-3">{order.items}</td>
                <td className="py-3">${order.total.toFixed(2)}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Latest Products */}
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Latest Products</h2>
          <Link to="/products" className="text-sm text-blue-500 hover:text-blue-700">View All</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mockProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-center h-32 mb-3 bg-gray-200 rounded-lg">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <span className={`text-sm ${product.stock > 20 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;