/* global WebImporter */
export default function parse(element, { document }) {
  // Get all slick slides that represent a card
  const slides = Array.from(element.querySelectorAll('[class*="slick-slide"]'))
    .filter(slide => slide.querySelector('.card.iNavSearchResult'));

  const rows = [['Cards (cards7)']];

  slides.forEach(slide => {
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return; // Defensive: skip if missing

    // Get the image element (reference, not clone)
    let imageEl = null;
    const imageFrame = card.querySelector('.iNavSearchResult__image-frame img');
    if (imageFrame) imageEl = imageFrame;

    // Get the content wrapper
    let textCellParts = [];
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    if (contentWrapper) {
      // Find the anchor inside content wrapper (should wrap content)
      const link = contentWrapper.querySelector('a');
      let title = '';
      let desc = '';
      let linkHref = '';
      if (link) {
        // Title
        const h2 = link.querySelector('.iNavSearchResult__heading h2');
        if (h2 && h2.textContent.trim()) {
          title = h2.textContent.trim();
        }
        // Description
        const span = link.querySelector('.iNavSearchResult__sub-heading span');
        if (span && span.textContent.trim()) {
          desc = span.textContent.trim();
        }
        // Card link
        if (link.href) {
          linkHref = link.getAttribute('href');
        }
      }
      // Add title (strong for semantics)
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title;
        textCellParts.push(strong);
      }
      // Add description
      if (desc) {
        if (title) textCellParts.push(document.createElement('br'));
        const descSpan = document.createElement('span');
        descSpan.textContent = desc;
        textCellParts.push(descSpan);
      }
      // Add CTA if link exists and title exists
      // (Optional: In this design, usually CTA is not a separate label, so we do NOT duplicate link)
    }
    // Defensive: if content wrapper missing, show nothing
    rows.push([
      imageEl,
      textCellParts.length ? textCellParts : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
