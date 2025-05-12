"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import AddProductModal from "./AddProductModal"
import EditProductModal from "./EditProductModal"
import { getAllProducts, deleteProduct, findProductBySearch } from "../../Api/ProductApi/ProductApi"

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
}

interface ProductPayload {
  name: string
  category: string
  price: number
  stock: number
}

interface ApiResponse {
  length: number
  message: string
  data: Product[] | null
}

const categoryOptions = ["All", "Electronics", "Men's Wear", "Books", "Mobile Phones", "Women's Wear"]

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeleteProduct = async (id: string) => {
    if (!id) return
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        setProducts(prev => prev.filter(p => p._id !== id))
      } catch (err) {
        console.error("Error deleting product:", err)
      }
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }



  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = (await getAllProducts()) as ApiResponse
      if (response && typeof response === "object" && "data" in response) {
        if (Array.isArray(response.data)) {
          setProducts(response.data)
        } else {
          setProducts([])
        }
      } else {
        console.error("Unexpected API response format:", response)
        setError("Received invalid data format from server")
        setProducts([])
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again later.")
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }



  const handleAddProduct = async (newProduct: ProductPayload) => {
    setIsSubmitting(true)
    try {
      const productWithId: Product = {
        ...newProduct,
        _id: Date.now().toString(),
      }
      setProducts((prev) => [...prev, productWithId])
      setIsAddModalOpen(false)
      fetchProducts()
    } catch (err) {
      console.error("Error adding product:", err)
      alert("Failed to add product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (searchQuery.trim() === "") {
          const response = (await getAllProducts()) as ApiResponse
          if (Array.isArray(response.data)) {
            setProducts(response.data)
          } else {
            setProducts([])
          }
        } else {
          const response = await findProductBySearch(searchQuery)
          if (Array.isArray(response.data)) {
            setProducts(response.data)
          } else {
            setProducts([])
          }
        }
      } catch (err) {
        console.error("Error searching products:", err)
        setError("Search failed. Please try again.")
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetch()
  }, [searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory
    return matchesCategory
  })

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex flex-wrap items-center gap-3 mobile:flex-col mobile:items-stretch">
        <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                  activeCategory === cat
                    ? "bg-blue-500 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            <Plus size={18} className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={fetchProducts}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Products
            </>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 mt-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <p className="mb-4 text-gray-500">No products available</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <>
          {/* Desktop view */}
          <div className="overflow-hidden bg-white rounded-lg shadow tablet:hidden">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Stock</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.stock > 50
                              ? "bg-green-100 text-green-800"
                              : product.stock > 20
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 text-blue-500 hover:text-blue-700"
                            onClick={() => openEditModal(product)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-1 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No products match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet and Mobile views omitted for brevity — same pattern */}
        </>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
        isSubmitting={isSubmitting}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </div>
  )
}

export default Products
