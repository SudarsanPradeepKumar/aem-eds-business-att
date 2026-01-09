/**
 * Parser for hero-dark block variant
 * Extracts hero content with background image from AT&T Business pages
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('img, picture img, [style*="background-image"]');
  const imageCell = bgImage ? bgImage.cloneNode(true) : '';

  // Extract eyebrow text
  const eyebrow = element.querySelector('.eyebrow, .hero-eyebrow, [class*="eyebrow"]');
  const eyebrowText = eyebrow ? eyebrow.textContent.trim() : '';

  // Extract heading
  const heading = element.querySelector('h1, h2, .hero-title, [class*="title"]');
  const headingText = heading ? heading.textContent.trim() : '';

  // Extract description/body content
  const description = element.querySelector('.hero-desc, .hero-body, p:not(.eyebrow)');
  const descText = description ? description.textContent.trim() : '';

  // Extract list items (bullet points)
  const listItems = element.querySelectorAll('ul li, .hero-list li');
  const listContent = Array.from(listItems).map(li => `- ${li.textContent.trim()}`).join('\n');

  // Extract CTAs
  const ctas = element.querySelectorAll('a.btn, a.cta, a[class*="button"], .hero-cta a');
  const ctaElements = Array.from(ctas).map(cta => {
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    return link;
  });

  // Build cells array for hero block
  const cells = [
    [imageCell],
    [eyebrowText],
    [headingText],
    [descText],
  ];

  // Add list content if present
  if (listContent) {
    cells.push([listContent]);
  }

  // Add CTAs
  if (ctaElements.length > 0) {
    const ctaContainer = document.createElement('p');
    ctaElements.forEach((cta, idx) => {
      if (idx === 0) {
        const strong = document.createElement('strong');
        strong.appendChild(cta);
        ctaContainer.appendChild(strong);
      } else {
        ctaContainer.appendChild(document.createTextNode(' '));
        ctaContainer.appendChild(cta);
      }
    });
    cells.push([ctaContainer]);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero (dark)',
    cells
  });

  element.replaceWith(block);
}
