/* Flâmula · editor de bandeiras (inspirado no maker do CardArt).
   Tudo roda no navegador: não precisa de conta para criar e baixar. */
(() => {
const FL = window.FL; if (!FL) return;
const { $, toast, D, byId, I, saveBlob } = FL;

/* estilos do editor */
const css = document.createElement('style');
css.textContent = `
.ehead{display:flex;justify-content:space-between;align-items:end;gap:16px;flex-wrap:wrap;padding:36px 0 18px}
.ehead h1{font-size:clamp(32px,4vw,48px)}
.ehead p{margin:8px 0 0;color:var(--mut);max-width:58ch}
.etools{display:flex;gap:6px;flex-wrap:wrap}
.etools .ic[disabled]{opacity:.35;cursor:default}
.egrid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:18px;align-items:start}
.epv{position:sticky;top:96px;display:grid;gap:12px}
.ecv{border-radius:var(--r-l);padding:clamp(18px,4%,40px);display:grid;place-items:center;min-height:300px;background:var(--stage)}
.ecv svg{width:100%;height:auto;max-height:58vh;display:block;touch-action:none;filter:drop-shadow(0 0 .6px rgba(0,0,0,.45)) drop-shadow(0 18px 30px rgba(0,0,0,.22))}
.ecv svg [data-i]{cursor:grab}
.ecv svg.drag [data-i]{cursor:grabbing}
.ebar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.esmall{display:flex;align-items:end;gap:14px;margin-left:auto;color:var(--mut);font-size:12px}
.esmall div{display:grid;justify-items:center;gap:4px}
.esmall svg{display:block;width:auto;box-shadow:0 0 0 1px rgba(0,0,0,.12)}
.epanel{border-radius:var(--r-l);padding:16px;display:grid;gap:14px}
.ename{display:flex;align-items:center;gap:8px;padding:0 14px;min-height:48px;border-radius:999px;background:var(--chip)}
.ename input{flex:1;border:0;background:none;font:600 17px Manrope,sans-serif;color:var(--ink);outline:none;min-height:46px}
.etabs{display:flex;overflow-x:auto}
.etabs button{flex:1 0 auto}
.epane{display:grid;gap:14px}
.elabel{font-size:13px;font-weight:700;color:var(--mut);margin:2px 0 -4px}
.lays{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.lays button{display:grid;gap:5px;justify-items:center;padding:8px 6px;border-radius:16px;border:1px solid var(--line);background:none;font-size:12px;font-weight:600;color:var(--mut)}
.lays button svg{width:100%;height:auto;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.1)}
.lays button.on{border-color:var(--acc);color:var(--ink);box-shadow:0 0 0 2px var(--acc) inset}
.ratios{display:flex;flex-wrap:wrap;gap:6px}
.slots{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
.slot{display:flex;align-items:center;gap:8px;padding:5px 10px 5px 5px;border-radius:999px;background:var(--chip)}
.slot input[type=color]{width:34px;height:34px;border:0;padding:0;border-radius:999px;background:none;cursor:pointer;flex:none}
.slot input[type=color]::-webkit-color-swatch-wrapper{padding:0}
.slot input[type=color]::-webkit-color-swatch{border:1px solid rgba(0,0,0,.15);border-radius:999px}
.slot input[type=text]{width:100%;border:0;background:none;font:600 13px Manrope,sans-serif;color:var(--ink);outline:none;text-transform:uppercase;font-variant-numeric:tabular-nums}
.rng{display:grid;grid-template-columns:92px minmax(0,1fr) 48px;align-items:center;gap:10px;font-size:14px}
.rng output{text-align:right;color:var(--mut);font-variant-numeric:tabular-nums;font-size:13px}
input[type=range]{width:100%;accent-color:var(--acc);height:28px}
.shapes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.shapes button{display:grid;justify-items:center;gap:4px;padding:10px 4px;border-radius:16px;border:1px solid var(--line);background:none;font-size:12px;font-weight:600;color:var(--mut)}
.shapes svg{width:30px;height:30px}
.chlist{display:flex;flex-wrap:wrap;gap:6px}
.chlist button{display:flex;align-items:center;gap:6px;min-height:38px;padding:0 12px 0 6px;border-radius:999px;border:1px solid var(--line);background:none;font-weight:600;font-size:13px}
.chlist button.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.chlist i{width:24px;height:24px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}
.erow{display:flex;flex-wrap:wrap;gap:8px}
.pals{display:grid;gap:8px}
.pals button{display:flex;align-items:center;gap:10px;padding:8px 12px 8px 8px;border-radius:16px;border:1px solid var(--line);background:none;font-weight:600;font-size:14px;text-align:left}
.pals span.c{display:flex;flex:none}
.pals span.c i{width:22px;height:22px;border-radius:999px;margin-left:-6px;box-shadow:0 0 0 2px var(--stage)}
.pals span.c i:first-child{margin-left:0}
.esel{width:100%}
.drop{display:grid;place-items:center;gap:6px;padding:22px;border-radius:20px;border:1.5px dashed var(--line);text-align:center;color:var(--mut);cursor:pointer}
.drop b{color:var(--ink)}
.rules{margin:0;padding-left:18px;color:var(--mut);font-size:14px;display:grid;gap:4px}
.ehint{font-size:13px;color:var(--mut);margin:0}
@media(max-width:980px){.egrid{grid-template-columns:minmax(0,1fr)}.epv{position:sticky;top:72px;z-index:5}.ecv{min-height:0;padding:14px}.ecv svg{max-height:34vh}.esmall{display:none}}
@media(max-width:520px){.lays{grid-template-columns:repeat(3,minmax(0,1fr))}.rng{grid-template-columns:76px minmax(0,1fr) 40px}}
`;
document.head.appendChild(css);

/* geometria */
let uid = 0;
const R = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
const pts = a => a.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
const star = (cx, cy, r, f, n = 5, ir = .382) => { const p = []; for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? r * ir : r, a = -Math.PI / 2 + i * Math.PI / n; p.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]) } return `<polygon points="${pts(p)}" fill="${f}"/>` };
const stripes = (W, H, cs, vert) => cs.map((c, i) => vert ? R(W * i / cs.length, 0, W / cs.length + .6, H, c) : R(0, H * i / cs.length, W, H / cs.length + .6, c)).join('');

