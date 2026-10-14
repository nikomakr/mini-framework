# mini-framework

A small JavaScript framework built from scratch, without any other framework or library, and a TodoMVC app built with it.

The framework covers:

- Abstracting the DOM
- Routing
- State management
- Event handling

## Requirements

- [Node.js](https://nodejs.org/) (any recent version). No packages to install.

## How to run

From the root of the repository:

```bash
node server.js
```

Then open <http://localhost:65500/todomvc/> in your browser.

To use a different port:

```bash
PORT=3000 node server.js
```

No Node.js? Python works too:

```bash
python3 -m http.server 65500
```

## Why a local server?

The project uses JavaScript modules, which browsers will not load from a page opened directly from the file system (`file://`). Any local server fixes this.

## 👥 Team Roles
Team Member	Roles & Responsibilities
Niko
• Product Owner / Manager
• Senior Software Engineer (Code Reviewer)
• Backend Engineer

Amal
• Project Manager / Scrum Master
• UX/UI Researcher
• Product Designer
• Frontend Engineer

Claudia
• QA Engineer
• Frontend Engineer

Sabri
• Full Stack Engineer
• Frontend Engineer

## How We Work
We follow Scrumban, combining Scrum's sprint rhythm with a Kanban board workflow.
⏱️ Sprints & Ceremonies
Sprint Length: 1 week (Monday to Friday) with a sprint goal agreed upon during planning.
Mondays: Sprint Review, Retrospective, and Planning.
Wednesdays: Short mid-sprint check-in.
Daily: Stand-ups posted via chat.
📊 Kanban Board & Flow
Board Columns: Backlog
→
→ Ready
→
→ In progress
→
→ Review
→
→ Done
WIP Limit: One ticket at a time — each person works on a single ticket until it is fully completed.
Definition of Done: Acceptance criteria met, pull request reviewed and merged into main.
🎫 Ticket Standards
Every ticket must include:
A clear goal
Acceptance criteria
An owner
A size (S / M / L)
A priority (Must / Should / Could)
💻 Development Workflow
🌿 Git Branching Strategy
Branch Rule: One branch per ticket.
Naming Convention: <type>/<ticket-id>-<short-name>
Example: feat/MF-02-h-render
💬 Commit Messages
Convention: <type>(<scope>): <ticket title>
Example: feat(server): Set up the repository and a local server
🔀 Pull Requests & Merging
Main Branch Protection: main is protected from direct pushes.
Merging Process: Every change reaches main through a pull request that must be reviewed and squash-merged by Niko.

## Creating Events
Add event handlers inside the on property passed to h(). Use the event name without the on prefix.
Setup Note: To run any of the examples below, save the code as example.js in your project root, create an example.html file with the template below, and start your local server (node server.js). Then, open http://localhost:65500/example.html in your browser.

HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Event example</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./example.js"></script>
  </body>
</html>
Examples
1. Click Event
JavaScript
import { h, render } from './framework/index.js';

const button = h('button', {
  on: {
    click: () => console.log('Button clicked!'),
  },
}, 'Click me');

render(button, document.getElementById('app'));

2. Double-Click Event
Use dblclick to handle a double-click.
JavaScript
import { h, render } from './framework/index.js';

const text = h('p', {
  on: {
    dblclick: () => console.log('Double-clicked!'),
  },
}, 'Double-click this text');

render(text, document.getElementById('app'));
3. Keyboard Bindings with onKey
Use onKey() to run a handler for a specific key. Key names match event.key.
JavaScript
import { h, render, onKey } from './framework/index.js';

const input = h('input', {
  placeholder: 'Press Enter or Escape',
  on: {
    keydown: onKey({
      Enter: () => console.log('Enter pressed!'),
      Escape: () => console.log('Escape pressed!'),
    }),
  },
});

render(input, document.getElementById('app'));
4. Global Keyboard Events with onGlobal
Use onGlobal() to listen for keyboard events across the entire page. By default, key events originating in inputs, text areas, selects, and editable content are ignored.
JavaScript
import { onGlobal } from './framework/index.js';

const stopListening = onGlobal('keydown', (event) => {
  console.log('Key pressed:', event.key);
});
To include keyboard events from inputs, pass allowInInputs: true:
JavaScript
import { onGlobal } from './framework/index.js';

const stopListening = onGlobal(
  'keydown',
  (event) => console.log('Key pressed:', event.key),
  { allowInInputs: true },
);
Cleanup: onGlobal() returns a cleanup function. Call stopListening() when you no longer need the listener.

How Event Handling Works
Event Delegation: For most bubbling events, the framework delegates handling through a shared handler on document. It walks from the event target up through its parent elements to find registered handlers, rather than attaching a separate native event listener to every element.
Non-Bubbling Events: Events that do not bubble—such as focus, blur, mouseenter, mouseleave, load, error, and scroll—are assigned directly to their elements.
Global Handling: Global events use onGlobal(). The blur, focus, and resize global events are handled on window, while other supported global events use the document-level handler.

## Team
- Niko
- Amal
- Claudia
- Sabri
