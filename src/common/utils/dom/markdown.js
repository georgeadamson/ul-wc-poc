import md from 'nano-markdown';
import safe from './html-safe.js';

// TODO: Consider migrating to:
// - https://github.com/markdown-it/markdown-it or
// - https://github.com/commonmark/commonmark.js
// for more features, customisation & CommonMark standards but bigger download.
// It will enable things like .disable(['link'])

// 1. Escape any markup already in the text.
// 2. Convert markdown to html.
// 3. Strip leading <p> and trailing </p> added by markdown helper.
export default function markdown(text, config) {
  return md(safe(text)).replace(/^<p>|<\/p>$/g, '');
}
