/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .container and .row in the section
  const container = element.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.children).filter(col => col.classList.contains('col'));
  if (cols.length === 0) return;

  // For each column, group into logical blocks: Each block is a label (heading) and its associated list, or just a label, or just a list
  // This will allow us to distribute content per logical block, not per full column
  const columnBlocks = cols.map(col => {
    const blocks = [];
    let currentLabel = null;
    let currentList = null;
    // For the dom structure, we're interested in direct children: usually span.heading and ul
    Array.from(col.children).forEach(child => {
      // Identify label (usually span with .footer-text.bold)
      if (child.matches('.footer-text.bold')) {
        if (currentLabel || currentList) {
          // Push previous block if any
          if (currentLabel && currentList) {
            blocks.push([currentLabel, currentList]);
          } else if (currentLabel) {
            blocks.push([currentLabel]);
          } else if (currentList) {
            blocks.push([currentList]);
          }
        }
        currentLabel = child;
        currentList = null;
      } else if (child.matches('ul,ol')) {
        // If we have a label, associate the list to it
        if (currentLabel) {
          currentList = child;
        } else {
          // List without label
          if (currentList) {
            blocks.push([currentList]);
          }
          currentList = child;
        }
      } else {
        // Any other element (maybe a note or trademark info)
        if (currentLabel || currentList) {
          // Push previous block
          if (currentLabel && currentList) {
            blocks.push([currentLabel, currentList]);
          } else if (currentLabel) {
            blocks.push([currentLabel]);
          } else if (currentList) {
            blocks.push([currentList]);
          }
          currentLabel = null;
          currentList = null;
        }
        blocks.push([child]);
      }
    });
    // Push any remaining block
    if (currentLabel && currentList) {
      blocks.push([currentLabel, currentList]);
    } else if (currentLabel) {
      blocks.push([currentLabel]);
    } else if (currentList) {
      blocks.push([currentList]);
    }
    return blocks;
  });

  // Find the max number of blocks in any column
  const maxRows = Math.max(...columnBlocks.map(blocks => blocks.length));

  // Build rows: N header, then maxRows rows, each row is cells for that block in each column
  const tableRows = [];
  for (let i = 0; i < maxRows; i++) {
    const row = columnBlocks.map(blocks => {
      if (blocks[i]) {
        // If the block array is of length 1, use the element directly
        if (blocks[i].length === 1) return blocks[i][0];
        // Otherwise, use all elements in the block
        return blocks[i];
      }
      return '';
    });
    tableRows.push(row);
  }

  const tableArr = [
    ['Columns'],
    ...tableRows
  ];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
