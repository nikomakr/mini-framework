// Names handled by later features (keys, events, refs) are not DOM attributes.
const RESERVED = new Set(['key', 'on', 'ref']);

// These must be set as live properties, otherwise the browser ignores later changes.
const PROPERTIES = new Set(['value', 'checked', 'selected']);

/**
 * Applies a style object or string to an element.
 *
 * @param {HTMLElement} el - The element to style.
 * @param {Object|string} style - e.g. { color: 'red', fontSize: '20px' } or 'color: red'.
 */
function setStyle(el, style) {
  if (typeof style === 'string') {
    el.setAttribute('style', style);
    return;
  }
  Object.entries(style).forEach(([name, value]) => {
    if (name.includes('-')) {
      el.style.setProperty(name, value);
    } else {
      el.style[name] = value;
    }
  });
}

/**
 * Sets one attribute, property or style on a real DOM element.
 *
 * @param {HTMLElement} el - The element to update.
 * @param {string} name - Attribute name, e.g. 'class', 'for', 'data-id'.
 * @param {*} value - The value to set. `false`, `null` and `undefined` remove the attribute.
 */
export function setAttribute(el, name, value) {
  if (RESERVED.has(name)) return;

  if (name === 'style') {
    setStyle(el, value);
    return;
  }

  if (PROPERTIES.has(name)) {
    el[name] = value;
    return;
  }

  if (value === false || value === null || value === undefined) {
    el.removeAttribute(name);
    return;
  }

  // Boolean attributes such as disabled or autofocus are present with an empty value.
  el.setAttribute(name, value === true ? '' : String(value));
}

/**
 * Builds a real DOM node from a virtual node, including all its children.
 *
 * @param {Object|string|number} vnode - A virtual node from h(), or text.
 * @returns {Node} The real DOM node.
 */
export function createElement(vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  const el = document.createElement(vnode.tag);

  Object.entries(vnode.attrs).forEach(([name, value]) => setAttribute(el, name, value));

  vnode.children.forEach((child) => {
    if (child === null || child === undefined || child === false || child === true) return;
    el.appendChild(createElement(child));
  });

  return el;
}

/**
 * Renders a virtual node into a container, replacing whatever was there.
 *
 * @example
 * render(h('h1', {}, ['todos']), document.getElementById('app'));
 *
 * @param {Object} vnode - The virtual node to render.
 * @param {HTMLElement} container - The element to render into.
 * @returns {Node} The rendered DOM node.
 */
export function render(vnode, container) {
  const el = createElement(vnode);
  container.replaceChildren(el);
  return el;
}
