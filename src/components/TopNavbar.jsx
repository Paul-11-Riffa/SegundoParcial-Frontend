import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/TopNavbar.module.css';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';

const TopNavbar = () => {
  const { user, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [cartBounce, setCartBounce] = useState(false);
  const navigate = useNavigate();

  // Cargar productos al montar
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setAllProducts(response.data);
      } catch (err) {
        console.error('Error loading products for search');
      }
    };
    fetchProducts();
  }, []);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Mostrar máximo 5 resultados
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, allProducts]);

  // Animate cart badge when count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleProductClick = (productId) => {
    clearSearch();
    navigate(`/product/${productId}`);
  };

  return (
    <nav className={styles.topNavbar}>
      <div className={styles.container}>
        {/* Logo Section */}
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoText}>ZARSS</span>
        </Link>

        {/* Main Navigation Links */}
        <div className={styles.navLinks}>
          <NavLink
            to="/dashboard"
            className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/shop"
            className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Shop
          </NavLink>
          <NavLink
            to="/my-orders"
            className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            My Orders
          </NavLink>
          {isAdmin && (
            <>
              <NavLink
                to="/admin/products"
                className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                Products
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                Users
              </NavLink>
              <NavLink
                to="/admin/sales-history"
                className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                Sales
              </NavLink>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button className={styles.clearButton} onClick={clearSearch}>
              <FaTimes />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map(product => (
                <div
                  key={product.id}
                  className={styles.searchResultItem}
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.image || 'https://via.placeholder.com/60'}
                    alt={product.name}
                    className={styles.resultImage}
                  />
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultCategory}>{product.category_name}</span>
                  </div>
                  <span className={styles.resultPrice}>${parseFloat(product.price).toFixed(2)}</span>
                </div>
              ))}
              <div className={styles.viewAllResults} onClick={() => { navigate('/shop'); clearSearch(); }}>
                View all results in Shop →
              </div>
            </div>
          )}

          {showResults && searchResults.length === 0 && (
            <div className={styles.searchResults}>
              <div className={styles.noResults}>
                No products found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className={styles.actions}>
          <Link to="/wishlist" className={styles.iconButton} title="Wishlist">
            <FaHeart />
            <span className={styles.badge}>0</span>
          </Link>
          <Link to="/cart" className={styles.iconButton} title="Cart">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className={`${styles.badge} ${cartBounce ? styles.bounce : ''}`}>
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/profile" className={styles.iconButton} title="Profile">
            <FaUser />
          </Link>
          <button onClick={handleLogout} className={styles.iconButton} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;