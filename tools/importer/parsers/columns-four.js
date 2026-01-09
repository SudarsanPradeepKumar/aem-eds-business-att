/**
 * Parser for columns-four block variant
 * Extracts four-column link sections (link farms)
 */
export default function parse(element, { document }) {
  // Find all columns
  const columns = element.querySelectorAll('.link-column, .col, [class*="column"]');

  // If no explicit columns, try to find link groups
  const linkGroups = columns.length > 0 ? columns : [element];

  // Organize links into 4 columns
  const allLinks = element.querySelectorAll('a');
  const linksPerColumn = Math.ceil(allLinks.length / 4);

  const columnCells = [[], [], [], []];

  if (columns.length >= 4) {
    // Use existing column structure
    columns.forEach((col, idx) => {
      if (idx < 4) {
        const links = col.querySelectorAll('a');
        links.forEach(link => {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.textContent.trim();
          columnCells[idx].push(a);
        });
      }
    });
  } else {
    // Distribute links across 4 columns
    allLinks.forEach((link, idx) => {
      const colIdx = Math.floor(idx / linksPerColumn);
      if (colIdx < 4) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent.trim();
        columnCells[colIdx].push(a);
      }
    });
  }

  // Build cells - each row has content from all 4 columns
  const maxRows = Math.max(...columnCells.map(col => col.length));
  const cells = [];

  for (let row = 0; row < maxRows; row++) {
    const rowCells = columnCells.map(col => {
      if (col[row]) {
        const p = document.createElement('p');
        p.appendChild(col[row]);
        return p;
      }
      return '';
    });
    cells.push(rowCells);
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns (four)',
    cells
  });

  element.replaceWith(block);
}
