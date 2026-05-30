// ══════════════════════════════════════════════
//  app.js  —  Main controller
// ══════════════════════════════════════════════

// ── Helpers ────────────────────────────────────
function val(id)        { return (document.getElementById(id)?.value || '').trim(); }
function setEl(id, txt) { const e = document.getElementById(id); if (e) e.textContent = txt; }
function toNum(v)       { return parseFloat(String(v).replace(/,/g, '')) || 0; }
function formatMoney(n) {
  const num = parseFloat(String(n).replace(/,/g,'')) || 0;
  return num.toLocaleString('en-US');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ── Page Switching ─────────────────────────────
let currentPage = 'apartments';

const pageModules = {
  apartments: Apartments,
  goods:      Goods,
  finance:    Finance,
  property:   Property
};

function switchPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  document.getElementById(`page-${name}`)?.classList.add('active');
  document.querySelector(`[data-page="${name}"]`)?.classList.add('active');

  currentPage = name;
  pageModules[name]?.load();
}

// ── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  switchPage('apartments');
});
