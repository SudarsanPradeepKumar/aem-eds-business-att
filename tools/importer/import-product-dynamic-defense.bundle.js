var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-product-dynamic-defense.js
  var import_product_dynamic_defense_exports = {};
  __export(import_product_dynamic_defense_exports, {
    default: () => import_product_dynamic_defense_default
  });

  // tools/importer/parsers/hero-dark.js
  function parse(element, { document }) {
    const bgImage = element.querySelector('img, picture img, [style*="background-image"]');
    const imageCell = bgImage ? bgImage.cloneNode(true) : "";
    const eyebrow = element.querySelector('.eyebrow, .hero-eyebrow, [class*="eyebrow"]');
    const eyebrowText = eyebrow ? eyebrow.textContent.trim() : "";
    const heading = element.querySelector('h1, h2, .hero-title, [class*="title"]');
    const headingText = heading ? heading.textContent.trim() : "";
    const description = element.querySelector(".hero-desc, .hero-body, p:not(.eyebrow)");
    const descText = description ? description.textContent.trim() : "";
    const listItems = element.querySelectorAll("ul li, .hero-list li");
    const listContent = Array.from(listItems).map((li) => `- ${li.textContent.trim()}`).join("\n");
    const ctas = element.querySelectorAll('a.btn, a.cta, a[class*="button"], .hero-cta a');
    const ctaElements = Array.from(ctas).map((cta) => {
      const link = document.createElement("a");
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      return link;
    });
    const cells = [
      [imageCell],
      [eyebrowText],
      [headingText],
      [descText]
    ];
    if (listContent) {
      cells.push([listContent]);
    }
    if (ctaElements.length > 0) {
      const ctaContainer = document.createElement("p");
      ctaElements.forEach((cta, idx) => {
        if (idx === 0) {
          const strong = document.createElement("strong");
          strong.appendChild(cta);
          ctaContainer.appendChild(strong);
        } else {
          ctaContainer.appendChild(document.createTextNode(" "));
          ctaContainer.appendChild(cta);
        }
      });
      cells.push([ctaContainer]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Hero (dark)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll('.flex-card, .multi-tile-card, .card, [class*="card-item"]');
    const cells = [];
    cardItems.forEach((card) => {
      const img = card.querySelector("img, picture img");
      const imageCell = img ? img.cloneNode(true) : "";
      const title = card.querySelector('h2, h3, h4, .card-title, [class*="title"]');
      const titleText = title ? title.textContent.trim() : "";
      const desc = card.querySelector('p, .card-desc, .card-body, [class*="desc"]');
      const descText = desc ? desc.textContent.trim() : "";
      const link = card.querySelector("a");
      let linkElement = null;
      if (link) {
        linkElement = document.createElement("a");
        linkElement.href = link.href;
        linkElement.textContent = link.textContent.trim() || "Learn more";
      }
      const contentCell = document.createElement("p");
      if (titleText) {
        const strong = document.createElement("strong");
        strong.textContent = titleText;
        contentCell.appendChild(strong);
        contentCell.appendChild(document.createTextNode(" "));
      }
      if (descText) {
        contentCell.appendChild(document.createTextNode(descText + " "));
      }
      if (linkElement) {
        contentCell.appendChild(linkElement);
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const contentCol = element.querySelector('.story-tile-content, .col-text, [class*="content"]');
    const imageCol = element.querySelector('.story-tile-image, .col-image, [class*="image"]');
    const img = imageCol ? imageCol.querySelector("img") : element.querySelector("img");
    const heading = contentCol ? contentCol.querySelector("h2, h3, .title") : element.querySelector("h2, h3");
    const headingText = heading ? heading.textContent.trim() : "";
    const desc = contentCol ? contentCol.querySelector("p, .desc, .body") : element.querySelector("p");
    const descText = desc ? desc.textContent.trim() : "";
    const cta = contentCol ? contentCol.querySelector('a.btn, a.cta, a[class*="button"]') : element.querySelector("a.btn, a.cta");
    const leftContent = document.createElement("div");
    if (headingText) {
      const strong = document.createElement("strong");
      strong.textContent = headingText;
      leftContent.appendChild(strong);
      leftContent.appendChild(document.createElement("br"));
    }
    if (descText) {
      leftContent.appendChild(document.createTextNode(descText + " "));
    }
    if (cta) {
      const link = document.createElement("a");
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      const strong = document.createElement("strong");
      strong.appendChild(link);
      leftContent.appendChild(strong);
    }
    const rightContent = img ? img.cloneNode(true) : "";
    const cells = [
      [leftContent, rightContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/import-product-dynamic-defense.js
  var parsers = {
    "hero-dark": parse,
    "cards": parse2,
    "columns": parse3
  };
  var PAGE_TEMPLATE = {
    name: "product-dynamic-defense",
    description: "AT&T Dynamic Defense product page template with hero, feature cards, pricing cards, testimonials, and FAQ sections",
    urls: [
      "https://www.business.att.com/products/att-dynamic-defense.html"
    ],
    blocks: [
      {
        name: "hero-dark",
        instances: [".hero.aem-GridColumn .hero-wrapper", ".hero-wrapper", ".base-hero-v2", '[class*="hero"]'],
        section: "dark"
      },
      {
        name: "cards",
        instances: [".multi-tile-main", ".multi-tile-cards", ".flex-cards", ".flex-card-main"]
      },
      {
        name: "columns",
        instances: [".story-tile-main", ".image-text-container", ".story-tile", '[class*="story-tile"]']
      }
    ]
  };
  function executeCleanup(document) {
    const navElements = document.querySelectorAll("nav, header, .global-nav, .site-header, #header, .att-header");
    navElements.forEach((el) => el.remove());
    const footerElements = document.querySelectorAll("footer, .global-footer, .site-footer, #footer, .att-footer");
    footerElements.forEach((el) => el.remove());
    const scriptStyles = document.querySelectorAll('script, style, noscript, link[rel="stylesheet"]');
    scriptStyles.forEach((el) => el.remove());
    const popups = document.querySelectorAll('[class*="cookie"], [class*="popup"], [class*="modal"], [id*="cookie"], .consent-banner');
    popups.forEach((el) => el.remove());
    const tracking = document.querySelectorAll('img[width="1"], img[height="1"], [style*="display:none"], [style*="display: none"]');
    tracking.forEach((el) => el.remove());
    const chatWidgets = document.querySelectorAll('[class*="chat"], [id*="chat"], .inq-wrapper');
    chatWidgets.forEach((el) => el.remove());
    const adElements = document.querySelectorAll('[class*="ad-"], [id*="ad-"], .advertisement');
    adElements.forEach((el) => el.remove());
    const forms = document.querySelectorAll("form, .contact-form, .lead-form");
    forms.forEach((el) => el.remove());
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const processedElements = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
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
  var import_product_dynamic_defense_default = {
    /**
     * Main transformation function
     */
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeCleanup(document);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_product_dynamic_defense_exports);
})();
