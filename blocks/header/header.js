import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Creates the top bar with Personal/Business toggle
 * @returns {Element} The top bar element
 */
function createTopBar() {
  const topBar = document.createElement('div');
  topBar.className = 'nav-top-bar';
  topBar.innerHTML = `
    <div class="nav-top-bar-content">
      <ul class="nav-customer-type">
        <li><a href="https://www.att.com/?customerType=personal">Personal</a></li>
        <li class="active"><a href="/">Business</a></li>
      </ul>
    </div>
  `;
  return topBar;
}

/**
 * Products mega-menu data with icons and sub-links
 */
const productsMegaMenuData = [
  {
    icon: '/icons/wireless.svg',
    title: 'Wireless',
    links: [
      { text: 'Plans & prices', url: 'https://www.business.att.com/products/wireless-plans.html' },
      { text: 'Phones & devices', url: 'https://www.att.com/buy/phones/?smb=true' },
      { text: 'Hotspots', url: 'https://www.att.com/buy/connected-devices-and-more/?smb=true' },
    ],
  },
  {
    icon: '/icons/internet.svg',
    title: 'Internet',
    links: [
      { text: 'Fiber internet', url: 'https://www.business.att.com/products/business-fiber-internet.html' },
      { text: 'Wireless internet', url: 'https://www.business.att.com/products/wireless-internet.html' },
      { text: 'Dedicated internet', url: 'https://www.business.att.com/products/att-dedicated-internet.html' },
    ],
  },
  {
    icon: '/icons/voice.svg',
    title: 'Voice & Collaboration',
    links: [
      { text: 'VOIP phone', url: 'https://www.business.att.com/products/att-phone-for-business.html' },
      { text: 'Office@Hand', url: 'https://www.business.att.com/products/office-at-hand.html' },
      { text: 'IP-Toll-Free service', url: 'https://www.business.att.com/products/ip-toll-free.html' },
    ],
  },
  {
    icon: '/icons/cybersecurity.svg',
    title: 'Cybersecurity',
    links: [
      { text: 'AT&T Dynamic Defense', url: 'https://www.business.att.com/products/att-dynamic-defense.html' },
      { text: 'Secure Access Service Edge', url: 'https://www.business.att.com/products/sase.html' },
    ],
  },
  {
    icon: '/icons/networking.svg',
    title: 'Networking Services',
    links: [
      { text: 'Ethernet', url: 'https://www.business.att.com/categories/ethernet-and-transport.html' },
      { text: 'SD-WAN', url: 'https://www.business.att.com/products/sd-wan.html' },
      { text: 'Edge solutions', url: 'https://www.business.att.com/categories/att-on-premise-edge.html' },
    ],
  },
  {
    icon: '/icons/iot.svg',
    title: 'Internet of Things',
    links: [
      { text: 'Vehicle solutions', url: 'https://www.business.att.com/categories/vehicle-solutions.html' },
      { text: 'Asset management', url: 'https://www.business.att.com/categories/asset-management.html' },
      { text: 'Management platforms', url: 'https://www.business.att.com/categories/iot-platforms.html' },
    ],
  },
];

/**
 * Builds a mega-menu from nested navigation structure or data
 * @param {Element} navItem The nav item with dropdown
 */
function buildMegaMenu(navItem) {
  const subList = navItem.querySelector(':scope > ul');
  if (!subList) return;

  // Check if this is the Products dropdown (first nav item or by text content)
  const navText = navItem.textContent?.trim().toLowerCase();
  const isProducts = navText?.startsWith('products');

  // Check if this dropdown has categories with icons (like Products)
  const hasCategories = subList.querySelector(':scope > li > picture, :scope > li > img');

  if (hasCategories) {
    // Build from existing HTML structure with icons
    const megaMenu = document.createElement('div');
    megaMenu.className = 'mega-menu';
    const categoriesGrid = document.createElement('div');
    categoriesGrid.className = 'mega-menu-categories';

    subList.querySelectorAll(':scope > li').forEach((categoryItem) => {
      const category = document.createElement('div');
      category.className = 'mega-menu-category';

      const icon = categoryItem.querySelector(':scope > picture, :scope > img');
      if (icon) {
        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'mega-menu-icon';
        iconWrapper.appendChild(icon.cloneNode(true));
        category.appendChild(iconWrapper);
      }

      const titleText = Array.from(categoryItem.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join('')
        .trim();

      if (titleText) {
        const title = document.createElement('span');
        title.className = 'mega-menu-category-title';
        title.textContent = titleText;
        category.appendChild(title);
      }

      const subLinks = categoryItem.querySelector(':scope > ul');
      if (subLinks) {
        const linksContainer = document.createElement('ul');
        linksContainer.className = 'mega-menu-links';
        subLinks.querySelectorAll(':scope > li').forEach((linkItem) => {
          const li = document.createElement('li');
          const link = linkItem.querySelector('a');
          if (link) li.appendChild(link.cloneNode(true));
          linksContainer.appendChild(li);
        });
        category.appendChild(linksContainer);
      }

      categoriesGrid.appendChild(category);
    });

    megaMenu.appendChild(categoriesGrid);
    subList.replaceWith(megaMenu);
    navItem.classList.add('has-mega-menu');
  } else if (isProducts) {
    // Build Products mega-menu from data (for CDN-served simplified nav)
    const megaMenu = document.createElement('div');
    megaMenu.className = 'mega-menu';
    const categoriesGrid = document.createElement('div');
    categoriesGrid.className = 'mega-menu-categories';

    productsMegaMenuData.forEach((categoryData) => {
      const category = document.createElement('div');
      category.className = 'mega-menu-category';

      // Icon
      const iconWrapper = document.createElement('span');
      iconWrapper.className = 'mega-menu-icon';
      const iconImg = document.createElement('img');
      iconImg.src = categoryData.icon;
      iconImg.alt = categoryData.title;
      iconImg.loading = 'lazy';
      iconWrapper.appendChild(iconImg);
      category.appendChild(iconWrapper);

      // Title
      const title = document.createElement('span');
      title.className = 'mega-menu-category-title';
      title.textContent = categoryData.title;
      category.appendChild(title);

      // Links
      const linksContainer = document.createElement('ul');
      linksContainer.className = 'mega-menu-links';
      categoryData.links.forEach((linkData) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = linkData.url;
        link.textContent = linkData.text;
        li.appendChild(link);
        linksContainer.appendChild(li);
      });
      category.appendChild(linksContainer);

      categoriesGrid.appendChild(category);
    });

    megaMenu.appendChild(categoriesGrid);
    subList.replaceWith(megaMenu);
    navItem.classList.add('has-mega-menu');
  }
}

