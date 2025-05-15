import axios, { AxiosError } from "axios"

const BASE_URL = "http://localhost:2343/api/product"

export interface ProductPayload {
  name: string
  category: string
  price: number
  stock: number
  productImage: string
  _id: string
   createdAt: string;
}

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get`)
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    console.error("Fetch Products Error:", axiosError.response?.data || axiosError.message)
    return axiosError.response?.data || { message: "An error occurred" }
  }
}

export const createProduct = async (formData: FormData, token: string) => {
 try {
  console.log("Token being sent:", token)
  const response = await axios.post("http://localhost:2343/api/product/product", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
 }
  catch (error: unknown) {
    const axiosError = error as AxiosError
    console.error("Fetch Products Error:", axiosError.response?.data || axiosError.message)
    return axiosError.response?.data || { message: "An error occurred" }
  }
}

export const updateProduct = async (productId: string, updatedData: Partial<ProductPayload>) => {
  try {
    const response = await axios.patch(`${BASE_URL}/update_product/${productId}`, updatedData)
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    console.error("Update Product Error:", axiosError.response?.data || axiosError.message)
    return axiosError.response?.data || { message: "An error occurred" }
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete_product/${productId}`)
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    console.error("Delete Product Error:", axiosError.response?.data || axiosError.message)
    return axiosError.response?.data || { message: "An error occurred" }
  }
}

export const getOneProduct = async (productId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/getone/${productId}`)
    return response.data
  } catch (error: unknown) {
    const axiosError = error as AxiosError
    console.error("Delete Product Error:", axiosError.response?.data || axiosError.message)
    return axiosError.response?.data || { message: "An error occurred" }
  }
}


// GET products by category
export const getProductsByCategory = async (category: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${category}`)
      return response.data
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      console.error("Category Fetch Error:", axiosError.response?.data || axiosError.message)
      return axiosError.response?.data || { message: "An error occurred" }
    }
  }
  
  // GET search products by name
  export const findProductBySearch = async (query: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/`, {
        params: { query },
      })
      return response.data
    } catch (error: unknown) {
      const axiosError = error as AxiosError
      console.error("Search Error:", axiosError.response?.data || axiosError.message)
      return axiosError.response?.data || { message: "An error occurred" }
    }
  }
