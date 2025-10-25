/**
 * Skrollr.js Fix for Passive Event Listeners
 * Resuelve el warning: "Unable to preventDefault inside passive event listener"
 * 
 * Este script debe cargarse ANTES de skrollr.js
 */

(function() {
  'use strict';

  // Detectar si el navegador soporta event listener options
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (err) {
    supportsPassive = false;
  }

  // Si el navegador soporta passive, podemos usar { passive: false }
  if (supportsPassive) {
    // Monkey-patch addEventListener para skrollr
    var originalAddEventListener = EventTarget.prototype.addEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      // Para eventos de touch y wheel, permitir preventDefault
      if (type === 'touchmove' || type === 'touchstart' || type === 'wheel' || type === 'mousewheel') {
        if (typeof options === 'boolean') {
          options = { capture: options, passive: false };
        } else if (typeof options === 'object' && options !== null) {
          options.passive = false;
        } else {
          options = { passive: false };
        }
      }
      
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  // Alternativa: Desactivar skrollr en dispositivos móviles si es necesario
  // Descomenta las siguientes líneas si quieres desactivar parallax en móviles
  /*
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log('Skrollr desactivado en dispositivo móvil para mejorar rendimiento');
    window.DISABLE_SKROLLR = true;
  }
  */
})();
