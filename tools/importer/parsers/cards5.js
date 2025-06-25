/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Cards (cards5)'];
  // Find the .slick-track container that holds all slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  // Get all .slick-slide children (cards)
  const slideDivs = Array.from(slickTrack.children).filter(div => div.classList.contains('slick-slide'));
  const rows = [headerRow];

  slideDivs.forEach(slide => {
    // Card root - always div > div.card
    let card;
    if (slide.firstElementChild && slide.firstElementChild.classList.contains('card')) {
      card = slide.firstElementChild;
    } else if (
      slide.firstElementChild &&
      slide.firstElementChild.firstElementChild &&
      slide.firstElementChild.firstElementChild.classList.contains('card')
    ) {
      card = slide.firstElementChild.firstElementChild;
    } else {
      return;
    }
    // First cell: image (mandatory)
    let imgFrame = card.querySelector('.iNavSearchResult__image-frame');
    let img = imgFrame ? imgFrame.querySelector('img') : null;
    if (!img) return;

    // Second cell: text content
    // We'll grab the content-wrapper, but reference the actual child elements
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    let textContent = document.createElement('div');
    if (contentWrapper) {
      // There is an <a> inside contentWrapper which holds all main visible text
      let innerLink = contentWrapper.querySelector('a');
      let fragments = [];
      if (innerLink) {
        // Find meta (type), heading, subheading, author/date row
        let meta = innerLink.querySelector('.iNavSearchResult__meta');
        if (meta) {
          // Remove image/video counts for cleanliness
          const metaCopy = meta.cloneNode(true);
          const toRemove = metaCopy.querySelectorAll('.iNavSearchResult__meta-image-count, .iNavSearchResult__meta-video-count');
          toRemove.forEach(el => el.remove());
          if (metaCopy.childNodes.length) fragments.push(metaCopy);
        }
        let heading = innerLink.querySelector('.iNavSearchResult__heading');
        if (heading) fragments.push(heading);
        let subheading = innerLink.querySelector('.iNavSearchResult__sub-heading');
        if (subheading) fragments.push(subheading);
        let authorRow = innerLink.querySelector('.iNavSearchResult__card-row');
        if (authorRow) fragments.push(authorRow);
      }
      // Append all valid fragments in order
      fragments.forEach(frag => {
        // reference, don't clone (except meta, already cloned for cleanup)
        if (frag instanceof Node && frag.parentNode !== textContent) {
          textContent.appendChild(frag);
        }
      });
    }
    // Only push if both image and text
    if (img && textContent.childNodes.length) {
      rows.push([img, textContent]);
    }
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
