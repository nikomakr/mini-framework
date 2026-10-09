import { h, render } from '../framework/index.js';
import { Header } from './components/Header.js';
import { TodoList } from './components/TodoList.js';
import { Footer } from './components/Footer.js';
import { Info } from './components/Info.js';

const app = h('section', { class: 'todoapp' }, [
Header(),
h('section', { class: 'main' }, [
h('input', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox' }),
h('label', { for: 'toggle-all' }, 'Mark all as complete'),
TodoList(),
]),
Footer(),
]);

const page = h('div', {}, [
app,
Info(),
]);

render(page, document.body);
