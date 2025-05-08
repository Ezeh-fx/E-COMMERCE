import  { useState } from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: { id: number; name: string; category: string; price: number; stock: number }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    category: '', 
    price: '', 
    stock: '' 
  });

  const handleSubmit = () => {
    const productToAdd = {
      id: Date.now(), // Temporary ID
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock)
    };
    
    onAddProduct(productToAdd);
    setNewProduct({ name: '', category: '', price: '', stock: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">Product Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-700">Category</label>
            <select 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-gray-700">Stock</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;