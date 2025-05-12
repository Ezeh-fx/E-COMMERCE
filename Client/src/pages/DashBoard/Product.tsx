"use client"

import { useState } from "react"
import { Edit, Trash2, Plus } from "lucide-react"
import AddProductModal from "./AddProductModal"
import EditProductModal from "./EditProductModal"

const categoryOptions = ["All", "Electronics", "Accessories", "Apparel", "Home"]

const Products = () => {
  const initialProducts = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 45 },
    { id: 2, name: "Smartphone Case", category: "Accessories", price: 19.99, stock: 120 },
    { id: 3, name: "Cotton T-Shirt", category: "Apparel", price: 24.99, stock: 78 },
    { id: 4, name: "Smart Speaker", category: "Electronics", price: 129.99, stock: 32 },
    { id: 5, name: "Desk Lamp", category: "Home", price: 39.99, stock: 54 },
  ]

  const [products, setProducts] = useState(initialProducts)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  interface Product {
    id: number
    name: string
    category: string
    price: number
    stock: number
  }

  const handleAddProduct = (product: Product): void => {
    setProducts([...products, product])
  }

  const handleEditProduct = (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)))
    setIsEditModalOpen(false)
  }

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex flex-wrap items-center gap-3 mobile:flex-col mobile:items-stretch">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
          >
            <Plus size={18} className="mr-2" /> Add Product
          </button>
        </div>
      </div>

      {/* Desktop view - full table */}
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
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
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
                    <button className="p-1 text-blue-500 hover:text-blue-700" onClick={() => openEditModal(product)}>
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet view - simplified table */}
      <div className="hidden overflow-x-auto bg-white rounded-lg shadow tablet:block mobile:hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 bg-gray-50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </td>
                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 50
                        ? "bg-green-100 text-green-800"
                        : product.stock > 20
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700" onClick={() => openEditModal(product)}>
                      <Edit size={18} />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - card layout */}
      <div className="hidden space-y-4 mobile:block">
        {products.map((product) => (
          <div key={product.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 text-blue-500 hover:text-blue-700" onClick={() => openEditModal(product)}>
                  <Edit size={18} />
                </button>
                <button className="p-1 text-red-500 hover:text-red-700" onClick={() => handleDeleteProduct(product.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-medium">${product.price.toFixed(2)}</div>
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
            </div>
          </div>
        ))}
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaveProduct={handleEditProduct}
          product={selectedProduct}
        />
      )}
    </div>
  )
}

export default Products
