// Input sanitization utility
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/["']/g, '') // Remove quotes
    .replace(/&/g, '&amp;') // Escape ampersand
    .trim();
}

export function sanitizeHTML(html) {
  if (typeof html !== 'string') {
    return html;
  }
  
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/&/g, '&amp;');
}