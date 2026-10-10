import { h } from '../../framework/index.js';
import { toggleTodo, deleteTodo } from '../store.js';

/**
 * One todo in the list.
 *
 * @param {{ id: string, title: string, completed: boolean }} todo
 * @returns {Object} Virtual node.
 */
export function TodoItem(todo) {
  return h('li', { key: todo.id, class: todo.completed ? 'completed' : null }, [
    h('div', { class: 'view' }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        on: { change: () => toggleTodo(todo.id) },
      }),
      h('label', {}, todo.title),
      h('button', { class: 'destroy', on: { click: () => deleteTodo(todo.id) } }),
    ]),
    h('input', { class: 'edit', value: todo.title }),
  ]);
}
