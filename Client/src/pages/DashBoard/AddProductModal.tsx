"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createProduct } from "../../Api/ProductApi/ProductApi"
import { addProduct } from "../../global/productReducer"
import { RootState } from "../../global/store"
import { category } from "../../components/data/data"

export interface ProductPayload {
  name: string
  category: string
  price: number
  stock: number
  productImage: string
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (newProduct: ProductPayload) => Promise<void>
  isSubmitting: boolean
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const token = useSelector((state: RootState) => state.user.user?.token)

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.stock ||
      !productImage
    ) {
      alert("Please fill in all fields and select an image")
      return
    }

    const formData = new FormData()
    formData.append("name", newProduct.name)
    formData.append("category", newProduct.category)
    formData.append("price", String(Number(newProduct.price)))
    formData.append("stock", String(Number(newProduct.stock)))
    formData.append("productImage", productImage)

    setIsSubmitting(true)
    try {
      const response = await createProduct(formData, token as string)
      const created = { ...response.data, id: response.data._id }

      dispatch(addProduct(created))

      setNewProduct({ name: "", category: "", price: "", stock: "" })
      setProductImage(null)
      onClose()
    } catch (error) {
      alert("Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg max-h-[90vh] overflow-y-auto tablet:max-w-sm mobile:p-4 mobile:max-w-full">
        <h2 className="mb-4 text-xl font-semibold tablet:text-lg">Add New Product</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700 mobile:text-sm">Product Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mobile:py-1.5"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 mobile:text-sm">Category</label>
            <select
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mobile:py-1.5"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              <option value="">Select category</option>
              {Object.entries(category).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 mobile:text-sm">Price ($)</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mobile:py-1.5"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 mobile:text-sm">Stock</label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mobile:py-1.5"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 mobile:text-sm">Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mobile:file:py-1"
              onChange={(e) => setProductImage(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3 tablet:flex-wrap tablet:space-y-2 mobile:flex-col mobile:space-x-0 mobile:space-y-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 tablet:order-2 mobile:order-2 mobile:w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 tablet:order-1 tablet:w-full mobile:order-1 mobile:w-full"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddProductModal