/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slick-track inside the carousel
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  // Each card is a direct child slick-slide > div > .card iNavSearchResult
  const slides = Array.from(slickTrack.children);
  const rows = [['Cards (cards10)']];

  slides.forEach((slide) => {
    // Defensive: Account for slide wrapper
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;

    // Image cell: use the first .iNavSearchResult__image-frame > img
    let imageEl = null;
    const imageFrame = card.querySelector('.iNavSearchResult__image-frame img');
    if (imageFrame) imageEl = imageFrame;

    // Text cell: extract heading, description, and meta info
    // Use the .iNavSearchResult__content-wrapper as base
    const wrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    let textCellContent = document.createElement('div');
    if (wrapper) {
      // Get the inner <a> (which contains the content)
      const contentA = wrapper.querySelector('a');
      const parent = contentA || wrapper;

      // Meta line (category, image/video count)
      const meta = parent.querySelector('.iNavSearchResult__meta');
      if (meta) textCellContent.appendChild(meta);
      // Heading (h2 inside .iNavSearchResult__heading)
      const heading = parent.querySelector('.iNavSearchResult__heading');
      if (heading) textCellContent.appendChild(heading);
      // Subheading/description
      const subheading = parent.querySelector('.iNavSearchResult__sub-heading');
      if (subheading) textCellContent.appendChild(subheading);
      // Author and date row
      const cardRow = parent.querySelector('.iNavSearchResult__card-row');
      if (cardRow) textCellContent.appendChild(cardRow);
    }
    rows.push([imageEl, textCellContent]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
