/* Flâmula · jogo "Qual é o país?": 10 bandeiras, 4 opções, 3 níveis, cronômetro e ranking. */
(() => {
const FL = window.FL; if (!FL) return;
const { $, toast, esc, D, I } = FL;
const FB = () => window.FB || {};
const ROUNDS = 10, LIMIT_DIFICIL = 10000;

const css = document.createElement('style');
css.textContent = `
.jg{max-width:820px;margin:0 auto}
.jg-h{text-align:center;padding:34px 0 22px}
.jg-h h1{font-size:clamp(34px,5vw,56px)}
.jg-h p{color:var(--mut);margin:10px auto 0;max-width:52ch}
.lvls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.lvl{display:grid;gap:8px;align-content:start;text-align:left;padding:20px;border-radius:26px;border:0;color:var(--ink)}
.lvl b{font:700 22px var(--font-d);letter-spacing:-.02em}
.lvl span{color:var(--mut);font-size:14px}
.lvl em{font-style:normal;font-size:13px;font-weight:600;color:var(--azul)}
.lvl i{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font:700 18px var(--font-d);font-style:normal;color:#fff}
.jg-top{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:22px 0 12px}
.jg-pill{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:999px;font-weight:600;font-size:15px;font-variant-numeric:tabular-nums}
.jg-dots{display:flex;gap:6px;justify-content:center;margin:0 0 14px}
.jg-dots i{width:8px;height:8px;border-radius:99px;background:var(--chip);transition:transform .5s var(--spring),background-color .3s}
.jg-dots i.ok{background:#34C759}.jg-dots i.no{background:#FF3B30}.jg-dots i.now{transform:scale(1.6);background:var(--ink)}
.jg-stage{border-radius:34px;aspect-ratio:16/10;display:grid;place-items:center;padding:clamp(18px,6%,48px);position:relative;overflow:hidden}
.jg-stage img,.jg-stage svg{max-width:100%;max-height:100%;width:auto;height:auto;filter:drop-shadow(0 0 .6px rgba(0,0,0,.45)) drop-shadow(0 16px 28px rgba(0,0,0,.25));animation:jgin .6s var(--spring) both}
.jg-stage svg{width:100%;height:100%}
@keyframes jgin{from{opacity:0;transform:scale(.86) translateY(10px)}}
.jg-bar{position:absolute;left:0;bottom:0;height:5px;background:var(--brasa);border-radius:0 4px 4px 0;transition:width .1s linear}
.opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
.opt{min-height:62px;padding:10px 16px;border-radius:22px;border:0;font-weight:600;font-size:17px;color:var(--ink);text-align:center;transition:transform var(--dur) var(--spring),background-color .25s,color .25s}
.opt:active{transform:scale(1.04)}
.opt.ok{background:#34C759!important;color:#fff;animation:bump .7s var(--spring)}
.opt.no{background:#FF3B30!important;color:#fff;animation:shake .45s}
.opt[disabled]{pointer-events:none}
.opt kbd{display:none}
@media(hover:hover){.opt kbd{display:inline;font:600 12px var(--font);color:var(--mut);margin-right:8px;opacity:.7}}
@keyframes shake{20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}

.jg-res{border-radius:34px;padding:30px 22px;text-align:center;display:grid;gap:10px;justify-items:center;margin-top:24px}
.jg-res .big{font:800 clamp(56px,10vw,96px)/1 var(--font-d);letter-spacing:-.05em}
.jg-res .sub{color:var(--mut)}
.jg-res .row2{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.jg-save{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;max-width:440px}
.jg-save input{flex:1 1 200px;min-height:46px;padding:0 16px;border-radius:999px;border:0;background:var(--chip);font-size:16px;color:var(--ink);outline:none}
.rk{display:grid;gap:8px;margin-top:12px}
.rk li{display:grid;grid-template-columns:42px minmax(0,1fr) auto auto;gap:12px;align-items:center;padding:10px 16px;border-radius:20px;font-variant-numeric:tabular-nums}
.rk li b{font:700 18px var(--font-d);text-align:center}
.rk li span{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rk li small{color:var(--mut);font-size:14px;white-space:nowrap}
.rk li.me{box-shadow:0 0 0 2px var(--brasa) inset}
.rk ol{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.medal1 b{color:#D4A017}.medal2 b{color:#8E9AA6}.medal3 b{color:#B0703A}
.jg-sec{margin-top:30px}
@media(max-width:760px){.lvls{grid-template-columns:minmax(0,1fr)}.opt{min-height:58px;font-size:16px}.jg-stage{border-radius:28px}.rk li{grid-template-columns:34px minmax(0,1fr) auto;}.rk li small.t2{display:none}}
`;
document.head.appendChild(css);

/* níveis e bandeiras */
const EASY = ['br', 'ar', 'us', 'ca', 'mx', 'fr', 'de', 'it', 'es', 'pt', 'gb', 'jp', 'cn', 'in', 'ru', 'au', 'za', 'eg', 'ng', 'kr', 'se', 'no', 'fi', 'dk', 'nl', 'be', 'ch', 'at', 'gr', 'tr', 'il', 'sa', 'cl', 'co', 'pe', 've', 'uy', 'cu', 'jm', 'ie', 'pl', 'ua', 'ma', 'nz', 'th', 'vn', 'id', 'ph', 'pk', 'ke', 'gh', 'sn', 'cm', 'py', 'bo', 'ec', 'cz', 'hu', 'ro', 'sg'];
const TERR = new Set(['aq', 'eh', 'hk', 'mo', 'tw', 'gf', 'um', 'hm', 'bv', 'tf', 'gs', 'io', 'xk', 'gb-eng', 'gb-nir', 'gb-sct', 'gb-wls']);
const paises = () => D.filter(f => f.t === 'pais');
const NIV = {
  facil: { nome: 'Fácil', cor: '#34C759', txt: '10 bandeiras conhecidas, opções de todo o mundo.', pool: () => paises().filter(f => EASY.includes(f.id)), distr: f => paises().filter(x => !TERR.has(x.id) && !x.isl) },
  medio: { nome: 'Médio', cor: '#FF9F0A', txt: 'Países de todos os continentes, opções sorteadas entre eles.', pool: () => paises().filter(f => !TERR.has(f.id) && !f.isl), distr: f => paises().filter(x => !TERR.has(x.id) && !x.isl) },
  dificil: { nome: 'Difícil', cor: '#FF3B30', txt: 'Inclui territórios, opções do mesmo continente e 10 segundos por bandeira.', pool: () => paises(), distr: f => { const s = paises().filter(x => x.ct === f.ct); return s.length >= 6 ? s : paises() } }
};
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
const tfmt = ms => { const s = ms / 1000, m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`.replace('.', ',') };
const LKEY = 'flamula-recordes';
const local = () => { try { return JSON.parse(localStorage.getItem(LKEY) || '{}') } catch (e) { return {} } };
const saveLocal = (nivel, r) => { const all = local(); const L = (all[nivel] || []).concat([r]).sort((a, b) => b.pontos - a.pontos).slice(0, 10); all[nivel] = L; try { localStorage.setItem(LKEY, JSON.stringify(all)) } catch (e) { } return L };
const loadImg = f => new Promise(res => { if (!f.src) return res(f.ra ? 'draw' : false); const im = new Image(); const t = setTimeout(() => res(f.ra ? 'draw' : false), 6000); im.onload = () => { clearTimeout(t); res('img') }; im.onerror = () => { clearTimeout(t); res(f.ra ? 'draw' : false) }; im.src = f.src });

let G = null, tick = null, rkTab = 'facil';
const stop = () => { clearInterval(tick); tick = null };

const menu = () => {
  stop(); G = null; const rec = local();
  $('v-jogo').innerHTML = `<div class="jg"><div class="jg-h"><h1>Qual é o país?</h1><p>Uma bandeira, quatro nomes. Acerte as 10 no menor tempo possível e entre no ranking.</p></div>
  <div class="lvls">${Object.entries(NIV).map(([k, n]) => { const b = (rec[k] || [])[0]; return `<button class="lvl lg pr" data-nivel="${k}"><i style="background:${n.cor}">${n.nome[0]}</i><b>${n.nome}</b><span>${n.txt}</span>${b ? `<em>Seu recorde: ${b.acertos}/10 em ${tfmt(b.td * 100)}</em>` : '<em>Jogar</em>'}</button>` }).join('')}</div>
  <section class="jg-sec"><div class="shead"><div><h2>Ranking</h2><p id="rkp">Melhores resultados de cada nível.</p></div><div class="seg" id="rkt"><i class="ind" aria-hidden="true"></i>${Object.entries(NIV).map(([k, n]) => `<button data-v="${k}" class="${k === rkTab ? 'on' : ''}">${n.nome}</button>`).join('')}</div></div><div class="rk" id="rkl"></div></section></div>`;
  segBind($('rkt'), v => { rkTab = v; ranking() }); ranking();
};
const segBind = (el, fn) => { const mv = () => { const b = el.querySelector('button.on'), ind = el.querySelector('.ind'); if (b && b.offsetWidth) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)` } }; el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); mv(); fn(b.dataset.v) }); requestAnimationFrame(mv) };

