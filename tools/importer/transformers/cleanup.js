/**
 * DOM Cleanup Transformer
 * Removes unwanted elements before parsing
 */
export default function transform(document) {
  // Remove navigation elements
  const navElements = document.querySelectorAll('nav, header, .global-nav, .site-header, #header');
  navElements.forEach(el => el.remove());

  // Remove footer elements
  const footerElements = document.querySelectorAll('footer, .global-footer, .site-footer, #footer');
  footerElements.forEach(el => el.remove());

  // Remove script and style tags
  const scriptStyles = document.querySelectorAll('script, style, noscript');
  scriptStyles.forEach(el => el.remove());

  // Remove cookie banners and popups
  const popups = document.querySelectorAll('[class*="cookie"], [class*="popup"], [class*="modal"], [id*="cookie"]');
  popups.forEach(el => el.remove());

  // Remove tracking pixels and hidden elements
  const tracking = document.querySelectorAll('img[width="1"], img[height="1"], [style*="display:none"], [style*="display: none"]');
  tracking.forEach(el => el.remove());

  // Remove chat widgets
  const chatWidgets = document.querySelectorAll('[class*="chat"], [id*="chat"], .inq-wrapper');
  chatWidgets.forEach(el => el.remove());

  // Remove ad-related elements
  const adElements = document.querySelectorAll('[class*="ad-"], [id*="ad-"], .advertisement');
  adElements.forEach(el => el.remove());

  // Clean up empty divs
  const emptyDivs = document.querySelectorAll('div:empty');
  emptyDivs.forEach(el => {
    if (!el.id && !el.className) {
      el.remove();
    }
  });
}
