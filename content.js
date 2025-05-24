// -------------- utilitaires ---------------------------------------
const noop = () => {};
Object.defineProperty(window, 'Prism', { configurable:true, get:()=>({highlightAll:noop}), set:noop });
window.katex = { render:noop };
window.renderMath = noop;

// -------------- applique / retire le prune ------------------------
const QUERY = '[data-testid^="conversation-turn-"]';
let observer, enabled = false, maxTurns = 2;

function applyPrune() {
  if (!enabled) return;
  const turns = Array.from(document.querySelectorAll(QUERY));
  turns.slice(0, -maxTurns).forEach(el => el.remove());        // suppression HARD
}

function installObserver() {
  if (observer) observer.disconnect();
  if (!enabled) return;
  observer = new MutationObserver(applyPrune);
  observer.observe(document.body, { childList:true, subtree:true });
}

// -------------- charge paramètres et écoute changements ----------
chrome.storage.sync.get({enabled:true, maxTurns:2}, cfg => {
  enabled   = cfg.enabled;
  maxTurns  = cfg.maxTurns;
  applyPrune();
  installObserver();
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled)  enabled  = changes.enabled.newValue;
  if (changes.maxTurns) maxTurns = changes.maxTurns.newValue;
  applyPrune();
  installObserver();
});
