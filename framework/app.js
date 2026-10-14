import { patch } from './diff.js';
import { scheduleRender } from './scheduler.js';
import { unmount } from './lifecycle.js';

/**
 * Starts an app. The framework calls `view(state)` to describe the page and
 * keeps the page up to date whenever the store changes — the app itself
 * never touches the DOM.
 *
 * @example
 * const store = createStore({ count: 0 });
 * createApp({
 *   root: document.getElementById('app'),
 *   store,
 *   view: (state) => h('p', {}, [`Count: ${state.count}`]),
 * });
 *
 * @param {Object} options
 * @param {HTMLElement} options.root - The element the app is rendered into.
 * @param {Object} [options.store] - A store from createStore().
 * @param {Function} options.view - Receives the state, returns a virtual node from h()
 *   (or a list of them, to put several elements directly in `root`).
 * @returns {{ refresh: Function, unmount: Function }} Controls for the running app.
 */
export function createApp({ root, store, view }) {
  if (!root) throw new Error('createApp: a root element is required.');
  if (typeof view !== 'function') throw new Error('createApp: view must be a function.');

  let current;

  const update = () => {
    const next = view(store ? store.getState() : {});
    patch(root, current, next);
    current = next;
  };

  const requestRender = () => scheduleRender(update);

  update();
  const unsubscribe = store ? store.subscribe(requestRender) : () => {};

  return {
    refresh: requestRender,
    unmount: () => {
      unsubscribe();
      Array.from(root.childNodes).forEach(unmount);
      root.replaceChildren();
      current = undefined;
    },
  };
}
