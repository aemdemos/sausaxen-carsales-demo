/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Cards (cards6)'];

  // Find all visible slides (cards)
  const slides = Array.from(element.querySelectorAll('.slick-slide'))
    .filter(slide => slide.getAttribute('aria-hidden') === 'false');

  const rows = slides.map(slide => {
    // Card root
    const card = slide.querySelector('.card') || slide;

    // 1. IMAGE CELL
    let image = null;
    const imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    if (imgFrame && imgFrame.querySelector('img')) {
      image = imgFrame.querySelector('img');
    } else if (card.querySelector('img')) {
      image = card.querySelector('img');
    } else {
      image = '';
    }

    // 2. TEXT CELL
    // Collects all text content in semantic order: title, description, byline/sponsor/date
    const content = card.querySelector('.iNavSearchResult__content-wrapper') || card;
    const cellFragments = [];

    // Title (strong for semantic emphasis)
    const heading = content.querySelector('.iNavSearchResult__heading h2, .iNavSearchResult__heading, .card-title h2, .card-title');
    if (heading && heading.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      cellFragments.push(strong);
    }

    // Description
    const sub = content.querySelector('.iNavSearchResult__sub-heading span, .iNavSearchResult__sub-heading, .card-subtitle span, .card-subtitle');
    if (sub && sub.textContent.trim()) {
      if (cellFragments.length) cellFragments.push(document.createElement('br'));
      cellFragments.push(document.createTextNode(sub.textContent.trim()));
    }

    // Card Row: author, date, sponsor
    const cardRow = content.querySelector('.iNavSearchResult__card-row');
    if (cardRow) {
      // Reference the original node but remove any author image for a clean byline
      const clone = cardRow.cloneNode(true);
      const img = clone.querySelector('.iNavSearchResult__authorimage');
      if (img) img.remove();
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      if (text) {
        if (cellFragments.length) cellFragments.push(document.createElement('br'));
        cellFragments.push(document.createTextNode(text));
      }
    }
    const sponsorRow = content.querySelector('.iNavSearchResult__sponsor');
    if (sponsorRow) {
      const clone = sponsorRow.cloneNode(true);
      const img = clone.querySelector('img');
      if (img) img.remove();
      const text = clone.textContent.replace(/\s+/g, ' ').trim();
      if (text) {
        if (cellFragments.length) cellFragments.push(document.createElement('br'));
        cellFragments.push(document.createTextNode(text));
      }
    }

    // If no text at all, fallback: whole text content
    if (!cellFragments.length) {
      const fallbackText = content.textContent.replace(/\s+/g, ' ').trim();
      if (fallbackText) cellFragments.push(document.createTextNode(fallbackText));
    }

    return [image, cellFragments];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
