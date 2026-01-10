export default function decorate(block) {
  // Find the picture element for background
  const picture = block.querySelector('picture');

  if (picture) {
    // Move picture to be direct child of block for CSS background handling
    const pictureParent = picture.parentElement;
    if (pictureParent && pictureParent !== block) {
      block.prepend(picture);
      // Remove empty parent divs
      if (pictureParent.children.length === 0) {
        pictureParent.remove();
      }
    }
  }

  // Wrap remaining content in a content div if not already wrapped
  const contentElements = [...block.children].filter((child) => child.tagName !== 'PICTURE');
  if (contentElements.length > 0) {
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'hero-content';
    contentElements.forEach((el) => contentWrapper.append(el));
    block.append(contentWrapper);
  }

  // Handle badge/eyebrow text (em elements at the start)
  block.querySelectorAll('.hero-content > div > div > em').forEach((em) => {
    const wrapper = em.closest('div');
    if (wrapper) {
      wrapper.classList.add('hero-badge');
    }
  });

  // Handle disclaimer text (small elements)
  block.querySelectorAll('.hero-content small').forEach((small) => {
    const wrapper = small.closest('div');
    if (wrapper) {
      wrapper.classList.add('hero-disclaimer');
    }
  });

  // Add button class to links that look like buttons (strong > a)
  block.querySelectorAll('strong > a').forEach((link) => {
    link.classList.add('button');
    link.closest('strong').replaceWith(link);
  });

  // Handle button containers with multiple links
  block.querySelectorAll('.hero-content > div > div').forEach((div) => {
    const links = div.querySelectorAll('a');
    if (links.length >= 1 && !div.classList.contains('hero-badge') && !div.classList.contains('hero-disclaimer')) {
      // Check if div contains only links (directly or inside a single P tag)
      const hasOnlyLinks = [...div.childNodes].every((node) =>
        node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '' ||
        node.tagName === 'A'
      );

      // Also check for links inside a P tag (common pattern)
      const hasPWithOnlyLinks = div.children.length === 1 &&
        div.children[0].tagName === 'P' &&
        [...div.children[0].childNodes].every((node) =>
          node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '' ||
          node.tagName === 'A'
        );

      if ((hasOnlyLinks || hasPWithOnlyLinks) && links.length > 0) {
        div.classList.add('button-container');
        links.forEach((link, index) => {
          link.classList.add('button');
          // First button is secondary (outline), second is primary (solid dark)
          if (index === 0) {
            link.classList.add('secondary');
          } else {
            link.classList.add('primary');
          }
        });
      }
    }
  });

  // Also handle direct links that should be buttons (secondary) - fallback
  block.querySelectorAll('p > a:only-child').forEach((link) => {
    if (!link.classList.contains('button')) {
      link.classList.add('button', 'secondary');
    }
  });
}
