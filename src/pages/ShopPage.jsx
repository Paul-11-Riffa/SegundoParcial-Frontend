import React, { useState, useEffect } from 'react';
import { getProducts, addToCart } from '../services/api';
import ProductCard from '../components/shop/ProductCard';
import HeroSection from '../components/shop/HeroSection';
import RecentlyViewed from '../components/shop/RecentlyViewed';
import { ProductSkeletonGrid } from '../components/shop/ProductSkeleton';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import styles from '../styles/ShopPage.module.css';
import { FaThLarge, FaList, FaFilter } from 'react-icons/fa';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const { showToast } = useToast();
  const { refreshCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        showToast('Could not load products. Please try again later.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category_name))];

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_name === selectedCategory);
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      refreshCart(); // Update cart count in navbar
      showToast('Product added to cart!', 'success');
    } catch (err) {
      showToast('Could not add product to cart.', 'error');
    }
  };

  const handleProductClick = (product) => {
    addToRecentlyViewed(product);
    // Future: navigate to product detail page
    // navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.shopPage}>
      <HeroSection />

      {loading && <ProductSkeletonGrid count={6} />}

      {/* Filter and Sort Bar */}
      {!loading && (
      <div className={styles.filterBar} id="products">
        <div className={styles.filterLeft}>
          <FaFilter className={styles.filterIcon} />
          <select
            className={styles.filterSelect}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className={styles.filterRight}>
          <span className={styles.productCount}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
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
            <p>No products found in this category.</p>
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