const LAYS = [
  ['lisa', 'Lisa', 1], ['h', 'Faixas', 'k'], ['v', 'Colunas', 'k'], ['nord', 'Nórdica', 2],
  ['nord2', 'Nórdica dupla', 3], ['cruz', 'Cruz', 2], ['aspa', 'Aspa', 2], ['cantao', 'Cantão', 2],
  ['cantaoh', 'Cantão e faixas', 3], ['tri', 'Triângulo', 3], ['diag', 'Diagonal', 2], ['banda', 'Banda', 3],
  ['quartos', 'Quartos', 2], ['borda', 'Borda', 2], ['chevron', 'Divisa', 3], ['centro', 'Faixa central', 2]
];
const NAMES = { h: 'Faixa', v: 'Coluna' };
const slotCount = s => { const L = LAYS.find(l => l[0] === s.lay); return L[2] === 'k' ? s.k : L[2] };
const slotLabels = s => {
  const n = slotCount(s);
  const map = { lisa: ['Campo'], nord: ['Campo', 'Cruz'], nord2: ['Campo', 'Contorno', 'Cruz'], cruz: ['Campo', 'Cruz'], aspa: ['Campo', 'Aspa'], cantao: ['Campo', 'Cantão'], cantaoh: ['Faixa de cima', 'Faixa de baixo', 'Cantão'], tri: ['Faixa de cima', 'Faixa de baixo', 'Triângulo'], diag: ['Superior', 'Inferior'], banda: ['Superior', 'Banda', 'Inferior'], quartos: ['Quartos A', 'Quartos B'], borda: ['Campo', 'Borda'], chevron: ['Faixa de cima', 'Faixa de baixo', 'Divisa'], centro: ['Laterais', 'Centro'] };
  return map[s.lay] || Array.from({ length: n }, (_, i) => `${NAMES[s.lay]} ${i + 1}`);
};
const base = (W, H, s) => {
  const c = s.c;
  switch (s.lay) {
    case 'lisa': return R(0, 0, W, H, c[0]);
    case 'h': return stripes(W, H, c.slice(0, s.k));
    case 'v': return stripes(W, H, c.slice(0, s.k), true);
    case 'nord': { const t = H * .2, x = W * .36; return R(0, 0, W, H, c[0]) + R(0, H / 2 - t / 2, W, t, c[1]) + R(x - t / 2, 0, t, H, c[1]) }
    case 'nord2': { const t = H * .26, u = H * .12, x = W * .36; return R(0, 0, W, H, c[0]) + R(0, H / 2 - t / 2, W, t, c[1]) + R(x - t / 2, 0, t, H, c[1]) + R(0, H / 2 - u / 2, W, u, c[2]) + R(x - u / 2, 0, u, H, c[2]) }
    case 'cruz': { const t = H * .2; return R(0, 0, W, H, c[0]) + R(0, H / 2 - t / 2, W, t, c[1]) + R(W / 2 - t / 2, 0, t, H, c[1]) }
    case 'aspa': return R(0, 0, W, H, c[0]) + `<path d="M0 0L${W} ${H}M0 ${H}L${W} 0" stroke="${c[1]}" stroke-width="${H * .18}"/>`;
    case 'cantao': return R(0, 0, W, H, c[0]) + R(0, 0, W * .42, H / 2, c[1]);
    case 'cantaoh': return R(0, 0, W, H / 2, c[0]) + R(0, H / 2, W, H / 2, c[1]) + R(0, 0, H / 2, H / 2, c[2]);
    case 'tri': return R(0, 0, W, H / 2, c[0]) + R(0, H / 2, W, H / 2, c[1]) + `<polygon points="${pts([[0, 0], [W * .4, H / 2], [0, H]])}" fill="${c[2]}"/>`;
    case 'diag': return R(0, 0, W, H, c[0]) + `<polygon points="${pts([[W, 0], [W, H], [0, H]])}" fill="${c[1]}"/>`;
    case 'banda': return R(0, 0, W, H, c[0]) + `<polygon points="${pts([[W, 0], [W, H], [0, H]])}" fill="${c[2]}"/><path d="M0 ${H}L${W} 0" stroke="${c[1]}" stroke-width="${H * .28}"/>`;
    case 'quartos': return R(0, 0, W / 2, H / 2, c[0]) + R(W / 2, 0, W / 2, H / 2, c[1]) + R(0, H / 2, W / 2, H / 2, c[1]) + R(W / 2, H / 2, W / 2, H / 2, c[0]);
    case 'borda': { const b = H * .1; return R(0, 0, W, H, c[1]) + R(b, b, W - 2 * b, H - 2 * b, c[0]) }
    case 'chevron': return R(0, 0, W, H / 2, c[0]) + R(0, H / 2, W, H / 2, c[1]) + `<polygon points="${pts([[0, 0], [W * .22, 0], [W * .5, H / 2], [W * .22, H], [0, H], [W * .28, H / 2]])}" fill="${c[2]}"/>`;
    case 'centro': return R(0, 0, W, H, c[0]) + R(W / 3, 0, W / 3, H, c[1]);
  }
  return '';
};
const SHAPES = [['star5', 'Estrela'], ['star6', 'Estrela 6'], ['disco', 'Disco'], ['anel', 'Anel'], ['crescente', 'Crescente'], ['losango', 'Losango'], ['cruzp', 'Cruz'], ['tri', 'Triângulo']];
const shape = (k, cx, cy, r, f) => {
  switch (k) {
    case 'star5': return star(cx, cy, r, f);
    case 'star6': return star(cx, cy, r, f, 6, .58);
    case 'disco': return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"/>`;
    case 'anel': return `<circle cx="${cx}" cy="${cy}" r="${r * .8}" fill="none" stroke="${f}" stroke-width="${r * .36}"/>`;
    case 'crescente': { const id = 'cm' + (++uid); return `<mask id="${id}"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#fff"/><circle cx="${cx + r * .38}" cy="${cy}" r="${r * .8}" fill="#000"/></mask><circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" mask="url(#${id})"/>` }
    case 'losango': return `<polygon points="${pts([[cx, cy - r], [cx + r * .72, cy], [cx, cy + r], [cx - r * .72, cy]])}" fill="${f}"/>`;
    case 'cruzp': { const a = r * .34; return R(cx - a / 2, cy - r, a, 2 * r, f) + R(cx - r, cy - a / 2, 2 * r, a, f) }
    case 'tri': return `<polygon points="${pts([[cx, cy - r], [cx + r * .92, cy + r * .62], [cx - r * .92, cy + r * .62]])}" fill="${f}"/>`;
  }
  return '';
};
const dimsOf = s => [900, Math.round(900 * s.ra[0] / s.ra[1])];
const build = (s, ed) => {
  const [W, H] = dimsOf(s);
  let o = base(W, H, s);
  if (s.img) { const z = s.img.z * H, x = s.img.x * W - z / 2, y = s.img.y * H - z / 2; o += `<image href="${s.img.src}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${z.toFixed(1)}" height="${z.toFixed(1)}" preserveAspectRatio="xMidYMid meet" opacity="${s.img.op}"/>` }
  s.ch.forEach((c, i) => {
    const cx = c.x * W, cy = c.y * H, r = c.z * H / 2;
    o += `<g ${ed ? `data-i="${i}"` : ''} transform="rotate(${c.r} ${cx.toFixed(1)} ${cy.toFixed(1)})">${shape(c.s, cx, cy, r, c.c)}${ed ? `<circle cx="${cx}" cy="${cy}" r="${Math.max(r, 22)}" fill="transparent"/>` : ''}</g>`;
  });
  if (ed && ed.guides) o += `<g stroke="rgba(255,255,255,.75)" stroke-width="2" stroke-dasharray="8 8" style="mix-blend-mode:difference" pointer-events="none"><path d="M${W / 2} 0V${H}M0 ${H / 2}H${W}M${W / 3} 0V${H}M${W * 2 / 3} 0V${H}M0 ${H / 3}H${W}M0 ${H * 2 / 3}H${W}"/></g>`;
  if (ed && s.sel != null && s.ch[s.sel]) { const c = s.ch[s.sel]; o += `<circle cx="${c.x * W}" cy="${c.y * H}" r="${c.z * H / 2 + 10}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 8" pointer-events="none" style="filter:drop-shadow(0 0 2px rgba(0,0,0,.6))"/>` }
  return o;
};
const svgFull = s => { const [W, H] = dimsOf(s); return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${build(s)}</svg>` };

/* estado, histórico e rascunho */
const KEY = 'flamula-rascunho';
const PALS = [
  ['Flâmula', ['#0E1B3D', '#EFEBE4', '#FF5A1F', '#FF8A3D', '#121317']],
  ['Tropical', ['#009C3B', '#FFDF00', '#002776', '#FFFFFF']],
  ['Pan-africana', ['#078930', '#FCDD09', '#DA121A', '#000000']],
  ['Pan-árabe', ['#CE1126', '#FFFFFF', '#000000', '#007A3D']],
  ['Nórdica', ['#006AA7', '#FECC00', '#FFFFFF', '#BA0C2F']],
  ['Oceano', ['#0A3D62', '#1E6F9F', '#4FB3D9', '#F4F1EA', '#FFB627']],
  ['Crepúsculo', ['#2B2F63', '#874E6E', '#E0784C', '#F4A960', '#FFFFFF']],
  ['Monocromática', ['#121317', '#5F5C57', '#EFEBE4', '#FFFFFF']]
];
const fill7 = a => Array.from({ length: 7 }, (_, i) => a[i % a.length].toUpperCase());
const fresh = () => ({ name: 'Minha bandeira', ra: [2, 3], lay: 'h', k: 3, c: fill7(['#0E1B3D', '#EFEBE4', '#FF5A1F', '#FF8A3D']), ch: [{ s: 'star5', x: .5, y: .5, z: .3, r: 0, c: '#FF5A1F' }], img: null, sel: 0 });
let S = fresh(), hist = [], hi = -1, mode = 'plana', guides = false, tab = 'base', built = false;
const snap = () => JSON.stringify(S);
const commit = () => { const j = snap(); if (hist[hi] === j) return; hist = hist.slice(0, hi + 1); hist.push(j); if (hist.length > 80) hist.shift(); hi = hist.length - 1; try { localStorage.setItem(KEY, j) } catch (e) { } tools() };
const restore = j => { S = JSON.parse(j); renderAll() };
const undo = () => { if (hi > 0) { hi--; restore(hist[hi]); try { localStorage.setItem(KEY, hist[hi]) } catch (e) { } } };
const redo = () => { if (hi < hist.length - 1) { hi++; restore(hist[hi]); try { localStorage.setItem(KEY, hist[hi]) } catch (e) { } } };

/* interface */
const ratios = [[1, 1], [2, 3], [3, 5], [1, 2], [7, 10], [10, 19]];
const icon = { undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3', redo: 'M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3', dice: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8.5 8.5h.01M15.5 15.5h.01M15.5 8.5h.01M8.5 15.5h.01M12 12h.01', reset: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4', grid: 'M4 4h16v16H4zM12 4v16M4 12h16', trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13', copy2: 'M8 8h12v12H8zM4 16V4h12', up: 'M12 19V5M6 11l6-6 6 6', img: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01' };
const ico = n => `<svg class="ico" viewBox="0 0 24 24"><path d="${icon[n]}"/></svg>`;
const segH = (id, items, cur) => `<div class="seg" id="${id}"><i class="ind" aria-hidden="true"></i>${items.map(([v, l]) => `<button data-v="${v}" class="${v === cur ? 'on' : ''}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
const segMove = el => { if (!el) return; const b = el.querySelector('button.on'), ind = el.querySelector('.ind'); if (!b || !b.offsetWidth) return; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`; ind.classList.add('moving'); setTimeout(() => ind.classList.remove('moving'), 220) };
const segSet = (el, v) => { el.querySelectorAll('button').forEach(b => { b.classList.toggle('on', b.dataset.v === v); b.setAttribute('aria-pressed', b.dataset.v === v) }); segMove(el) };

const shell = () => {
  $('v-criar').innerHTML = `
  <div class="ehead"><div><h1>Editor</h1><p>Monte uma bandeira no navegador: proporção, layout, cores e símbolos, com prévia no mastro. Não precisa de conta para criar e baixar.</p></div>
   <div class="etools"><button class="ic pr" id="eundo" aria-label="Desfazer" title="Desfazer (Ctrl+Z)">${ico('undo')}</button><button class="ic pr" id="eredo" aria-label="Refazer" title="Refazer (Ctrl+Shift+Z)">${ico('redo')}</button><button class="btn gh pr" id="erand">${ico('dice')}Surpreenda-me</button><button class="btn gh pr" id="ereset">${ico('reset')}Recomeçar</button></div></div>
  <div class="egrid">
   <section class="epv">
    <div class="ecv lg" id="ecv"></div>
    <div class="ebar">${segH('emode', [['plana', 'Plana'], ['mastro', 'No mastro']], mode)}<button class="btn gh pr" id="eguides" aria-pressed="false">${ico('grid')}Guias</button><div class="esmall" id="esmall"></div></div>
    <p class="ehint">Arraste os símbolos no desenho. Setas movem o símbolo selecionado; Delete remove.</p>
   </section>
   <section class="epanel lg">
    <label class="ename" for="ename">${I('remix').replace('class="ico"', 'class="ico" style="opacity:.6"')}<input id="ename" maxlength="48" placeholder="Nome da bandeira"></label>
    ${segH('etabs', [['base', 'Base'], ['simb', 'Símbolos'], ['img', 'Imagem'], ['cores', 'Cores'], ['exp', 'Exportar']], tab)}
    <div class="epane" id="epane"></div>
   </section>
  </div>`;
  $('etabs').classList.add('etabs');
  built = true;
};

const rng = (id, label, v, min, max, step, fmt) => `<label class="rng" for="${id}"><span>${label}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"><output id="${id}-o">${fmt(v)}</output></label>`;
const pct = v => Math.round(v * 100) + '%';
const deg = v => Math.round(v) + '°';

const pane = () => {
  const p = $('epane'); const s = S;
  if (tab === 'base') {
    const labs = slotLabels(s);
    p.innerHTML = `<p class="elabel">Proporção (altura : largura)</p><div class="ratios">${ratios.map(r => `<button class="chip ${r[0] === s.ra[0] && r[1] === s.ra[1] ? 'on' : ''}" data-ra="${r.join(':')}">${r[0]}:${r[1]}</button>`).join('')}</div>
    <p class="elabel">Layout</p><div class="lays">${LAYS.map(([k, l]) => { const t = { ...s, lay: k, k: s.k }; return `<button class="pr ${k === s.lay ? 'on' : ''}" data-lay="${k}"><svg viewBox="0 0 90 60">${base(90, 60, t)}</svg>${l}</button>` }).join('')}</div>
    ${s.lay === 'h' || s.lay === 'v' ? rng('ek', 'Quantidade', s.k, 2, 7, 1, v => v) : ''}
    <p class="elabel">Cores do layout</p><div class="slots">${labs.map((l, i) => `<label class="slot" title="${l}"><input type="color" data-ci="${i}" value="${s.c[i]}" aria-label="${l}"><input type="text" data-ct="${i}" value="${s.c[i]}" maxlength="7" aria-label="${l} em hex"></label>`).join('')}</div>`;
  } else if (tab === 'simb') {
    const c = s.ch[s.sel];
    p.innerHTML = `<p class="elabel">Adicionar símbolo</p><div class="shapes">${SHAPES.map(([k, l]) => `<button class="pr" data-add="${k}"><svg viewBox="0 0 60 60">${shape(k, 30, 30, 24, 'currentColor')}</svg>${l}</button>`).join('')}</div>
    ${s.ch.length ? `<p class="elabel">Símbolos na bandeira</p><div class="chlist">${s.ch.map((x, i) => `<button class="${i === s.sel ? 'on' : ''}" data-sel="${i}"><i style="background:${x.c}"></i>${SHAPES.find(z => z[0] === x.s)[1]} ${i + 1}</button>`).join('')}</div>` : '<p class="ehint">Nenhum símbolo ainda. Escolha um acima.</p>'}
    ${c ? `<div class="slots"><label class="slot"><input type="color" id="echc" value="${c.c}" aria-label="Cor do símbolo"><input type="text" id="echt" value="${c.c}" maxlength="7" aria-label="Cor do símbolo em hex"></label></div>
     ${rng('ez', 'Tamanho', c.z, .05, 1.2, .01, pct)}${rng('ex', 'Horizontal', c.x, 0, 1, .005, pct)}${rng('ey', 'Vertical', c.y, 0, 1, .005, pct)}${rng('er', 'Rotação', c.r, -180, 180, 1, deg)}
     <div class="erow"><button class="btn gh pr" id="edup">${ico('copy2')}Duplicar</button><button class="btn gh pr" id="efront">${ico('up')}Trazer para frente</button><button class="btn gh pr" id="edel">${ico('trash')}Remover</button><button class="btn gh pr" id="ecenter">Centralizar</button></div>` : ''}`;
  } else if (tab === 'img') {
    p.innerHTML = s.img ? `<div class="erow"><img src="${s.img.src}" alt="" style="height:64px;border-radius:12px;box-shadow:0 0 0 1px var(--line)"></div>
     ${rng('iz', 'Tamanho', s.img.z, .1, 1.6, .01, pct)}${rng('ix', 'Horizontal', s.img.x, 0, 1, .005, pct)}${rng('iy', 'Vertical', s.img.y, 0, 1, .005, pct)}${rng('io', 'Opacidade', s.img.op, .1, 1, .01, pct)}
     <div class="erow"><label class="btn gh pr" for="efile">${ico('img')}Trocar imagem</label><button class="btn gh pr" id="eimgdel">${ico('trash')}Remover imagem</button></div><input type="file" id="efile" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden>
     <p class="ehint">A imagem fica acima do layout e abaixo dos símbolos.</p>`
      : `<label class="drop" for="efile">${ico('img')}<b>Enviar uma imagem</b><span>PNG, JPG, WebP ou SVG, até 5 MB. Ela fica no seu navegador.</span></label><input type="file" id="efile" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden>
     <p class="ehint">Use imagens suas ou de uso livre. Escudos de clubes, logotipos e marcas não são aceitos na galeria.</p>`;
  } else if (tab === 'cores') {
    const of = D.filter(f => !f.approx && f.c && f.c.length > 1 && f.o === 'oficial').sort((a, b) => a.n.localeCompare(b.n, 'pt'));
    p.innerHTML = `<p class="elabel">Paletas</p><div class="pals">${PALS.map(([n, c], i) => `<button class="pr" data-pal="${i}"><span class="c">${c.map(x => `<i style="background:${x}"></i>`).join('')}</span>${n}</button>`).join('')}</div>
    <p class="elabel">Paleta de uma bandeira oficial</p><select class="esel" id="eofpal"><option value="">Escolha uma bandeira…</option>${of.map(f => `<option value="${f.id}">${f.n}</option>`).join('')}</select>
    <p class="ehint">A paleta é aplicada às cores do layout e aos símbolos, na ordem.</p>`;
  } else {
    p.innerHTML = `<div class="erow"><button class="btn acc pr" id="esvgdl">${I('dl')}Baixar SVG</button><button class="btn pr" id="epngdl">${I('dl')}Baixar PNG</button><button class="btn gh pr" id="ecopy">${I('copy')}Copiar SVG</button></div>
    <p class="ehint">O SVG mantém a qualidade em qualquer tamanho. O PNG sai com 1800 px de largura.</p>
    <div class="erow"><button class="btn gh pr" id="esend">Enviar para a galeria</button></div>
    <p class="elabel">Antes de enviar para a galeria</p><ul class="rules"><li>Crie bandeiras originais ou remixes de bandeiras oficiais.</li><li>Não use escudos de clubes, logotipos ou marcas registradas.</li><li>Nada de símbolos de ódio, conteúdo ofensivo ou ataques a grupos.</li><li>Não inclua dados pessoais. Tudo o que é publicado fica visível para todos.</li></ul>`;
  }
};

const cv = () => {
  const [W, H] = dimsOf(S);
  if (mode === 'mastro') {
    const N = 22; let o = `<svg viewBox="-24 -26 ${W + 40} ${H + 60}" role="img" aria-label="Prévia no mastro"><defs><symbol id="ewsym" viewBox="0 0 ${W} ${H}">${build(S)}</symbol>`;
    for (let i = 0; i < N; i++) o += `<clipPath id="ewc${i}"><rect x="${(i * W / N).toFixed(1)}" y="-30" width="${(W / N + 1).toFixed(1)}" height="${H + 60}"/></clipPath>`;
    o += `</defs><rect x="-20" y="-24" width="9" height="${H + 60}" rx="4.5" fill="#9a968f"/>`;
    for (let i = 0; i < N; i++) { const sh = (.5 + .5 * Math.sin(i / N * Math.PI * 3)).toFixed(2); o += `<g clip-path="url(#ewc${i})"><g class="wv" style="animation-delay:${(-i * .13).toFixed(2)}s"><use href="#ewsym" width="${W}" height="${H}"/><rect x="${(i * W / N).toFixed(1)}" y="0" width="${(W / N + 1).toFixed(1)}" height="${H}" fill="#000" opacity="${(sh * .12).toFixed(3)}"/></g></g>` }
    $('ecv').innerHTML = o + '</svg>';
  } else {
    $('ecv').innerHTML = `<svg id="esvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${S.name}">${build(S, { guides })}</svg>`;
  }
  const inner = build(S);
  $('esmall').innerHTML = [64, 32, 16].map(h => `<div><svg viewBox="0 0 ${W} ${H}" style="height:${h}px">${inner}</svg>${h}px</div>`).join('');
};
const tools = () => { if (!built) return; $('eundo').disabled = hi <= 0; $('eredo').disabled = hi >= hist.length - 1 };
const renderAll = () => { $('ename').value = S.name; cv(); pane(); tools() };

/* ações */
const applyPal = cs => { const n = slotCount(S), a = fill7(cs), L = cs.length; S.c = a; S.ch.forEach((c, i) => { let k = (n + i) % L; if (L > 1 && a[k] === a[0]) k = (k + 1) % L; c.c = a[k] }); renderAll(); commit() };
const rnd = a => a[Math.floor(Math.random() * a.length)];
const random = () => {
  const pal = rnd(PALS)[1].slice().sort(() => Math.random() - .5);
  const lay = rnd(LAYS)[0];
  S = { ...S, lay, k: 2 + Math.floor(Math.random() * 3), ra: rnd([[2, 3], [2, 3], [1, 2], [3, 5]]), c: fill7(pal), ch: [], img: S.img, sel: null };
  const nCh = Math.random() < .7 ? 1 + (Math.random() < .3 ? 1 : 0) : 0;
  for (let i = 0; i < nCh; i++) S.ch.push({ s: rnd(['star5', 'star5', 'disco', 'star6', 'crescente', 'losango', 'anel']), x: rnd([.5, .25, .3, .75]), y: rnd([.5, .5, .25]), z: .18 + Math.random() * .25, r: 0, c: pal[(slotCount(S) + i) % pal.length] });
  S.sel = S.ch.length ? 0 : null; renderAll(); commit();
};
const loadImg = file => {
  if (!file) return; if (file.size > 5 * 1024 * 1024) return toast('Imagem acima de 5 MB');
  const r = new FileReader(); r.onload = () => { S.img = { src: r.result, x: .5, y: .5, z: .7, op: 1 }; renderAll(); commit() }; r.readAsDataURL(file);
};
const slug = () => (S.name || 'bandeira').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bandeira';
const dlSVG = () => { saveBlob(new Blob([svgFull(S)], { type: 'image/svg+xml' }), slug() + '.svg'); toast('SVG baixado') };
const dlPNG = () => {
  const [W, H] = dimsOf(S), k = 2, img = new Image();
  img.onload = () => { const c = document.createElement('canvas'); c.width = W * k; c.height = H * k; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); c.toBlob(b => { if (b) { saveBlob(b, slug() + '.png'); toast('PNG baixado') } else toast('Não foi possível gerar o PNG') }, 'image/png') };
  img.onerror = () => toast('Não foi possível gerar o PNG');
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgFull(S));
};

