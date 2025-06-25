/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const cells = [
    ['Cards (cards12)']
  ];

  // Get all slides (cards)
  const slides = element.querySelectorAll('.slick-slide');
  slides.forEach(slide => {
    // Each card is inside .card.iNavSearchResult
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // ------- IMAGE CELL -------
    let imageElem = null;
    const imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    if (imgFrame) {
      imageElem = imgFrame.querySelector('img');
    }

    // ------- TEXT CELL -------
    const textCellContent = [];
    
    // Type (ADVICE, FEATURE, etc)
    const metaType = card.querySelector('.iNavSearchResult__type');
    if (metaType && metaType.textContent.trim()) {
      const typeDiv = document.createElement('div');
      typeDiv.textContent = metaType.textContent.trim();
      typeDiv.style.fontSize = '12px';
      typeDiv.style.fontWeight = 'bold';
      typeDiv.style.textTransform = 'uppercase';
      textCellContent.push(typeDiv);
    }

    // Title (h2)
    const heading = card.querySelector('.iNavSearchResult__heading h2');
    if (heading && heading.textContent.trim()) {
      // Use the existing h2 element for semantic meaning
      textCellContent.push(heading);
    }

    // Description/subheading
    const subheading = card.querySelector('.iNavSearchResult__sub-heading');
    if (subheading && subheading.textContent.trim()) {
      // Use the existing span/div for semantic meaning
      textCellContent.push(subheading);
    }

    // Sponsor row (brand and logo)
    const sponsorRow = card.querySelector('.iNavSearchResult__card-row');
    if (sponsorRow) {
      const sponsorElem = sponsorRow.querySelector('.iNavSearchResult__sponsor');
      if (sponsorElem) {
        // Reference the existing sponsor element
        // Remove trailing separator if present
        if (sponsorElem.lastChild && sponsorElem.lastChild.nodeType === 3 && /[-–]\s*$/.test(sponsorElem.lastChild.textContent)) {
          sponsorElem.lastChild.textContent = sponsorElem.lastChild.textContent.replace(/[-–]\s*$/, '');
        }
        textCellContent.push(sponsorElem);
      }
      // Date
      const dateElem = sponsorRow.querySelector('.iNavSearchResult__date');
      if (dateElem && dateElem.textContent.trim()) {
        textCellContent.push(dateElem);
      }
    }

    // --------- ASSEMBLE ROW ---------
    cells.push([
      imageElem,
      textCellContent
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
