# Functional

## Is the framework implemented without using any other high-level library/framework like React, Angular, Vue and similar?

**Yes** — plain JavaScript ES modules only; no dependencies, no CDN, no `addEventListener()` in user code.

To check, run this from the repository root.

```zsh
ls package.json node_modules 2>&1; grep -rnE "from +['\"][^./]|https?://[^\"']+\.(js|css)" framework todomvc || echo "No external libraries"
```

- No `package.json` or `node_modules`: nothing can be installed from npm.
- No import by package name (e.g. `from 'react'`): every import is a local `./` or `../` file.
- No script or stylesheet loaded from the internet.

In the browser, DevTools → Network → reload shows only files served from `localhost`.

## Open the documentation file. Is the documentation written in a markdown file?

**Yes** — the documentation is [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md).

A Markdown file (`.md`) is plain text with simple formatting marks, such as `#` for headings and three backticks around code blocks, which Gitea, GitHub and most editors display as a formatted page.

Click the link above to open it and check: it shows as a formatted page with headings, lists and highlighted code examples.

## Does the documentation contain a top-level overview of the framework's features?

**Yes** — the [Overview](docs/DOCUMENTATION.md#overview) section, at the top of the documentation, lists the four features:

- **Abstracting the DOM**: `h()` describes elements as plain objects; `render()` and `patch()` turn them into real elements and update only what changed.
- **Event handling**: events are declared on the element with `on: { click: … }`, handled through one handler per event type at the root, not `addEventListener()`.
- **State management**: `createStore()` keeps the app's data in one place that every part of the app can read, update and listen to.
- **Routing**: `createRouter()` keeps the URL (`#/`, `#/active`, …) and the state in sync, including the back and forward buttons.

It also explains how `createApp()` ties them together, and why this is a framework rather than a library: the framework calls your code (inversion of control).

## Does the documentation contain an explanation and code examples on how to create an element, add attributes to an element, create an event and nest elements?

**Yes** — each has its own section in the documentation, with an explanation and code examples you can run:

| Topic | Section | In short |
|---|---|---|
| Create an element | [Create an element](docs/DOCUMENTATION.md#create-an-element) | `h('h1', {}, ['Hello, world!'])`, then `render(node, container)` |
| Add attributes | [Add attributes](docs/DOCUMENTATION.md#add-attributes) | `h('input', { id: 'name', type: 'text', placeholder: 'Insert name' })`, including boolean attributes, `value`/`checked` and `style` objects |
| Create an event | [Create an event](docs/DOCUMENTATION.md#create-an-event) | `h('button', { on: { click: save } }, ['Save'])`, plus double-click, `onKey` for key bindings, `onGlobal` for page-wide keys and `createKeyState` for held keys |
| Nest elements | [Nest elements](docs/DOCUMENTATION.md#nest-elements) | `h('ul', {}, fruits.map((name) => h('li', {}, [name])))`, nested to any depth, with conditional children |

The [Try your own code](docs/DOCUMENTATION.md#try-your-own-code) section explains how to run any example in a browser.

## Does the documentation contain an explanation on how the framework works?

**Yes** — see [How it works](docs/DOCUMENTATION.md#how-it-works). It follows one change through the framework:

```
user action → event handler → store.setState() → view(state) → patch() → page updated
```

It then explains each step, and why it was built that way: virtual DOM, diffing, event delegation, the store, hash routing, rendering once per frame, lifecycle hooks and the game loop.

## Open the todoMVC project and compare it to other todoMVC project [todoMVC example] (https://todomvc.com/examples/react/dist/). Does it contain every element as the other todoMVCs examples?

**Yes** — run `node server.js`, open <http://localhost:65500/todomvc/> next to the [reference example](https://todomvc.com/examples/javascript-es6/dist/) and add a todo. Both have:

- the `todos` title and the "What needs to be done?" input
- the "Mark all as complete" toggle
- each todo with its checkbox, label, delete button (on hover) and edit input (on double-click)
- the footer with the items-left counter, the All / Active / Completed filters and "Clear completed"
- the info footer: "Double-click to edit a todo", "Created by …", "Part of TodoMVC"

## Open the Web Developer Tools (Ctrl+Shift+I) and check for the classes, ids, etc. Does it correctly correspond to those in the examples?

**Yes** — both show the same elements, classes and ids.

Some elements only appear once there are todos (as in the reference), so add some first:

1. Start the server from the repository root:

   zsh:

   ```zsh
   node server.js
   ```

   bash:

   ```bash
   node server.js
   ```

2. Open <http://localhost:65500/todomvc/> and the [reference example](https://todomvc.com/examples/javascript-es6/dist/) side by side.
3. In both, add two todos and tick one. Now every element is on the page.
4. Open DevTools (Ctrl+Shift+I, or Cmd+Option+I on a Mac) → **Elements**.
5. Expand `<body>`, then `<section class="todoapp">`, clicking the arrows to open each level.
6. To jump to an element, press Ctrl+F (Cmd+F on a Mac) inside the Elements tab and search for a class or id, e.g. `toggle-all` or `clear-completed`.

What you should find:

```html
<body>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus>
    </header>
    <section class="main">                          <!-- only when there is at least one todo -->
      <input id="toggle-all" class="toggle-all" type="checkbox">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li class="completed">                      <!-- one li per todo; "completed" when ticked -->
          <div class="view">
            <input class="toggle" type="checkbox">
            <label>…</label>
            <button class="destroy"></button>
          </div>
          <input class="edit">
        </li>
      </ul>
    </section>
    <footer class="footer">                         <!-- only when there is at least one todo -->
      <span class="todo-count"><strong>1</strong> item left</span>
      <ul class="filters">
        <li><a class="selected" href="#/">All</a></li>
        <li><a href="#/active">Active</a></li>
        <li><a href="#/completed">Completed</a></li>
      </ul>
      <button class="clear-completed">Clear completed</button>   <!-- only when a todo is ticked -->
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by …</p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</body>
```

Double-clicking a todo adds the class `editing` to its `li` (`class="completed editing"` if it is also ticked).

## Can you add a to-do element to the to-do list?

**Yes** — Enter adds a trimmed todo; empty input is ignored and the input clears.

## When you add a to-do element to the list, does the footer (element with class footer) appear as in other examples?

**Yes** — `.main` and `.footer` appear once there is at least one todo.

## Can you check/uncheck a to-do element on the list?

**Yes** — the `li` gets and loses the `completed` class.

## Can you remove a to-do element off the list?

**Yes** — the destroy button (shown on hover) removes it.

## Add at least 2 to-dos and select only one of them. If you click on the Active button, do only the unchecked to-dos appear?

**Yes**

## And if you click on the Completed button, do only the checked to-dos appear?

**Yes**

## Does a Clear Completed button to-dos appear?

**Yes** — shown only when at least one todo is completed.

## When clicking on the clear completed button, does it remove only the checked to-dos?

**Yes**

## When clicking on the Active and Completed buttons, does the URL change?

**Yes** — `#/active` and `#/completed`; loading a URL applies the filter, back/forward work, and unknown URLs go to `#/`.

## Add 3 to-dos to the list and check each one, keeping an eye on the counter of to-dos left to do. Does the counter change accordingly to your actions?

**Yes** — "3 items left", "2 items left", "1 item left", "0 items left", with the number in `<strong>`.

## If you double click a to-do element on the list can you edit that element?

**Yes** — the edit input is focused with the caret at the end; Enter or blur saves (trimmed), Escape cancels, and an empty title deletes the todo.


# Basic

## +Does the code obey the good practices?

**Yes**:

- small ES modules, each file with one job (e.g. `vnode.js` builds elements, `diff.js` updates the page, `router.js` handles the URL)
- JSDoc comments on every exported function
- no `console.log` in the framework, the app or the examples (the server prints one start-up message on purpose)
- no unused imports
- consistent formatting: 2-space indentation, semicolons, single quotes
- the app never touches the DOM itself, except inside `ref`/`onMount` (focusing inputs)

To check, run this from the repository root.

zsh:

```zsh
awk 'FNR==1{prev=""} /^export (function|const)/ && prev !~ /\*\// {print FILENAME": "$0; bad=1} NF{prev=$0} END{if(!bad) print "Every exported function has JSDoc"}' framework/*.js todomvc/**/*.js examples/**/*.js
grep -rn 'console\.log' framework todomvc examples || echo 'No console.log'
perl -0ne 'my $s = $_; for my $n (grep length, map { split /[\s,]+/ } $s =~ /import\s*\{([^}]*)\}/g) { my $c = () = $s =~ /\b\Q$n\E\b/g; print "$ARGV: $n is never used\n" if $c < 2 }' framework/*.js todomvc/**/*.js examples/**/*.js | grep . || echo 'No unused imports'
```


# Bonus

## +Is the performance similar both in the student todoMVC and other examples?

**Yes** — on each change, only the elements that differ are updated: list items are matched by `key` and moved rather than rebuilt, and many state changes in one frame produce one redraw.

To check: DevTools → Performance → record while adding, ticking and filtering todos, next to the reference example, and compare the time each action takes: it should stay within one frame (about 16 ms).

## +Is it easier to handle the DOM using the framework than it is to use plain HTML and JS?

**Yes** — you describe what the page should look like for the current state, and the framework works out the DOM changes.

The same todo item, both ways:

```js
// With the framework: one description, used for the first render and every update
h('li', { key: todo.id, class: todo.completed ? 'completed' : null }, [
  h('label', { on: { dblclick: () => startEditing(todo.id) } }, todo.title),
]);
```

```js
// Plain JS: build it…
const li = document.createElement('li');
const label = document.createElement('label');
label.textContent = todo.title;
label.addEventListener('dblclick', () => startEditing(todo.id));
li.append(label);
list.append(li);

// …update it by hand after every change…
li.classList.toggle('completed', todo.completed);
label.textContent = todo.title;

// …and remove the listener and the element yourself when the todo is deleted
```

What the framework handles for you:

- **Updates**: only what changed is touched, so you never write update code.
- **Lists**: items with a `key` are added, moved and removed automatically.
- **Events**: declared with `on`, cleaned up when the element is removed.
- **Focus and caret**: kept when the page redraws, so typing is never interrupted.

To see this in the TodoMVC app, open [todomvc/components/TodoItem.js](todomvc/components/TodoItem.js). The whole todo item (checkbox, label, delete button and edit input) is built with `h()`; there is no `document.createElement`, `addEventListener` or `classList`. The only direct DOM call is putting the cursor in the edit input when editing starts.

## +Is it easier to handle the routing in JS using the framework?

**Yes** — a route is one line, from `todomvc/app.js`:

```js
createRouter({
  store,
  routes: {
    '/': () => setFilter('all'),
    '/active': () => setFilter('active'),
    '/completed': () => setFilter('completed'),
  },
});
```

The framework handles the first load, links, back/forward, and sends unknown URLs to `#/`.

## +Does the project run quickly and effectively? (Favoring recursivity, no unnecessary data requests, etc...)

**Yes**

- **Recursive**: building (`createElement`), updating (`patchNode` → `updateChildren`) and removing (`unmount`) all walk the tree recursively.
- **No unnecessary requests**: DevTools → Network shows only the project's own 21 files (the HTML page, 2 CSS files and 18 JavaScript modules), each loaded once, all from `localhost`; there are no API calls.
- **No unnecessary work**:
  - `localStorage` is written only when the todos change, not on every key press.
  - `memo` skips building and comparing parts of the page that have not changed.
  - Many state changes in one frame cause a single redraw.

To check the recursion in the code, run this from the repository root. Each line shows a function calling itself (or `patchNode` and `updateChildren` calling each other) for every child.

zsh:

```zsh
grep -n "createElement(child)" framework/render.js; grep -nE "updateChildren\(node|patchNode\(match" framework/diff.js; grep -n "forEach(unmount)" framework/lifecycle.js
```

Expected output (both):

```
84:    el.appendChild(createElement(child));
136:    const node = match ? patchNode(match.node, match.vnode, vnode) : createElement(vnode);
184:  updateChildren(node, oldVNode.children, newVNode.children);
64:    Array.from(node.childNodes).forEach(unmount);
```

| Line | What it shows |
|---|---|
| `render.js:84` | `createElement` builds each child by calling itself |
| `diff.js:136` | `updateChildren` calls `patchNode` for each child |
| `diff.js:184` | `patchNode` calls `updateChildren` for that child's own children |
| `lifecycle.js:64` | `unmount` calls itself for each child before an element is removed |

To see it while the app runs: DevTools → **Performance** → record → tick a todo → stop. In the flame chart under the click, `patchNode` → `updateChildren` → `patchNode` → … is stacked several levels deep, one pair per level of the page (`section` → `ul` → `li` → `div` → `input`).

## +Is the code using asynchronicity to increase performance?

**Yes** — changing the state does not redraw the page straight away. The redraw is scheduled with `requestAnimationFrame`, so any number of changes in the same frame cause **one** redraw, just before the browser paints. (Typing in a form field is the one exception: it redraws as soon as the key is handled, so fast typing is never lost.)

To check, without reading any code:

1. Start the server from the repository root:

   zsh:

   ```zsh
   node server.js
   ```

   bash:

   ```bash
   node server.js
   ```

2. Open <http://localhost:65500/todomvc/>.
3. Open DevTools (Ctrl+Shift+I, or Cmd+Option+I on a Mac) → **Console**.
4. Paste this and press Enter. It makes 100 state changes in a row and counts how many times the page is redrawn:

```js
const { h, createStore, createApp } = await import('/framework/index.js');
const store = createStore({ count: 0 });
let redraws = 0;
createApp({ root: document.createElement('div'), store, view: (state) => { redraws++; return h('p', {}, [String(state.count)]); } });
redraws = 0;
for (let i = 0; i < 100; i++) store.setState((state) => ({ count: state.count + 1 }));
console.log('Redraws straight after 100 changes:', redraws);
await new Promise((done) => requestAnimationFrame(() => setTimeout(done)));
console.log('Redraws after the next frame:', redraws);
```

Expected output:

```
Redraws straight after 100 changes: 0
Redraws after the next frame: 1
```

- **0** means nothing was redrawn while the changes were made: the redraw waited (asynchronous).
- **1** means all 100 changes were then drawn in a single redraw, instead of 100.

The snippet only creates its own small test app in memory; it does not touch the TodoMVC page or its todos. If Chrome asks you to type "allow pasting" first, that is its normal safety prompt for the console.

## +Do you think this project is well done in general?

**Yes** — every question above passes, the framework has no dependencies, and the documentation explains both how to use it and how it works.

To check, in about five minutes:

**1. Run every automatic check at once** from the repository root.

zsh:

```zsh
{ [ -e package.json ] || [ -e node_modules ]; } && echo "FAIL  dependencies found" || echo "OK    no dependencies"
grep -rqE "from +['\"][^./]|https?://[^\"']+\.(js|css)" framework todomvc && echo "FAIL  external library" || echo "OK    no external libraries"
for s in 'Overview' 'Create an element' 'Add attributes' 'Create an event' 'Nest elements' 'How it works'; do grep -q "^## $s" docs/DOCUMENTATION.md && echo "OK    docs: $s" || echo "FAIL  docs: $s"; done
grep -q 'To be written' docs/DOCUMENTATION.md && echo "FAIL  docs has placeholders" || echo "OK    docs complete"
awk 'FNR==1{p=""} /^export (function|const)/ && p !~ /\*\// {b=1} NF{p=$0} END{print b ? "FAIL  missing JSDoc" : "OK    JSDoc on every export"}' framework/*.js todomvc/**/*.js
grep -rq 'console\.log' framework todomvc && echo "FAIL  console.log found" || echo "OK    no console.log"
perl -0ne 'my $s = $_; for my $n (grep length, map { split /[\s,]+/ } $s =~ /import\s*\{([^}]*)\}/g) { my $c = () = $s =~ /\b\Q$n\E\b/g; print "$ARGV\n" if $c < 2 }' framework/*.js todomvc/**/*.js | grep -q . && echo "FAIL  unused imports" || echo "OK    no unused imports"
ok=1; for f in framework/*.js todomvc/**/*.js; do node --input-type=module --check < "$f" 2>/dev/null || { echo "FAIL  syntax error in $f"; ok=; }; done; [ -n "$ok" ] && echo "OK    all JavaScript is valid"
```

Expected output (both): 13 lines, all starting with `OK`. Any problem prints a line starting with `FAIL`.

**2. Try the app** (about two minutes):

1. Run `node server.js` and open <http://localhost:65500/todomvc/>.
2. Add three todos, tick one, then click **Active**, **Completed** and **All**: the list, the counter and the URL change each time.
3. Double-click a todo, change its text and press Enter; then click **Clear completed**.
4. Reload the page: the todos are still there.

**3. Skim the documentation**: open [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) and copy any example into the playground page described in [Try your own code](docs/DOCUMENTATION.md#try-your-own-code).

# Social

## +Did you learn anything from this project?

Up to the auditor

## +Would you recommend/nominate this program as an example for the rest of the school?

Up to the auditor