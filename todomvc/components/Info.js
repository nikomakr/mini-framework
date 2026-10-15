import { h } from '../../framework/index.js';

/**
 * The information footer below the app.
 *
 * @returns {Object} Virtual node.
 */
export function Info() {
  return h('footer', { class: 'info' }, [
    h('p', {}, 'Double-click to edit a todo'),
    h('p', {}, [
      'Created by ',
      h('a', { href: '#' }, 'Niko'),
      ', ',
      h('a', { href: '#' }, 'Amal'),
      ', ',
      h('a', { href: '#' }, 'Sabri'),
      ', ',
      h('a', { href: '#' }, 'Claudia'),
    ]),
    h('p', {}, ['Part of ', h('a', { href: 'http://todomvc.com' }, 'TodoMVC')]),
  ]);
}
