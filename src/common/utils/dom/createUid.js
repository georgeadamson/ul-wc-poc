// Helper to generate a [probably] unique id:
// Optional feature: If you supply a DOM element, this will set it's id if it doesn't already have one.
export default function createUid(prefix = '', elem = undefined) {
  // Generate a rudimentary little guid string, like "ebpa3utobjd", with optional prefix:
  const uid =
    prefix +
    Math.random()
      .toString(36)
      .substr(2);

  // Assign the id to the element if necessary.
  // Return its existing id if it already has one:
  if (elem) {
    if (elem.id) return elem.id;
    elem.id = uid;
  }

  return uid;
}
