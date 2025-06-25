/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards9)'];
  const cells = [headerRow];
  // Find the slick-track, which contains all the slick-slide (card) elements
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  const slides = Array.from(slickTrack.children).filter(slide => slide.querySelector('.card.iNavSearchResult'));
  slides.forEach(slide => {
    const card = slide.querySelector('.card.iNavSearchResult');
    if (!card) return;
    // Card image
    let imgEl = '';
    const mainLink = card.querySelector('a');
    if (mainLink) {
      const imgFrame = mainLink.querySelector('.iNavSearchResult__image-frame');
      if (imgFrame) {
        const foundImg = imgFrame.querySelector('img');
        if (foundImg) imgEl = foundImg;
      }
    }
    // Card text content
    const contentWrapper = card.querySelector('.iNavSearchResult__content-wrapper');
    let textCell = document.createElement('div');
    if (contentWrapper) {
      // Title
      const heading = contentWrapper.querySelector('.iNavSearchResult__heading h2');
      if (heading && heading.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createElement('br'));
      }
      // Description
      const descSpan = contentWrapper.querySelector('.iNavSearchResult__sub-heading');
      if (descSpan && descSpan.textContent.trim()) {
        const descDiv = document.createElement('div');
        descDiv.textContent = descSpan.textContent.trim();
        textCell.appendChild(descDiv);
      }
      // Author or Sponsor row
      const cardRow = contentWrapper.querySelector('.iNavSearchResult__card-row');
      if (cardRow) {
        let metaDiv = document.createElement('div');
        const sponsor = cardRow.querySelector('.iNavSearchResult__sponsor');
        if (sponsor) {
          // Presented By [sponsor name] [sponsor logo] - [date]
          metaDiv.appendChild(document.createTextNode('Presented By '));
          const sponsorName = sponsor.querySelector('.sponsor-name');
          if (sponsorName) {
            metaDiv.appendChild(document.createTextNode(sponsorName.textContent.trim()));
          }
          const sponsorLogo = sponsor.querySelector('img.sponsor-logo');
          if (sponsorLogo) {
            metaDiv.appendChild(document.createTextNode(' '));
            metaDiv.appendChild(sponsorLogo);
          }
          const date = cardRow.querySelector('.iNavSearchResult__date');
          if (date) {
            metaDiv.appendChild(document.createTextNode(' - ' + date.textContent.trim()));
          }
        } else {
          // Author and date: [authorname] - [date] (if both)
          const authorName = cardRow.querySelector('.iNavSearchResult__authorname');
          const date = cardRow.querySelector('.iNavSearchResult__date');
          if (authorName && authorName.textContent.trim()) {
            metaDiv.appendChild(document.createTextNode(authorName.textContent.replace(/\u00a0/g, ' ').replace(/\s*-\s*$/, '').trim()));
          }
          if (date && date.textContent.trim()) {
            if (authorName && authorName.textContent.trim()) {
              metaDiv.appendChild(document.createTextNode(' - '));
            }
            metaDiv.appendChild(document.createTextNode(date.textContent.trim()));
          }
        }
        // Only add metaDiv if it has content
        if (metaDiv.childNodes.length) {
          textCell.appendChild(metaDiv);
        }
      }
    }
    cells.push([
      imgEl,
      textCell
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
