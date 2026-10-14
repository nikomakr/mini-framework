import { h, onKey } from '../../framework/index.js';
import {
  toggleTodo,
  deleteTodo,
  startEditing,
  setEditTitle,
  saveEditing,
  cancelEditing,
} from '../store.js';

/**
 * Focuses the edit input with the caret at the end. Given to the input as a
 * `ref` only while its todo is being edited, so it runs once when editing
 * starts (and with null when it stops).
 *
 * @param {HTMLInputElement|null} input
 */
function focusAtEnd(input) {
  if (!input) return;
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

/**
 * One todo in the list.
 *
 * @param {{ id: string, title: string, completed: boolean }} todo
 * @param {{ editingId: string|null, editTitle: string }} editing - Which todo is being edited, and its typed text.
 * @returns {Object} Virtual node.
 */
export function TodoItem(todo, { editingId, editTitle }) {
  const isEditing = todo.id === editingId;
  const classes = [todo.completed && 'completed', isEditing && 'editing'].filter(Boolean).join(' ');

  return h('li', { key: todo.id, class: classes || null }, [
    h('div', { class: 'view' }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        on: { change: () => toggleTodo(todo.id) },
      }),
      h('label', { on: { dblclick: () => startEditing(todo.id) } }, todo.title),
      h('button', { class: 'destroy', on: { click: () => deleteTodo(todo.id) } }),
    ]),
    h('input', {
      class: 'edit',
      value: isEditing ? editTitle : todo.title,
      ref: isEditing ? focusAtEnd : undefined,
      on: {
        input: (event) => setEditTitle(event.target.value),
        keydown: onKey({ Enter: saveEditing, Escape: cancelEditing }),
        blur: saveEditing,
      },
    }),
  ]);
}
