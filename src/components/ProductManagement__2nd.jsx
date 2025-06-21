import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../stylesheets/ProductManagement__2nd.css';
import AdminLayout from './AdminLayout';

const ProductManagement__2nd = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetch(`https://shop-app-backend-gsx6.onrender.com/api/products/by-shopId/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(console.error);
  }, [id]);

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`https://shop-app-backend-gsx6.onrender.com/api/products/${productToDelete}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== productToDelete));
        closeDeleteModal();
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="products-container">
        <div className="products-header">
          <h2>Product Management</h2>
          <p>Manage shop's products</p>
        </div>
        
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found for this shop.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.productImage} 
                    alt={product.name} 
                    className="product-image" 
                  />
                </div>
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">₹{product.price}</div>
                </div>
                <button 
                  className="delete-button" 
                  onClick={() => openDeleteModal(product._id)}
                >
                  DELETE PRODUCT
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to permanently delete this product? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="btn btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn btn-confirm" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductManagement__2nd;