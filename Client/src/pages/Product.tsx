import { useState, useEffect } from "react";
// import { GRID3 } from "../components/data/data";
import { ThreeCircles } from "react-loader-spinner";
// import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  getAllProducts,
  ProductPayload,
  findProductBySearch,
} from "../Api/ProductApi/ProductApi";
import ProductSidebar from "./Product_Detail";

const categoryOptions = [
  "All",
  "Electronics",
  "Men's Wear",
  "Accessories",
  "Mobile Phones",
  "Women's Wear",
];
const Product = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductPayload[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    AOS.init({ duration: 1000, once: true }); // ✅ AOS scroll animation init
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllProducts();
      if (response && typeof response === "object" && "data" in response) {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } else {
        console.error("Unexpected API response format:", response);
        setError("Received invalid data format from server");
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setError(null);
      setIsLoading(true);
      try {
        if (searchQuery.trim() === "") {
          const response = await getAllProducts();
          if (Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            setProducts([]);
          }
        } else {
          const response = await findProductBySearch(searchQuery);
          if (Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Error searching products:", err);
        setError("Search failed. Please try again.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    // Add a class to the body to prevent scrolling when sidebar is open
    document.body.style.overflow = "hidden";
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSelectedProductId(null);
    // Restore scrolling when sidebar is closed
    document.body.style.overflow = "auto";
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesCategory;
  });

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
          {/* Product Sidebar */}
          <ProductSidebar
            productId={selectedProductId}
            onClose={closeSidebar}
          />
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full max-w-md px-4 py-2 rounded-md border border-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-[#e67e22] bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

         
          {error && (
            <div className="flex items-center justify-center mb-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mx-auto mb-10 max-w-7xl">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                  selectedCategory === cat
                    ? "bg-blue-500 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

            {!isLoading && !error && products.length === 0 && (
        <div className="p-8 text-center rounded-lg shadow">
          <p className="mb-4 text-gray-500">No products available</p>
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Your First Product
          </button>
        </div>
      )}

          {/* Product Grid */}
          <div className="grid w-full grid-cols-4 gap-6 tablet:grid-cols-2 tablet:gap-4 mobile:grid-cols-1 mobile:gap-6  mobile:w-[90%] tablet:w-[90%]">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                data-aos="fade-up" // ✅ Animation added here
                className="w-full bg-[#1c1a32] rounded-lg flex flex-col gap-3 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#2a2845] cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                {/* Image container with fixed aspect ratio */}
                <div className="w-full pt-[75%] relative">
                  <img
                    src={product.productImage}
                    alt={typeof product.name === "string" ? product.name : ""}
                    className="absolute top-0 left-0 object-cover w-full h-full"
                  />
                </div>

                {/* Content container with consistent padding */}
                <div className="flex flex-col flex-grow gap-3 p-4">
                  <p className="text-white text-[20px] tablet:text-[18px] mobile:text-[18px] font-medium line-clamp-2 min-h-[56px] mobile:min-h-[50px]">
                    {product.name}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-white text-[18px] tablet:text-[16px] mobile:text-[16px] font-bold">
                      {product.price}$
                    </p>
                    <button className="bg-[#E56623B2] text-white px-4 py-2 mobile:px-3 mobile:py-1.5 rounded-[10px] hover:bg-[#e67e22] transition-colors duration-300 text-sm mobile:text-sm whitespace-nowrap">
                      Add to cart
                    </button>
                  </div>
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
