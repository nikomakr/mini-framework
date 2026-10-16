# Framework documentation

## Overview

This framework lets you build a web page by describing **what** it should look like for the current data. The framework works out **how** to update the page.

It offers four features:

- **Abstracting the DOM**: `h()` describes an element as a plain JavaScript object (a *virtual node*). `render()` and `patch()` turn those objects into real elements and keep them up to date, changing only what is different.
- **Event handling**: events are declared on the element with `on: { click: … }`. The framework handles them through one handler per event type at the root of the page, not with `addEventListener()`. `onKey`, `onGlobal` and `createKeyState` cover keyboard shortcuts and held keys.
- **State management**: `createStore()` keeps the app's data in one place that every part of the app can read, update and listen to.
- **Routing**: `createRouter()` keeps the URL (`#/`, `#/active`, …) and the state in sync, including the browser's back and forward buttons.

`createApp()` ties them together: give it a store and a `view` function, and the page is redrawn whenever the state changes.

### A framework, not a library

With a library, your code is in control and calls the library when it needs it. With a framework, the control is inverted: **the framework calls your code**.

Here, you never create, change or remove DOM elements yourself. You write a `view(state)` function and event handlers that update the store. The framework decides when to call `view`, compares the result with what is on the page, and applies the changes.

## Getting started

The framework is made of ES modules with no dependencies, so there is nothing to install. The page must be served over HTTP: opening the HTML file directly (`file://...`) will not work.

### Folder structure

```
.
├── AUDIT.md              the audit questions, answered, with commands to check them
├── README.md             what the project is, how to run it, how the team works
├── docs                  the documentation
│   └── DOCUMENTATION.md  this file
├── examples              small demos of the framework
│   └── moving-box        game-style demo: arrow keys, createLoop, ref + transform
│       ├── app.js        the demo's code
│       └── index.html    the demo's page and styles
├── framework             the framework itself; import everything from index.js
│   ├── app.js            createApp(): connects store, view and rendering
│   ├── diff.js           patch(): updates only what changed on the page
│   ├── events.js         event delegation, onKey, onGlobal, createKeyState
│   ├── fps.js            createFpsMeter(): frames-per-second display (development only)
│   ├── index.js          everything you can import
│   ├── lifecycle.js      ref, onMount, onUnmount
│   ├── render.js         render(): builds real elements from virtual nodes
│   ├── router.js         createRouter(): keeps the URL hash and the state in sync
│   ├── scheduler.js      one redraw per frame, createLoop()
│   ├── state.js          createStore(): the app's state and subscriptions
│   └── vnode.js          h() and memo(): describe elements as plain objects
├── server.js             small static server (Node.js, no dependencies)
└── todomvc               the TodoMVC app built with the framework
    ├── app.js            entry point: the page view, router and createApp
    ├── components        the parts of the TodoMVC page
    │   ├── Footer.js     counter, filters and Clear completed
    │   ├── Header.js     title and the new-todo input
    │   ├── Info.js       the information footer below the app
    │   ├── TodoItem.js   one todo: toggle, label, delete and edit input
    │   └── TodoList.js   the list of todos
    ├── css               the TodoMVC stylesheets
    │   ├── base.css      official TodoMVC base styles (local copy)
    │   └── index.css     official TodoMVC app styles (local copy)
    ├── index.html        the page that loads the app
    └── store.js          todo state, actions and localStorage saving

8 directories, 28 files
```

### Run it

From the `mini-framework` folder:

```bash
node server.js
```

Then open `http://localhost:65500/todomvc/` to see the TodoMVC app.

### Try your own code

Create `playground.html` in the `mini-framework` folder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Framework playground</title>
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import { h, render } from '/framework/index.js';

    render(h('h1', {}, ['Hello, world!']), document.getElementById('app'));
  </script>
</body>
</html>
```

Open `http://localhost:65500/playground.html`. You should see "Hello, world!".

***In every example below***, replace the contents of the `<script type="module">` tag in this page with the example code.

### A minimal app

This counter uses a store, an event and `createApp`. Clicking the button updates the store, and the framework redraws the page:

```js
import { h, createStore, createApp } from '/framework/index.js';

const store = createStore({ count: 0 });

const view = (state) =>
  h('div', {}, [
    h('p', {}, [`Clicked ${state.count} times`]),
    h('button', { on: { click: () => store.setState((s) => ({ count: s.count + 1 })) } }, 'Click me'),
  ]);

createApp({ root: document.getElementById('app'), store, view });
```

