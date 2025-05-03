import { useState, useEffect } from "react";
import { GRID3 } from "../components/static/data";
import { ThreeCircles } from "react-loader-spinner";
import { Link } from "react-router-dom";  

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const categories = ["All", ...new Set(GRID3.map((item) => item.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? GRID3
      : GRID3.filter((item) => item.category === selectedCategory);

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
      ) : (
        <div className="w-full bg-[#0D0B1E] py-10 min-h-screen text-white px-4">
          {/* ✅ Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mx-auto mb-10 max-w-7xl">
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full border-2 text-sm font-semibold transition-all
                ${
                  selectedCategory === category
                    ? "bg-[#e67e22] border-[#e67e22] text-black"
                    : "border-white hover:bg-white hover:text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ✅ Product Grid (your original layout) */}
          <div className="grid w-full h-auto lg:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-cols-4 place-items-center bg-[#0D0B1E] py-5 gap-y-10">
            {filteredProducts.map((items, i) => (
              <div
                key={i}
                className="w-[90%] h-[90%] shadow-[rgba(0,0,0,0.24)_0px_3px_8px] gap-5 flex flex-col mb-10 mt-5"
              >
                {/* Product Image */}
                <div>
                  <img
                    src={items.img}
                    alt={
                      typeof items.title === "string"
                        ? items.title
                        : String(items.title)
                    }
                    className="w-full h-auto"
                  />
                </div>

                {/* Product Description */}
                <div>
                  <p className="font-normal text-[24px] text-[#FFFFFF] leading-[100%]">
                    {items.title}
                  </p>
                </div>

                <div className="flex items-center justify-between py-2">
                  {/* Product Price */}
                  <p className="text-[#FFFFFF]">{items.price}</p>

                  {/* Purchase Button */}
             <Link to={"/cart"}>
             <button
                    className="bg-[#E56623B2] text-white font-bold py-3 px-6 hover:bg-[#e67e22] transition rounded-[15px] 
                  drop-shadow-[0_4px_6px_rgba(255,255,255,0.3)] h-[50px] text-[24px] leading-[100%] w-auto"
                  >
                    Add to cart
                  </button>
             </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}  
    </div>
  );
};

export default Product;
