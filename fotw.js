/* Flâmula · bandeiras militares por país, lidas do FOTW (Flags of the World) pela função /api/fotw.
   Só para consulta: sem download, sem remix. Crédito ao autor de cada imagem e ao FOTW. */
(() => {
const { $, esc, D, svg, toast } = FL;
const API = '/api/fotw';
const CREDITO = 'FOTW Flags Of The World website at https://www.fotw.info/';
const cache = new Map();
const api = q => { if (cache.has(q)) return cache.get(q); const p = fetch(API + '?' + q).then(r => r.ok ? r.json() : r.json().catch(() => ({})).then(j => { throw new Error(j.erro || 'HTTP ' + r.status) })); p.catch(() => cache.delete(q)); cache.set(q, p); return p };
const img = k => API + '?img=' + encodeURIComponent(k);
const paisDe = code => D.find(f => f.t === 'pais' && (f.k || '').toLowerCase() === code);
const nomePt = p => { const f = paisDe(p.code); return f ? f.n : p.nome };
const ESP = { army: 'Exército', navy: 'Marinha', 'air force': 'Força Aérea', 'naval ensign': 'Pavilhão naval', marines: 'Fuzileiros', 'marine corps': 'Fuzileiros navais', 'coast guard': 'Guarda costeira', 'national guard': 'Guarda nacional', 'armed forces': 'Forças Armadas', military: 'Militares' };
const rot = (l, p) => { const t = l.txt.trim(); return ESP[t.toLowerCase()] || (t === p.nome ? 'Página principal' : t) };

const css = document.createElement('style');
css.textContent = `
#v-militares.fwp>.phead,#v-militares.fwp>.notice,#v-militares.fwp>#milg,#v-militares.fwp>#mildest{display:none}
.fw-hero .dstage:empty::after{content:'Toque em uma bandeira abaixo';color:var(--mut)}
.fw-sec{margin-top:40px}.fw-busca{display:flex;gap:10px;align-items:center;margin:14px 0 16px}
.fw-busca input{flex:1;min-height:44px;border-radius:999px;border:1px solid var(--line);background:var(--chip);padding:0 18px;font:inherit;color:inherit}
.fw-paises{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
.fw-p{display:flex;align-items:center;gap:10px;min-height:52px;padding:8px 14px;border-radius:18px;border:0;text-align:left;font:600 15px var(--font);color:inherit;cursor:pointer}
.fw-p img,.fw-p svg{width:34px;height:24px;object-fit:cover;border-radius:5px;flex:none;box-shadow:0 0 0 1px var(--line)}
.fw-p .ab{width:34px;height:24px;border-radius:5px;background:var(--chip);display:grid;place-items:center;font-size:11px;flex:none}
.fw-top{display:flex;align-items:center;gap:12px;margin:8px 0 6px}.fw-top h1{margin:0;font:700 clamp(28px,5vw,44px)/1.05 var(--font-d)}
.fw-top .ghf img,.fw-top .ghf svg{width:56px;height:38px;object-fit:cover;border-radius:8px;box-shadow:0 0 0 1px var(--line)}
.fw-tabs{display:flex;gap:8px;overflow-x:auto;padding:4px 0 10px;scrollbar-width:none}.fw-tabs .chip[aria-pressed=true]{background:var(--acc);color:var(--acc-ink)}
.fw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.fw-c{border-radius:22px;padding:12px;display:flex;flex-direction:column;gap:10px;cursor:zoom-in;border:0;text-align:left;color:inherit;font:inherit}
.fw-c .st{aspect-ratio:3/2;display:grid;place-items:center;border-radius:14px;background:var(--stage,rgba(127,127,127,.08));overflow:hidden}
.fw-c .st img{width:88%;height:84%;object-fit:contain;filter:drop-shadow(0 4px 12px rgba(0,0,0,.18))}
.fw-c b{font-size:15px;line-height:1.3}.fw-c small{color:var(--mut);font-size:12.5px;line-height:1.35}
.fw-links{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.fw-cred{margin-top:36px;font-size:13px;color:var(--mut)}
.fw-cred a{color:inherit}
@media(max-width:520px){.fw-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.fw-c{padding:8px;border-radius:18px}.fw-paises{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
document.head.appendChild(css);

/* lista de países, embaixo das militares em destaque */
let LISTA = null;
const lista = async () => {
  const v = $('v-militares'); v.classList.remove('fwp'); const fp = $('fwpais'); if (fp) fp.remove();
  let box = $('fwlista');
  if (!box) { box = document.createElement('section'); box.id = 'fwlista'; box.className = 'fw-sec'; v.insertBefore(box, $('milg')) }
  if (!$('mildest')) { const h = document.createElement('div'); h.id = 'mildest'; h.className = 'shead fw-sec'; h.innerHTML = '<div><h2>Em destaque</h2><p>Bandeiras militares com página própria no Flâmula.</p></div>'; v.insertBefore(h, $('milg')) }
  box.innerHTML = `<div class="shead"><div><h2>Bandeiras militares por país</h2><p>Escolha um país para ver todas as bandeiras militares dele, da Wikipédia e do Flags of the World (FOTW).</p></div></div>
  <div class="fw-busca"><input id="fwq" type="search" placeholder="Buscar país" autocomplete="off"></div><div class="fw-paises" id="fwps"><span class="sk" style="width:220px"></span></div>`;
  try {
    if (!LISTA) LISTA = (await api('lista=1')).paises.map(p => ({ ...p, pt: nomePt(p) })).sort((a, b) => a.pt.localeCompare(b.pt, 'pt'));
    const draw = q => { const n = FL.norm(q || ''); const L = LISTA.filter(p => !n || FL.norm(p.pt).includes(n) || FL.norm(p.nome).includes(n));
      $('fwps').innerHTML = L.length ? L.map(p => { const f = paisDe(p.code); return `<a class="fw-p lg pr" href="#fotw-${p.code}">${f ? svg(f, '', true) : `<span class="ab">${esc(p.code.toUpperCase())}</span>`}<span>${esc(p.pt)}</span></a>` }).join('') : '<div class="empty"><b>Nenhum país encontrado</b></div>' };
    draw(); $('fwq').oninput = e => draw(e.target.value);
  } catch (e) { $('fwps').innerHTML = `<div class="empty"><b>O FOTW não respondeu agora</b><p>${esc(e.message)}</p><button class="btn gh pr sm" id="fwre">Tentar de novo</button></div>`; $('fwre').onclick = lista }
};

/* página do país */
let PAG = [], BASE = null, WL = null;
const MILRE = /milit|guerra|naval|marinha|navy|army|ex[ée]rc|for[çc]as? a[ée]rea|armadas|air force|armed forces|ensign|pavilh|jaque|jack|estandarte|standard|costeira|coast guard|fuzileir|marine|defesa|defen[cs]e|regiment|batalh|insígnia|insignia/i;
const wiki = async f => {
  const box = $('fwwl'); if (!box) return;
  const fim = (t) => { if ($('fwwl')) { $('fwwp').textContent = t; $('fwwl').innerHTML = '' } };
  if (!f || !window.FLWIKI || !FLWIKI.lista) return fim('Este país não tem lista de bandeiras ligada no Flâmula.');
  try {
    const l = await FLWIKI.lista(f); if (!$('fwwl') || location.hash !== '#fotw-' + (f.k || '').toLowerCase()) return;
    const S = l && l.sections ? l.sections.filter(s => MILRE.test(s.name)) : [];
    if (!S.length) return fim('A lista de bandeiras deste país na Wikipédia não tem uma seção militar.');
    WL = { l, S };
    $('fwwp').innerHTML = `Seções militares da página <a class="lnk" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)}</a>.`;
    $('fwwl').innerHTML = S.map((s, si) => `<div class="wl-s"><h3>${esc(s.name)} <small>${s.items.length}</small></h3><div class="wl-g">${s.items.map((it, ii) => `<button class="wl-i pr" data-mws="${si}" data-mwi="${ii}"><span class="wl-im"><img src="${esc(it.img)}" alt="" loading="lazy"></span><span class="wl-c">${esc(it.cap || it.file || '')}</span></button>`).join('')}</div></div>`).join('');
  } catch (e) { fim('Não foi possível carregar a lista da Wikipédia agora.') }
};
const pais = async code => {
  const v = $('v-militares'); v.classList.add('fwp'); const fl = $('fwlista'); if (fl) fl.remove();
  let box = $('fwpais'); if (!box) { box = document.createElement('section'); box.id = 'fwpais'; v.appendChild(box) }
  box.innerHTML = '<p class="tl-msg"><span class="sk" style="width:240px"></span></p>'; scrollTo(0, 0);
  try {
    if (!LISTA) LISTA = (await api('lista=1')).paises.map(p => ({ ...p, pt: nomePt(p) }));
    const p = LISTA.find(x => x.code === code); if (!p) throw new Error('País não encontrado na lista do FOTW');
    const f = paisDe(code); document.title = 'Militares · ' + p.pt + ' · Flâmula';
    PAG = p.links.map(l => ({ href: l.href, nome: rot(l, p) }));
    BASE = f || { id: 'fw-' + code, c: ['#FFFFFF', '#000000'], t: 'militar', r: '', ra: [2, 3] };
    box.innerHTML = `<a class="back lg pr" href="#militares">${FL.I('back')}Militares</a>
    <div class="dgrid fw-hero"><div class="dstage lg" id="fwstage">${f ? svg(f, 'fl', false) : ''}</div><div class="dinfo"><div class="dhead lg"><h1>${esc(p.pt)}</h1><p class="of">Bandeiras militares</p><div class="pills"><span class="o">Militar</span>${f && f.ct ? `<span>${esc(f.ct)}</span>` : ''}</div><p style="margin:12px 0 0;color:var(--mut)">Toque em qualquer bandeira para vê-la aqui em destaque, ampliar e baixar. As da Wikipédia também podem ser remixadas.</p>${f ? `<div class="acts"><a class="btn gh pr" href="#b-${esc(f.id)}">Página da bandeira nacional</a></div>` : ''}</div></div></div>
    <section class="sec" id="fwwiki"><div class="shead"><div><h2>Da Wikipédia</h2><p id="fwwp">Procurando as seções militares na lista de bandeiras do país…</p></div></div><div id="fwwl"><p class="tl-msg"><span class="sk" style="width:240px"></span></p></div></section>
    <section class="sec"><div class="shead"><div><h2>Do Flags of the World</h2><p>Imagens do FOTW com o autor de cada uma. Podem ser baixadas com crédito, mas não alteradas.</p></div></div><div class="fw-tabs" id="fwtabs"></div><div id="fwcont"></div></section>
    <p class="fw-cred">Imagens do FOTW reproduzidas sem alterações de <a href="https://www.fotw.info/" target="_blank" rel="noopener">${esc(CREDITO)}</a>, com o autor indicado em cada uma. Uso só para consulta, sem fins comerciais.</p>`;
    wiki(f);
    tabs(0);
  } catch (e) { box.innerHTML = `<a class="btn gh pr sm" href="#militares">← Militares</a><div class="empty" style="margin-top:20px"><b>Não foi possível carregar</b><p>${esc(e.message)}</p><button class="btn gh pr sm" id="fwre">Tentar de novo</button></div>`; $('fwre').onclick = () => pais(code) }
};
const tabs = i => {
  $('fwtabs').innerHTML = PAG.length > 1 ? PAG.map((t, k) => `<button class="chip pr" data-fwt="${k}" aria-pressed="${k === i}">${esc(t.nome)}</button>`).join('') : '';
  pagina(i);
};
const pagina = async i => {
  const t = PAG[i], c = $('fwcont'); if (!c) return;
  c.innerHTML = '<div class="fw-grid">' + '<div class="fw-c lg"><div class="st"><span class="sk" style="width:60%"></span></div></div>'.repeat(6) + '</div>';
  try {
    const d = await api('p=' + encodeURIComponent(t.href)); if (PAG[i] !== t) return;
    const grupos = []; d.itens.forEach((it, k) => { it.k = k; const g = grupos[grupos.length - 1]; if (g && g.sec === it.sec) g.L.push(it); else grupos.push({ sec: it.sec, L: [it] }) });
    c.innerHTML = (d.itens.length ? grupos.map(g => `${g.sec ? `<div class="ghd">${esc(g.sec)}</div>` : ''}<div class="fw-grid">${g.L.map(it => `<button class="fw-c lg pr" data-fwi="${it.k}"><div class="st"><img src="${img(it.img)}" alt="${esc(it.label || 'Bandeira')}" loading="lazy" decoding="async"></div><b>${esc(it.label || it.sec || 'Bandeira')}</b>${it.credito ? `<small>${esc(it.credito)}</small>` : ''}${it.prop ? `<small>Proporção ${esc(it.prop)}</small>` : ''}</button>`).join('')}</div>`).join('')
      : '<div class="empty"><b>Esta página do FOTW não tem imagens de bandeiras</b><p>Veja as páginas relacionadas abaixo.</p></div>')
      + (d.links.length ? `<div class="ghd" style="font-size:17px">Páginas relacionadas no FOTW</div><div class="fw-links">${d.links.map((l, k) => `<button class="chip pr" data-fwl="${k}">${esc(l.txt)}</button>`).join('')}</div>` : '')
      + `<p class="fw-cred"><a href="${esc(d.url)}" target="_blank" rel="noopener">Abrir esta página no FOTW ↗</a></p>`;
    c._d = d;
  } catch (e) { c.innerHTML = `<div class="empty"><b>O FOTW não respondeu agora</b><p>${esc(e.message)}</p><button class="btn gh pr sm" data-fwt="${i}">Tentar de novo</button></div>` }
};

document.addEventListener('click', e => {
  const mw = e.target.closest('[data-mws]'); if (mw && WL) { const s = WL.S[+mw.dataset.mws]; const k = +mw.dataset.mwi; FL.pickFlag({ ...s.items[k], title: s.name, page: WL.l.url }, BASE, { stage: '#fwstage', list: s.items.map(x => ({ ...x, title: s.name })), idx: k }); return }
  const tb = e.target.closest('[data-fwt]'); if (tb) { tabs(+tb.dataset.fwt); return }
  const c = $('fwcont'); if (!c || !c._d) return; const d = c._d;
  const l = e.target.closest('[data-fwl]'); if (l) { const L = d.links[+l.dataset.fwl]; let k = PAG.findIndex(p => p.href === L.href); if (k < 0) { PAG.push({ href: L.href, nome: L.txt }); k = PAG.length - 1 } tabs(k); $('fwtabs').scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
  const b = e.target.closest('[data-fwi]'); if (b) {
    const L = d.itens.map(it => ({ img: img(it.img), big: img(it.img), file: '', title: it.label || it.sec || 'Bandeira', cap: [it.sec && it.sec !== it.label ? it.sec : '', it.prop ? 'Proporção ' + it.prop : ''].filter(Boolean).join(' · '), credito: it.credito ? it.credito + ' · FOTW' : 'FOTW Flags Of The World', fotw: true, page: d.url, nome: it.img.split('/').pop() }));
    const k = +b.dataset.fwi; FL.pickFlag(L[k], BASE, { stage: '#fwstage', list: L.map(x => ({ ...x, cap: [x.cap, x.credito].filter(Boolean).join(' · ') })), idx: k });
  }
});

window.FLFOTW = { lista, pais };
})();
