/**
 * Creates a virtual node: a plain object describing an element.
 *
 * @example
 * h('div', { class: 'nameSubm' }, [
 *   h('input', { type: 'text', placeholder: 'Insert Name' }),
 * ]);
 * // → { tag: 'div', attrs: { class: 'nameSubm' }, children: [ { tag: 'input', ... } ] }
 *
 * @param {string} tag - HTML tag name, e.g. 'div'.
 * @param {Object} [attrs={}] - Attributes, properties and styles for the element.
 * @param {Array|string|number|Object} [children=[]] - Child nodes or text.
 * @returns {{ tag: string, attrs: Object, children: Array }} The virtual node.
 */
export function h(tag, attrs = {}, children = []) {
  // Allow h('p', 'Hello') or h('ul', [ ... ]) when there are no attributes.
  if (Array.isArray(attrs) || typeof attrs !== 'object' || attrs === null) {
    children = attrs ?? [];
    attrs = {};
  }

  const list = Array.isArray(children) ? children : [children];

  return {
    tag,
    attrs,
    children: list
      .flat(Infinity)
      .filter((child) => child !== null && child !== undefined && child !== false && child !== true),
  };
}
