import { h } from '../../framework/index.js';
import { TodoItem } from './TodoItem.js';

/**
 * The list of todos.
 *
 * @param {Array<{ id: string, title: string, completed: boolean }>} todos
 * @returns {Object} Virtual node.
 */
export function TodoList(todos) {
  return h('ul', { class: 'todo-list' }, todos.map((todo) => TodoItem(todo)));
}