## Create an element

Use `h(tag, attrs, children)` to create a virtual node, then pass it to `render` together with the DOM element it should appear in.

```js
import { h, render } from '/framework/index.js';

const title = h('h1', {}, ['Hello, world!']);

render(title, document.getElementById('app'));
```

- `tag` is the HTML tag name as a string, such as `'h1'`, `'div'` or `'button'`.
- `attrs` is an object of attributes (use `{}` when there are none).
- `children` is an array of the content inside the element. Text is written as a string.

`render` replaces whatever was inside the container with the new element, so calling it again with a different node swaps the content.

When an element has no attributes, you can skip the `attrs` argument:

```js
import { h, render } from '/framework/index.js';

const paragraph = h('p', 'This paragraph has no attributes.');

render(paragraph, document.getElementById('app'));
```

You should inspect the page, hoover over the 'This paragraph has no attributes.', go to Console in DevTools, type `$0.attributes.length` and it will give you 0.

## Add attributes

The second argument of `h` is an object. Each key is the name of an attribute and each value is what to set it to.

```js
import { h, render } from '/framework/index.js';

const form = h('form', { id: 'signup', class: 'form' }, [
  h('label', { for: 'name' }, ['Name']),
  h('input', {
    id: 'name',
    type: 'text',
    placeholder: 'Insert name',
    value: 'Ada',
    'data-id': 42,
  }),
  h(
    'button',
    {
      type: 'button',
      disabled: true,
      style: { color: 'white', backgroundColor: 'teal', 'font-size': '18px' },
    },
    ['Send']
  ),
]);

render(form, document.getElementById('app'));
```

How the different kinds of values are handled:

- **Normal attributes** (`id`, `class`, `type`, `placeholder`, `for`, `data-*`, ...) are written as they appear in HTML. Numbers are converted to text. Names with a dash, such as `data-id`, must be quoted.
- **Boolean attributes** such as `disabled`: `true` adds the attribute, and `false`, `null` or `undefined` leaves it out.
- **`value`, `checked` and `selected`** are set directly on the element, so they keep working after the user has typed or clicked.
- **`style`** can be an object, where camelCase keys (`backgroundColor`) and dashed keys (`'font-size'`) both work, or a plain string such as `'color: red'`.

