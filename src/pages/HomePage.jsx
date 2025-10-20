import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/shop/ProductCard';
import { ProductSkeletonGrid } from '../components/shop/ProductSkeleton';
import { useToast } from '../context/ToastContext';
import styles from '../styles/HomePageNew.module.css';
// Textura premium para Hero - Estilo Apple/Nike
const heroImage = '/assets/textures/steel-texture.jpg';
import categoryKitchen from '../assets/cocina-marmol.jpg';
import categoryLaundry from '../assets/toallas.jpg';
import categoryLiving from '../assets/cocina-limpia.jpg';
import categoryTech from '../assets/vitroceramica.jpg';

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [realCategories, setRealCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos destacados y categorías reales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos destacados (los primeros 8 en stock)
        const productsResponse = await getProducts({ 
          in_stock: 'true',
          page_size: 8 
        });
        setFeaturedProducts(productsResponse.data.results || productsResponse.data);
        
        // Cargar categorías reales
        const categoriesResponse = await getCategories();
        setRealCategories(categoriesResponse.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        showToast('Error al cargar el catálogo', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showToast]);

  // Imágenes por defecto para categorías
  const categoryImages = {
    0: categoryKitchen,
    1: categoryLaundry,
    2: categoryLiving,
    3: categoryTech,
  };

  const brands = ['Samsung', 'LG', 'Sony', 'Mabe', 'Whirlpool', 'Bosch'];

  return (
    <div className={styles.homePage}>
      {/* SECCIÓN HERO */}
      <section className={styles.heroSection}>
        <img src={heroImage} alt="DOMUS Premium Quality" className={styles.heroImage} />
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Diseñado para durar</h1>
            <p className={styles.heroSubtitle}>
              La perfección está en los detalles. Materiales premium que transforman tu espacio.
            </p>
            <button 
              className={styles.heroCTA}
              onClick={() => navigate('/shop')}
            >
              Descubrir DOMUS
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS VISUALES */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Explora por categoría</h2>
          <div className={styles.categoriesGrid}>
            {realCategories.length > 0 ? (
              realCategories.slice(0, 4).map((category, index) => (
                <div 
                  key={category.id}
                  className={styles.categoryCard}
                  onClick={() => navigate('/shop')}
                >
                  <img 
                    src={categoryImages[index] || categoryKitchen} 
                    alt={category.name} 
                    className={styles.categoryImage}
                  />
                  <div className={styles.categoryOverlay}>
                    <h3 className={styles.categoryName}>{category.name}</h3>
                    <p className={styles.categoryDesc}>
                      {category.product_count} productos disponibles
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Categorías por defecto mientras cargan
              <div className={styles.loadingCategories}>Cargando categorías...</div>
            )}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS - CATÁLOGO REAL */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Diseñados para inspirar</h2>
          <p className={styles.productsSubtitle}>
            Cada pieza seleccionada para transformar tu rutina diaria
          </p>
          
          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : (
            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onProductClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}
          
          <div className={styles.viewAllContainer}>
            <button 
              className={styles.viewAllButton}
              onClick={() => navigate('/shop')}
            >
              Ver todo el catálogo
            </button>
          </div>
        </div>
      </section>

      {/* MARCAS DE CONFIANZA */}
      <section className={styles.brandsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Innovación garantizada</h2>
          <p className={styles.brandsSubtitle}>
            Colaboramos con líderes que definen el futuro del hogar
          </p>
          <div className={styles.brandsGrid}>
            {brands.map((brand, index) => (
              <div key={index} className={styles.brandCard}>
                <span className={styles.brandName}>{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={styles.finalCTA}>
        <div className={styles.container}>
          <h2 className={styles.finalTitle}>Tu hogar te espera</h2>
          <p className={styles.finalSubtitle}>
            Comienza tu transformación hoy
          </p>
          <button 
            className={styles.finalButton}
            onClick={() => navigate('/shop')}
          >
            Explorar ahora
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;