import { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";

const Order = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000); // Simulate a loading delay of 2 seconds
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0b1e] text-white font-sans px-4 py-10">
      {loading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1a32]">
          <ThreeCircles
            visible={true}
            height="100"
            width="100"
            color="#e67e22"
            ariaLabel="three-circles-loading"
          />
          <p className="mt-3 text-lg font-medium text-[#e67e22]">Loading...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-[#1c1a32] rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#29274c] text-center">
            <h2 className="text-3xl font-bold">Order Summary</h2>
            <p className="text-sm text-gray-400">Thank you for your purchase!</p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            {/* Shipping Info */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Shipping Information</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Address:</strong> 123 Main St, Lagos, Nigeria</p>
                <p><strong>Email:</strong> john@example.com</p>
                <p><strong>Phone:</strong> +234 800 000 0000</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Items Ordered</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center border-b border-[#29274c] pb-2">
                  <div>
                    <p className="font-medium">Heavy Duty Truck</p>
                    <p className="text-gray-400">Quantity: 1</p>
                  </div>
                  <p className="font-semibold">$120,000</p>
                </div>

                <div className="flex justify-between items-center border-b border-[#29274c] pb-2">
                  <div>
                    <p className="font-medium">Logistics Van</p>
                    <p className="text-gray-400">Quantity: 2</p>
                  </div>
                  <p className="font-semibold">$170,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="px-6 py-4 bg-[#29274c] flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>$290,000</span>
          </div>

          {/* Button */}
          <div className="p-6 text-center">
            <a
              href="/"
              className="inline-block px-6 py-3 bg-[#f39c12] text-black font-semibold rounded-lg hover:bg-[#e67e22] transition"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
