// Jobs waiting for the next frame. A Set means the same job only runs once per frame.
const queue = new Set();
let scheduled = false;

/**
 * Runs every queued job, once each.
 */
function flush() {
  scheduled = false;
  const jobs = [...queue];
  queue.clear();
  jobs.forEach((job) => job());
}

/**
 * Queues a job to run on the next animation frame. Queuing the same job
 * several times before that frame still runs it only once.
 *
 * @example
 * scheduleRender(update); // many calls in one frame → one update
 *
 * @param {Function} job - The work to run, e.g. a render.
 */
export function scheduleRender(job) {
  queue.add(job);
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(flush);
}
