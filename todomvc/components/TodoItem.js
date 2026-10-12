import { h } from '../../framework/index.js';
import { onKey } from '../../framework/events.js';
import { toggleTodo, deleteTodo, updateTodo } from '../store.js';
/**
 * One todo in the list.
 *
 * @param {{ id: string, title: string, completed: boolean }} todo
 * @returns {Object} Virtual node.
 */
export function TodoItem(todo) {
    function startEditing(event) {
    const li = event.target.closest('li');
    if (!li) return;

    li.classList.add('editing');

    const input = li.querySelector('.edit');
      if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

   function saveEditing(event, input) {
    const title = input.value.trim();
    const li = input.closest('li');

    if (!title) {
      deleteTodo(todo.id);
      return;
    }

    updateTodo(todo.id, title);

    if (li) li.classList.remove('editing');
  }

  function cancelEditing(event, input) {
    input.value = todo.title;

    const li = input.closest('li');
    if (li) li.classList.remove('editing');
  }
  return h('li', { key: todo.id, class: todo.completed ? 'completed' : null }, [
    h('div', { class: 'view' }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        on: { change: () => toggleTodo(todo.id) },
      }),
h('label', { on: { dblclick: startEditing } }, todo.title),      h('button', { class: 'destroy', on: { click: () => deleteTodo(todo.id) } }),
    ]),
    h('input', { class: 'edit', value: todo.title, on: { blur: (event) => saveEditing(event, event.target), keydown: (event) => { if (event.key === 'Enter') saveEditing(event, event.target); else if (event.key === 'Escape') cancelEditing(event, event.target); } } }),
  ]);
}
