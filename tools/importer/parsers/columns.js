/**
 * Parser for columns block variant
 * Extracts two-column layouts (text + image)
 */
export default function parse(element, { document }) {
  // Find content column (usually left side with text)
  const contentCol = element.querySelector('.story-tile-content, .col-text, [class*="content"]');

  // Find image column (usually right side)
  const imageCol = element.querySelector('.story-tile-image, .col-image, [class*="image"]');
  const img = imageCol ? imageCol.querySelector('img') : element.querySelector('img');

  // Extract heading
  const heading = contentCol ? contentCol.querySelector('h2, h3, .title') : element.querySelector('h2, h3');
  const headingText = heading ? heading.textContent.trim() : '';

  // Extract description/body
  const desc = contentCol ? contentCol.querySelector('p, .desc, .body') : element.querySelector('p');
  const descText = desc ? desc.textContent.trim() : '';

  // Extract CTA
  const cta = contentCol ? contentCol.querySelector('a.btn, a.cta, a[class*="button"]') : element.querySelector('a.btn, a.cta');

  // Build left column content
  const leftContent = document.createElement('div');

  if (headingText) {
    const strong = document.createElement('strong');
    strong.textContent = headingText;
    leftContent.appendChild(strong);
    leftContent.appendChild(document.createElement('br'));
  }

  if (descText) {
    leftContent.appendChild(document.createTextNode(descText + ' '));
  }

  if (cta) {
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    const strong = document.createElement('strong');
    strong.appendChild(link);
    leftContent.appendChild(strong);
  }

  // Build right column (image)
  const rightContent = img ? img.cloneNode(true) : '';

  const cells = [
    [leftContent, rightContent]
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns',
    cells
  });

  element.replaceWith(block);
}
