import { h } from '../../framework/index.js';
import { clearCompleted } from '../store.js';

/**
 * The footer: how many todos are left, the filters and the clear button.
 *
 * @param {Array<{ id: string, title: string, completed: boolean }>} todos
 * @returns {Object} Virtual node.
 */
export function Footer(todos) {
  const active = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - active;

  return h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' }, [
      h('strong', {}, String(active)),
      active === 1 ? ' item left' : ' items left',
    ]),
    h('ul', { class: 'filters' }, [
      h('li', {}, [h('a', { class: 'selected', href: '#/' }, 'All')]),
      h('li', {}, [h('a', { href: '#/active' }, 'Active')]),
      h('li', {}, [h('a', { href: '#/completed' }, 'Completed')]),
    ]),
    completed > 0
      ? h('button', { class: 'clear-completed', on: { click: clearCompleted } }, 'Clear completed')
      : null,
  ]);
}
