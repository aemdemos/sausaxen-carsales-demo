/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Embed'];

  // Gather all visible text (e.g. copyright) from across the block
  function getAllTextNodes(el) {
    let nodes = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        nodes.push(document.createTextNode(node.textContent.trim()));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        nodes = nodes.concat(getAllTextNodes(node));
      }
    });
    return nodes;
  }
  // Get all text (e.g. "© carsales.com.au Pty Ltd 1999-2025")
  const textNodes = getAllTextNodes(element);

  // Get all links (social icons) in DOM order
  const links = Array.from(element.querySelectorAll('a[href]'));

  // Combine text and links, preserving order and semantic grouping
  const cellContent = [];
  if (textNodes.length) {
    // Add all text nodes, separated by a space if needed
    for (let i = 0; i < textNodes.length; i++) {
      if (i > 0) cellContent.push(document.createTextNode(' '));
      cellContent.push(textNodes[i]);
    }
  }
  if (links.length) {
    // Add space if both text and links
    if (cellContent.length) cellContent.push(document.createTextNode(' '));
    // Add all links, separated by a space if needed
    links.forEach((a, i) => {
      if (i > 0) cellContent.push(document.createTextNode(' '));
      cellContent.push(a);
    });
  }

  if (cellContent.length === 0) {
    cellContent.push('');
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent],
  ], document);
  element.replaceWith(table);
}
