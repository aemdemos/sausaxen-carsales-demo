/* global WebImporter */
export default function parse(element, { document }) {
  // Get all visible card elements in the carousel
  const cards = Array.from(element.querySelectorAll('.card.iNavSearchResult'));
  const rows = [['Cards (cards4)']]; // Header row
  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Try to find the first <img> in .iNavSearchResult__image-frame
    let image = null;
    const imageFrame = card.querySelector('.iNavSearchResult__image-frame');
    if (imageFrame) {
      image = imageFrame.querySelector('img');
    } else {
      image = card.querySelector('img');
    }
    // --- TEXT CELL ---
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper') || card;
    const textContent = [];
    // Title (Heading)
    let heading = contentWrapper.querySelector('.iNavSearchResult__heading h2,.iNavSearchResult__heading,.card-title h2,.card-title');
    if (heading) heading = heading.tagName.toLowerCase().startsWith('h') ? heading : heading.querySelector('h2, h3, h1') || heading;
    if (heading && heading.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      textContent.push(strong);
    }
    // Description
    let desc = contentWrapper.querySelector('.iNavSearchResult__sub-heading span, .iNavSearchResult__sub-heading, .card-subtitle span, .card-subtitle');
    if (desc && desc.textContent.trim()) {
      if (textContent.length > 0) textContent.push(document.createElement('br'));
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textContent.push(p);
    }
    // Author and Date (if present)
    const cardRow = contentWrapper.querySelector('.iNavSearchResult__card-row');
    if (cardRow) {
      let author = cardRow.querySelector('.iNavSearchResult__authorname');
      let date = cardRow.querySelector('.iNavSearchResult__date');
      author = author && author.textContent.replace(/\s*-\s*$/, '').trim();
      date = date && date.textContent.trim();
      if ((author && author.length > 0) || (date && date.length > 0)) {
        const p = document.createElement('p');
        p.textContent = (author ? author : '') + (author && date ? ' · ' : '') + (date ? date : '');
        textContent.push(p);
      }
    }
    // Fallback: if textContent is empty, use all text in contentWrapper
    if (textContent.length === 0) {
      const fallback = contentWrapper.innerText.trim();
      if (fallback) {
        const p = document.createElement('p');
        p.textContent = fallback;
        textContent.push(p);
      }
    }
    // Only add row if both image and textContent present
    if (image && textContent.length > 0) {
      rows.push([
        image,
        textContent.length === 1 ? textContent[0] : textContent
      ]);
    }
  });
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
