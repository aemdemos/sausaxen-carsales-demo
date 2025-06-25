/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slick slides with cards
  const slides = Array.from(element.querySelectorAll('.slick-slide'));
  const cells = [];
  // Header row matches example
  cells.push(['Cards (cards8)']);
  slides.forEach(slide => {
    // Defensive: get the card in this slide
    const card = slide.querySelector('.iNavSearchResult');
    if (!card) return;
    // --- IMAGE ---
    let imageEl = null;
    // Find the first image in the card
    const image = card.querySelector('.iNavSearchResult__image-frame img, .iNavSearchResult__image');
    if (image) {
      imageEl = image;
    }
    // Fallback: if no image, use an empty div
    if (!imageEl) {
      imageEl = document.createElement('div');
    }
    // --- TEXT CELL ---
    const textFragments = [];
    // Title (as <strong> to match visual emphasis)
    const titleH2 = card.querySelector('.iNavSearchResult__heading h2');
    if (titleH2) {
      const strong = document.createElement('strong');
      strong.textContent = titleH2.textContent.trim();
      textFragments.push(strong);
    }
    // Description (sub-heading)
    const descSpan = card.querySelector('.iNavSearchResult__sub-heading span');
    if (descSpan && descSpan.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descSpan.textContent.trim();
      textFragments.push(p);
    }
    // Author and date
    const metaRow = card.querySelector('.iNavSearchResult__card-row');
    if (metaRow) {
      // Author Name
      const authorName = metaRow.querySelector('.iNavSearchResult__authorname');
      let authorTxt = '';
      if (authorName && authorName.textContent.trim()) {
        authorTxt = authorName.textContent.replace(/\s*-\s*$/, '').trim();
      }
      // Date
      const dateEl = metaRow.querySelector('.iNavSearchResult__date');
      let dateTxt = '';
      if (dateEl && dateEl.textContent.trim()) {
        dateTxt = dateEl.textContent.trim();
      }
      if (authorTxt || dateTxt) {
        const metaSpan = document.createElement('span');
        metaSpan.textContent = (authorTxt ? authorTxt : '') + (dateTxt ? ' - ' + dateTxt : '');
        textFragments.push(metaSpan);
      }
    }
    cells.push([
      imageEl,
      textFragments
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
