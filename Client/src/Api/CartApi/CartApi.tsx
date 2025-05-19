

import axios from 'axios';

const BASE_URL = "http://localhost:2343/api/"


export interface CartItem {
  productId: string;
  quantity: number;
  product?: {
    _id: string;
    name: string;
    price: number;
    productImage?: string;
  };
}

// Interface for cart response
export interface CartResponse {
  message: string;
  cart: CartItem[];
}


export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1,
  token : string
): Promise<CartResponse> => {
  try {
    
    const response = await axios.post(
      `${BASE_URL}/add`,
      {
        userId,
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (
  userId: string,
  productId: string,
    token: string
): Promise<CartResponse> => {
  try {
   
    
    const response = await axios.post(
      `${BASE_URL}/remove`,
      {
        userId,
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const emptyCart = async (userId: string , token : string): Promise<CartResponse> => {
  try {
    
    
    const response = await axios.post(
      `${BASE_URL}/empty`,
      {
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error emptying cart:', error);
    throw error;
  }
};


export const getUserCart = async (
  userId: string,
  token: string
): Promise<CartResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/cart/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};