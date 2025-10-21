import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, getCategories } from '../services/api';
import styles from '../styles/ManageProductsPage.module.css';
import { FaPlus, FaSearch, FaFilter, FaTimes, FaBox, FaDollarSign, FaExclamationTriangle, FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProductFormModal from '../components/admin/ProductFormModal';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Estados para los modales
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '', // 'low', 'out', 'available'
    priceMin: '',
    priceMax: ''
  });

  // Estadísticas
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const productsData = response.data.results || response.data;
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      calculateStatistics(productsData);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      const categoriesData = response.data.results || response.data;
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  // Calcular estadísticas
  const calculateStatistics = (productsData) => {
    const totalProducts = productsData.length;
    const totalValue = productsData.reduce((sum, p) => sum + (parseFloat(p.price) * p.stock), 0);
    const lowStockCount = productsData.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStockCount = productsData.filter(p => p.stock === 0).length;

    setStatistics({
      totalProducts,
      totalValue,
      lowStockCount,
      outOfStockCount
    });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products];

    // Filtro de búsqueda
    if (filters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Filtro de categoría
    if (filters.category) {
      // Buscar el nombre de la categoría seleccionada por su ID
      const selectedCategory = categories.find(cat => cat.id === parseInt(filters.category));
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category_name === selectedCategory.name);
      }
    }

    // Filtro de stock
    if (filters.stockStatus === 'low') {
      filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
    } else if (filters.stockStatus === 'out') {
      filtered = filtered.filter(p => p.stock === 0);
    } else if (filters.stockStatus === 'available') {
      filtered = filtered.filter(p => p.stock > 10);
    }

    // Filtro de precio
    if (filters.priceMin) {
      filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.priceMax));
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      stockStatus: '',
      priceMin: '',
      priceMax: ''
    });
  };

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
    setSuccessMessage(`¡Producto ${isEdit ? 'actualizado' : 'creado'} exitosamente!`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(productToDelete.id);
      handleCloseModals();
      fetchProducts();
      setSuccessMessage('¡Producto eliminado exitosamente!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError('Error al eliminar producto.');
      setTimeout(() => setError(''), 4000);
    }
  };

  // Función para obtener badge de stock
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className={`${styles.stockBadge} ${styles.stockOut}`}>Agotado</span>;
    } else if (stock <= 10) {
      return <span className={`${styles.stockBadge} ${styles.stockLow}`}>Stock Bajo</span>;
    } else {
      return <span className={`${styles.stockBadge} ${styles.stockOk}`}>Disponible</span>;
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <header className={styles.header}>
          <h1>Gestión de Inventario</h1>
          <button className={styles.addButton} onClick={handleOpenAddModal}>
            <FaPlus /> Agregar Producto
          </button>
        </header>

        {/* --- TARJETAS DE ESTADÍSTICAS --- */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#e7f3ff' }}>
              <FaBox style={{ color: '#007bff' }} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Total Productos</span>
              <span className={styles.statValue}>{statistics.totalProducts}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#e8f5e9' }}>
              <FaDollarSign style={{ color: '#28a745' }} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Valor Inventario</span>
              <span className={styles.statValue}>${statistics.totalValue.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#fff3e0' }}>
              <FaExclamationTriangle style={{ color: '#ff9800' }} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Stock Bajo</span>
              <span className={styles.statValue}>{statistics.lowStockCount}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: '#ffebee' }}>
              <FaExclamationTriangle style={{ color: '#dc3545' }} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Agotados</span>
              <span className={styles.statValue}>{statistics.outOfStockCount}</span>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {/* --- BARRA DE BÚSQUEDA Y FILTROS --- */}
        <div className={styles.searchAndFilters}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              name="search"
              placeholder="Buscar productos por nombre o descripción..."
              value={filters.search}
              onChange={handleFilterChange}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filtersRow}>
            <div className={styles.filterGroup}>
              <label>Categoría:</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className={styles.selectInput}
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Estado de Stock:</label>
              <select
                name="stockStatus"
                value={filters.stockStatus}
                onChange={handleFilterChange}
                className={styles.selectInput}
              >
                <option value="">Todos</option>
                <option value="available">Disponible (&gt;10)</option>
                <option value="low">Stock Bajo (1-10)</option>
                <option value="out">Agotado (0)</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Precio Mín:</label>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                className={styles.priceInput}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Precio Máx:</label>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
                className={styles.priceInput}
                placeholder="9999.99"
                step="0.01"
              />
            </div>

            <button className={styles.clearButton} onClick={handleClearFilters}>
              <FaTimes /> Limpiar
            </button>
          </div>
        </div>

        {/* --- TABLA DE PRODUCTOS --- */}
        <div className={styles.tableContainer}>
          {filteredProducts.length === 0 ? (
            <p className={styles.noResults}>
              No se encontraron productos que coincidan con los filtros.
            </p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productImage}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <div className={styles.noImage}>
                            <FaBox />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.productName}>
                        {product.name}
                        {product.description && (
                          <span className={styles.productDesc}>
                            {product.description.substring(0, 50)}
                            {product.description.length > 50 ? '...' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {product.category_name || product.category?.name || 'Sin categoría'}
                    </td>
                    <td className={styles.price}>
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className={styles.centered}>
                      <span className={styles.stockNumber}>{product.stock}</span>
                    </td>
                    <td>
                      {getStockBadge(product.stock)}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleOpenEditModal(product)}
                          title="Editar producto"
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleOpenDeleteModal(product)}
                          title="Eliminar producto"
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
          title="Confirmar Eliminación"
          onConfirm={handleDelete}
          onCancel={handleCloseModals}
        >
          ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete?.name}</strong>?
          Esta acción no se puede deshacer.
        </ConfirmationModal>
      )}
    </>
  );
};

export default ManageProductsPage;