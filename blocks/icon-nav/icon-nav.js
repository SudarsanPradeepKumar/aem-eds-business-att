/**
 * Icon Navigation Block
 * Horizontal bar with icons and text labels (like AT&T's quick links)
 */

// Map link text to icon names
const iconMap = {
  'phones & devices': 'phones',
  'phone plans': 'plans',
  'internet': 'internet',
  'voice': 'voice',
  'bundles': 'bundles',
  'deals': 'deals',
};

async function loadIcon(iconName) {
  try {
    const resp = await fetch(`/icons/${iconName}.svg`);
    if (resp.ok) {
      const svg = await resp.text();
      return svg;
    }
  } catch (e) {
    // Icon not found
  }
  return null;
}

export default async function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')];

  // Create nav container
  const nav = document.createElement('nav');
  nav.className = 'icon-nav-container';
  nav.setAttribute('aria-label', 'Quick links');

  const promises = items.map(async (item) => {
    const link = item.querySelector('a');
    const text = link ? link.textContent.trim() : item.textContent.trim();
    const href = link ? link.href : '#';

    const navItem = document.createElement('a');
    navItem.href = href;
    navItem.className = 'icon-nav-item';

    // Get icon name from map based on link text
    const iconName = iconMap[text.toLowerCase()] || text.toLowerCase().replace(/\s+/g, '-');
    const iconSvg = await loadIcon(iconName);

    if (iconSvg) {
      const iconWrapper = document.createElement('div');
      iconWrapper.className = 'icon-nav-icon';
      iconWrapper.innerHTML = iconSvg;
      navItem.appendChild(iconWrapper);
    }

    const label = document.createElement('span');
    label.className = 'icon-nav-label';
    label.textContent = text;
    navItem.appendChild(label);

    return navItem;
  });

  const navItems = await Promise.all(promises);
  navItems.forEach((navItem) => nav.appendChild(navItem));

  block.textContent = '';
  block.appendChild(nav);
}
