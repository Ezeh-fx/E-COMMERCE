import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../global/store";
import { emptyCart as emptyCartState } from "../../global/cartReducer";
import { emptyCart as emptyCartApi } from "../../Api/CartApi/CartApi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Success = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.user?.token);
  const user = useSelector((state: RootState) => state.user.user);
  console.log("User:", user);
  console.log("Token:", token);
  useEffect(() => {
    const clearCart = async () => {
      try {
        try {
          if (!user || !token) return;
          await emptyCartApi(user.id, token); // Call API to empty cart
          dispatch(emptyCartState()); // Clear Redux state
          toast.success("Cart has been emptied");
        } catch (err) {
          console.error("Failed to empty cart:", err);
          toast.error("Failed to empty the cart");
        }
        toast.success("Payment successful and cart has been emptied!");
      } catch (error) {
        console.error("Failed to clear cart after checkout:", error);
        toast.error("Something went wrong while clearing the cart.");
      }
    };

    if (sessionId) {
      clearCart();
      console.log("Session ID:", sessionId);
    }
  }, [dispatch, sessionId, user, token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0b1e] text-white">
      <h1 className="text-4xl font-bold mb-4 text-[#e67e22]">
        Payment Successful
      </h1>
      <p className="mb-6 text-lg">Thank you for your purchase!</p>
      <Link
        to={"/"}
        className="bg-[#f39c12] text-black px-6 py-3 rounded-lg hover:bg-[#e67e22] transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Success;
