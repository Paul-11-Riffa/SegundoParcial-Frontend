import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from '../styles/TopNavbar.module.css';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { getProducts, logoutUser } from '../services/api';

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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar localStorage siempre, incluso si falla la petición al backend
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
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
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>DOMUS</span>
        </Link>

        {/* Main Navigation Links */}
        <div className={styles.navLinks}>
          {isAdmin ? (
            <>
              {/* BOTÓN DASHBOARD */}
              <NavLink
                to="/admin/dashboard"
                className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                📊 Dashboard
              </NavLink>
              
              {/* MÓDULO 1: GESTIÓN */}
              <div className={styles.moduleDropdown}>
                <button className={styles.moduleButton}>
                  Gestión
                </button>
                <div className={styles.moduleDropdownContent}>
                  <NavLink to="/admin/users" className={styles.moduleDropdownLink}>
                    👥 Clientes
                  </NavLink>
                  <NavLink to="/admin/products" className={styles.moduleDropdownLink}>
                    📦 Inventario
                  </NavLink>
                  <NavLink to="/admin/sales-history" className={styles.moduleDropdownLink}>
                    📊 Ventas
                  </NavLink>
                  <NavLink to="/admin/reports" className={styles.moduleDropdownLink}>
                    📋 Reportes
                  </NavLink>
                </div>
              </div>
              
              {/* MÓDULO 2: ANÁLISIS */}
              <div className={styles.moduleDropdown}>
                <button className={styles.moduleButton}>
                  Análisis
                </button>
                <div className={styles.moduleDropdownContent}>
                  {/* ❌ ELIMINADO: Reportes con IA - Usar /admin/reports en su lugar */}
                  <NavLink to="/admin/audit" className={styles.moduleDropdownLink}>
                    📋 Bitácora
                  </NavLink>
                </div>
              </div>
            </>
          ) : (
            <NavLink
              to="/shop"
              className={({isActive}) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Tienda
            </NavLink>
          )}
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
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
                    src={product.image_url || product.image || 'https://via.placeholder.com/60'}
                    alt={product.name}
                    className={styles.resultImage}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }}
                  />
                  <div className={styles.resultInfo}>
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultCategory}>{product.category_name}</span>
                  </div>
                  <span className={styles.resultPrice}>${parseFloat(product.price).toFixed(2)}</span>
                </div>
              ))}
              <div className={styles.viewAllResults} onClick={() => { navigate('/shop'); clearSearch(); }}>
                Ver todos los resultados en la Tienda →
              </div>
            </div>
          )}

          {showResults && searchResults.length === 0 && (
            <div className={styles.searchResults}>
              <div className={styles.noResults}>
                No se encontraron productos para "{searchQuery}"
              </div>
            </div>
          )}
        </div>

        {/* Action Icons */}
        <div className={styles.actions}>
          {/* Search Icon (mobile-friendly) - Solo para clientes */}
          {!isAdmin && (
            <button className={styles.iconButton} title="Buscar">
              <FaSearch />
            </button>
          )}
          
          {/* Cart with counter - Solo para clientes */}
          {!isAdmin && (
            <Link to="/account/cart" className={styles.iconButton} title="Carrito">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className={`${styles.badge} ${cartBounce ? styles.bounce : ''}`}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          
          {/* Profile Dropdown */}
          {user ? (
            <div className={styles.profileMenu}>
              <button className={styles.iconButton} title="Perfil">
                <FaUser />
              </button>
              <div className={styles.dropdown}>
                {!isAdmin && (
                  <>
                    <Link to="/account/profile" className={styles.dropdownItem}>
                      <FaUser /> Mi Perfil
                    </Link>
                    <Link to="/account/my-orders" className={styles.dropdownItem}>
                      Mis Órdenes
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                  </>
                )}
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <FaSignOutAlt /> Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={styles.iconButton} title="Iniciar Sesión">
              <FaUser />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;