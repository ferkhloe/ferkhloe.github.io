/**
 * FERKHLOE - Analítica privada del sitio (Google Analytics 4)
 * ------------------------------------------------------------
 * 1. Cree una propiedad GA4 para https://ferkhloe.github.io/
 * ID de medición GA4 configurado para Ferkhloe.
 *
 * No muestra contador público.
 * Registra páginas y clics de navegación sin enviar nombres, teléfonos,
 * correos escritos por visitantes ni contenido de formularios.
 */
(() => {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-RLWSC6JFK6';

  const idValido = /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);

  // Si aún no se ha configurado el ID real, la página funciona normalmente
  // pero NO se envía ninguna estadística.
  if (!idValido) {
    console.info('[FERKHLOE Analytics] Pendiente configurar ID GA4.');
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

  // Configuración enfocada en estadísticas del sitio, no publicidad.
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src =
    'https://www.googletagmanager.com/gtag/js?id=' +
    encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(gtagScript);

  // Eventos útiles para FERKHLOE.
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    const name = link.dataset.analytics || '';
    const label =
      link.dataset.analyticsLabel ||
      link.textContent.trim().replace(/\s+/g, ' ').slice(0, 100) ||
      href.slice(0, 100);

    let eventName = name ? 'ferkhloe_click' : '';

    // Detectar eventos aunque una página todavía no tenga data-analytics.
    if (!eventName) {
      const h = href.toLowerCase();
      if (h.includes('wa.me') || h.includes('whatsapp')) {
        eventName = 'contact_click';
      } else if (h.startsWith('mailto:')) {
        eventName = 'contact_click';
      } else if (/\.pdf($|\?)/i.test(h)) {
        eventName = 'file_download';
      } else if (h && !h.startsWith('#') && !h.startsWith('javascript:')) {
        try {
          const u = new URL(href, location.href);
          if (u.origin !== location.origin) eventName = 'outbound_click';
        } catch (_) {}
      }
    }

    if (!eventName) return;

    window.gtag('event', eventName, {
      link_name: name || 'generic',
      link_label: label,
      link_url: href,
      page_path: location.pathname,
      page_title: document.title
    });
  }, {capture: true});
})();
