import { useState, useEffect, useCallback } from "react";
import { createReview, getOneProduct } from "../Api/ProductApi/ProductApi";
import { useSelector } from "react-redux";
import { RootState } from "../global/store";

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
  reviews?: Array<{
    user: string;
    name: string;
    rating: number;
    comment: string;
  }>;
}

interface ReviewFormData {
  rating: number;
  comment: string;
  name: string;
}

const ProductSidebar = ({ productId, onClose }: ProductSidebarProps) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
     const userData = useSelector((state: RootState) => state.user.user);
  const userName = userData?.firstname || userData?.lastname || "Anonymous User";
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    rating: 5,
    comment: "",
    name: userName,
  });
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0); // Added to trigger refreshes

  const token = useSelector((state: RootState) => state.user.user?.token);
  // console.log(token);

  const fetchProductDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOneProduct(id);
      console.log(id)
      if (response && response.data) {
        setProduct(response.data);
      } else {
        setError("Product not found");
      }
    } catch (err: any) {
      console.error("Product fetch error:", err);
      // Handle potential error formats
      const errorMessage = 
        err?.response?.data?.err || 
        err?.response?.data?.message || 
        err?.message ||
        "Failed to fetch product details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Reset states when productId changes
    if (!productId) {
      setProduct(null);
      setShowReviewForm(false);
      setReviewError(null);
      setReviewSuccess(false);
      return;
    }

    fetchProductDetails(productId);
  }, [productId, fetchProductDetails, refreshKey]);

  useEffect(() => {
    if (productId) {
      document.querySelector(".product-sidebar-scroll")?.scrollTo(0, 0);
    }
  }, [productId]);

  const handleReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReviewFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !token) {
      setReviewError("You must be logged in to submit a review");
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);

    try {
       await createReview(
        productId, 
        reviewFormData, 
        token, 
      );
      setReviewSuccess(true);
      setReviewFormData({ rating: 5, comment: ""  , name: "" });

      // Refresh product details to update review count
      setRefreshKey(prev => prev + 1); // Trigger a refresh via the key change

      // Auto-hide the form after successful submission
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Review submission error:", err);
      
      // Handle nested error data from server
      const errorMessage = 
        err?.response?.data?.err || // Handle direct error message from server
        err?.response?.data?.error?.message || // Handle nested error objects
        err?.response?.data?.message || 
        err?.message || 
        "Failed to submit review";
      
      // Special handling for 404 errors that may be wrapped in a 500 response
      if (err?.response?.data?.error?.httpCode === 404 || err?.response?.status === 404) {
        setReviewError("Product not found or no longer available. Please refresh the page.");
      } else {
        setReviewError(errorMessage);
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
    if (showReviewForm) {
      // Reset form when closing
      setReviewFormData({ rating: 5, comment: ""  , name: "" });
      setReviewError(null);
      setReviewSuccess(false);
    }
  };

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
        <div className="h-full overflow-y-auto product-sidebar-scroll">
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
                  className="absolute p-2 text-white bg-black rounded-full shadow top-4 right-4 hover:bg-gray-800"
                  aria-label="Close sidebar"
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
              <div className="flex-1 p-6 overflow-y-auto bg-white">
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
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-5 h-5 mr-1 ${
                        product.stock > 0 ? "text-green-500" : "text-red-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {product.stock > 0 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      )}
                    </svg>
                    {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button 
                      className={`flex-1 px-6 py-3 font-medium text-white rounded-lg ${
                        product.stock > 0 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className={`flex-1 px-6 py-3 font-medium rounded-lg ${
                        product.stock > 0
                          ? "text-blue-600 border border-blue-600 hover:bg-blue-50"
                          : "text-gray-400 border border-gray-400 cursor-not-allowed"
                      }`}
                      disabled={product.stock <= 0}
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      Product Details
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Detail label="Category" value={product.category} />
                      <Detail
                        label="Available Stock"
                        value={`${product.stock} units`}
                      />
                      <Detail 
                        label="Date Added" 
                        value={new Date(product.dateCreated).toLocaleDateString()} 
                      />
                      <Detail 
                        label="Reviews" 
                        value={product.numberOfReviews.toString()} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Customer Reviews ({product.numberOfReviews})
                    </h3>
                    <button
                      onClick={toggleReviewForm}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {showReviewForm ? "Cancel" : "Write a Review"}
                    </button>
                  </div>

                  {/* Review Form */}
                  {showReviewForm && (
                    <div className="p-4 mb-6 border border-gray-200 rounded-lg">
                      {reviewSuccess ? (
                        <div className="p-3 text-sm text-green-800 bg-green-100 rounded">
                          Review submitted successfully!
                        </div>
                      ) : (
                        <form onSubmit={handleReviewSubmit}>
                          <h4 className="mb-3 text-lg font-medium">
                            Share your experience
                          </h4>

                          {reviewError && (
                            <div className="p-3 mb-3 text-sm text-red-800 bg-red-100 rounded">
                              {reviewError}
                              {reviewError.includes("Product not found") && (
                                <button 
                                  onClick={() => setRefreshKey(prev => prev + 1)} 
                                  className="block w-full mt-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md py-1.5 hover:bg-blue-700"
                                >
                                  Refresh Product Data
                                </button>
                              )}
                            </div>
                          )}

                          <div className="mb-4">
                            <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-700">
                              Rating
                            </label>
                            <select
                              id="rating"
                              name="rating"
                              value={reviewFormData.rating}
                              onChange={handleReviewChange}
                              className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value={5}>5 - Excellent</option>
                              <option value={4}>4 - Very Good</option>
                              <option value={3}>3 - Good</option>
                              <option value={2}>2 - Fair</option>
                              <option value={1}>1 - Poor</option>
                            </select>
                          </div>

                          <div className="mb-4">
                            <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-700">
                              Comment
                            </label>
                            <textarea
                              id="comment"
                              name="comment"
                              value={reviewFormData.comment}
                              onChange={handleReviewChange}
                              className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              rows={4}
                              required
                              placeholder="Share your experience with this product..."
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            disabled={reviewSubmitting}
                            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                          >
                            {reviewSubmitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  ></path>
                                </svg>
                                Submitting...
                              </span>
                            ) : (
                              "Submit Review"
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Display reviews if available */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-black">{review.name}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    product.numberOfReviews === 0 && (
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a product to view details.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Helper component
const Detail = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default ProductSidebar;