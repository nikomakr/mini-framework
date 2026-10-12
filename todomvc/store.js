import { createStore } from '../framework/index.js';

/**
 * The single store for the TodoMVC app.
 *
 * - todos: Array<{ id: string, title: string, completed: boolean }>
 * - newTitle: the text currently typed in the "What needs to be done?" input
 */
// Key under which the todos are saved in the browser.
const STORAGE_KEY = 'todos-mini-framework';

/**
 * Reads the saved todos from localStorage. Returns an empty list if nothing
 * is saved, the data is unreadable, or storage is unavailable.
 *
 * @returns {Array<{ id: string, title: string, completed: boolean }>}
 */
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved
      .filter((todo) => todo && typeof todo.title === 'string' && todo.id !== undefined)
      .map((todo) => ({ id: String(todo.id), title: todo.title, completed: Boolean(todo.completed) }));
  } catch {
    return [];
  }
}

/**
 * Saves the todos to localStorage. Does nothing if storage is unavailable.
 *
 * @param {Array<{ id: string, title: string, completed: boolean }>} todos
 */
function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage can be full or blocked (e.g. private browsing); the app still works.
  }
}

export const store = createStore({ todos: loadTodos(), newTitle: '', filter: 'all' });

// Save only when the todos change, not on every keystroke in the input.
store.subscribe((state) => state.todos, (state) => saveTodos(state.todos));

/**
 * Creates a unique id for a new todo.
 *
 * @returns {string}
 */
function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Keeps the store in sync with what is typed in the new-todo input.
 *
 * @param {string} text
 */
export function setNewTitle(text) {
  store.setState({ newTitle: text });
}

/**
 * Adds a todo with the trimmed title and clears the input.
 * Empty or whitespace-only titles are ignored.
 *
 * @param {string} title
 */
export function addTodo(title) {
  const trimmed = title.trim();
  if (!trimmed) return;
  store.setState((state) => ({
    todos: [...state.todos, { id: createId(), title: trimmed, completed: false }],
    newTitle: '',
  }));
}

/**
 * Sets which todos are shown: 'all', 'active' or 'completed'.
 *
 * @param {'all' | 'active' | 'completed'} filter
 */
export function setFilter(filter) {
  store.setState({ filter });
}

/**
 * Returns the todos that match a filter.
 *
 * @param {Array<{ id: string, title: string, completed: boolean }>} todos
 * @param {'all' | 'active' | 'completed'} filter
 * @returns {Array<{ id: string, title: string, completed: boolean }>}
 */
export function filterTodos(todos, filter) {
  if (filter === 'active') return todos.filter((todo) => !todo.completed);
  if (filter === 'completed') return todos.filter((todo) => todo.completed);
  return todos;
}

/**
 * Ticks or unticks one todo.
 *
 * @param {string} id
 */
export function toggleTodo(id) {
  store.setState((state) => ({
    todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
  }));
}

/**
 * Removes one todo.
 *
 * @param {string} id
 */
export function deleteTodo(id) {
  store.setState((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  }));
}
/**
 * Updates the title of one todo.
 *
 * @param {string} id
 * @param {string} title
 */
export function updateTodo(id, title) {
  store.setState((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, title } : todo
    ),
  }));
}
/**
 * Marks every todo as complete or incomplete.
 *
 * @param {boolean} completed
 */
export function toggleAll(completed) {
  store.setState((state) => ({
    todos: state.todos.map((todo) => ({ ...todo, completed })),
  }));
}

/**
 * Removes every completed todo.
 */
export function clearCompleted() {
  store.setState((state) => ({
    todos: state.todos.filter((todo) => !todo.completed),
  }));
}
