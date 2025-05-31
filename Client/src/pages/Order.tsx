import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../global/store";
import { getAllOrders } from "../Api/CartApi/CartApi";
import { ThreeCircles } from "react-loader-spinner";
import { toast } from "react-toastify";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderType {
  _id: string;
  createdAt: string;
  amount: number;
  currency: string;
  cartItems: OrderItem[];
  email: string;
  paymentReference: string;
  status: string;
  shipping?: {
    name: string;
    email: string;
    address: string;
  };
}

const Order = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const token = user?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !token) return;
        const data = await getAllOrders(user.id, token);
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        toast.error("Could not load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  return (
    <div className="min-h-screen bg-[#0d0b1e] text-white font-sans px-4 py-10">
      {loading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1a32]">
          <ThreeCircles height="100" width="100" color="#e67e22" visible />
          <p className="mt-3 text-lg font-medium text-[#e67e22]">
            Loading Orders...
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-3xl font-bold text-center">Order Summary</h2>

          {orders.length === 0 ? (
            <p className="text-center text-gray-400">
              You haven't placed any orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1c1a32] rounded-xl shadow-lg overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-[#29274c]">
                  <h3 className="text-xl font-semibold">
                    Order ID:{" "}
                    <span className="text-[#f39c12]">{order._id}</span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-lg font-semibold">
                      Shipping Info
                    </h4>
                    <div className="space-y-1 text-sm text-gray-300">
                      <p>Name: {order.shipping?.name || "N/A"}</p>
                      <p>Email: {order.shipping?.email || order.email}</p>
                      <p>Address: {order.shipping?.address || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-lg font-semibold">
                      Items Ordered
                    </h4>
                    <div className="space-y-3 text-sm">
                      {order.cartItems?.map((item) => (
                        <div
                          key={item.productId}
                          className="flex justify-between"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p>₦{item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#29274c] flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₦{order.amount.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}

          <div className="text-center">
            <a
              href="/"
              className="inline-block mt-6 px-6 py-3 bg-[#f39c12] text-black font-semibold rounded-lg hover:bg-[#e67e22] transition"
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
