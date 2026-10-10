import { h, onKey } from '../../framework/index.js';
import { addTodo, setNewTitle } from '../store.js';

/**
 * The page header with the input for new todos.
 *
 * @param {{ newTitle: string }} state
 * @returns {Object} Virtual node.
 */
export function Header({ newTitle }) {
  return h('header', { class: 'header' }, [
    h('h1', {}, 'todos'),
    h('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      value: newTitle,
      on: {
        input: (event) => setNewTitle(event.target.value),
        keydown: onKey({ Enter: (event) => addTodo(event.target.value) }),
      },
    }),
  ]);
}
