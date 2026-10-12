# Framework documentation

## Overview

This framework lets you describe a page as plain JavaScript objects and turn them into real DOM elements.

- `h(tag, attrs, children)` creates a **virtual node**: a plain object that describes an element.
- `render(vnode, container)` turns a virtual node into real DOM elements and puts them inside a container.

You never call `document.createElement` yourself. You describe what the page should look like with `h`, and `render` builds it.

## Getting started

The framework is made of ES modules, so the page must be served over HTTP. Opening the HTML file directly (`file://...`) will not work.

**1. Project layout**

```
my-project/
├── index.html
└── framework/
    ├── index.js
    ├── vnode.js
    ├── render.js
    └── ...
```

**2. A page to paste the examples into** (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Framework demo</title>
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import { h, render } from './framework/index.js';

    render(h('h1', {}, ['Hello, world!']), document.getElementById('app'));
  </script>
</body>
</html>
```

**3. Start a local server** from the `my-project` folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. You should see "Hello, world!".

In every example below, replace the contents of the `<script type="module">` tag in this page with the example code.

## Create an element

Use `h(tag, attrs, children)` to create a virtual node, then pass it to `render` together with the DOM element it should appear in.

```js
import { h, render } from './framework/index.js';

const title = h('h1', {}, ['Hello, world!']);

render(title, document.getElementById('app'));
```

- `tag` is the HTML tag name as a string, such as `'h1'`, `'div'` or `'button'`.
- `attrs` is an object of attributes (use `{}` when there are none).
- `children` is an array of the content inside the element. Text is written as a string.

`render` replaces whatever was inside the container with the new element, so calling it again with a different node swaps the content.

When an element has no attributes, you can skip the `attrs` argument:

```js
import { h, render } from './framework/index.js';

const paragraph = h('p', 'This paragraph has no attributes.');

render(paragraph, document.getElementById('app'));
```

## Add attributes

The second argument of `h` is an object. Each key is the name of an attribute and each value is what to set it to.

```js
import { h, render } from './framework/index.js';

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
import { h, render } from './framework/index.js';

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

_To be written._

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

## Routing

The router keeps the **URL** and the **state** in sync. It uses the part of the URL after `#` (for example `#/about`), so it works with any static server and the page never reloads.

### Define routes

`createRouter({ routes, store })` takes:

- **`routes`**: an object whose keys are paths (`'/'`, `'/about'`) and whose values are functions. Each function receives the store and updates it for that route.
- **`store`**: the store the routes update.

When the page loads, the router applies the route already in the URL, or goes to `#/` if there is none. An unknown path falls back to the `'/'` route.

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

_To be written._
