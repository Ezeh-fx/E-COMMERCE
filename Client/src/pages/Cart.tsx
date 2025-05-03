import { ThreeCircles } from "react-loader-spinner";
import { useState, useEffect } from "react";

const Cart = () => {
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        setTimeout(() => setLoading(false), 2000);
      }, []);
  return (
    <div>
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
      ) :(
        <div className="h-auto py-20 bg-[#0d0b1e] text-white font-sans">
        {/* Header */}
        <header className="px-5 py-12 text-center">
          <h1 className="m-0 text-4xl">Your Cart</h1>
        </header>
  
        {/* Cart Section */}
        <section className="max-w-5xl mx-auto bg-[#1c1a32] p-8 rounded-xl shadow-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#29274c]">
                <th className="text-left p-3 border-b border-[#29274c]">Product</th>
                <th className="text-left p-3 border-b border-[#29274c]">Price</th>
                <th className="text-left p-3 border-b border-[#29274c]">Quantity</th>
                <th className="text-left p-3 border-b border-[#29274c]">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-[#29274c]">Heavy Duty Truck</td>
                <td className="p-3 border-b border-[#29274c]">$120,000</td>
                <td className="p-3 border-b border-[#29274c]">1</td>
                <td className="p-3 border-b border-[#29274c]">$120,000</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-[#29274c]">Logistics Van</td>
                <td className="p-3 border-b border-[#29274c]">$85,000</td>
                <td className="p-3 border-b border-[#29274c]">2</td>
                <td className="p-3 border-b border-[#29274c]">$170,000</td>
              </tr>
            </tbody>
          </table>
  
          <div className="mt-6 text-xl text-right">
            <strong>Total: $290,000</strong>
          </div>
  
          <a
            href="/order"
            className="block bg-[#f39c12] text-black font-bold text-center py-3 mt-5 rounded-lg w-52 ml-auto hover:bg-[#e67e22] transition"
          >
            Proceed to Checkout
          </a>
        </section>
      </div>
      )}
    </div>
  )
}

export default Cart
