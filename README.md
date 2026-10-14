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
PORT=65500 node server.js
```

No Node.js? Python works too:

```bash
python3 -m http.server 65500
```

## Why a local server?

The project uses JavaScript modules, which browsers will not load from a page opened directly from the file system (`file://`). Any local server fixes this.

## Documentation

How to use the framework, with code examples, and how it works: [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md).

## Team Roles

| Team member | Roles & responsibilities |
|---|---|
| Niko | Product Owner / Manager<br>Senior Software Engineer (Code Reviewer)<br>Backend Engineer |
| Amal | Project Manager / Scrum Master<br>UX/UI Researcher<br>Product Designer<br>Frontend Engineer |
| Claudia | QA Engineer<br>Frontend Engineer |
| Sabri | Full Stack Engineer<br>Frontend Engineer |

## How We Work

We follow Scrumban, combining Scrum's sprint rhythm with a Kanban board workflow.

### Sprints & Ceremonies

- **Sprint length:** 1 week (Monday to Friday), with a sprint goal agreed during planning.
- **Mondays:** Sprint Review, Retrospective and Planning.
- **Wednesdays:** Short mid-sprint check-in.
- **Daily:** Stand-ups posted via chat.

### Kanban Board & Flow

- **Board columns:** Backlog → Ready → In progress → Review → Done
- **WIP limit:** One ticket at a time — each person works on a single ticket until it is fully completed.
- **Definition of Done:** Acceptance criteria met, pull request reviewed and merged into `main`.

### Ticket Standards

Every ticket must include:

- A clear goal
- Acceptance criteria
- An owner
- A size (S / M / L)
- A priority (Must / Should / Could)

## Development Workflow

### Git Branching Strategy

- **Branch rule:** One branch per ticket.
- **Naming convention:** `<type>/<ticket-id>-<short-name>`
- **Example:** `feat/MF-02-h-render`

### Commit Messages

- **Convention:** `<type>(<scope>): <ticket title>`
- **Example:** `feat(server): Set up the repository and a local server`

### Pull Requests & Merging

- **Main branch protection:** `main` is protected from direct pushes.
- **Merging process:** Every change reaches `main` through a pull request that must be reviewed and squash-merged by Niko.
