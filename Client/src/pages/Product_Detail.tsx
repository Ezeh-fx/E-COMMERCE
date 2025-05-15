import { useState, useEffect } from "react";
import { getOneProduct } from "../Api/ProductApi/ProductApi";

interface ProductSidebarProps {
  productId: string | null;
  onClose: () => void;
}

interface ProductDetail {
  _id: string;
  name: string;
  price: number;
  productImage: string;
  category: string;
  stock: number;
  dateCreated: string;
  numberOfReviews: number;
}

const ProductSidebar = ({ productId, onClose }: ProductSidebarProps) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getOneProduct(productId);
        if (response && response.data) {
          setProduct(response.data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Product fetch error:", err);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return (
    <>
      {/* Overlay */}
      {productId && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[40%] sm:w-1/2 bg-white z-40 transform transition-transform duration-300 ease-in-out shadow-lg ${
          productId ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full animate-spin border-r-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">
              {error}
            </div>
          ) : product ? (
            <div className="flex flex-col h-full">
              {/* Product image */}
              <div className="relative bg-gray-100 h-1/2">
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
                <button
                  onClick={onClose}
                  className="absolute p-2 bg-white rounded-full shadow top-4 right-4 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Product details */}
              <div className="flex-1 p-6 bg-white">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {product.name}
                  </h2>
                  <span className="inline-block px-3 py-1 mt-2 text-sm text-blue-800 bg-blue-100 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 mr-1 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    In Stock: {product.stock}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button className="flex-1 px-6 py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                      Add to Cart
                    </button>
                    <button className="flex-1 px-6 py-3 font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100">
                      Buy Now
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Product Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* <Detail label="Product ID" value={product._id} /> */}
                      <Detail label="Category" value={product.category} />
                      <Detail
                        label="Available Stock"
                        value={`${product.stock} units`}
                      />
                      <Detail
                        label="Reviews"
                        value={`${product.numberOfReviews} reviews`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No product found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Helper for clean layout
const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default ProductSidebar;
