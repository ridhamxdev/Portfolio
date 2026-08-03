/**
 * Intro handoff (playbook 2.1): the preloader marks done ~0.5s before it
 * fully clears, and gated components (hero) start their entrances early so
 * nothing waits for anything to finish.
 */
let done = false;
const subs = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  subs.forEach((fn) => fn());
  subs.clear();
}

export function isIntroDone() {
  return done;
}

/** Runs cb now if the intro already finished, otherwise on handoff. */
export function onIntroDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}
