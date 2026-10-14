import { h, createApp, createRouter } from '../framework/index.js';
import { store, toggleAll, setFilter, filterTodos } from './store.js';
import { Header } from './components/Header.js';
import { TodoList } from './components/TodoList.js';
import { Footer } from './components/Footer.js';
import { Info } from './components/Info.js';

/**
 * Describes the whole page for the current state: the app itself and the
 * information footer, placed side by side directly in the body, as in the
 * reference TodoMVC.
 *
 * @param {{ todos: Array, newTitle: string, filter: string, editingId: string|null, editTitle: string }} state
 * @returns {Array<Object>} Virtual nodes.
 */
function view(state) {
  const hasTodos = state.todos.length > 0;
  const allCompleted = hasTodos && state.todos.every((todo) => todo.completed);

  return [
    h('section', { class: 'todoapp' }, [
      Header(state),
      // The list and the footer are only shown when there is at least one todo.
      hasTodos && h('section', { class: 'main' }, [
        h('input', {
          id: 'toggle-all',
          class: 'toggle-all',
          type: 'checkbox',
          checked: allCompleted,
          on: { change: (event) => toggleAll(event.target.checked) },
        }),
        h('label', { for: 'toggle-all' }, 'Mark all as complete'),
        TodoList(filterTodos(state.todos, state.filter), state),
      ]),
      hasTodos && Footer(state.todos, state.filter),
    ]),
    Info(),
  ];
}

// The URL decides which todos are shown: #/, #/active or #/completed.
createRouter({
  store,
  routes: {
    '/': () => setFilter('all'),
    '/active': () => setFilter('active'),
    '/completed': () => setFilter('completed'),
  },
});

createApp({ root: document.body, store, view });
