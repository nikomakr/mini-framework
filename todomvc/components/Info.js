import { h } from '../../framework/index.js';

export function Info() {
return h('footer', { class: 'info' }, [
h('p', {}, 'Double-click to edit a todo'),
]);
}
