//---------------------------------------------------------------
// 1. Accès DOM
//---------------------------------------------------------------
const toggle = document.getElementById('toggle');
const range  = document.getElementById('turns');
const valOut = document.getElementById('val');

//---------------------------------------------------------------
// 2. Helper valeur paire
//---------------------------------------------------------------
const toEven = v => (v = Math.max(2, +v || 2), v % 2 ? v + 1 : v);

//---------------------------------------------------------------
// 3. Initialisation UI
//---------------------------------------------------------------
chrome.storage.sync.get({ enabled: true, maxTurns: 2 }, cfg => {
  toggle.checked     = cfg.enabled;
  range.value        = cfg.maxTurns;
  valOut.textContent = cfg.maxTurns;
});

//---------------------------------------------------------------
// 4. Toggle ON/OFF
//---------------------------------------------------------------
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.sync.set({ enabled }, () => {
    if (!enabled) {
      /* on vient de désactiver → recharge l’onglet ChatGPT courant
         pour rapatrier les messages qui avaient été supprimés
         par les anciennes versions ou recalculer les hauteurs */
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    }
  });
});

//---------------------------------------------------------------
// 5. Slider : écriture temps réel
//---------------------------------------------------------------
range.addEventListener('input', () => {
  const even = toEven(range.value);
  range.value        = even;
  valOut.textContent = even;
  chrome.storage.sync.set({ maxTurns: even });
});
