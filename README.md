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

## Team

- Niko
- Amal
- Claudia
- Sabri
