import React, { useState, useEffect } from 'react';
import { getCategories, createProduct, updateProduct, getProductDetail } from '../../services/api';
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
          const categoriesData = response.data.results || response.data;
          setCategories(categoriesData);
        } catch (err) {
          console.error('Error al cargar categorías:', err);
          setError('Error al cargar las categorías.');
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  // Rellena el formulario si estamos en modo de edición
  useEffect(() => {
    const loadProductData = async () => {
      if (isEditMode && editingProduct && editingProduct.id) {
        try {
          // Cargar el producto completo desde el backend para asegurar que tenemos el campo 'category' (ID)
          const response = await getProductDetail(editingProduct.id);
          const productData = response.data;
          
          setFormData({
            name: productData.name || '',
            description: productData.description || '',
            price: productData.price || '',
            stock: productData.stock || 0,
            category: productData.category || '', // ✅ Ahora obtenemos el ID de la categoría del backend
          });
          // ✅ Usar image_url del backend (URL completa y validada)
          setImagePreview(productData.image_url || productData.image || null);
          setImageFile(null);
        } catch (err) {
          console.error('Error al cargar producto:', err);
          // Fallback: usar datos del producto pasado (puede no tener category ID)
          setFormData({
            name: editingProduct.name || '',
            description: editingProduct.description || '',
            price: editingProduct.price || '',
            stock: editingProduct.stock || 0,
            category: editingProduct.category || '',
          });
          // ✅ Usar image_url del backend como fallback
          setImagePreview(editingProduct.image_url || editingProduct.image || null);
          setImageFile(null);
        }
      } else {
        // Modo creación: resetear formulario
        setFormData({
          name: '', description: '', price: '', stock: 0, category: '',
        });
        setImagePreview(null);
        setImageFile(null);
      }
    };

    if (isOpen) {
      loadProductData();
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
          setError('Por favor selecciona una categoría.');
          setIsLoading(false);
          return;
        }
        await createProduct(dataToSend);
      }
      onProductSaved(isEditMode);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError('Ocurrió un error. Por favor verifica los datos del producto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nombre del Producto *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              required 
              onChange={handleChange}
              placeholder="Ej: Laptop HP Pavilion"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="description">Descripción</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              rows="3" 
              onChange={handleChange} 
              className={styles.textarea}
              placeholder="Descripción detallada del producto..."
            ></textarea>
          </div>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="price">Precio ($) *</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                value={formData.price} 
                required 
                onChange={handleChange} 
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="stock">Stock *</label>
              <input 
                type="number" 
                id="stock" 
                name="stock" 
                value={formData.stock} 
                required 
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="category">Categoría *</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="" disabled>Selecciona una categoría...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="image">Imagen del Producto</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img
                  src={imagePreview}
                  alt="Vista previa"
                />
                <p>Vista previa de la imagen</p>
              </div>
            )}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;