/* global WebImporter */
/* eslint-disable no-console */

// PARSER IMPORTS - Import all parsers needed for this template
import heroDarkParser from './parsers/hero-dark.js';
import cardsParser from './parsers/cards.js';
import cardsServicesParser from './parsers/cards-services.js';
import columnsParser from './parsers/columns.js';
import columnsFourParser from './parsers/columns-four.js';

// TRANSFORMER IMPORTS - Import all transformers found in tools/importer/transformers/
import cleanupTransformer from './transformers/cleanup.js';

// PARSER REGISTRY - Map parser names to functions
const parsers = {
  'hero-dark': heroDarkParser,
  'cards': cardsParser,
  'cards-services': cardsServicesParser,
  'columns': columnsParser,
  'columns-four': columnsFourParser,
};

// TRANSFORMER REGISTRY - Array of transformer functions
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'portfolio',
  description: 'AT&T Business portfolio pages with hero, cards, and columns blocks for product/service categories',
  urls: [
    'https://www.business.att.com/portfolios/mobility.html'
  ],
  blocks: [
    {
      name: 'hero-dark',
      instances: ['.base-hero-v2', '.hero-wrapper', "[class*='hero']"],
      section: 'dark'
    },
    {
      name: 'cards',
      instances: ['.flex-cards', '.flex-card-main', '.multi-tile-cards', '.multi-tile-main']
    },
    {
      name: 'cards-services',
      instances: ['.pictogram-cards', '.pictogram-card-main', "[class*='pictogram']"],
      section: 'light-gray'
    },
    {
      name: 'columns',
      instances: ['.story-tile', '.story-tile-main', "[class*='story-tile']"]
    },
    {
      name: 'columns-four',
      instances: ['.link-farm', '.link-columns', "[class*='link-farm']"],
      section: 'light-gray'
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - The hook name ('beforeTransform' or 'afterTransform')
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - The payload containing { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      } catch (e) {
        console.warn(`Invalid selector for ${blockDef.name}: ${selector}`);
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

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (full localized path without extension)
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
