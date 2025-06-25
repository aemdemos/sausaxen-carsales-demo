/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards3)'];
  // Locate .slick-track in the carousel, which has all slides (cards)
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  // Each card is .slick-slide > div > .card.iNavSearchResult
  const slides = slickTrack.querySelectorAll('.slick-slide > div > .card.iNavSearchResult');
  const rows = Array.from(slides).map(card => {
    // IMAGE: first cell
    const img = card.querySelector('.iNavSearchResult__image-frame img');
    // TEXT: second cell
    // Use .iNavSearchResult__content-wrapper if present, otherwise the card
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper') || card;
    // Find the main link (contains all text)
    const mainA = contentWrapper.querySelector('a') || contentWrapper;
    const textParts = [];
    // 1. REVIEW TYPE (meta info)
    const meta = mainA.querySelector('.iNavSearchResult__meta');
    if (meta) {
      // REVIEW type, image/video count, and rating (all as text, space-separated)
      let metaStrings = [];
      const type = meta.querySelector('.iNavSearchResult__type');
      if (type) metaStrings.push(type.textContent.trim());
      const imgCount = meta.querySelector('.iNavSearchResult__meta-image-count');
      if (imgCount) metaStrings.push(imgCount.textContent.trim() + ' images');
      const vidCount = meta.querySelector('.iNavSearchResult__meta-video-count');
      if (vidCount) metaStrings.push(vidCount.textContent.trim() + ' videos');
      // Editors rating
      const ratingVal = meta.querySelector('.rating-text__value');
      const ratingMax = meta.querySelector('.rating-text__maxValue');
      if (ratingVal && ratingMax) {
        metaStrings.push(ratingVal.textContent.trim() + (ratingMax.textContent ? ratingMax.textContent.trim() : ''));
      }
      if (metaStrings.length > 0) {
        const metaDiv = document.createElement('div');
        metaDiv.textContent = metaStrings.join(' · ');
        textParts.push(metaDiv);
      }
    }
    // 2. HEADING (card title, always as heading element)
    const heading = mainA.querySelector('.iNavSearchResult__heading h2');
    if (heading) {
      textParts.push(heading);
    }
    // 3. DESCRIPTION (card subtitle)
    const desc = mainA.querySelector('.iNavSearchResult__sub-heading');
    if (desc && desc.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = desc.textContent.trim();
      textParts.push(descP);
    }
    // 4. AUTHOR/DATE
    const cardRow = mainA.querySelector('.iNavSearchResult__card-row');
    if (cardRow) {
      textParts.push(cardRow);
    }
    // Fallback: all text content if nothing present
    if (textParts.length === 0) {
      textParts.push(document.createTextNode(card.textContent.trim()));
    }
    return [img, textParts];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
