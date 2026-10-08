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

_To be written._

## Routing

_To be written._

## How it works

_To be written._
