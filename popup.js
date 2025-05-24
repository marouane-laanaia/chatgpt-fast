const toggle = document.getElementById('toggle');
const range  = document.getElementById('turns');
const valOut = document.getElementById('val');

chrome.storage.sync.get({enabled:true, maxTurns:2}, cfg => {
  toggle.checked = cfg.enabled;
  range.value    = cfg.maxTurns;
  valOut.textContent = cfg.maxTurns;
});

toggle.addEventListener('change', () =>
  chrome.storage.sync.set({enabled: toggle.checked}));

range.addEventListener('input', () =>
  valOut.textContent = range.value);

range.addEventListener('change', () =>
  chrome.storage.sync.set({maxTurns: Number(range.value)}));
