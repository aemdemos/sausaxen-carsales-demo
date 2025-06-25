/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards2)'];

  // Get all cards in the carousel
  const cards = Array.from(element.querySelectorAll('.card.iNavSearchResult'));

  // Helper to build the text content cell for each card
  function buildTextCell(card) {
    const frag = document.createDocumentFragment();

    // --- TYPE (e.g. REVIEW/NEWS) ---
    const type = card.querySelector('.iNavSearchResult__type');
    if (type && type.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = type.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }

    // --- HEADING ---
    const heading = card.querySelector('.iNavSearchResult__heading h2');
    if (heading && heading.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }

    // --- DESCRIPTION ---
    const desc = card.querySelector('.iNavSearchResult__sub-heading span');
    if (desc && desc.textContent.trim()) {
      const descSpan = document.createElement('span');
      descSpan.textContent = desc.textContent.trim();
      frag.appendChild(descSpan);
      frag.appendChild(document.createElement('br'));
    }

    // --- RATING (if present) ---
    const rating = card.querySelector('editors-rating');
    if (rating) {
      // If there is a child .rating-text__value and .rating-text__maxValue
      const ratingValue = rating.querySelector('.rating-text__value');
      const ratingMax = rating.querySelector('.rating-text__maxValue');
      if (ratingValue && ratingMax) {
        const ratingSpan = document.createElement('span');
        ratingSpan.textContent = `Rating: ${ratingValue.textContent.trim()}${ratingMax.textContent.trim()}`;
        frag.appendChild(ratingSpan);
        frag.appendChild(document.createElement('br'));
      }
    }

    // --- AUTHOR ---
    const cardRow = card.querySelector('.iNavSearchResult__card-row');
    if (cardRow) {
      const authorName = cardRow.querySelector('.iNavSearchResult__authorname');
      const date = cardRow.querySelector('.iNavSearchResult__date');
      // Only if there's actual content
      if ((authorName && authorName.textContent.trim()) || (date && date.textContent.trim())) {
        const byline = document.createElement('div');
        if (authorName && authorName.textContent.trim()) {
          byline.textContent = authorName.textContent.replace(/\s*-\s*$/, '').trim();
        }
        if (date && date.textContent.trim()) {
          if (byline.textContent.length > 0) byline.textContent += ' - ';
          byline.textContent += date.textContent.trim();
        }
        frag.appendChild(byline);
      }
    }

    // Remove trailing <br> if present
    if (frag.lastChild && frag.lastChild.tagName === 'BR') {
      frag.removeChild(frag.lastChild);
    }
    return frag;
  }

  // Helper to get the main card image (do not clone, reference directly)
  function getCardImg(card) {
    // Prefer the first .iNavSearchResult__image inside a .iNavSearchResult__image-frame
    const img = card.querySelector('.iNavSearchResult__image-frame img, .iNavSearchResult__image');
    return img || '';
  }

  // Compose each card row: [image, content]
  const cardRows = cards.map(card => {
    const img = getCardImg(card);
    const text = buildTextCell(card);
    return [img, text];
  });

  // Compose full table data
  const tableData = [headerRow, ...cardRows];

  // Create the block
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
