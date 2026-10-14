/**
 * Creates a store: one place that holds the app's state, reachable from
 * every page. Several stores can exist at the same time, each independent.
 *
 * @example
 * const store = createStore({ count: 0 });
 * store.subscribe((state) => state.count, (state) => updateCounter(state.count));
 * store.setState((state) => ({ count: state.count + 1 }));
 *
 * @param {Object} [initialState={}] - The state to start with.
 * @returns {{ getState: Function, setState: Function, subscribe: Function }} The store.
 */
export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  /**
   * Returns the current state.
   *
   * @returns {Object}
   */
  function getState() {
    return state;
  }

  /**
   * Merges changes into the state, then tells the listeners. The old state is
   * never changed: a new object is created.
   *
   * @param {Object|Function} update - The keys to change, or a function that
   *   receives the current state and returns them. Returning nothing changes nothing.
   */
  function setState(update) {
    const prevState = state;
    const partial = typeof update === 'function' ? update(prevState) : update;

    // Nothing to merge: the updater returned nothing, or the input is not an object.
    if (partial === null || typeof partial !== 'object') return;

    state = { ...prevState, ...partial };

    // A copy, so a listener that unsubscribes does not break the loop.
    Array.from(listeners).forEach(({ selector, listener }) => {
      if (selector && Object.is(selector(prevState), selector(state))) return;
      listener(state, prevState);
    });
  }

  /**
   * Listens for changes. With a selector, the listener only runs when the
   * selected part of the state changes (compared with Object.is).
   *
   * @example
   * const stop = store.subscribe((state) => state.todos, saveTodos);
   * stop(); // no longer listening
   *
   * @param {Function} selectorOrListener - `listener(state, prevState)`, or a
   *   selector `(state) => part` when a listener is given as well.
   * @param {Function} [maybeListener] - The listener, when a selector is given.
   * @returns {Function} Call it to stop listening.
   */
  function subscribe(selectorOrListener, maybeListener) {
    const hasSelector = typeof maybeListener === 'function';
    const selector = hasSelector ? selectorOrListener : null;
    const listener = hasSelector ? maybeListener : selectorOrListener;

    if (typeof listener !== 'function') {
      throw new TypeError('subscribe(listener) or subscribe(selector, listener) requires a function.');
    }

    const entry = { selector, listener };
    listeners.add(entry);

    return () => {
      listeners.delete(entry);
    };
  }

  return { getState, setState, subscribe };
}