/* eventos */
const bind = () => {
  const root = $('v-criar');
  root.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const tb = t.closest('#etabs'), md = t.closest('#emode');
    if (tb) { tab = t.dataset.v; segSet(tb, tab); pane(); return }
    if (md) { mode = t.dataset.v; segSet(md, mode); cv(); return }
    if (t.id === 'eundo') return undo();
    if (t.id === 'eredo') return redo();
    if (t.id === 'erand') return random();
    if (t.id === 'ereset') { const keep = S.name; S = fresh(); S.name = keep; renderAll(); commit(); return toast('Editor reiniciado') }
    if (t.id === 'eguides') { guides = !guides; t.setAttribute('aria-pressed', guides); t.classList.toggle('on', guides); cv(); return }
    if (t.dataset.ra) { S.ra = t.dataset.ra.split(':').map(Number); renderAll(); commit(); return }
    if (t.dataset.lay) { S.lay = t.dataset.lay; renderAll(); commit(); return }
    if (t.dataset.add) { const used = slotCount(S); S.ch.push({ s: t.dataset.add, x: .5, y: .5, z: .3, r: 0, c: S.c[used % 7] === S.c[0] ? '#FFFFFF' : S.c[used % 7] }); S.sel = S.ch.length - 1; renderAll(); commit(); return }
    if (t.dataset.sel) { S.sel = +t.dataset.sel; cv(); pane(); return }
    if (t.id === 'edel' && S.ch[S.sel]) { S.ch.splice(S.sel, 1); S.sel = S.ch.length ? Math.min(S.sel, S.ch.length - 1) : null; renderAll(); commit(); return }
    if (t.id === 'edup' && S.ch[S.sel]) { const c = { ...S.ch[S.sel] }; c.x = Math.min(1, c.x + .06); c.y = Math.min(1, c.y + .06); S.ch.push(c); S.sel = S.ch.length - 1; renderAll(); commit(); return }
    if (t.id === 'efront' && S.ch[S.sel]) { const [c] = S.ch.splice(S.sel, 1); S.ch.push(c); S.sel = S.ch.length - 1; renderAll(); commit(); return }
    if (t.id === 'ecenter' && S.ch[S.sel]) { S.ch[S.sel].x = .5; S.ch[S.sel].y = .5; renderAll(); commit(); return }
    if (t.id === 'eimgdel') { S.img = null; renderAll(); commit(); return }
    if (t.dataset.pal) return applyPal(PALS[+t.dataset.pal][1]);
    if (t.id === 'esvgdl') return dlSVG();
    if (t.id === 'epngdl') return dlPNG();
    if (t.id === 'ecopy') return navigator.clipboard.writeText(svgFull(S)).then(() => toast('SVG copiado')).catch(() => toast('Não foi possível copiar'));
    if (t.id === 'esend') return toast('O envio para a galeria exige login e entra na próxima etapa. Por enquanto, baixe o arquivo.');
  });
  root.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'ename') { S.name = t.value; return }
    if (t.dataset.ci) { S.c[+t.dataset.ci] = t.value.toUpperCase(); const tx = root.querySelector(`[data-ct="${t.dataset.ci}"]`); if (tx) tx.value = t.value.toUpperCase(); cv(); return }
    if (t.dataset.ct) { if (/^#[0-9a-fA-F]{6}$/.test(t.value)) { S.c[+t.dataset.ct] = t.value.toUpperCase(); const ci = root.querySelector(`[data-ci="${t.dataset.ct}"]`); if (ci) ci.value = t.value; cv() } return }
    const c = S.ch[S.sel];
    const setO = (id, f) => { const o = $(id + '-o'); if (o) o.textContent = f(+t.value) };
    if (c && t.id === 'echc') { c.c = t.value.toUpperCase(); $('echt').value = c.c; cv(); return }
    if (c && t.id === 'echt') { if (/^#[0-9a-fA-F]{6}$/.test(t.value)) { c.c = t.value.toUpperCase(); $('echc').value = t.value; cv() } return }
    if (c && ['ez', 'ex', 'ey', 'er'].includes(t.id)) { c[{ ez: 'z', ex: 'x', ey: 'y', er: 'r' }[t.id]] = +t.value; setO(t.id, t.id === 'er' ? deg : pct); cv(); return }
    if (S.img && ['iz', 'ix', 'iy', 'io'].includes(t.id)) { S.img[{ iz: 'z', ix: 'x', iy: 'y', io: 'op' }[t.id]] = +t.value; setO(t.id, pct); cv(); return }
    if (t.id === 'ek') { S.k = +t.value; setO('ek', v => v); cv(); return }
  });
  root.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'efile') return loadImg(t.files[0]);
    if (t.id === 'eofpal' && t.value) { const f = byId[t.value]; applyPal(f.c); return toast('Paleta de ' + f.n + ' aplicada') }
    if (t.id === 'ek' || t.dataset.ci || t.dataset.ct) { pane(); }
    commit();
  });
  /* arrastar símbolos no desenho */
  let drag = null;
  root.addEventListener('pointerdown', e => {
    const g = e.target.closest('#esvg [data-i]'); if (!g) return;
    const svg = $('esvg'); S.sel = +g.dataset.i; drag = { svg, id: e.pointerId };
    svg.setPointerCapture(e.pointerId); svg.classList.add('drag'); cv(); if (tab === 'simb') pane(); e.preventDefault();
  });
  root.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return; const svg = $('esvg'); if (!svg) return;
    const r = svg.getBoundingClientRect(), c = S.ch[S.sel]; if (!c) return;
    c.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); c.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    $('esvg').innerHTML = build(S, { guides });
    const ex = $('ex'), ey = $('ey'); if (ex) { ex.value = c.x; $('ex-o').textContent = pct(c.x) } if (ey) { ey.value = c.y; $('ey-o').textContent = pct(c.y) }
  });
  const end = () => { if (!drag) return; drag = null; const svg = $('esvg'); if (svg) svg.classList.remove('drag'); cv(); commit() };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  addEventListener('keydown', e => {
    if ($('v-criar').hidden) return;
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); return e.shiftKey ? redo() : undo() }
    if (typing) return;
    const c = S.ch[S.sel]; if (!c) return;
    const st = e.shiftKey ? .05 : .01;
    const mv = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
    if (mv) { e.preventDefault(); c.x = Math.min(1, Math.max(0, c.x + mv[0])); c.y = Math.min(1, Math.max(0, c.y + mv[1])); cv(); if (tab === 'simb') pane(); clearTimeout(bind.t); bind.t = setTimeout(commit, 300) }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); S.ch.splice(S.sel, 1); S.sel = S.ch.length ? 0 : null; renderAll(); commit() }
  });
  addEventListener('resize', () => { if (!$('v-criar').hidden) { segMove($('etabs')); segMove($('emode')) } });
};

