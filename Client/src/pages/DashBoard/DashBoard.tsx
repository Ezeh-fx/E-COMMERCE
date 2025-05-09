
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { mockStats, mockOrders, mockProducts } from '../../components/data/mockData';

const Dashboard = () => {
  return (
    <div className="w-full">
      <h1 className="mb-4 text-xl font-semibold mobile:text-2xl">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6 min-[641px]:grid-cols-2 min-[1008px]:grid-cols-4">
        {mockStats.map((stat, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-sm text-gray-500">{stat.title}</h3>
            <div className="flex items-end mt-2">
              <span className="text-xl min-[641px]:text-2xl font-bold">{stat.value}</span>
              <span className={`ml-2 text-sm ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Orders */}
      <div className="p-3 mb-6 bg-white rounded-lg shadow mobile:p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium mobile:text-lg">Recent Orders</h2>
          <Link to="/orders" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {/* Desktop Table - Hidden on mobile */}
        <div className="hidden min-[641px]:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Customer</th>
                <th className="pb-2">Items</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 min-[641px]:hidden min-[1008px]:table-cell">Date</th>
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
                  <td className="py-3 min-[641px]:hidden min-[1008px]:table-cell">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View - Visible only on mobile */}
        <div className="min-[641px]:hidden">
          {mockOrders.slice(0, 3).map((order) => (
            <div key={order.id} className="p-3 mb-3 border rounded-lg last:mb-0">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Order #{order.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">{order.customer}</div>
              <div className="flex justify-between mt-2">
                <span className="text-sm">{order.items} items</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">{order.date}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Latest Products */}
      <div className="p-3 bg-white rounded-lg shadow mobile:p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium mobile:text-lg">Latest Products</h2>
          <Link to="/products" className="flex items-center text-sm text-blue-500 hover:text-blue-700">
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[641px]:grid-cols-2 min-[1008px]:grid-cols-3">
          {mockProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="p-3 border rounded-lg mobile:p-4">
              <div className="flex items-center justify-center h-24 mb-3 bg-gray-200 rounded-lg mobile:h-32">
                <Package size={24} className="text-gray-400 mobile:hidden" />
                <Package size={32} className="hidden text-gray-400 mobile:block" />
              </div>
              <h3 className="text-sm font-medium mobile:text-base">{product.name}</h3>
              <p className="text-xs text-gray-500 mobile:text-sm">{product.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold mobile:text-base">${product.price.toFixed(2)}</span>
                <span className={`text-xs mobile:text-sm ${product.stock > 20 ? 'text-green-500' : 'text-red-500'}`}>
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