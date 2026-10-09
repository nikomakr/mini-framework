import { h } from '../../framework/index.js';

export function Footer() {
return h('footer', { class: 'footer' }, [
h('span', { class: 'todo-count' }, [
h('strong', {}, '0'),
' item left',
]),
h('ul', { class: 'filters' }, [
h('li', {}, [
h('a', { class: 'selected', href: '#/' }, 'All'),
]),
h('li', {}, [
h('a', { href: '#/active' }, 'Active'),
]),
h('li', {}, [
h('a', { href: '#/completed' }, 'Completed'),
]),
]),
h('button', { class: 'clear-completed' }, 'Clear completed'),
]);
}
