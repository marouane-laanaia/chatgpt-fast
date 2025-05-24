const noop = () => {};

// Neutralise Prism avant qu'il se charge
Object.defineProperty(window, 'Prism', {
  configurable: true,
  get: () => ({ highlightAll: noop }),
  set: noop
});

window.katex      = { render: noop };
window.renderMath = noop;
