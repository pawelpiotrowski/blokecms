export const inputWebComponentStartTag = '-%';
export const inputWebComponentEndTag = '%-';
export const inputWebComponentBlockStartTag = `<p>${inputWebComponentStartTag}`;
export const inputWebComponentBlockEndTag = `${inputWebComponentEndTag}</p>`;
// Looking for "-%SomeComponent%-"
export const inlineWebComponentOpeningTagRegex = new RegExp(
  `${inputWebComponentStartTag}[a-z]*${inputWebComponentEndTag}`,
  'gi',
);
// Looking for "-%/SomeComponent%-"
export const inlineWebComponentClosingTagRegex = new RegExp(
  `${inputWebComponentStartTag}/[a-z]*${inputWebComponentEndTag}`,
  'gi',
);
// Looking for "<p>-%SomeComponent%-</p>"
export const blockWebComponentOpeningTagRegex = new RegExp(
  `${inputWebComponentBlockStartTag}[a-z]*${inputWebComponentBlockEndTag}`,
  'gi',
);
// Looking for "<p>-%/SomeComponent%-</p>"
export const blockWebComponentClosingTagRegex = new RegExp(
  `${inputWebComponentBlockStartTag}/[a-z]*${inputWebComponentBlockEndTag}`,
  'gi',
);
