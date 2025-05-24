//---------------------------------------------------------------
// 1. Accès DOM
//---------------------------------------------------------------
const toggle = document.getElementById('toggle');
const range  = document.getElementById('turns');
const valOut = document.getElementById('val');

//---------------------------------------------------------------
// 2. Helper : impose un nombre pair ≥ 2
//---------------------------------------------------------------
const toEven = v => (v = Math.max(2, +v || 2), v % 2 ? v + 1 : v);

//---------------------------------------------------------------
// 3. Init interface ← storage
//---------------------------------------------------------------
chrome.storage.sync.get({ enabled: true, maxTurns: 2 }, cfg => {
  toggle.checked     = cfg.enabled;
  range.value        = cfg.maxTurns;
  valOut.textContent = cfg.maxTurns;
});

//---------------------------------------------------------------
// 4. Toggle ON/OFF : enregistrement immédiat (plus de reload)
//---------------------------------------------------------------
toggle.addEventListener('change', () =>
  chrome.storage.sync.set({ enabled: toggle.checked }));

//---------------------------------------------------------------
// 5. Slider : écriture temps réel
//---------------------------------------------------------------
range.addEventListener('input', () => {
  const even = toEven(range.value);
  range.value        = even;
  valOut.textContent = even;
  chrome.storage.sync.set({ maxTurns: even });
});
