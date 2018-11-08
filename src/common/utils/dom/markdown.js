import md from 'nano-markdown';

// Strip <p>...</p> added by markdown helper:
// TODO: Find a more efficient solution:
export default function markdown(text, props) {
  let result = md(text).replace(/^<p>|<\/p>$/g, '');
  //console.log(props, props && props.target);

  // Hack for demo only!
  if (props && props.target === '_blank') {
    result = result.replace(
      '<a href="http://bbc.co.uk">Read more</a>',
      `<a target="_blank" 
        href="http://bbc.co.uk" 
        aria-describedby="_newwindow1"
        data-tooltip="Opens in new window">Read more <i id="_newwindow1" hidden>Opens in new window</i></a>
      `
    );
  }

  return result;
}
