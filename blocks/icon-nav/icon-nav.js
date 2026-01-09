/**
 * Icon Navigation Block
 * Horizontal bar with icons and text labels (like AT&T's quick links)
 */
export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')];

  // Create nav container
  const nav = document.createElement('nav');
  nav.className = 'icon-nav-container';
  nav.setAttribute('aria-label', 'Quick links');

  items.forEach((item) => {
    const link = item.querySelector('a');
    const img = item.querySelector('img');
    const text = link ? link.textContent : item.textContent.trim();
    const href = link ? link.href : '#';

    const navItem = document.createElement('a');
    navItem.href = href;
    navItem.className = 'icon-nav-item';

    if (img) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'icon-nav-icon';
      iconWrapper.appendChild(img.cloneNode(true));
      navItem.appendChild(iconWrapper);
    }

    const label = document.createElement('span');
    label.className = 'icon-nav-label';
    label.textContent = text;
    navItem.appendChild(label);

    nav.appendChild(navItem);
  });

  block.textContent = '';
  block.appendChild(nav);
}
