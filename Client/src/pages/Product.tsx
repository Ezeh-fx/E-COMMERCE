import { useState, useEffect } from "react";
import { GRID3 } from "../components/data/data";
import { ThreeCircles } from "react-loader-spinner";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    AOS.init({ duration: 1000, once: true }); // ✅ AOS scroll animation init
  }, []);

  const categories = ["All", ...new Set(GRID3.map((item) => item.category))];
  const filteredProducts =
    selectedCategory === "All"
      ? GRID3
      : GRID3.filter((item) => item.category === selectedCategory);

  return (
    <div className="w-full bg-[#0D0B1E] min-h-screen text-white">
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
        <div className="w-full px-4 py-10">
          {/* Filter Buttons */}
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

          {/* Product Grid */}
          <section className="flex flex-col items-center gap-[60px]">
            <div className="grid w-full grid-cols-4 gap-6 px-4 tablet:grid-cols-2 mobile:grid-cols-1">
              {filteredProducts.map((item, i) => (
                <div
                  key={i}
                  className="w-full bg-[#1c1a32] p-4 rounded-lg flex flex-col gap-3 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]"
                  data-aos="fade-up"
                >
                  {/* Product Image */}
                  <img
                    src={item.img}
                    alt={typeof item.title === "string" ? item.title : String(item.title)}
                    className="object-cover w-full h-auto rounded-md"
                  />

                  {/* Product Title */}
                  <p className="text-white text-[20px]">{item.title}</p>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <p className="text-white">{item.price}</p>
                    <Link to="/cart">
                      <button className="bg-[#E56623B2] text-white px-4 py-2 rounded-[10px] hover:bg-[#e67e22] transition-all">
                        Add to cart
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Product;
