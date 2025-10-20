import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories, addToCart } from '../services/api';
import ProductCard from '../components/shop/ProductCard';
import HeroSection from '../components/shop/HeroSection';
import CategoryBanner from '../components/shop/CategoryBanner';
import RecentlyViewed from '../components/shop/RecentlyViewed';
import { ProductSkeletonGrid } from '../components/shop/ProductSkeleton';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import styles from '../styles/ShopPage.module.css';
import { FaThLarge, FaList, FaFilter } from 'react-icons/fa';

const ShopPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const { showToast } = useToast();
  const { refreshCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategories();
  }, []);

  // Cargar productos con filtros
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Construir filtros para el backend
        const filters = {};
        
        if (selectedCategory !== 'all') {
          filters.category_slug = selectedCategory;
        }
        
        if (searchQuery.trim()) {
          filters.search = searchQuery.trim();
        }
        
        // Solo productos en stock
        filters.in_stock = 'true';
        
        // Ordenamiento
        if (sortBy === 'price-low') {
          filters.ordering = 'price';
        } else if (sortBy === 'price-high') {
          filters.ordering = '-price';
        } else if (sortBy === 'name') {
          filters.ordering = 'name';
        }
        
        const response = await getProducts(filters);
        setProducts(response.data);
      } catch (err) {
        showToast('No se pudieron cargar los productos. Por favor, intenta más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery, showToast]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      refreshCart(); // Update cart count in navbar
      showToast('¡Producto agregado al carrito!', 'success');
    } catch (err) {
      showToast('No se pudo agregar el producto al carrito.', 'error');
    }
  };

  const handleProductClick = (product) => {
    addToRecentlyViewed(product);
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.shopPage}>
      <HeroSection />

      {/* Category Context Banner - Estilo Nike */}
      {!loading && selectedCategory !== 'all' && (
        <CategoryBanner 
          category={selectedCategory}
          productCount={products.length}
        />
      )}

      {loading && <ProductSkeletonGrid count={6} />}

      {/* Filter and Sort Bar */}
      {!loading && (
      <div className={styles.filterBar} id="products">
        <div className={styles.filterLeft}>
          <FaFilter className={styles.filterIcon} />
          
          {/* Buscador */}
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Filtro de categoría */}
          <select
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Ordenamiento */}
          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Predeterminado</option>
            <option value="name">Nombre (A-Z)</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
          </select>
        </div>

        <div className={styles.filterRight}>
          <span className={styles.productCount}>
            {products.length} {products.length === 1 ? 'Producto' : 'Productos'}
          </span>
          <div className={styles.viewToggle}>
            <button
              className={viewMode === 'grid' ? styles.active : ''}
              onClick={() => setViewMode('grid')}
            >
              <FaThLarge />
            </button>
            <button
              className={viewMode === 'list' ? styles.active : ''}
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Product Grid */}
      {!loading && (
      <div className={viewMode === 'grid' ? styles.productGrid : styles.productList}>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
              viewMode={viewMode}
            />
          ))
        ) : (
          <div className={styles.noProducts}>
            <p>No se encontraron productos.</p>
          </div>
        )}
      </div>
      )}

      {/* Recently Viewed Products */}
      {!loading && <RecentlyViewed />}
    </div>
  );
};

export default ShopPage;