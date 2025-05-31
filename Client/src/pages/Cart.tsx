import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../global/store";
import {
  getUserCart,
  removeFromCart,
  emptyCart as emptyCartApi,
  createCheckoutSession,
} from "../Api/CartApi/CartApi";
import {
  setCart,
  removeFromCart as removeFromCartState,
  emptyCart,
} from "../global/cartReducer"; // Adjust path if needed
import { ThreeCircles } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const token = user?.token;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user || !token) return;
        const res = await getUserCart(user.id, token);
        const items = Array.isArray(res.cart)
          ? res.cart
              .filter(
                (item) =>
                  item.product &&
                  typeof item.product.name === "string" &&
                  typeof item.product.price === "number"
              )
              .map((item) => ({
                ...item,
                product: {
                  name: item.product!.name,
                  price: item.product!.price,
                },
              }))
          : [];
        dispatch(setCart(items));
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        dispatch(setCart([]));
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, token, dispatch]);

  const handleRemove = async (productId: string) => {
    if (!user || !token) return;

    try {
      await removeFromCart(user.id, productId, token); // Call backend API
      dispatch(removeFromCartState(productId)); // Update Redux state
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    }
  };

  const handleEmptyCart = async () => {
    if (!user || !token) return;

    const confirmed = window.confirm(
      "Are you sure you want to empty your cart?"
    );
    if (!confirmed) {
      toast.info("Cart clearing cancelled");
      return;
    }

    try {
      await emptyCartApi(user.id, token); // API call to backend
      dispatch(emptyCart()); // Clear Redux state
      toast.success("Cart has been emptied");
    } catch (err) {
      console.error("Failed to empty cart:", err);
      toast.error("Failed to empty the cart");
    }
  };

  const handleCheckout = async () => {
    if (!user || !token) {
      toast.error("You must be logged in to checkout.");
      return;
    }
    setCheckoutLoading(true);

    try {
      const { url } = await createCheckoutSession(user.id, token);
      window.location.href = url; // Redirect to Stripe checkout
      setCheckoutLoading(false);
    } catch (err) {
      setCheckoutLoading(false);
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout session.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      {loading ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1c1a32]">
          <ThreeCircles height="100" width="100" color="#e67e22" visible />
          <p className="mt-3 text-lg font-medium text-[#e67e22]">Loading...</p>
        </div>
      ) : (
        <div className="min-h-screen py-20 bg-[#0d0b1e] text-white font-sans">
          <header className="px-5 py-8 text-center">
            <h1 className="text-4xl font-bold">{user?.firstname}'s Cart</h1>
          </header>

          <section className="max-w-5xl mx-auto bg-[#1c1a32] p-6 sm:p-10 rounded-xl shadow-lg overflow-x-auto">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center">
                <p className="mb-8 text-xl text-gray-400">Your cart is empty</p>
                <button
                  className="bg-[#f39c12] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#e67e22] transition"
                  onClick={() => navigate("/product")}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <>
                <table className="min-w-[700px] w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#29274c] text-left">
                      <th className="p-3 border-b border-[#29274c]">Product</th>
                      <th className="p-3 border-b border-[#29274c]">Price</th>
                      <th className="p-3 border-b border-[#29274c]">
                        Quantity
                      </th>
                      <th className="p-3 border-b border-[#29274c]">
                        Subtotal
                      </th>
                      <th className="p-3 border-b border-[#29274c] text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.productId}
                        className="hover:bg-[#2b294f] transition"
                      >
                        <td className="p-3 border-b border-[#29274c]">
                          {item.product?.name || "Unnamed Product"}
                        </td>
                        <td className="p-3 border-b border-[#29274c]">
                          ${item.product?.price.toLocaleString()}
                        </td>
                        <td className="p-3 border-b border-[#29274c]">
                          {item.quantity}
                        </td>
                        <td className="p-3 border-b border-[#29274c]">
                          $
                          {(
                            (item.product?.price ?? 0) * item.quantity
                          ).toLocaleString()}
                        </td>
                        <td className="p-3 border-b border-[#29274c] text-center">
                          <button
                            onClick={() => handleRemove(item.productId)}
                            className="text-red-500 transition hover:text-red-600"
                            title="Remove item"
                          >
                            <MdDelete size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 text-xl text-right">
                  <strong>Total: ${total.toLocaleString()}</strong>
                </div>

                <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:justify-end">
                  <button
                    onClick={handleEmptyCart}
                    className="px-6 py-3 font-bold text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Empty Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg transition ${
                      checkoutLoading
                        ? "bg-[#c87f0a] cursor-not-allowed"
                        : "bg-[#f39c12] hover:bg-[#e67e22] text-black"
                    }`}
                  >
                    {checkoutLoading ? (
                      <>
                        <TailSpin height={20} width={20} color="#fff" />
                        Redirecting...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Cart;
