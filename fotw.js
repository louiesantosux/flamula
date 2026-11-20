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
#v-militares.fwp>.phead,#v-militares.fwp>.notice,#v-militares.fwp>#milg{display:none}
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
  if (!box) { box = document.createElement('section'); box.id = 'fwlista'; box.className = 'fw-sec'; v.appendChild(box) }
  box.innerHTML = `<div class="shead"><div><h2>Todas as bandeiras militares, por país</h2><p>Estandartes, pavilhões e insígnias de cada país, lidos do Flags of the World (FOTW). Só para consulta.</p></div></div>
  <div class="fw-busca"><input id="fwq" type="search" placeholder="Buscar país" autocomplete="off"></div><div class="fw-paises" id="fwps"><span class="sk" style="width:220px"></span></div>`;
  try {
    if (!LISTA) LISTA = (await api('lista=1')).paises.map(p => ({ ...p, pt: nomePt(p) })).sort((a, b) => a.pt.localeCompare(b.pt, 'pt'));
    const draw = q => { const n = FL.norm(q || ''); const L = LISTA.filter(p => !n || FL.norm(p.pt).includes(n) || FL.norm(p.nome).includes(n));
      $('fwps').innerHTML = L.length ? L.map(p => { const f = paisDe(p.code); return `<a class="fw-p lg pr" href="#fotw-${p.code}">${f ? svg(f, '', true) : `<span class="ab">${esc(p.code.toUpperCase())}</span>`}<span>${esc(p.pt)}</span></a>` }).join('') : '<div class="empty"><b>Nenhum país encontrado</b></div>' };
    draw(); $('fwq').oninput = e => draw(e.target.value);
  } catch (e) { $('fwps').innerHTML = `<div class="empty"><b>O FOTW não respondeu agora</b><p>${esc(e.message)}</p><button class="btn gh pr sm" id="fwre">Tentar de novo</button></div>`; $('fwre').onclick = lista }
};

/* página do país */
let PAG = [];
const pais = async code => {
  const v = $('v-militares'); v.classList.add('fwp'); const fl = $('fwlista'); if (fl) fl.remove();
  let box = $('fwpais'); if (!box) { box = document.createElement('section'); box.id = 'fwpais'; v.appendChild(box) }
  box.innerHTML = '<p class="tl-msg"><span class="sk" style="width:240px"></span></p>'; scrollTo(0, 0);
  try {
    if (!LISTA) LISTA = (await api('lista=1')).paises.map(p => ({ ...p, pt: nomePt(p) }));
    const p = LISTA.find(x => x.code === code); if (!p) throw new Error('País não encontrado na lista do FOTW');
    const f = paisDe(code); document.title = 'Militares · ' + p.pt + ' · Flâmula';
    PAG = p.links.map(l => ({ href: l.href, nome: rot(l, p) }));
    box.innerHTML = `<a class="btn gh pr sm" href="#militares">← Militares</a>
    <div class="fw-top">${f ? `<span class="ghf">${svg(f, '', false)}</span>` : ''}<div><h1>${esc(p.pt)}</h1><p class="sub" style="margin:4px 0 0;color:var(--mut)">Bandeiras militares · Flags of the World</p></div></div>
    <div class="fw-tabs" id="fwtabs"></div><div id="fwcont"></div>
    <p class="fw-cred">Imagens reproduzidas sem alterações de <a href="https://www.fotw.info/" target="_blank" rel="noopener">${esc(CREDITO)}</a>, com o autor indicado em cada uma. Uso só para consulta, sem fins comerciais.</p>`;
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
  const tb = e.target.closest('[data-fwt]'); if (tb) { tabs(+tb.dataset.fwt); return }
  const c = $('fwcont'); if (!c || !c._d) return; const d = c._d;
  const l = e.target.closest('[data-fwl]'); if (l) { const L = d.links[+l.dataset.fwl]; let k = PAG.findIndex(p => p.href === L.href); if (k < 0) { PAG.push({ href: L.href, nome: L.txt }); k = PAG.length - 1 } tabs(k); $('fwtabs').scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
  const b = e.target.closest('[data-fwi]'); if (b && FL.viewer) {
    FL.viewer(d.itens.map(it => ({ img: img(it.img), title: it.label || it.sec, cap: [it.sec && it.sec !== it.label ? it.sec : '', it.credito, it.prop ? 'Proporção ' + it.prop : '', 'FOTW Flags Of The World'].filter(Boolean).join(' · ') })), +b.dataset.fwi, { url: d.url, urlLabel: 'Página no FOTW' });
  }
});

window.FLFOTW = { lista, pais };
})();
