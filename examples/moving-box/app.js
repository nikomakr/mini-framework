import { h, createApp, createStore, createLoop, createKeyState, onGlobal } from '../../framework/index.js';

// Sizes are fixed here, so the loop never has to measure the page.
const ARENA_WIDTH = 480;
const ARENA_HEIGHT = 320;
const BOX_SIZE = 40;
const SPEED = 240; // pixels per second, whatever the frame rate

const COLOURS = ['#d9534f', '#5bc0de', '#5cb85c', '#f0ad4e'];

// The store holds what changes rarely. The position changes every frame, so it does not live here.
const store = createStore({ colour: 0 });

const keys = createKeyState();

// Position and the box element, used by the loop without going through the store.
const position = { x: (ARENA_WIDTH - BOX_SIZE) / 2, y: (ARENA_HEIGHT - BOX_SIZE) / 2 };
let box = null;

/**
 * Keeps a value between a minimum and a maximum.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Moves the box by writing its transform directly, which the browser can do
 * without layout or repaint.
 */
function draw() {
  if (box) box.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
}

/**
 * Moves the box according to the arrow keys held down. Called every frame.
 *
 * @param {number} delta - Milliseconds since the previous frame.
 */
function update(delta) {
  let dx = Number(keys.isDown('ArrowRight')) - Number(keys.isDown('ArrowLeft'));
  let dy = Number(keys.isDown('ArrowDown')) - Number(keys.isDown('ArrowUp'));
  if (dx === 0 && dy === 0) return;

  // Moving diagonally should not be faster than moving straight.
  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  const distance = SPEED * (delta / 1000);
  position.x = clamp(position.x + dx * distance, 0, ARENA_WIDTH - BOX_SIZE);
  position.y = clamp(position.y + dy * distance, 0, ARENA_HEIGHT - BOX_SIZE);
  draw();
}

const loop = createLoop(update);

/**
 * Keeps a reference to the box element, and draws it in its starting place.
 *
 * @param {HTMLElement|null} el - The box, or null when it is removed.
 */
function setBox(el) {
  box = el;
  draw();
}

// Arrow keys would otherwise scroll the page; Space changes the colour.
onGlobal('keydown', (event) => {
  if (event.key.startsWith('Arrow')) event.preventDefault();
  if (event.key === ' ') {
    event.preventDefault();
    store.setState((state) => ({ colour: (state.colour + 1) % COLOURS.length }));
  }
});

/**
 * Describes the page. Only re-renders when the colour changes, never while the box moves.
 *
 * @param {{ colour: number }} state
 * @returns {Object} Virtual node.
 */
function view(state) {
  return h('main', {}, [
    h('h1', {}, 'Moving box'),
    h('p', {}, 'Hold the arrow keys to move. Press Space to change colour.'),
    h('div', {
      class: 'arena',
      onMount: () => loop.start(),
      onUnmount: () => {
        loop.stop();
        keys.destroy();
      },
    }, [
      h('div', { class: 'box', ref: setBox, style: { backgroundColor: COLOURS[state.colour] } }),
    ]),
  ]);
}

createApp({ root: document.getElementById('app'), store, view });
