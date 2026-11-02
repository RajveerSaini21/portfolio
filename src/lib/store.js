// Scroll and pointer live in a plain module object, not React state.
//
// A scroll listener that calls setState would re-render the React tree on every
// wheel tick. Instead the DOM listener mutates this object and the 3D scene
// reads it inside useFrame, so scrolling costs zero React renders.

export const view = {
  /** Document scroll progress, 0 at the top and 1 at the bottom. */
  progress: 0,
  /** Pointer position normalized to -1..1, used for camera parallax. */
  pointerX: 0,
  pointerY: 0,
}

/** Index of the section currently filling most of the viewport. */
export const activeSection = { index: 0 }
