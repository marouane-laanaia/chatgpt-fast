/* Neutralise Prism, KaTeX, renderMath avant qu’ils ne se chargent */
const noop = () => {};

Object.defineProperty(window, 'Prism', {
  configurable: true,
  get: () => ({ highlightAll: noop }),
  set: () => {}
});

window.katex      = { render: noop };
window.renderMath = noop;
