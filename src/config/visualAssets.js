/**
 * VISUAL ASSETS CONFIGURATION
 * Configuración centralizada de activos visuales para DOMUS
 * 
 * Facilita cambios rápidos sin tocar el código de componentes.
 */

// ========================================
// TEXTURAS PREMIUM - HomePage Hero
// ========================================
export const HERO_TEXTURES = {
  // Textura principal actual
  main: '/assets/textures/steel-texture.jpg',
  
  // Alternativas disponibles
  alternatives: {
    steel: '/assets/textures/steel-texture.jpg',
    stoveKnob: '/assets/textures/stove-knob.jpg',
    digitalPanel: '/assets/textures/digital-panel.jpg',
    iceDispenser: '/assets/textures/ice-dispenser.jpg',
  }
};

// ========================================
// BANNERS DE CATEGORÍA - ShopPage
// ========================================
export const CATEGORY_BANNERS = {
  'cocina': {
    image: '/assets/hero-banners/mixer-marble.jpg',
    title: 'Cocina de Autor',
    subtitle: 'Donde la pasión se encuentra con la precisión'
  },
  'lavado': {
    image: '/assets/hero-banners/washer-dryer-stack.jpg',
    title: 'Cuidado Inteligente',
    subtitle: 'Tecnología que respeta cada fibra'
  },
  'electrodomesticos-pequenos': {
    image: '/assets/hero-banners/mixer-studio.jpg',
    title: 'Pequeños Detalles',
    subtitle: 'Grandes momentos en tu día a día'
  },
  'tecnologia': {
    image: '/assets/hero-banners/tv-wall-mount.jpg',
    title: 'Experiencia Visual',
    subtitle: 'Diseño que desaparece, contenido que cautiva'
  },
  'limpieza': {
    image: '/assets/hero-banners/vacuum-artistic.jpg',
    title: 'Pureza Renovada',
    subtitle: 'La limpieza elevada a su máxima expresión'
  },
  'default': {
    image: '/assets/hero-banners/mixer-marble.jpg',
    title: 'DOMUS Collection',
    subtitle: 'Diseño que transforma tu espacio'
  }
};

// ========================================
// GALERÍA - ProductDetailPage
// ========================================
export const PRODUCT_GALLERY_DEFAULTS = {
  // Imágenes de respaldo cuando el producto no tiene galería
  fallbackImages: {
    hero: '/assets/appliances-large/fridge-modern.jpg',
    detail: '/assets/textures/stove-knob.jpg',
    front: '/assets/appliances-large/washer.jpg',
    ambient: '/assets/hero-banners/mixer-marble.jpg'
  },
  
  // Mapeo de categorías a imágenes de detalle
  detailByCategory: {
    'cocina': '/assets/textures/stove-knob.jpg',
    'lavado': '/assets/textures/digital-panel.jpg',
    'refrigeradores': '/assets/textures/ice-dispenser.jpg',
    'default': '/assets/textures/steel-texture.jpg'
  },
  
  // Mapeo de categorías a imágenes ambientales
  ambientByCategory: {
    'cocina': '/assets/hero-banners/mixer-marble.jpg',
    'lavado': '/assets/hero-banners/washer-dryer-stack.jpg',
    'electrodomesticos-pequenos': '/assets/hero-banners/mixer-studio.jpg',
    'tecnologia': '/assets/hero-banners/tv-wall-mount.jpg',
    'default': '/assets/hero-banners/mixer-marble.jpg'
  }
};

// ========================================
// ESTILOS DE PRODUCTCARD
// ========================================
export const PRODUCT_CARD_CONFIG = {
  // Fondo del contenedor de imagen
  imageContainerBackground: '#f5f5f7', // Gris Apple
  
  // Alternativas
  backgroundOptions: {
    appleGray: '#f5f5f7',
    pureWhite: '#ffffff',
    warmWhite: '#fafaf9',
    coolGray: '#f8f9fa'
  },
  
  // Configuración de hover
  hoverScale: 1.05, // Escala en hover (objeto contain)
  hoverLift: '-12px' // Elevación de la tarjeta
};

// ========================================
// MENSAJES PREMIUM - HomePage
// ========================================
export const HERO_MESSAGES = {
  current: {
    title: 'Diseñado para durar',
    subtitle: 'La perfección está en los detalles. Materiales premium que transforman tu espacio.',
    cta: 'Descubrir DOMUS'
  },
  
  alternatives: [
    {
      title: 'Donde la calidad es arte',
      subtitle: 'Cada acabado, cada textura, cuenta una historia de excelencia.',
      cta: 'Explorar la colección'
    },
    {
      title: 'Más que electrodomésticos',
      subtitle: 'Experiencias premium diseñadas para elevar tu día a día.',
      cta: 'Descubrir más'
    },
    {
      title: 'El futuro del hogar',
      subtitle: 'Innovación y diseño en perfecta armonía.',
      cta: 'Ver productos'
    }
  ]
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Obtiene el banner de categoría según el slug
 */
export const getCategoryBanner = (categorySlug) => {
  return CATEGORY_BANNERS[categorySlug?.toLowerCase()] || CATEGORY_BANNERS.default;
};

/**
 * Obtiene imágenes de galería para un producto
 */
export const getProductGalleryImages = (product) => {
  const category = product.category_slug?.toLowerCase() || 'default';
  
  return {
    hero: product.image || PRODUCT_GALLERY_DEFAULTS.fallbackImages.hero,
    detail: PRODUCT_GALLERY_DEFAULTS.detailByCategory[category] || 
            PRODUCT_GALLERY_DEFAULTS.detailByCategory.default,
    front: product.image_2 || PRODUCT_GALLERY_DEFAULTS.fallbackImages.front,
    ambient: PRODUCT_GALLERY_DEFAULTS.ambientByCategory[category] ||
             PRODUCT_GALLERY_DEFAULTS.ambientByCategory.default
  };
};

/**
 * Obtiene mensaje hero aleatorio (para A/B testing)
 */
export const getRandomHeroMessage = () => {
  const allMessages = [HERO_MESSAGES.current, ...HERO_MESSAGES.alternatives];
  return allMessages[Math.floor(Math.random() * allMessages.length)];
};

export default {
  HERO_TEXTURES,
  CATEGORY_BANNERS,
  PRODUCT_GALLERY_DEFAULTS,
  PRODUCT_CARD_CONFIG,
  HERO_MESSAGES,
  getCategoryBanner,
  getProductGalleryImages,
  getRandomHeroMessage
};
