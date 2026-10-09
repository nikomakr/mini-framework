import { h } from '../../framework/index.js';

export function Header() {
return h('header', { class: 'header' }, [
h('h1', {}, 'todos'),
h('input', {
class: 'new-todo',
placeholder: 'What needs to be done?',
autofocus: true,
}),
]);
}
