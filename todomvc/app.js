import { h, createApp } from '../framework/index.js';
import { store, toggleAll } from './store.js';
import { Header } from './components/Header.js';
import { TodoList } from './components/TodoList.js';
import { Footer } from './components/Footer.js';
import { Info } from './components/Info.js';

/**
 * Describes the whole page for the current state.
 *
 * @param {{ todos: Array, newTitle: string }} state
 * @returns {Object} Virtual node.
 */
function view(state) {
  const allCompleted = state.todos.length > 0 && state.todos.every((todo) => todo.completed);

  return h('div', {}, [
    h('section', { class: 'todoapp' }, [
      Header(state),
      h('section', { class: 'main' }, [
        h('input', {
          id: 'toggle-all',
          class: 'toggle-all',
          type: 'checkbox',
          checked: allCompleted,
          on: { change: (event) => toggleAll(event.target.checked) },
        }),
        h('label', { for: 'toggle-all' }, 'Mark all as complete'),
        TodoList(state.todos),
      ]),
      Footer(),
    ]),
    Info(),
  ]);
}

createApp({ root: document.body, store, view });