/* abrir o editor (rota #criar ou #criar-<id> para remix) */
FL.openEditor = id => {
  if (!built) { shell(); bind() }
  document.title = 'Editor · Flâmula';
  const f = id && byId[id];
  if (f) {
    S = fresh(); S.name = 'Remix de ' + f.n; if (f.ra) S.ra = f.ra.slice();
    const cs = f.c.map(x => x.toUpperCase()); S.lay = cs.length >= 3 ? 'h' : 'lisa'; S.k = Math.min(3, cs.length); S.c = fill7(cs);
    const mid = S.lay === 'lisa' ? S.c[0] : S.c[Math.floor(S.k / 2)];
    S.ch[0].c = cs.find(x => x !== mid) || '#FFFFFF'; if (S.lay === 'lisa') { S.ch[0].s = 'disco'; S.ch[0].z = .5 }
    hist = []; hi = -1; renderAll(); commit(); toast('Paleta de ' + f.n + ' carregada no editor');
  } else if (hi < 0) {
    let saved = null; try { saved = localStorage.getItem(KEY) } catch (e) { }
    if (saved) { try { S = JSON.parse(saved) } catch (e) { S = fresh() } }
    renderAll(); commit();
  } else renderAll();
  requestAnimationFrame(() => { segMove($('etabs')); segMove($('emode')) });
};
if (/^#criar(-|$)/.test(location.hash) && !$('v-criar').hidden) FL.openEditor(location.hash.length > 7 ? location.hash.slice(7) : null);
})();
