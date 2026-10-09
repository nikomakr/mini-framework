import { h } from '../../framework/index.js';
import { TodoItem } from './TodoItem.js';

export function TodoList() {
return h('ul', { class: 'todo-list' }, [
TodoItem(),
]);
}
