/* global WebImporter */
/* eslint-disable no-console */

// PARSER IMPORTS - Import all parsers needed for this template
import heroDarkParser from './parsers/hero-dark.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-dark': heroDarkParser,
  'cards': cardsParser,
  'columns': columnsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'product-dynamic-defense',
  description: 'AT&T Dynamic Defense product page template with hero, feature cards, pricing cards, testimonials, and FAQ sections',
  urls: [
    'https://www.business.att.com/products/att-dynamic-defense.html'
  ],
  blocks: [
    {
      name: 'hero-dark',
      instances: ['.hero.aem-GridColumn .hero-wrapper', '.hero-wrapper', '.base-hero-v2', '[class*="hero"]'],
      section: 'dark'
    },
    {
      name: 'cards',
      instances: ['.multi-tile-main', '.multi-tile-cards', '.flex-cards', '.flex-card-main']
    },
    {
      name: 'columns',
      instances: ['.story-tile-main', '.image-text-container', '.story-tile', '[class*="story-tile"]']
    }
  ]
};

/**
 * Execute DOM cleanup before parsing
 * @param {Document} document - The DOM document
 */
function executeCleanup(document) {
  // Remove navigation elements
  const navElements = document.querySelectorAll('nav, header, .global-nav, .site-header, #header, .att-header');
  navElements.forEach(el => el.remove());

  // Remove footer elements
  const footerElements = document.querySelectorAll('footer, .global-footer, .site-footer, #footer, .att-footer');
  footerElements.forEach(el => el.remove());

  // Remove script and style tags
  const scriptStyles = document.querySelectorAll('script, style, noscript, link[rel="stylesheet"]');
  scriptStyles.forEach(el => el.remove());

  // Remove cookie banners and popups
  const popups = document.querySelectorAll('[class*="cookie"], [class*="popup"], [class*="modal"], [id*="cookie"], .consent-banner');
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

  // Remove forms and contact sections (handled separately)
  const forms = document.querySelectorAll('form, .contact-form, .lead-form');
  forms.forEach(el => el.remove());
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const processedElements = new Set();

  // Find all block instances defined in the template
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Skip if this element was already processed
          if (processedElements.has(element)) {
            return;
          }
          processedElements.add(element);

          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      } catch (e) {
        console.warn(`Invalid selector "${selector}" for block ${blockDef.name}:`, e.message);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  /**
   * Main transformation function
   */
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute DOM cleanup (initial cleanup)
    executeCleanup(document);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          console.log(`Parsing block: ${block.name} (${block.selector})`);
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Apply WebImporter built-in rules
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path (full localized path without extension)
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
