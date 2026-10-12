import { h } from '../../framework/index.js';
import { clearCompleted } from '../store.js';

/**
 * The footer: how many todos are left, the filters and the clear button.
 *
 * @param {Array<{ id: string, title: string, completed: boolean }>} todos
 * @param {'all' | 'active' | 'completed'} filter - The filter currently shown.
 * @returns {Object} Virtual node.
 */
export function Footer(todos, filter) {
  const selectedWhen = (name) => (filter === name ? 'selected' : null);
  const active = todos.filter((todo) => !todo.completed).length;
  const completed = todos.length - active;

  return h('footer', { class: 'footer' }, [
    h('span', { class: 'todo-count' }, [
      h('strong', {}, String(active)),
      active === 1 ? ' item left' : ' items left',
    ]),
    h('ul', { class: 'filters' }, [
      h('li', {}, [h('a', { class: selectedWhen('all'), href: '#/' }, 'All')]),
      h('li', {}, [h('a', { class: selectedWhen('active'), href: '#/active' }, 'Active')]),
      h('li', {}, [h('a', { class: selectedWhen('completed'), href: '#/completed' }, 'Completed')]),
    ]),
    completed > 0
      ? h('button', { class: 'clear-completed', on: { click: clearCompleted } }, 'Clear completed')
      : null,
  ]);
}
