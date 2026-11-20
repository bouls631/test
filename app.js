/* Suivi des tests d'escalade — stockage JSON local ou GitHub */
const LS_CONFIG = 'suivi-tests.config';
const LS_DATA = 'suivi-tests.data';

let data = { version: 2, pdc: 75, sessions: [] };
let config = {};
let draft = {};
let currentDate = null;

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const linkify = (s) => esc(s).replace(/https?:\/\/[^\s<]+/g, (u) => `<a href="${u}" target="_blank" rel="noopener">vidéo</a>`);
const today = () => new Date().toISOString().slice(0, 10);
const frDate = (iso) => iso.split('-').reverse().join('/');

/* ---------- Scores : règles de la colonne « score » du fichier Excel ---------- */
function computeScore(def, raw, pdc) {
  const n = (k) => Number(raw?.[k]) || 0;
  let v = null;
  if (def.mode === 'ratio') v = n('kg') > 0 ? (pdc + n('kg')) / pdc : null;           // (PDC + lesté) / PDC
  if (def.mode === 'time2') v = n('droit') + n('gauche') || null;                     // somme des 2 bras
  if (def.mode === 'charge') v = n('kg') || null;                                     // charge tenue
  if (def.mode === 'reps') v = n('reps') || null;                                     // temps total = reps × cycle
  if (def.mode === 'position') v = n('sec') || null;                                  // temps + position
  if (def.mode === 'repsOrKg') v = n('kg') || n('reps') || null;                      // reps ou charge max
  if (v == null) return null;
  return def.mode === 'ratio' ? Math.round(v * 100) / 100 : v;
}

function scoreText(def, raw, value) {
  if (value == null) return '–';
  if (def.mode === 'ratio') return String(value).replace('.', ',');
  if (def.mode === 'charge') return `${value} kg`;
  if (def.mode === 'reps') return `${value * def.per} s${raw?.reps ? ` (${raw.reps} reps)` : ''}`;
  if (def.mode === 'position') return `${raw?.pos ? raw.pos + ' · ' : ''}${value} s`;
  if (def.mode === 'repsOrKg') return Number(raw?.kg) > 0 ? `${value} kg${raw?.reps ? ` + ${raw.reps} reps` : ''}` : `${value} reps`;
  return `${value} s`;
}

function status(msg) { $('status').textContent = msg; }
function ghStatus(msg) { $('gh-status').textContent = msg; }

/* ---------- Données ---------- */
function saveLocal() { localStorage.setItem(LS_DATA, JSON.stringify(data)); }

function setData(d) {
  data = { version: 2, pdc: Number(d.pdc) || 0, sessions: Array.isArray(d.sessions) ? d.sessions : [] };
  saveLocal();
  renderAll();
}

function sessionFor(date) { return data.sessions.find((s) => s.date === date); }

/* Le protocole suit la suite Jour 1 → Jour 2 → Jour 3 → Jour 1 */
function defaultJour(date) {
  const prev = data.sessions.filter((s) => s.date < date).sort((a, b) => b.date.localeCompare(a.date))[0];
  return prev ? (Number(prev.jour) || 1) % 3 + 1 : 1;
}

function dayShift(date, days) {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function renderAll() {
  renderDay(); renderHistorique(); renderProgression(); renderProgramme();
}

/* Chaque journée a sa propre page : #/jour/AAAA-MM-DD */
function goToDay(date, push = true) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  const changed = currentDate !== date;
  currentDate = date;
  if (push && location.hash !== '#/jour/' + date) location.hash = '#/jour/' + date;
  renderDay();
  if (changed) showTab('saisie');
}

