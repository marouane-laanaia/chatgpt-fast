//---------------------------------------------------------------
// PARAMÈTRES & ÉTAT
//---------------------------------------------------------------
const QUERY = 'article[data-testid^="conversation-turn-"]';
let observer = null;
let enabled  = false;
let maxTurns = 2;

//---------------------------------------------------------------
// OUTILS d'affichage
//---------------------------------------------------------------
const hide  = el => el.style.display = 'none';
const show  = el => el.style.display = '';

// Ré-affiche absolument tout
function revealAll() {
  document.querySelectorAll(QUERY).forEach(show);
}

//---------------------------------------------------------------
// PRUNING — non destructif
//---------------------------------------------------------------
function prune() {
  if (!enabled) return;
  const turns = [...document.querySelectorAll(QUERY)];
  const split = Math.max(0, turns.length - maxTurns);

  turns.forEach((el, i) => i < split ? hide(el) : show(el));
}

//---------------------------------------------------------------
// OBSERVER
//---------------------------------------------------------------
function setupObserver() {
  if (observer) observer.disconnect();
  observer = null;

  if (!enabled) {
    revealAll();          // ⇐ quand on désactive, tout réapparaît
    return;
  }

  observer = new MutationObserver(prune);
  observer.observe(document.body, { childList: true, subtree: true });
}

//---------------------------------------------------------------
// APPLIQUE RÉGLAGES
//---------------------------------------------------------------
function applySettings(cfg = {}) {
  if ('enabled'  in cfg) enabled  = cfg.enabled;
  if ('maxTurns' in cfg) maxTurns = cfg.maxTurns;

  setupObserver();
  prune();                // exécute une passe immédiate si activé
}

//---------------------------------------------------------------
// 1. Récupération initiale
//---------------------------------------------------------------
chrome.storage.sync.get({ enabled: true, maxTurns: 2 }, applySettings);

//---------------------------------------------------------------
// 2. Réagit aux modifications du popup / options
//---------------------------------------------------------------
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  applySettings({
    enabled : changes.enabled  ? changes.enabled.newValue  : enabled,
    maxTurns: changes.maxTurns ? changes.maxTurns.newValue : maxTurns
  });
});
