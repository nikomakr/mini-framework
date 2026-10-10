import { createStore } from '../framework/index.js';

/**
 * The single store for the TodoMVC app.
 *
 * - todos: Array<{ id: string, title: string, completed: boolean }>
 * - newTitle: the text currently typed in the "What needs to be done?" input
 */
export const store = createStore({ todos: [], newTitle: '' });

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
 * Marks every todo as complete or incomplete.
 *
 * @param {boolean} completed
 */
export function toggleAll(completed) {
  store.setState((state) => ({
    todos: state.todos.map((todo) => ({ ...todo, completed })),
  }));
}