function hashDay() {
  const m = location.hash.match(/^#\/jour\/(\d{4}-\d{2}-\d{2})$/);
  return m ? m[1] : null;
}

function renderDay() {
  if (!currentDate) return;
  const s = sessionFor(currentDate);
  $('test-date').value = currentDate;
  $('jour').value = s?.jour || defaultJour(currentDate);
  $('pdc').value = s?.pdc || data.pdc || '';
  $('bilan').value = s?.bilan || '';
  $('day-label').textContent = 'Test du ' + frDate(currentDate);
  $('day-delete').hidden = !s;
  document.title = `${s ? 'Test du ' + frDate(currentDate) : 'Nouveau jour'} — Suivi escalade`;
  draft = {};
  for (const [tid, r] of Object.entries(s?.results || {})) draft[tid] = { raw: { ...(r.raw || {}) }, flags: { ...(r.flags || {}) } };
  renderSaisie();
}

async function loadInitial() {
  try { config = JSON.parse(localStorage.getItem(LS_CONFIG) || '{}'); } catch { config = {}; }
  for (const k of ['owner', 'repo', 'branch', 'path', 'token']) $(`gh-${k}`).value = config[k] || '';
  const cached = localStorage.getItem(LS_DATA);
  if (cached) {
    try { setData(JSON.parse(cached)); } catch { /* on retombe sur data.json */ }
  } else {
    try {
      const r = await fetch('data.json', { cache: 'no-store' });
      if (r.ok) setData(await r.json());
    } catch { /* ouverture en file:// sans fetch */ }
  }
  currentDate = hashDay() || today();
  if (!location.hash) location.hash = '#/jour/' + currentDate;
  renderAll();
  status(`${data.sessions.length} journée(s) de test · copie locale`);
  if (config.owner && config.repo && config.token) await githubLoad(true);
}

function b64encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}
function b64decode(str) {
  const bin = atob((str || '').replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
function githubUrl() {
  const { owner, repo, path, branch } = config;
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch || 'main')}`;
}
function githubHeaders() {
  return { Authorization: `Bearer ${config.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
}
async function githubError(r) {
  let msg = '';
  try { msg = (await r.json()).message || ''; } catch { /* réponse vide */ }
  if (r.status === 401 || r.status === 403) msg += ' — jeton invalide ou droits insuffisants';
  if (r.status === 409) msg += ' — le fichier a changé sur GitHub, rechargez avant d’envoyer';
  return `${r.status} ${msg}`;
}

async function githubLoad(silent = false) {
  if (!config.owner || !config.repo || !config.token) { ghStatus('Renseignez le propriétaire, le dépôt et le jeton.'); return; }
  ghStatus('Chargement…');
  try {
    const r = await fetch(githubUrl(), { headers: githubHeaders(), cache: 'no-store' });
    if (!r.ok) throw new Error(await githubError(r));
    setData(JSON.parse(b64decode((await r.json()).content)));
    ghStatus(`Chargé depuis ${config.owner}/${config.repo} (${data.sessions.length} journée(s)).`);
    if (!silent) status('Chargé depuis GitHub');
  } catch (e) { ghStatus('Erreur : ' + e.message); status('Erreur GitHub (voir l’onglet Données)'); }
}

async function githubPush() {
  if (!config.owner || !config.repo || !config.token) { ghStatus('Renseignez le propriétaire, le dépôt et le jeton.'); return; }
  ghStatus('Envoi…');
  try {
    const r0 = await fetch(githubUrl(), { headers: githubHeaders(), cache: 'no-store' });
    let sha;
    if (r0.ok) sha = (await r0.json()).sha;
    else if (r0.status !== 404) throw new Error(await githubError(r0));
    const body = {
      message: `Suivi des tests escalade — ${new Date().toLocaleString('fr-FR')}`,
      content: b64encode(JSON.stringify(data, null, 2) + '\n'),
      branch: config.branch || 'main',
    };
    if (sha) body.sha = sha;
    const r = await fetch(githubUrl(), { method: 'PUT', headers: { ...githubHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(await githubError(r));
    ghStatus('Envoyé sur GitHub.'); status('Données enregistrées sur GitHub');
  } catch (e) { ghStatus('Erreur : ' + e.message); }
}

/* ---------- Saisie d'une journée ---------- */
function renderSaisie() {
  const jour = Number($('jour').value);
  $('day-label').textContent = `Test du ${frDate(currentDate)} · Jour ${jour}`;
  const head = '<thead><tr><th>Test</th><th>Saisie</th><th>Score</th><th>Priorité</th><th>Bon potentiel</th><th>Point fort</th></tr></thead>';
  const rows = TEST_DEFS.filter((t) => t.jour === jour).map((def) => {
    const d = draft[def.id] || { raw: {}, flags: {} };
    const raw = d.raw || {}, flags = d.flags || {};
    const value = computeScore(def, raw, Number($('pdc').value));
    const fields = def.fields.map((f) => {
      if (f.key === 'pos') return `<label class="inline">Position
        <select data-field="pos" data-test="${def.id}"><option value="1/4 de front">1/4 de front</option><option value="1/2 front">1/2 front</option><option value="front lever">Front lever</option></select></label>`;
      return `<label class="inline">${esc(f.label)}<input type="number" min="0" step="${f.step}" inputmode="decimal" data-field="${f.key}" data-test="${def.id}" value="${esc(raw[f.key] ?? '')}"></label>`;
    }).join('');
    const flag = (key, label) => `<button type="button" class="flag ${flags[key] ? 'on' : ''}" data-flag="${key}" data-test="${def.id}" title="${label}">${label}</button>`;
    return `<tr data-test="${def.id}">
      <td class="test-name">${def.url ? `<a href="${esc(def.url)}" target="_blank" rel="noopener" title="Vidéo">▶</a> ` : ''}<strong>${esc(def.name)}</strong><br><span class="muted">${linkify(def.rule)}</span></td>
      <td>${fields}</td>
      <td class="score"><span class="computed">${scoreText(def, raw, value)}</span></td>
      <td>${flag('prio', 'P')}</td><td>${flag('pot', 'B')}</td><td>${flag('fort', 'F')}</td>
    </tr>`;
  }).join('');
  $('saisie-table').innerHTML = head + '<tbody>' + rows + '</tbody>';
}

function onField(e) {
  const el = e.target;
  if (!el.dataset.field) return;
  const id = el.dataset.test;
  const def = TEST_DEFS.find((t) => t.id === id);
  const d = (draft[id] ||= { raw: {}, flags: {} });
  (d.raw ||= {})[el.dataset.field] = el.value;
  const row = el.closest('tr');
  row.querySelector('.computed').textContent = scoreText(def, d.raw, computeScore(def, d.raw, Number($('pdc').value)));
}

function saveSession() {
  const date = $('test-date').value;
  const pdc = Number($('pdc').value);
  if (!date) { alert('Choisissez une date.'); return; }
  if (!(pdc > 0)) { alert('Renseignez le PDC (poids de corps) en kg.'); return; }

  const adjacent = data.sessions.some((s) => s.date !== date && Math.abs((new Date(date) - new Date(s.date)) / 86400000) === 1);
  if (adjacent && !confirm('Attention : le fichier prévoit 1 jour de repos total entre chaque jour de test. Enregistrer quand même ?')) return;

  const jour = Number($('jour').value);
  const results = {};
  for (const def of TEST_DEFS.filter((t) => t.jour === jour)) {
    const d = draft[def.id];
    if (!d) continue;
    const raw = d.raw || {}, flags = d.flags || {};
    const value = computeScore(def, raw, pdc);
    if (value == null && !Object.values(flags).some(Boolean)) continue;
    results[def.id] = { raw, flags, score: value, text: scoreText(def, raw, value) };
  }
  if (!Object.keys(results).length) { alert('Saisissez au moins un résultat.'); return; }

  const session = { id: 's-' + date, date, jour, pdc, bilan: $('bilan').value.trim(), results };
  const i = data.sessions.findIndex((s) => s.date === date);
  if (i >= 0) data.sessions[i] = session; else data.sessions.push(session);
  data.pdc = pdc;
  saveLocal();
  renderDay(); renderHistorique(); renderProgression();
  $('saisie-status').textContent = `Journée du ${frDate(date)} enregistrée en local — pensez à l’envoyer sur GitHub.`;
}

/* ---------- Historique ---------- */
function renderHistorique() {
  const sessions = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date));
  $('historique-list').innerHTML = sessions.length ? sessions.map((s) => {
    const n = Object.keys(s.results || {}).length;
    return `<div class="hist-card"><div><h3>Jour ${s.jour || '?'} — ${frDate(s.date)}</h3>
      <p>PDC ${s.pdc} kg · ${n} test(s) renseigné(s)${s.bilan ? ' · ' + esc(s.bilan).slice(0, 90) : ''}</p></div>
      <div class="actions" style="margin:0"><button class="btn" data-open="${esc(s.id)}">Ouvrir</button><button class="btn danger" data-del="${esc(s.id)}">Supprimer</button></div></div>`;
  }).join('') : '<div class="card empty">Aucune journée de test enregistrée.</div>';
}

function openSession(id) {
  const s = data.sessions.find((x) => x.id === id || x.date === id);
  if (!s) return;
  goToDay(s.date);
  window.scrollTo(0, 0);
}

/* ---------- Progression jour par jour ---------- */
function renderProgression() {
  const sessions = [...data.sessions].sort((a, b) => a.date.localeCompare(b.date));
  if (!sessions.length) { $('progression-table').innerHTML = '<tbody><tr><td class="empty">Aucune donnée.</td></tr></tbody>'; return; }
  const head = '<thead><tr><th>Jour</th><th>Test</th>' + sessions.map((s) => `<th><button class="link" data-open="${s.date}" title="Ouvrir cette journée">J${s.jour || '?'} · ${frDate(s.date)}</button></th>`).join('') + '</tr></thead>';
  const rows = TEST_DEFS.map((def) => {
    const vals = sessions.map((s) => s.results?.[def.id]?.score ?? null);
    const cells = vals.map((v, i) => {
      if (v == null) return '<td>–</td>';
      const prev = vals.slice(0, i).reverse().find((x) => x != null);
      const delta = prev == null ? '' : `<br><span class="muted">${v - prev > 0 ? '+' : ''}${Math.round((v - prev) * 100) / 100}</span>`;
      return `<td class="score"><strong>${scoreText(def, sessions[i].results[def.id].raw, v)}</strong>${delta}</td>`;
    }).join('');
    return `<tr><td class="score">J${def.jour}</td><td class="test-name"><strong>${esc(def.name)}</strong></td>${cells}</tr>`;
  }).join('');
  $('progression-table').innerHTML = head + '<tbody>' + rows + '</tbody>';
}

/* ---------- Programmes J1 / J2 / J3 (fichier Excel) ---------- */
function renderProgramme() {
  $('programme-list').innerHTML = PROGRAMS.map((p) => `<div class="card table-wrap prog">
    <h2>${esc(p.title.trim())}</h2>
    <table><thead><tr>${p.header.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${p.rows.filter((r) => r.some(Boolean)).map((r) => `<tr>${r.map((c) => `<td>${linkify(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>
  </div>`).join('');
}

/* ---------- Navigation & événements ---------- */
function showTab(name) {
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('main section').forEach((s) => s.classList.toggle('active', s.id === 'tab-' + name));
}

document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
$('saisie-table').addEventListener('input', onField);
$('saisie-table').addEventListener('change', onField);
$('pdc').addEventListener('input', renderSaisie);
$('jour').addEventListener('change', renderSaisie);
$('saisie-table').addEventListener('click', (e) => {
  const b = e.target.closest('[data-flag]');
  if (!b) return;
  const id = b.dataset.test, key = b.dataset.flag;
  const d = (draft[id] ||= { raw: {}, flags: {} });
  (d.flags ||= {})[key] = !d.flags[key];
  b.classList.toggle('on', !!d.flags[key]);
});
$('save-test').addEventListener('click', saveSession);
$('reset-test').addEventListener('click', renderDay);
$('test-date').addEventListener('change', (e) => goToDay(e.target.value));
$('day-prev').addEventListener('click', () => goToDay(dayShift(currentDate, -1)));
$('day-next').addEventListener('click', () => goToDay(dayShift(currentDate, 1)));
$('day-today').addEventListener('click', () => goToDay(today()));
$('day-new').addEventListener('click', () => goToDay(today()));
$('day-delete').addEventListener('click', () => {
  if (!sessionFor(currentDate) || !confirm(`Supprimer la journée du ${frDate(currentDate)} ?`)) return;
  data.sessions = data.sessions.filter((s) => s.date !== currentDate);
  saveLocal(); renderDay(); renderHistorique(); renderProgression();
});
$('historique-list').addEventListener('click', (e) => {
  const open = e.target.closest('[data-open]'), del = e.target.closest('[data-del]');
  if (open) openSession(open.dataset.open);
  if (del && confirm('Supprimer cette journée de test ?')) {
    data.sessions = data.sessions.filter((s) => s.id !== del.dataset.del);
    saveLocal(); renderAll();
  }
});
$('progression-table').addEventListener('click', (e) => {
  const open = e.target.closest('[data-open]');
  if (open) openSession(open.dataset.open);
});
window.addEventListener('hashchange', () => { const d = hashDay(); if (d) goToDay(d, false); });

$('gh-save-config').addEventListener('click', () => {
  config = Object.fromEntries(['owner', 'repo', 'branch', 'path', 'token'].map((k) => [k, $(`gh-${k}`).value.trim()]));
  localStorage.setItem(LS_CONFIG, JSON.stringify(config));
  ghStatus('Configuration enregistrée dans ce navigateur.');
});
$('gh-load').addEventListener('click', () => {
  config = Object.fromEntries(['owner', 'repo', 'branch', 'path', 'token'].map((k) => [k, $(`gh-${k}`).value.trim()]));
  localStorage.setItem(LS_CONFIG, JSON.stringify(config));
  githubLoad();
});
$('gh-push').addEventListener('click', githubPush);
$('export-json').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' }));
  a.download = 'data.json'; a.click(); URL.revokeObjectURL(a.href);
});
$('import-json').addEventListener('change', async (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.sessions)) throw new Error('format invalide');
    setData(d); status('Données importées');
  } catch (err) { alert('Import impossible : ' + err.message); }
  e.target.value = '';
});

loadInitial();
