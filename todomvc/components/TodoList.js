import { h } from '../../framework/index.js';
import { TodoItem } from './TodoItem.js';

/**
 * The list of todos.
 *
 * @param {Array<{ id: string, title: string, completed: boolean }>} todos
 * @param {{ editingId: string|null, editTitle: string }} editing - Which todo is being edited, and its typed text.
 * @returns {Object} Virtual node.
 */
export function TodoList(todos, editing) {
  return h('ul', { class: 'todo-list' }, todos.map((todo) => TodoItem(todo, editing)));
}
