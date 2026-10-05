// framework/state.js
//
// One place holds the app's state, reachable from every page.
//
//   createStore(initialState) -> { getState, setState, subscribe }
//   setState accepts an object (shallow merge) or an updater function
//   subscribe(listener) -> unsubscribe
//   subscribe(selector, listener) -> only fires when the selected part changes
//   Several stores can exist at the same time.

export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(update) {
    const prevState = state;

    let partial;
    if (typeof update === "function") {
      partial = update(prevState);
    } else {
      partial = update;
    }

    if (partial == null || typeof partial !== "object") {
      // Nothing to merge (updater returned undefined/null, or invalid input)
      return;
    }

    state = { ...prevState, ...partial };

    // Snapshot so unsubscribe during notify doesn't break iteration
    const snapshot = Array.from(listeners);
    for (const entry of snapshot) {
      const { selector, listener } = entry;

      if (selector) {
        const prevSelected = selector(prevState);
        const nextSelected = selector(state);
        if (Object.is(prevSelected, nextSelected)) {
          continue; // selected slice unchanged -> skip
        }
      }

      listener(state, prevState);
    }
  }

  function subscribe(selectorOrListener, maybeListener) {
    let selector = null;
    let listener;

    if (typeof maybeListener === "function") {
      selector = selectorOrListener;
      listener = maybeListener;
    } else {
      listener = selectorOrListener;
    }

    if (typeof listener !== "function") {
      throw new TypeError(
        "subscribe(listener) or subscribe(selector, listener) requires a function",
      );
    }

    const entry = { selector, listener };
    listeners.add(entry);

    return function unsubscribe() {
      listeners.delete(entry);
    };
  }

  return { getState, setState, subscribe };
}