const ranking = async (hl) => {
  const box = $('rkl'); if (!box) return;
  const row = (r, i) => `<li class="lg ${i < 3 ? 'medal' + (i + 1) : ''} ${hl && r.id === hl ? 'me' : ''}"><b>${i + 1}</b><span>${esc(r.nome)}</span><small>${r.acertos}/10</small><small class="t2">${tfmt(r.td * 100)}</small></li>`;
  if (FB().on) {
    box.innerHTML = '<p class="tl-msg"><span class="sk" style="width:200px"></span></p>';
    try { const L = await FB().ranking(rkTab); $('rkp').textContent = 'Ranking global de cada nível.'; box.innerHTML = L.length ? `<ol>${L.map(row).join('')}</ol>` : '<div class="empty"><b>Ninguém jogou este nível ainda</b><p>Seja o primeiro do ranking.</p></div>'; return } catch (e) { console.warn('[Flâmula] ranking:', e.message) }
  }
  const L = local()[rkTab] || []; $('rkp').textContent = 'Seus melhores resultados neste aparelho.';
  box.innerHTML = L.length ? `<ol>${L.map(row).join('')}</ol>` : '<div class="empty"><b>Sem resultados ainda</b><p>Jogue uma partida para aparecer aqui.</p></div>';
};

const start = async nivel => {
  const N = NIV[nivel], pool = shuffle(N.pool()); G = { nivel, i: 0, ok: 0, res: [], q: [], pool, used: new Set(), t0: 0, acc: 0, run: false };
  $('v-jogo').innerHTML = `<div class="jg"><div class="jg-top"><button class="jg-pill lg pr" id="jgsair">${I('back')}Sair</button><span class="jg-pill lg" style="color:${N.cor}">${N.nome}</span><span class="jg-pill lg" id="jgt" aria-live="off">0:00,0</span></div>
  <div class="jg-dots" id="jgd">${Array.from({ length: ROUNDS }, () => '<i></i>').join('')}</div>
  <div class="jg-stage lg" id="jgs"><span class="sk" style="width:60%;height:40%"></span></div><div class="opts" id="jgo"></div></div>`;
  $('jgsair').onclick = () => { stop(); menu() };
  next();
};
const pick = async () => {
  const N = NIV[G.nivel];
  for (let tries = 0; tries < 12; tries++) {
    const f = G.pool.find(x => !G.used.has(x.id)); if (!f) return null; G.used.add(f.id);
    const how = await loadImg(f); if (!how) continue;
    const others = shuffle(N.distr(f).filter(x => x.id !== f.id && x.n !== f.n)).slice(0, 3);
    return { f, how, opts: shuffle([f, ...others]) };
  }
  return null;
};
const next = async () => {
  if (!G) return;
  if (G.i >= ROUNDS) return finish();
  const dots = $('jgd'); if (dots) dots.children[G.i]?.classList.add('now');
  const q = G.q[G.i] || (G.q[G.i] = await pick());
  if (!G || !$('jgs')) return;
  if (!q) { toast('Não foi possível carregar mais bandeiras agora'); return finish() }
  $('jgs').innerHTML = (q.how === 'img' ? `<img src="${esc(q.f.src)}" alt="Bandeira misteriosa">` : FL.draw(q.f, '').replace(/aria-label="[^"]*"/, 'aria-label="Bandeira misteriosa"')) + (G.nivel === 'dificil' ? '<i class="jg-bar" id="jgb" style="width:100%"></i>' : '');
  $('jgo').innerHTML = q.opts.map((o, k) => `<button class="opt lg" data-id="${esc(o.id)}"><kbd>${k + 1}</kbd>${esc(o.n)}</button>`).join('');
  G.qStart = performance.now(); G.answered = false;
  if (!G.run) { G.run = true; G.t0 = performance.now() }
  if (!tick) tick = setInterval(upd, 100);
  G.pre = G.q[G.i + 1] ? null : pick().then(x => { if (G) G.q[G.i + 1] = x });
};
const upd = () => {
  if (!G || !$('jgt')) return stop();
  $('jgt').textContent = tfmt(performance.now() - G.t0);
  if (G.nivel === 'dificil' && !G.answered) { const left = LIMIT_DIFICIL - (performance.now() - G.qStart); const b = $('jgb'); if (b) b.style.width = Math.max(0, left / LIMIT_DIFICIL * 100) + '%'; if (left <= 0) answer(null) }
};
const answer = id => {
  if (!G || G.answered) return; G.answered = true;
  const q = G.q[G.i], right = id === q.f.id; if (right) G.ok++;
  G.res.push(right);
  document.querySelectorAll('#jgo .opt').forEach(b => { b.disabled = true; if (b.dataset.id === q.f.id) b.classList.add('ok'); else if (b.dataset.id === id) b.classList.add('no') });
  if (!id) toast('Tempo esgotado: era ' + q.f.n);
  const d = $('jgd').children[G.i]; d.classList.remove('now'); d.classList.add(right ? 'ok' : 'no');
  G.i++; setTimeout(async () => { if (G && G.pre) await G.pre; next() }, right ? 750 : 1300);
};
const finish = () => {
  stop(); if (!G) return; const ms = performance.now() - G.t0, td = Math.max(30, Math.min(99999, Math.round(ms / 100))); const N = NIV[G.nivel];
  const p = FB().profile; const r = { nome: '', acertos: G.ok, td, pontos: G.ok * 100000 - td };
  const nivel = G.nivel;
  $('v-jogo').innerHTML = `<div class="jg"><div class="jg-res lg"><span class="jg-pill" style="color:${N.cor};background:var(--chip)">${N.nome}</span><div class="big">${G.ok}/10</div><p class="sub">${G.ok === 10 ? 'Gabaritou!' : G.ok >= 7 ? 'Muito bem.' : G.ok >= 4 ? 'Dá para melhorar.' : 'Tente de novo.'} Tempo: <b>${tfmt(td * 100)}</b></p>
  <div class="jg-save"><input id="jgn" maxlength="24" placeholder="Seu nome no ranking" value="${esc((p && p.nome) || localStorage.getItem('flamula-apelido') || '')}"><button class="btn acc pr" id="jgsv">Salvar no ranking</button></div>
  <div class="row2"><button class="btn gh pr" id="jgag">Jogar de novo</button><button class="btn gh pr" id="jgmn">Trocar de nível</button></div></div>
  <section class="jg-sec"><div class="shead"><div><h2>Ranking · ${N.nome}</h2><p id="rkp"></p></div></div><div class="rk" id="rkl"></div></section></div>`;
  rkTab = nivel; ranking();
  $('jgag').onclick = () => start(nivel); $('jgmn').onclick = menu;
  $('jgsv').onclick = async e => {
    const nome = $('jgn').value.trim().slice(0, 24); if (!nome) return toast('Digite um nome para o ranking');
    try { localStorage.setItem('flamula-apelido', nome) } catch (er) { }
    r.nome = nome; saveLocal(nivel, r); e.currentTarget.disabled = true;
    if (FB().on) { try { const ref = await FB().salvarPlacar(nivel, r); toast('Placar salvo no ranking'); ranking(ref.id); return } catch (er) { toast('Salvo neste aparelho. O ranking global não respondeu.') } } else toast('Placar salvo neste aparelho');
    ranking();
  };
};

addEventListener('keydown', e => { if (!G || $('v-jogo').hidden || G.answered) return; const k = +e.key; if (k >= 1 && k <= 4) { const b = document.querySelectorAll('#jgo .opt')[k - 1]; if (b) answer(b.dataset.id) } });
document.addEventListener('click', e => { const b = e.target.closest('#jgo .opt'); if (b) return answer(b.dataset.id); const l = e.target.closest('[data-nivel]'); if (l) start(l.dataset.nivel) });

FL.views.jogo = () => { document.title = 'Jogo · Flâmula'; if (!G) menu() };
FL.stopGame = () => { stop(); G = null };
})();