/**
 * Creates the search box
 * @returns {Element} The search element
 */
function createSearchBox() {
  const search = document.createElement('div');
  search.className = 'nav-search';
  search.innerHTML = `
    <form class="nav-search-form" action="https://www.business.att.com/search" method="get">
      <input type="search" name="q" placeholder="Let's find what you need..." aria-label="Search">
      <button type="submit" aria-label="Search">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
      </button>
    </form>
  `;
  return search;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Check if we have proper 3-section structure or need to restructure
  if (nav.children.length >= 3) {
    // Standard structure: brand, sections, tools
    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });
  } else {
    // Single section structure - need to restructure
    const wrapper = nav.querySelector('.default-content-wrapper');
    if (wrapper) {
      // Remove H1 if present (Navigation title)
      const h1 = wrapper.querySelector('h1');
      if (h1) h1.remove();

      // Find logo/brand (picture or img in p tag)
      const brandP = wrapper.querySelector('p:has(picture), p:has(img)');
      if (brandP) {
        const brandSection = document.createElement('div');
        brandSection.className = 'section nav-brand';
        const brandWrapper = document.createElement('div');
        brandWrapper.className = 'default-content-wrapper';
        brandWrapper.appendChild(brandP.cloneNode(true));
        brandSection.appendChild(brandWrapper);
        brandP.remove();
        nav.insertBefore(brandSection, nav.firstChild);
      }

      // Find nav lists (Products, Industries, Resources)
      const navLists = wrapper.querySelectorAll(':scope > ul');
      if (navLists.length > 0) {
        const sectionsSection = document.createElement('div');
        sectionsSection.className = 'section nav-sections';
        const sectionsWrapper = document.createElement('div');
        sectionsWrapper.className = 'default-content-wrapper';

        // First list is the main nav, last might be tools
        const mainNav = navLists[0];
        sectionsWrapper.appendChild(mainNav.cloneNode(true));
        sectionsSection.appendChild(sectionsWrapper);
        nav.appendChild(sectionsSection);

        // Tools section (Sign In, etc.) - usually last ul
        if (navLists.length > 1) {
          const toolsSection = document.createElement('div');
          toolsSection.className = 'section nav-tools';
          const toolsWrapper = document.createElement('div');
          toolsWrapper.className = 'default-content-wrapper';
          toolsWrapper.appendChild(navLists[navLists.length - 1].cloneNode(true));
          toolsSection.appendChild(toolsWrapper);
          nav.appendChild(toolsSection);
        }

        // Remove original wrapper
        wrapper.parentElement?.remove();
      }
    }
  }

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        // Build mega-menu if this section has nested categories with icons
        buildMegaMenu(navSection);
      }
      navSection.addEventListener('click', () => {
        const expanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections);
        navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    });
  }

  // Create search box (centered in header)
  const searchBox = createSearchBox();

  // hamburger menu (on the right side like AT&T Business site)
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Menu">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // Remove tools section content (hide Sign In, etc.)
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.innerHTML = '';
  }

  // Restructure nav: Brand | Search | Hamburger
  // Insert search after brand
  if (navBrand && navBrand.nextSibling) {
    nav.insertBefore(searchBox, navBrand.nextSibling);
  } else {
    nav.appendChild(searchBox);
  }

  // Add hamburger at the end (right side)
  nav.appendChild(hamburger);

  nav.setAttribute('aria-expanded', 'false');
  // On mobile: use hamburger menu; on desktop: show nav sections
  if (!isDesktop.matches) {
    toggleMenu(nav, navSections, false);
  }
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      // Desktop: close mobile menu, CSS will show nav sections
      nav.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    } else {
      // Mobile: ensure menu is closed
      toggleMenu(nav, navSections, false);
    }
  });

  // Create nav wrapper
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  // Create top bar
  const topBar = createTopBar();

  // Create container with top bar and nav
  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-container';
  headerContainer.append(topBar);
  headerContainer.append(navWrapper);

  block.append(headerContainer);
}
