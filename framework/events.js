// Events that do not bubble cannot be caught at the root, so they are set on the element itself.
const NON_BUBBLING = new Set(['focus', 'blur', 'mouseenter', 'mouseleave', 'load', 'error', 'scroll']);

// element → { eventType: handler }. A WeakMap lets removed elements be cleaned up automatically.
const handlers = new WeakMap();

// Event types already listened to at the root.
const delegatedTypes = new Set();

/**
 * Runs the handlers for an event, starting at the element that was acted on
 * and walking up through its parents, like the browser's own bubbling.
 * A handler can call event.stopPropagation() to stop the walk.
 *
 * @param {Event} event - The event caught at the root.
 */
function dispatch(event) {
  let stopped = false;
  const stop = event.stopPropagation.bind(event);
  const stopImmediate = event.stopImmediatePropagation.bind(event);
  event.stopPropagation = () => {
    stopped = true;
    stop();
  };
  event.stopImmediatePropagation = () => {
    stopped = true;
    stopImmediate();
  };

  let node = event.target;
  while (node && node !== document && !stopped) {
    const handler = handlers.get(node)?.[event.type];
    if (handler) handler.call(node, event, node);
    node = node.parentNode;
  }
}

/**
 * Whether an event type is handled once at the root rather than on each element.
 *
 * @param {string} type - Event type, e.g. 'click'.
 * @returns {boolean}
 */
function isDelegated(type) {
  return !NON_BUBBLING.has(type) && `on${type}` in document;
}

/**
 * Sets up a single root handler for an event type, the first time it is needed.
 *
 * @param {string} type - Event type, e.g. 'click'.
 */
function listenAtRoot(type) {
  if (delegatedTypes.has(type)) return;
  document[`on${type}`] = dispatch;
  delegatedTypes.add(type);
}

/**
 * Registers the handlers declared in a virtual node's `on` attribute,
 * replacing any handlers the element had before.
 *
 * @example
 * h('button', { on: { click: () => save() } }, 'Save');
 *
 * @param {HTMLElement} el - The element the handlers belong to.
 * @param {Object<string, Function>} [on={}] - Event type → handler.
 */
export function setEvents(el, on = {}) {
  const previous = handlers.get(el) || {};

  // Clear handlers set directly on the element that are no longer wanted.
  Object.keys(previous).forEach((type) => {
    if (!isDelegated(type) && !(type in on)) {
      el[`on${type}`] = null;
    }
  });

  const next = {};
  Object.entries(on).forEach(([type, handler]) => {
    if (typeof handler !== 'function') return;
    next[type] = handler;
    if (isDelegated(type)) {
      listenAtRoot(type);
    } else {
      el[`on${type}`] = (event) => handler.call(el, event, el);
    }
  });

  if (Object.keys(next).length > 0) {
    handlers.set(el, next);
  } else {
    handlers.delete(el);
  }
}

/**
 * Removes every handler from an element.
 *
 * @param {HTMLElement} el - The element to clear.
 */
export function removeEvents(el) {
  setEvents(el, {});
}

/**
 * Builds a keyboard handler that runs a function for specific keys.
 *
 * @example
 * h('input', { on: { keydown: onKey({ Enter: save, Escape: cancel }) } });
 *
 * @param {Object<string, Function>} bindings - Key name (as in event.key) → function.
 * @returns {Function} A handler to use as `keydown` or `keyup`.
 */
export function onKey(bindings) {
  return (event, el) => {
    const handler = bindings[event.key];
    if (handler) handler(event, el);
  };
}
