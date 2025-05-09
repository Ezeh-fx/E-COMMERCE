"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveProduct: (product: Product) => void
  product: Product
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, onSaveProduct, product }) => {
  const [editedProduct, setEditedProduct] = useState({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price.toString(),
    stock: product.stock.toString(),
  })

  // Update form when product changes
  useEffect(() => {
    setEditedProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    })
  }, [product])

  const handleSubmit = () => {
    // Basic validation
    if (!editedProduct.name || !editedProduct.category || !editedProduct.price || !editedProduct.stock) {
      alert("Please fill in all fields")
      return
    }

    const updatedProduct = {
      id: editedProduct.id,
      name: editedProduct.name,
      category: editedProduct.category,
      price: Number.parseFloat(editedProduct.price),
      stock: Number.parseInt(editedProduct.stock),
    }

    onSaveProduct(updatedProduct)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mobile:p-4 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold">Edit Product</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">Product Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedProduct.name}
              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Category</label>
            <select
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedProduct.category}
              onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Apparel">Apparel</option>
              <option value="Home">Home</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Price ($)</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Stock</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editedProduct.stock}
              onChange={(e) => setEditedProduct({ ...editedProduct, stock: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end mt-6 space-x-3 mobile:space-x-0 mobile:space-y-2 mobile:w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 mobile:w-full mobile:order-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 mobile:w-full mobile:order-1 mobile:mb-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProductModal
