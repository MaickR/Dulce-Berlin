/**
 * Inicialización optimizada de Skrollr
 * Previene warnings de passive event listeners y mejora rendimiento
 */

(function() {
  'use strict';

  // Esperar a que el documento esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkrollr);
  } else {
    initSkrollr();
  }

  function initSkrollr() {
    // Solo inicializar skrollr en desktop (ancho > 1024px)
    if (window.innerWidth > 1024 && typeof skrollr !== 'undefined') {
      try {
        skrollr.init();
        console.log('✓ Skrollr inicializado correctamente');
      } catch (e) {
        console.warn('⚠ Error al inicializar skrollr:', e.message);
      }
    }

    // Optimizar performance al hacer scroll
    var scrollTimeout;
    var isScrolling = false;

    document.addEventListener('scroll', function() {
      if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('is-scrolling');
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        isScrolling = false;
        document.body.classList.remove('is-scrolling');
      }, 150);
    }, { passive: true });

    // Deshabilitar hover animations mientras se hace scroll en móviles
    if (window.innerWidth <= 1024) {
      document.addEventListener('touchmove', function() {
        if (!isScrolling) {
          isScrolling = true;
          document.body.classList.add('is-scrolling');
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
          isScrolling = false;
          document.body.classList.remove('is-scrolling');
        }, 150);
      }, { passive: true });
    }
  }
})();
