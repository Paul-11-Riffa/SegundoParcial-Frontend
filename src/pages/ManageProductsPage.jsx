import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api';
import styles from '../styles/ManageUsersPage.module.css';
import { FaPlus } from 'react-icons/fa';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProductFormModal from '../components/admin/ProductFormModal';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para los modales
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setFormModalOpen(false);
    setShowDeleteModal(false);
  };

  const handleProductSaved = (isEdit) => {
    handleCloseModals();
    fetchProducts();
    setSuccessMessage(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(productToDelete.id);
      handleCloseModals();
      fetchProducts();
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Product Management</h1>
          <button className={styles.addButton} onClick={handleOpenAddModal}>
            <FaPlus /> Add Product
          </button>
        </header>

        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category_name}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{product.stock} units</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.editButton} onClick={() => handleOpenEditModal(product)}>Edit</button>
                      <button className={styles.deleteButton} onClick={() => handleOpenDeleteModal(product)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onProductSaved={handleProductSaved}
        editingProduct={editingProduct}
      />

      {showDeleteModal && (
        <ConfirmationModal
          title="Confirm Deletion"
          onConfirm={handleDelete}
          onCancel={handleCloseModals}
        >
          Are you sure you want to delete the product <strong>{productToDelete?.name}</strong>?
        </ConfirmationModal>
      )}
    </>
  );
};

export default ManageProductsPage;