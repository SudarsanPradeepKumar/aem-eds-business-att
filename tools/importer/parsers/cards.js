/**
 * Parser for cards block variant
 * Extracts card grids from flex-cards and multi-tile sections
 */
export default function parse(element, { document }) {
  // Find all card items
  const cardItems = element.querySelectorAll('.flex-card, .multi-tile-card, .card, [class*="card-item"]');

  const cells = [];

  cardItems.forEach(card => {
    // Extract image
    const img = card.querySelector('img, picture img');
    const imageCell = img ? img.cloneNode(true) : '';

    // Extract title
    const title = card.querySelector('h2, h3, h4, .card-title, [class*="title"]');
    const titleText = title ? title.textContent.trim() : '';

    // Extract description
    const desc = card.querySelector('p, .card-desc, .card-body, [class*="desc"]');
    const descText = desc ? desc.textContent.trim() : '';

    // Extract link/CTA
    const link = card.querySelector('a');
    let linkElement = null;
    if (link) {
      linkElement = document.createElement('a');
      linkElement.href = link.href;
      linkElement.textContent = link.textContent.trim() || 'Learn more';
    }

    // Build content cell
    const contentCell = document.createElement('p');

    if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      contentCell.appendChild(strong);
      contentCell.appendChild(document.createTextNode(' '));
    }

    if (descText) {
      contentCell.appendChild(document.createTextNode(descText + ' '));
    }

    if (linkElement) {
      contentCell.appendChild(linkElement);
    }

    // Add row with image and content
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards',
    cells
  });

  element.replaceWith(block);
}
