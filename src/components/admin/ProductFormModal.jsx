import React, { useState, useEffect } from 'react';
import { getCategories, createProduct, updateProduct } from '../../services/api';
import styles from '../../styles/UserFormModal.module.css'; // Reutilizaremos el estilo del modal de usuario

const ProductFormModal = ({ isOpen, onClose, onProductSaved, editingProduct }) => {
  const isEditMode = Boolean(editingProduct);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Carga las categorías cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await getCategories();
          setCategories(response.data);
        } catch (err) {
          setError('Failed to load categories.');
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  // Rellena el formulario si estamos en modo de edición
  useEffect(() => {
    if (isEditMode && editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || 0,
        category: editingProduct.category || '',
      });
      // Mostrar imagen existente si hay una
      setImagePreview(editingProduct.image || null);
      setImageFile(null);
    } else {
      setFormData({
        name: '', description: '', price: '', stock: 0, category: '',
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [isOpen, editingProduct, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Si hay una imagen, enviamos FormData; si no, enviamos JSON
      let dataToSend;

      if (imageFile) {
        // Crear FormData para enviar imagen
        dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('description', formData.description || '');
        dataToSend.append('price', formData.price);
        dataToSend.append('stock', formData.stock);
        dataToSend.append('category', formData.category);
        dataToSend.append('image', imageFile);
      } else {
        // Enviar solo JSON si no hay imagen nueva
        dataToSend = formData;
      }

      if (isEditMode) {
        await updateProduct(editingProduct.id, dataToSend);
      } else {
        if (!formData.category) {
          setError('Please select a category.');
          setIsLoading(false);
          return;
        }
        await createProduct(dataToSend);
      }
      onProductSaved(isEditMode);
    } catch (err) {
      setError('An error occurred. Please check the product data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Product Name</label>
            <input type="text" id="name" name="name" value={formData.name} required onChange={handleChange} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} rows="3" onChange={handleChange} className={styles.textarea}></textarea>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price" value={formData.price} required onChange={handleChange} step="0.01" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" value={formData.stock} required onChange={handleChange} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Select a category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '150px',
                    maxHeight: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                  }}
                />
                <p style={{ fontSize: '0.85rem', color: '#6c757d', marginTop: '5px' }}>
                  Image preview
                </p>
              </div>
            )}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;