import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, addToCart, getSimilarProducts } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { getProductGalleryImages } from '../config/visualAssets';
import Rating from '../components/shop/Rating';
import RecentlyViewed from '../components/shop/RecentlyViewed';
import ProductCard from '../components/shop/ProductCard';
import styles from '../styles/ProductDetailPage.module.css';
import { FaCartPlus, FaHeart, FaCheck, FaArrowLeft, FaRegHeart } from 'react-icons/fa';

/**
 * ProductDetailPage - La "Galería de Arte"
 * 
 * Filosofía Apple: La página del producto es una narrativa visual.
 * La compra es una consecuencia de la inmersión visual.
 * 
 * Galería Asimétrica de 4 imágenes:
 * 1. Hero grande (refrigeradores/lavadoras)
 * 2. Detalle pequeño (texturas - perilla, panel)
 * 3. Vista frontal pequeña (otro hero)
 * 4. Ambiente grande (banners hero)
 */
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshCart } = useCart();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  // Gallery images - Dinámicamente generadas desde la configuración
  const galleryImages = product ? getProductGalleryImages(product) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ id });
        const productData = response.data.results?.[0] || response.data;
        setProduct(productData);
        addToRecentlyViewed(productData);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        showToast('No se pudo cargar el producto', 'error');
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate, showToast, addToRecentlyViewed]);

  // Cargar productos similares con ML
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!id) return;

      try {
        setSimilarLoading(true);
        const response = await getSimilarProducts(id, 6);
        setSimilarProducts(response.data.results || response.data.similar_products || []);
      } catch (error) {
        console.error('Error al cargar productos similares:', error);
        // No mostrar error, simplemente no mostrar similares
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [id]);

  const handleAddToCart = async () => {
    if (isAdding || !product || product.stock <= 0) return;

    try {
      setIsAdding(true);
      await addToCart(product.id, quantity);
      refreshCart();
      showToast(`${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`, 'success');
    } catch (error) {
      showToast('No se pudo agregar al carrito', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className={styles.productDetailPage}>
      {/* Header - Back Button */}
      <div className={styles.headerNav}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          <span>Volver</span>
        </button>
      </div>

      {/* Main Content: Galería + Info */}
      <div className={styles.mainContent}>
        
        {/* GALERÍA ASIMÉTRICA - Estilo Apple */}
        <div className={styles.gallerySection}>
          <div className={styles.asymmetricGrid}>
            {/* Imagen 1: Hero Grande */}
            <div className={`${styles.gridItem} ${styles.heroLarge}`}>
              <img src={galleryImages.hero} alt={product.name} />
            </div>
            
            {/* Imagen 2: Detalle Pequeño */}
            <div className={`${styles.gridItem} ${styles.detailSmall}`}>
              <img src={galleryImages.detail} alt="Detalle de calidad" />
            </div>
            
            {/* Imagen 3: Vista Frontal Pequeña */}
            <div className={`${styles.gridItem} ${styles.frontSmall}`}>
              <img src={galleryImages.front} alt="Vista del producto" />
            </div>
            
            {/* Imagen 4: Ambiente Grande */}
            <div className={`${styles.gridItem} ${styles.ambientLarge}`}>
              <img src={galleryImages.ambient} alt="Ambiente premium" />
            </div>
          </div>
        </div>

        {/* STICKY INFO PANEL - Siempre visible al hacer scroll */}
        <div className={styles.infoSection}>
          <div className={styles.stickyContainer}>
            
            {/* Category Badge */}
            <span className={styles.categoryBadge}>{product.category_name}</span>
            
            {/* Title */}
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            {/* Rating */}
            <div className={styles.ratingContainer}>
              <Rating 
                rating={product.rating || 4.5}
                reviewCount={product.review_count || 156}
                size="medium"
              />
            </div>

            {/* Price */}
            <div className={styles.priceContainer}>
              <span className={styles.price}>${parseFloat(product.price).toFixed(2)}</span>
              {isLowStock && (
                <span className={styles.stockBadge}>Solo {product.stock} disponibles</span>
              )}
              {isOutOfStock && (
                <span className={`${styles.stockBadge} ${styles.outOfStock}`}>Sin Stock</span>
              )}
            </div>

            {/* Description */}
            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className={styles.quantitySection}>
                <label className={styles.quantityLabel}>Cantidad</label>
                <div className={styles.quantitySelector}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.quantityBtn}
                  >
                    -
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button 
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
              >
                {isAdding ? (
                  <>
                    <div className={styles.spinner}></div>
                    Agregando...
                  </>
                ) : isOutOfStock ? (
                  'Sin Stock'
                ) : (
                  <>
                    <FaCartPlus />
                    Añadir al Carrito
                  </>
                )}
              </button>

              <button 
                className={styles.favoriteBtn}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <FaCheck className={styles.trustIcon} />
                <span>Envío gratuito en compras mayores a $50</span>
              </div>
              <div className={styles.trustItem}>
                <FaCheck className={styles.trustIcon} />
                <span>Garantía extendida disponible</span>
              </div>
              <div className={styles.trustItem}>
                <FaCheck className={styles.trustIcon} />
                <span>Instalación profesional opcional</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Productos Similares con ML */}
      {!similarLoading && similarProducts.length > 0 && (
        <div className={styles.similarProductsSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>✨ Productos Similares (Recomendados por IA)</h2>
            <p className={styles.sectionSubtitle}>Seleccionados especialmente según este producto</p>
            
            <div className={styles.similarProductsGrid}>
              {similarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  onProductClick={() => navigate(`/product/${similarProduct.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      <div className={styles.recentlyViewedSection}>
        <RecentlyViewed currentProductId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
