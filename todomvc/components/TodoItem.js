import { h } from '../../framework/index.js';

export function TodoItem() {
return h('li', { class: 'completed' }, [
h('div', { class: 'view' }, [
h('input', { class: 'toggle', type: 'checkbox', checked: true }),
h('label', {}, 'Taste JavaScript'),
h('button', { class: 'destroy' }),
]),
h('input', { class: 'edit', value: 'Create a TodoMVC template' }),
]);
}