Two names are not regular attributes: `on` is used for events (see [Create an event](#create-an-event)), and `key` and `ref` are reserved by the framework and are never written to the element.

## Nest elements

The third argument of `h` is the list of children. A child can be a string, a number, or another `h(...)` node, so you can nest elements as deep as you need.

```js
import { h, render } from '/framework/index.js';

const fruits = ['Apple', 'Banana', 'Cherry'];

const card = h('section', { class: 'card' }, [
  h('h2', {}, ['Fruit list']),
  h('p', {}, ['There are ', fruits.length, ' fruits.']),
  h(
    'ul',
    {},
    fruits.map((name) => h('li', {}, [name]))
  ),
  fruits.length > 5 && h('p', {}, ['That is a lot of fruit!']),
]);

render(card, document.getElementById('app'));
```

What to know about children:

- Strings and numbers become text. `['There are ', fruits.length, ' fruits.']` produces one sentence.
- An array inside the children list is flattened, so `fruits.map(...)` can be placed directly in the list or passed as the whole children argument.
- `null`, `undefined`, `true` and `false` are ignored. This is why `condition && h(...)` works to show an element only when the condition is true.
- When an element has no attributes, you can pass the children directly: `h('ul', [h('li', ['One']), h('li', ['Two'])])`.

## Create an event

Events are declared on the element, inside the `on` attribute. Each key is the event name without the `on` prefix (`click`, not `onclick`), and each value is the function to run. You never call `addEventListener()` yourself: the framework registers the handler for you and removes it when the element leaves the page.

### Handle a click

```js
import { h, render } from '/framework/index.js';

const button = h('button', {
  on: {
    click: () => console.log('Button clicked!'),
  },
}, ['Click me']);

render(button, document.getElementById('app'));
```

An element can listen to several events at once: `on: { click: save, mouseover: highlight }`.

### Handle a double-click

Use `dblclick`. TodoMVC uses it to start editing a todo.

```js
import { h, render } from '/framework/index.js';

const text = h('p', {
  on: {
    dblclick: () => console.log('Double-clicked!'),
  },
}, ['Double-click this text']);

render(text, document.getElementById('app'));
```

### What a handler receives

A handler is called with two arguments:

- **`event`**: the browser's event object, so `event.target.value`, `event.key` and `event.preventDefault()` all work as usual.
- **`el`**: the element that declared the handler. This can differ from `event.target`: clicking a `<span>` inside a `<button>` gives the span as `event.target` and the button as `el`.

Events bubble up through the parents as they do in the browser, and `event.stopPropagation()` stops them.

```js
import { h, render } from '/framework/index.js';

const input = h('input', {
  placeholder: 'Type something',
  on: {
    input: (event) => console.log('Value is now', event.target.value),
  },
});

render(input, document.getElementById('app'));
```

### Keyboard shortcuts with `onKey`

`onKey(bindings)` builds a `keydown` or `keyup` handler that runs a different function for each key. Key names are the values of `event.key`, such as `'Enter'`, `'Escape'`, `'ArrowUp'` or `'a'`. Other keys are ignored.

```js
import { h, render, onKey } from '/framework/index.js';

const input = h('input', {
  placeholder: 'Press Enter or Escape',
  on: {
    keydown: onKey({
      Enter: (event) => console.log('Saved:', event.target.value),
      Escape: (event, el) => el.blur(),
    }),
  },
});

render(input, document.getElementById('app'));
```

### Events on the whole page with `onGlobal`

Some events belong to the page rather than to one element, such as game controls or resizing the window. `onGlobal(type, handler)` listens to them and returns a function that stops listening.

```js
import { h, render, onGlobal } from '/framework/index.js';

render(h('input', { placeholder: 'Type here' }), document.getElementById('app'));

const stopListening = onGlobal('keydown', (event) => {
  console.log('Key pressed:', event.key);
  if (event.key === 'Escape') stopListening();
});
```

Open the Console, click an empty part of the page and press some keys: each one is logged. Typing in the input logs nothing. Press `Escape` (outside the input) to stop listening; after that, no keys are logged.

Key events typed inside an input, text area, select or editable element are ignored by default, so typing in a form does not trigger game controls. Pass `{ allowInInputs: true }` to receive them as well:

```js
import { h, render, onGlobal } from '/framework/index.js';

render(h('input', { placeholder: 'Type here' }), document.getElementById('app'));

onGlobal('keydown', (event) => console.log('Key pressed:', event.key), { allowInInputs: true });
```

Now typing in the input is logged too.

`blur`, `focus` and `resize` are listened to on the window. Every other type is listened to on the document.

### Held keys with `createKeyState`

For smooth movement, a game loop needs to know which keys are held down at each frame, rather than waiting for the keyboard to repeat. `createKeyState()` keeps track of them:

```js
import { h, render, createKeyState } from '/framework/index.js';

const keys = createKeyState();
let y = 100;
let running = true;

render(
  h('div', {}, [
    h('p', { id: 'held' }, ['Held keys: none']),
    h('button', { on: { click: () => { keys.destroy(); running = false; } } }, ['End game']),
    h('div', { id: 'box', style: 'position:absolute; left:100px; top:100px; width:40px; height:40px; background:teal' }),
  ]),
  document.getElementById('app')
);

const held = document.getElementById('held');
const box = document.getElementById('box');

// The game loop: runs once per frame
function frame() {
  if (keys.isDown('ArrowUp')) y -= 3;
  if (keys.isDown('ArrowDown')) y += 3;
  box.style.top = y + 'px';
  held.textContent = 'Held keys: ' + (keys.pressed().join(', ') || 'none');
  if (running) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

- `keys.isDown(key)` returns `true` while that key is held.
- `keys.pressed()` returns every key held right now, such as `['ArrowUp', ' ']`.
- `keys.destroy()` stops tracking keys. Call it when the game ends.

Click the page, then hold `ArrowDown`: the square slides down and the text shows `Held keys: ArrowDown`. Let go and it stops. Hold two keys together and both are listed. Click **End game** and holding keys no longer does anything.

Every key is released when the window loses focus or the tab is hidden, so none stay stuck. To see it, hold `ArrowDown`, switch to another app, let go, then come back: the square is not moving. This also happens while DevTools has focus, so click the page before testing.

### Events that do not bubble

`focus`, `blur`, `mouseenter`, `mouseleave`, `scroll`, `load` and `error` do not bubble, so the framework sets them directly on the element instead of handling them at the root. You declare them the same way, for example `on: { blur: save }`. See [Event delegation](#event-delegation) for how this works.

## Manage state

The app's data lives in a **store**: one object that holds the current state. Components never change the page directly. They change the store, and the framework updates the page.

### Create a store

`createStore(initialState)` returns a store with three functions: `getState`, `setState` and `subscribe`.

```js
import { createStore } from '/framework/index.js';

const store = createStore({ count: 0, name: 'Ada' });
```

### Read the state

`getState()` returns the current state.

```js
console.log(store.getState()); // { count: 0, name: 'Ada' }
```

### Update the state

`setState` accepts either an object or a function.

- **An object** is merged into the current state. Keys you leave out keep their value.
- **A function** receives the current state and returns the keys to change. Use it when the new value depends on the old one.

```js
store.setState({ count: 1 });
console.log(store.getState()); // { count: 1, name: 'Ada' }

store.setState((state) => ({ count: state.count + 1 }));
console.log(store.getState().count); // 2
```

### Listen for changes

`subscribe(listener)` runs `listener(state, previousState)` after every change, and returns a function that stops listening.

`subscribe(selector, listener)` runs the listener **only when the selected part changes**. The selector picks the part to watch. This avoids unnecessary work: for example, saving the todos when they change, but not on every key pressed in the input.

The comparison is shallow, so a selector can pick several values at once: `(state) => ({ lives: state.lives, score: state.score })` only counts as a change when `lives` or `score` is different, even though it returns a new object each time.

```js
const store = createStore({ count: 0, name: 'Ada' });

// Runs after every change
const stopListening = store.subscribe((state, previousState) => {
  console.log('changed from', previousState.count, 'to', state.count);
});

// Runs only when `count` changes
store.subscribe(
  (state) => state.count,
  (state) => console.log('count is now', state.count),
);

store.setState({ count: 5 });      // both listeners run
store.setState({ name: 'Grace' }); // only the first listener runs

stopListening();
store.setState({ count: 6 });      // only the `count` listener runs
```

### Connect the store to the page

`createApp` re-renders the page whenever the store changes. The view is a function of the state, so the page always matches the data.

```html
<div id="app"></div>
<script type="module">
  import { h, createStore, createApp } from '/framework/index.js';

  const store = createStore({ count: 0 });

  const view = (state) =>
    h('div', {}, [
      h('p', {}, [`Count: ${state.count}`]),
      h('button', { on: { click: () => store.setState((s) => ({ count: s.count + 1 })) } }, '+1'),
    ]);

  createApp({ root: document.getElementById('app'), store, view });
</script>
```

Several stores can exist at the same time; each one is independent.

To keep separate parts of the page from redrawing each other, give each part its own root and a `select`. The app then only redraws when its selected part changes (shallow comparison); its view still receives the whole state:

```js
createApp({ root: document.getElementById('chat'), store, select: (state) => state.messages, view: renderChat });
createApp({ root: document.getElementById('board'), store, select: (state) => state.board, view: renderBoard });
```

A new chat message redraws the chat only, not the board.

## Routing

The router keeps the **URL** and the **state** in sync. It uses the part of the URL after `#` (for example `#/about`), so it works with any static server and the page never reloads.

### Define routes

`createRouter({ routes, store })` takes:

- **`routes`**: an object whose keys are paths (`'/'`, `'/about'`) and whose values are functions. Each function receives the store and updates it for that route.
- **`store`**: the store the routes update.

When the page loads, the router applies the route already in the URL, or goes to `#/` if there is none. An unknown path, such as `#/nowhere`, also goes to `#/`. The address is replaced rather than added to the history, so the back button does not return to it.

```js
import { createStore, createRouter } from '/framework/index.js';

const store = createStore({ page: 'home' });

createRouter({
  store,
  routes: {
    '/': (routerStore) => routerStore.setState({ page: 'home' }),
    '/about': (routerStore) => routerStore.setState({ page: 'about' }),
  },
});
```

### Link to a route

Use a normal link whose `href` starts with `#`. Clicking it changes the URL, the router runs the matching route, and the page updates. The browser's back and forward buttons work as usual.

```js
h('a', { href: '#/about' }, 'About')
```

### Read the current route

The routes store the current page in the state, so the view reads it like any other value. This example also highlights the active link:

```html
<div id="app"></div>
<script type="module">
  import { h, createStore, createApp, createRouter } from '/framework/index.js';

  const store = createStore({ page: 'home' });

  createRouter({
    store,
    routes: {
      '/': (routerStore) => routerStore.setState({ page: 'home' }),
      '/about': (routerStore) => routerStore.setState({ page: 'about' }),
    },
  });

  const link = (href, label, page, current) =>
    h('a', { href, class: page === current ? 'selected' : null }, label);

  const view = (state) =>
    h('div', {}, [
      h('nav', {}, [
        link('#/', 'Home', 'home', state.page),
        ' | ',
        link('#/about', 'About', 'about', state.page),
      ]),
      h('h1', {}, state.page === 'about' ? 'About us' : 'Welcome home'),
    ]);

  createApp({ root: document.getElementById('app'), store, view });
</script>
```

In TodoMVC, the same pattern drives the filters: `#/`, `#/active` and `#/completed` set `filter` in the store, and the list shows only the matching todos.

## How it works

### The big picture

Every change follows the same one-way loop:

```
user action → event handler → store.setState() → next frame → view(state) → patch() → page updated
```

1. The user clicks, types or changes the URL.
2. A handler updates the store. It never touches the page.
3. The store tells `createApp` that the state has changed.
4. On the next animation frame, `createApp` calls `view(state)` to get a new virtual tree.
5. `patch()` compares the new tree with the previous one and changes only the parts of the page that differ.

Because the page is always built from the state, the two can never disagree.

### Virtual DOM

`h('p', { class: 'note' }, ['Hi'])` returns a plain object:

```js
{ tag: 'p', attrs: { class: 'note' }, children: ['Hi'] }
```

Plain objects are cheap to create and compare, whereas real DOM elements are slow to create and change. So the framework builds a new tree of objects on every update, and touches the real DOM only where something has changed.

`h()` also tidies the children: nested arrays are flattened, and `null`, `undefined`, `true` and `false` are removed. That is why `condition && h(...)` works for showing an element only sometimes.

### Diffing

`patch(container, oldTree, newTree)` walks both trees together:

- **Same tag**: the element is kept. Only attributes, styles, events and children that changed are updated.
- **Different tag, or text replaced by an element**: the old element is replaced.
- **Children with a `key`** (for example `key: todo.id`) are matched by key, so a list item keeps its element, and its state, when items are added, removed or reordered.
- **Children without a key** are matched in order.

`value`, `checked` and `selected` are compared with the live element, because the user may have changed them by typing or clicking. They are only set when they differ, so the cursor in an input does not jump. If a re-render moves the focused input and it loses the focus, the focus and cursor position are put back. If the new page moves the focus on purpose (for example a `ref` that focuses an input), it is left there.

### Event delegation

`addEventListener()` is not used. Instead:

1. When an element declares `on: { click: handler }`, the handler is stored in a `WeakMap` against that element.
2. The first time a `click` handler is needed, the framework sets **one** `document.onclick` for the whole page.
3. When a click happens, that root handler starts at the clicked element and walks up through its parents, running each stored `click` handler. This copies the browser's own bubbling, and `event.stopPropagation()` still stops it.

Why this way:

- **Fewer handlers**: a list of 1,000 todos uses one click handler, not 1,000.
- **Re-renders are cheap**: changing a handler only updates the `WeakMap`. Nothing is removed from or added to the element.
- **No leaks**: when an element is removed, the `WeakMap` lets the browser forget its handlers automatically.

Events that do not bubble (`focus`, `blur`, `mouseenter`, `mouseleave`, `scroll`, `load`, `error`) cannot be caught at the root, so they are set directly on the element with `el.onblur = …`.

`onGlobal(type, handler)` listens to an event across the whole page (for example game controls). Key events typed inside inputs are ignored unless `{ allowInInputs: true }` is passed.

### The store

The store is a single object that holds the app's state, reachable from every part of the app.

- `setState` never changes the old state. It creates a new object (`{ ...oldState, ...changes }`). This makes it easy to compare "before" and "after", and to give listeners both.
- `subscribe(selector, listener)` runs the listener only when the selected part changes (compared shallowly: an object or array counts as changed only if one of its values is different). TodoMVC uses this to save the todos to `localStorage` only when they change, not on every key pressed in the input.

### Hash routing

The router uses the part of the URL after `#`. Changing it:

- **does not reload the page**, so the state is kept;
- **needs no server set-up**: any static server works, and refreshing on `#/active` still loads the same `index.html`;
- **adds a history entry**, so the back and forward buttons work.

`createRouter` listens to `window.onhashchange`, finds the route for the new path, and calls it with the store. The route updates the state, and the normal loop redraws the page. A missing or unknown path is replaced with `#/`.

### Rendering once per frame

Several `setState` calls can happen in a row (for example, "Clear completed" removing many todos). Redrawing after each one would waste work.

So `createApp` does not redraw straight away. It queues the redraw with `requestAnimationFrame`, in a `Set`, so the same job is queued only once. However many times the state changes before the next frame, the page is redrawn **once**, just before the browser paints. This keeps updates smooth at 60 frames per second.

There is one exception: typing in a form field. After a key press, `input`, `change`, `focus` or `blur` in an `<input>`, `<textarea>` or `<select>`, the framework redraws as soon as the handlers have run, instead of waiting for the frame. Otherwise a key pressed within the same frame as Enter would land in an input that has not been cleared yet. Each action still causes one redraw at most, however many `setState` calls its handlers make.

Everything else waits for the frame, including clicks and page-wide keys from `onGlobal`. A game that calls `setState` on every `keydown` therefore still redraws at most once per frame.

### Lifecycle hooks

Some code needs the real element, for example to focus an input or measure its size. Three special attributes give access to it:

- `ref: (el) => …` receives the element once it is on the page, and `null` when it is removed. If a re-render gives a different `ref` function, the old one receives `null` and the new one receives the element. So `ref: isEditing ? focusAtEnd : undefined` (with `focusAtEnd` defined once, outside the view) runs `focusAtEnd` exactly when editing starts, which is how TodoMVC focuses the edit input.
- `onMount: (el) => …` runs once the element is on the page.
- `onUnmount: (el) => …` runs just before the element is removed.

These names are reserved, so they never appear as HTML attributes.

### Game loop

`createLoop(update)` calls `update(delta)` once per animation frame, where `delta` is the number of milliseconds since the previous frame. Moving by `speed * delta` keeps movement the same speed on any screen. While the tab is hidden, `update` is not called, and the first frame after returning reports a `delta` of `0`, so nothing jumps.

## Reference

Everything below is imported from `/framework/index.js`.

- `h(tag, attrs, children)`: Creates a virtual node. `attrs` and `children` are optional.
- `render(vnode, container)`: Builds real elements from a virtual node (or a list of them) and puts them in `container`, replacing what was there.
- `patch(container, oldVNode, newVNode)`: Updates `container` from `oldVNode` to `newVNode`, changing only what differs. Both can also be lists of virtual nodes.
- `onKey(bindings)`: Returns a key handler that runs a function per key, e.g. `onKey({ Enter: save, Escape: cancel })`.
- `onGlobal(type, handler, options)`: Listens to an event across the whole page. Returns a function that stops listening.
- `createKeyState()`: Tracks which keys are held down. Returns `{ isDown(key), pressed(), destroy() }`.
- `createStore(initialState)`: Creates a store. Returns `{ getState(), setState(changes), subscribe([selector,] listener) }`.
- `createApp({ root, store, view, select })`: Renders `view(state)` into `root` and redraws when the store changes. `view` may return a list of virtual nodes to place several elements directly in `root`. With `select`, it only redraws when the selected part of the state changes. Returns `{ refresh(), unmount() }`.
- `createRouter({ routes, store })`: Runs the route matching the URL after `#`, now and whenever it changes.
- `createLoop(update)`: Calls `update(delta, time)` every frame. Returns `{ start(), stop(), isRunning() }`.
- `createFpsMeter({ parent })`: For development: shows the frames per second and the slowest frame in a corner of the page. Returns `{ stop() }`.

Special attributes: `on` (events), `style` (object or string), `key` (list matching), `ref`, `onMount`, `onUnmount` (lifecycle).
