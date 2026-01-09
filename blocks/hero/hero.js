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

  // Add button class to links that look like buttons (strong > a)
  block.querySelectorAll('strong > a').forEach((link) => {
    link.classList.add('button');
    link.closest('strong').replaceWith(link);
  });

  // Also handle direct links that should be buttons (secondary)
  block.querySelectorAll('p > a:only-child').forEach((link) => {
    if (!link.classList.contains('button')) {
      link.classList.add('button', 'secondary');
    }
  });
}
