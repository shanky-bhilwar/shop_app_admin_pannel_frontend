import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../stylesheets/ProductManagement__2nd.css';
import AdminLayout from './AdminLayout';
import { Search } from 'lucide-react';

const ProductManagement__2nd = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/get-product-by-shopId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
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
      const token = localStorage.getItem('adminToken');

      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/adminDashboard/delete-product/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="products-container">
        <div className="products-header">
          <h2 style={{ color: "white" }}>Product Management</h2>
          <p style={{ color: "whitesmoke" }}>Manage shop's products</p>
          <Link to="/admin/products" className="back-button" style={{ marginTop: '40px' }}>
            ← Back
          </Link>
        </div>

        {/* Search Bar */}
        <div className="usd-search-container" style={{ marginTop: '20px', marginBottom: '24px' }}>
          <div className="usd-search-bar">
            <div className="usd-search-input-container">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="usd-search-input"
              />
              <Search className="usd-search-icon" size={20} />
            </div>
            <button onClick={handleSearch} className="btn btn-confirm">
              Search
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <p>No matching products found.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
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
