/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) - Header row
  const cells = [['Cards (cards11)']];

  // Find all non-cloned .slick-slide elements representing cards
  const slides = element.querySelectorAll('.slick-slide');
  slides.forEach((slide) => {
    if (slide.classList.contains('slick-cloned')) return;
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // --- IMAGE CELL ---
    // Get the first image inside image-frame
    const img = card.querySelector('.iNavSearchResult__image-frame img');

    // --- TEXT CELL ---
    // We'll extract: title (h2), subtitle (span), rating (if present), author+date (if present)
    const textCell = document.createElement('div');

    // Title
    const heading = card.querySelector('.iNavSearchResult__heading h2');
    if (heading && heading.textContent.trim()) {
      // Use <div><strong>TITLE</strong></div> to preserve heading semantics visually
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      textCell.appendChild(strong);
      textCell.appendChild(document.createElement('br'));
    }

    // Subtitle/Description
    const subheading = card.querySelector('.iNavSearchResult__sub-heading');
    if (subheading && subheading.textContent.trim()) {
      const desc = document.createElement('span');
      desc.textContent = subheading.textContent.trim();
      textCell.appendChild(desc);
      textCell.appendChild(document.createElement('br'));
    }

    // Owner Review Type
    const metaType = card.querySelector('.iNavSearchResult__type');
    if (metaType && metaType.textContent.trim()) {
      const meta = document.createElement('span');
      meta.textContent = metaType.textContent.trim();
      textCell.appendChild(meta);
      textCell.appendChild(document.createElement('br'));
    }

    // Rating
    const rating = card.querySelector('.owner-review-rating-text');
    if (rating && rating.textContent.trim()) {
      const ratingElem = document.createElement('span');
      ratingElem.textContent = rating.textContent.trim();
      textCell.appendChild(ratingElem);
      textCell.appendChild(document.createElement('br'));
    }

    // Author and Date
    const authorRow = card.querySelector('.iNavSearchResult__card-row');
    if (authorRow) {
      // Gather all text except images
      const authorFragments = Array.from(authorRow.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'IMG'))
        .map(n => n.textContent.replace(/\u00a0/g, ' ').trim())
        .filter(Boolean);
      if (authorFragments.length) {
        const line = document.createElement('span');
        line.textContent = authorFragments.join(' ');
        textCell.appendChild(line);
      }
    }

    // Remove trailing <br> if present
    while (
      textCell.lastChild &&
      textCell.lastChild.nodeName === 'BR'
    ) {
      textCell.removeChild(textCell.lastChild);
    }

    // Fallback: If textCell has no content, use all card-body text
    if (!textCell.textContent.trim()) {
      const cardBody = card.querySelector('.iNavSearchResult__content-wrapper');
      if (cardBody && cardBody.textContent.trim()) {
        textCell.textContent = cardBody.textContent.trim();
      }
    }

    // Add one row per card: [image, text]
    cells.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
