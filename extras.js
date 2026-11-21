/* Flâmula · notificações internas, conquistas e concursos mensais. */
(() => {
const FL = window.FL; if (!FL) return;
const { $, toast, esc, byId, I } = FL;
const FB = () => window.FB || {};
FL.ext = FL.ext || {};

const css = document.createElement('style');
css.textContent = `
/* sino */
#bell{position:relative;display:inline-flex}
#bell[hidden]{display:none}
.bellb{position:relative}
.bellb b{position:absolute;top:2px;right:2px;min-width:18px;height:18px;padding:0 5px;border-radius:99px;background:#FF3B30;color:#fff;font:700 11px/18px var(--font);text-align:center;box-shadow:0 0 0 2px var(--bg)}
.ntp{position:fixed;z-index:96;top:76px;right:max(16px,calc((100vw - 1200px)/2));width:min(400px,calc(100vw - 24px));max-height:min(560px,calc(100vh - 120px));display:flex;flex-direction:column;border-radius:28px;overflow:hidden;animation:ntin .35s var(--spring) both}
@keyframes ntin{from{opacity:0;transform:translateY(-8px) scale(.97)}}
.ntp header{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px 18px 10px}
.ntp header b{font:700 18px var(--font-d)}
.ntp header button{border:0;background:none;color:var(--azul);font:600 13px var(--font);padding:6px}
.ntl{overflow:auto;padding:0 8px 10px;display:grid;gap:4px}
.nti{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:12px;align-items:start;padding:10px;border-radius:18px;color:inherit;text-decoration:none}
.nti:hover{background:var(--chip)}
.nti.nova{background:color-mix(in srgb,var(--azul) 9%,transparent)}
.nti i{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;font-style:normal;font-size:17px;background:var(--chip)}
.nti p{margin:0;font-size:14px;line-height:1.4}
.nti small{color:var(--mut);font-size:12px}
.nti .x{border:0;background:none;color:var(--mut);font-size:18px;line-height:1;padding:4px 6px;border-radius:8px}
.ntv{padding:26px 18px 30px;text-align:center;color:var(--mut);font-size:14px}
.ntbg{position:fixed;inset:0;z-index:95}
@media(max-width:760px){.ntp{top:68px;right:12px}}
/* conquistas */
.cqg{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}@media(max-width:420px){.cqg{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.cq{padding:16px 10px 12px}.cq .md{width:56px;height:56px;font-size:24px}}
.cq{display:grid;gap:8px;justify-items:center;text-align:center;padding:20px 14px 16px;border-radius:24px;position:relative}
.cq .md{width:68px;height:68px;border-radius:50%;display:grid;place-items:center;font-size:30px;background:radial-gradient(circle at 32% 28%,#BDF3FB,#0DB8D3 38%,#1B7FDC 72%,#065B98);box-shadow:0 10px 24px rgba(6,60,100,.25),inset 0 -6px 12px rgba(0,0,0,.15)}
.cq b{font:700 15px var(--font-d);letter-spacing:-.01em}
.cq span{color:var(--mut);font-size:13px;line-height:1.35}
.cq.off .md{background:var(--chip);box-shadow:none;filter:grayscale(1);opacity:.55}
.cq.off b{color:var(--mut)}
.cq .pg{width:100%;height:6px;border-radius:99px;background:var(--chip);overflow:hidden}.cq .pg i{display:block;height:100%;background:linear-gradient(90deg,#0DB8D3,#1B7FDC)}
.cq small{font-size:12px;color:var(--mut);font-variant-numeric:tabular-nums}
.cqres{display:flex;gap:10px;align-items:center;margin-bottom:14px;color:var(--mut)}
.cqres b{color:var(--ink);font:700 22px var(--font-d)}
/* concursos */
.kc-h{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:end;padding:28px;border-radius:34px;background:linear-gradient(135deg,color-mix(in srgb,#0DB8D3 20%,var(--stage)),color-mix(in srgb,#065B98 14%,var(--stage)))}
.kc-h h1{font-size:clamp(30px,4.6vw,52px);margin:8px 0 6px}
.kc-h p{color:var(--mut);margin:0;max-width:60ch}
.kc-st{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;font:600 13px var(--font);background:var(--chip)}
.kc-st.inscricoes{color:#1E8E3E;background:color-mix(in srgb,#34C759 16%,transparent)}
.kc-st.votacao{color:#B86E00;background:color-mix(in srgb,#FF9F0A 18%,transparent)}
.kc-st.encerrado{color:var(--mut)}
.kc-steps{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.kc-steps span{font-size:13px;padding:6px 12px;border-radius:999px;background:var(--chip);color:var(--mut)}
.kc-steps span.on{background:var(--azul);color:#fff}
.kcg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.kcc{display:grid;gap:10px;padding:12px;border-radius:24px;position:relative}
.kcc .im{aspect-ratio:3/2;border-radius:16px;background:var(--stage);display:grid;place-items:center;padding:16px;overflow:hidden}
.kcc .im img{max-width:100%;max-height:100%;filter:drop-shadow(0 6px 14px rgba(0,0,0,.18))}
.kcc b{font:700 16px var(--font-d)}
.kcc .m{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--mut);font-size:13px}
.kcc.win{box-shadow:0 0 0 2px #D4A017 inset}
.kcc .crown{position:absolute;top:18px;left:18px;font:700 12px var(--font);padding:5px 10px;border-radius:999px;background:#D4A017;color:#fff}
.kcc .vt.on{background:var(--azul);color:#fff}
.kc-arq{display:flex;gap:8px;flex-wrap:wrap}
.kc-arq a{display:inline-flex;gap:8px;align-items:center;padding:8px 14px;border-radius:999px;background:var(--chip);color:var(--ink);text-decoration:none;font-size:14px}
.kc-arq a.on{background:var(--azul);color:#fff}
.kchome{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.kchome>a{display:grid;gap:10px;align-content:start;padding:24px;border-radius:30px;color:inherit;text-decoration:none}
.kchome h3{font:700 clamp(22px,2.6vw,30px)/1.1 var(--font-d);letter-spacing:-.02em;margin:0}
.kchome p{color:var(--mut);margin:0}
.kchome .wim{display:grid;grid-template-columns:120px minmax(0,1fr);gap:16px;align-items:center}
.kchome .wim img{width:120px;aspect-ratio:3/2;object-fit:contain;filter:drop-shadow(0 8px 16px rgba(0,0,0,.2))}
.kchome .solo{grid-column:1/-1}
.kc-form{display:grid;gap:12px;max-width:640px}
.kc-form input,.kc-form textarea{width:100%;box-sizing:border-box;min-height:46px;padding:12px 14px;border-radius:14px;border:0;background:var(--chip);color:var(--ink);font:16px var(--font)}
.kc-form textarea{min-height:90px;resize:vertical}
.kc-ad{display:grid;gap:10px;margin-top:22px}
.kc-ad .li{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;padding:14px 16px;border-radius:20px}
.kc-ad .acts{display:flex;gap:6px;flex-wrap:wrap}
@media(max-width:760px){.kc-h{grid-template-columns:minmax(0,1fr);padding:22px}.kchome{grid-template-columns:minmax(0,1fr)}}
`;
document.head.appendChild(css);

const mesId = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit' }).format(d).slice(0, 7);
const mesNome = id => { const [y, m] = id.split('-').map(Number); const s = new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }); return s.charAt(0).toUpperCase() + s.slice(1) };
const quando = ts => { if (!ts || !ts.seconds) return 'agora'; const s = Date.now() / 1000 - ts.seconds; if (s < 60) return 'agora'; if (s < 3600) return Math.floor(s / 60) + ' min'; if (s < 86400) return Math.floor(s / 3600) + ' h'; if (s < 604800) return Math.floor(s / 86400) + ' d'; return new Date(ts.seconds * 1000).toLocaleDateString('pt-BR') };
const dataSrc = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg || '');
const erroTxt = e => (e && e.code === 'permission-denied') ? 'Sem permissão. Confira se as regras do Firestore foram publicadas.' : (e && e.message) || 'Erro inesperado';

/* ================= notificações ================= */
let NT = [];
const ICN = { curtida: '❤️', aprovado: '✅', recusado: '⚠️', pedido: '📨', concurso: '🏆', conquista: '🏅' };
const bellHTML = () => { const n = NT.filter(x => !x.lida).length; return `<button class="ic pr bellb" id="bellb" aria-label="Notificações${n ? ' (' + n + ' novas)' : ''}"><svg class="ico" viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>${n ? `<b>${n > 99 ? '99+' : n}</b>` : ''}</button>` };
const garanteSino = () => { let b = $('bell'); if (!b) { const acc = $('acc'); if (!acc) return null; b = document.createElement('span'); b.id = 'bell'; acc.parentNode.insertBefore(b, acc) } return b };
const renderBell = () => { const b = garanteSino(); if (!b) return; const on = !!(FB().on && FB().user); b.hidden = !on; b.innerHTML = on ? bellHTML() : ''; if ($('ntp')) listaNT() };
const fechaNT = () => { $('ntp')?.remove(); $('ntbg')?.remove() };
const listaNT = () => {
  const p = $('ntp'); if (!p) return;
  const L = NT.slice().sort((a, b) => ((b.criadoEm?.seconds) || 9e12) - ((a.criadoEm?.seconds) || 9e12)).slice(0, 40);
  p.querySelector('.ntl').innerHTML = L.length ? L.map(n => `<a class="nti ${n.lida ? '' : 'nova'}" href="#${esc(n.link || 'perfil')}" data-nt="${esc(n.id)}"><i>${ICN[n.tipo] || '🔔'}</i><span><p>${esc(n.texto)}</p><small>${quando(n.criadoEm)}</small></span><button class="x" data-ntx="${esc(n.id)}" aria-label="Apagar">×</button></a>`).join('') : '<div class="ntv">Nenhuma notificação por enquanto.<br>Curtidas, aprovações e respostas aparecem aqui.</div>';
};
const abreNT = () => {
  if ($('ntp')) return fechaNT();
  document.body.insertAdjacentHTML('beforeend', `<div class="ntbg" id="ntbg"></div><section class="ntp lg" id="ntp" role="dialog" aria-label="Notificações"><header><b>Notificações</b><span><button id="ntlr">Marcar como lidas</button><button id="ntcl">Limpar</button></span></header><div class="ntl"></div></section>`);
  listaNT();
  $('ntbg').onclick = fechaNT;
  $('ntlr').onclick = () => { const ids = NT.filter(n => !n.lida).map(n => n.id); if (ids.length) FB().lerNotificacoes(ids).catch(e => toast(erroTxt(e))) };
  $('ntcl').onclick = () => { const ids = NT.map(n => n.id); if (ids.length) FB().apagarNotificacoes(ids.slice(0, 450)).catch(e => toast(erroTxt(e))) };
  $('ntp').onclick = e => {
    const x = e.target.closest('[data-ntx]'); if (x) { e.preventDefault(); e.stopPropagation(); FB().apagarNotificacoes([x.dataset.ntx]).catch(er => toast(erroTxt(er))); return }
    const a = e.target.closest('[data-nt]'); if (a) { const n = NT.find(q => q.id === a.dataset.nt); if (n && !n.lida) FB().lerNotificacoes([n.id]).catch(() => { }); fechaNT() }
  };
};
document.addEventListener('click', e => { if (e.target.closest('#bellb')) { e.preventDefault(); abreNT() } });
addEventListener('keydown', e => { if (e.key === 'Escape') fechaNT() });
addEventListener('fl-notifs', e => { const antes = new Set(NT.map(n => n.id)), prim = !NT._ok; NT = e.detail || []; NT._ok = true; if (!prim) NT.filter(n => !antes.has(n.id) && !n.lida).slice(0, 2).forEach(n => toast(n.texto)); renderBell() });
addEventListener('fb-user', () => setTimeout(renderBell, 0));
addEventListener('popstate', fechaNT);

/* curtida em criação da comunidade: avisa o autor (uma vez por bandeira neste aparelho) */
document.addEventListener('click', e => {
  const b = e.target.closest('#blike'); if (!b || !FB().on || !FB().user) return;
  setTimeout(() => {
    if (!b.classList.contains('on')) return;
    const k = window.FLKEY ? window.FLKEY() : ''; const id = k && k.startsWith('b-') ? k.slice(2) : ''; const f = byId[id];
    if (!f || f.o !== 'original' || !f.uid || f.uid === FB().user.uid) return;
    let s; try { s = new Set(JSON.parse(localStorage.getItem('flamula-avisos-curtida') || '[]')) } catch (er) { s = new Set() }
    if (s.has(id)) return; s.add(id); try { localStorage.setItem('flamula-avisos-curtida', JSON.stringify([...s].slice(-400))) } catch (er) { }
    FB().notificar(f.uid, { tipo: 'curtida', texto: `${FB().profile?.nome || 'Alguém'} curtiu sua criação “${f.n}”.`, link: 'b-' + id });
  }, 50);
}, true);

/* ================= conquistas ================= */
let curtidasStats = {};
addEventListener('fl-stats', e => { curtidasStats = e.detail.curtidas || {} });
const CQ = [
  ['primeira', '✏️', 'Primeira criação', 'Ter 1 criação aprovada', d => d.criacoes, 1],
  ['criador', '🎨', 'Criador', 'Ter 10 criações aprovadas', d => d.criacoes, 10],
  ['mestre', '🏛️', 'Mestre vexilólogo', 'Ter 50 criações aprovadas', d => d.criacoes, 50],
  ['curtido', '❤️', 'Curtido', 'Receber 10 curtidas nas suas criações', d => d.curtidas, 10],
  ['popular', '🌟', 'Popular', 'Receber 100 curtidas nas suas criações', d => d.curtidas, 100],
  ['jogador', '🎮', 'Jogador', 'Jogar 10 partidas', d => d.partidas, 10],
  ['lince', '👁️', 'Olho de lince', 'Acertar 100 bandeiras no jogo', d => d.acertos, 100],
  ['enciclopedia', '📚', 'Enciclopédia', 'Acertar 1.000 bandeiras no jogo', d => d.acertos, 1000],
  ['gabarito', '💯', 'Gabarito', 'Acertar todas as bandeiras de uma partida', d => d.gabaritos, 1],
  ['diario', '📅', 'Diário fiel', 'Fazer o desafio diário 7 dias seguidos', d => d.maiorSequencia, 7],
  ['colecionador', '🗂️', 'Colecionador', 'Ter uma coleção com 10 bandeiras', d => d.maiorColecao, 10],
  ['comunitario', '🤝', 'Comunitário', 'Participar de uma comunidade', d => d.comunidades, 1],
  ['concorrente', '🎟️', 'Concorrente', 'Ter uma criação aprovada em um concurso', d => d.concursos, 1],
  ['campeao', '🏆', 'Campeão', 'Vencer um concurso mensal', d => d.vitorias, 1]
];
const dadosBase = p => { const j = (p && p.jogo) || {}; return { partidas: j.partidas || 0, acertos: j.acertos || 0, gabaritos: j.gabaritos || 0, maiorSequencia: j.maiorSequencia || 0, maiorColecao: Math.max(0, ...((p && p.colecoes) || []).map(c => (c.bandeiras || []).length)), comunidades: ((p && p.comunidades) || []).length } };
const dadosCompletos = async (uid, p) => {
  const d = { ...dadosBase(p), criacoes: 0, curtidas: 0, concursos: 0, vitorias: 0 };
  const [env, ks] = await Promise.all([FB().meusEnvios().catch(() => []), FB().concursos().catch(() => [])]);
  const ap = env.filter(e => e.status === 'aprovada'); d.criacoes = ap.length;
  d.curtidas = ap.reduce((s, e) => s + (+curtidasStats['u-' + e.id] || 0), 0);
  d.concursos = ap.filter(e => e.concurso).length;
  d.vitorias = ks.filter(k => k.vencedor && k.vencedor.uid === uid).length;
  return d;
};
const ganhas = d => CQ.filter(c => c[4](d) >= c[5]).map(c => c[0]);
/* avisa quando uma conquista nova aparece (compara com as já vistas neste aparelho) */
const confere = (uid, d, parcial) => {
  const k = 'flamula-conquistas-' + uid; let vistas; try { vistas = JSON.parse(localStorage.getItem(k) || 'null') } catch (e) { vistas = null }
  const g = ganhas(d); if (vistas === null) { if (!parcial) try { localStorage.setItem(k, JSON.stringify(g)) } catch (e) { } return }
  const novas = g.filter(x => !vistas.includes(x)); if (!novas.length) return;
  try { localStorage.setItem(k, JSON.stringify([...new Set([...vistas, ...novas])])) } catch (e) { }
  novas.forEach(id => { const c = CQ.find(x => x[0] === id); toast(`${c[1]} Conquista desbloqueada: ${c[2]}`); FB().notificar(uid, { tipo: 'conquista', texto: `Conquista desbloqueada: ${c[2]}. ${c[3]}.`, link: 'perfil' }) });
};
addEventListener('fl-conquistas', () => { const u = FB().user; if (u) confere(u.uid, { ...dadosBase(FB().profile), criacoes: 0, curtidas: 0, concursos: 0, vitorias: 0 }, true) });
FL.ext.conquistas = async (box, x, u, p) => {
  x.innerHTML = '<a class="btn gh pr sm" href="#jogo">Jogar</a>';
  box.innerHTML = '<p class="tl-msg"><span class="sk" style="width:200px"></span></p>';
  const d = await dadosCompletos(u.uid, p); if (!box.isConnected) return;
  const g = new Set(ganhas(d));
  box.innerHTML = `<div class="cqres"><b>${g.size}</b> de ${CQ.length} conquistas</div><div class="cqg">${CQ.map(([id, ic, nome, txt, fn, meta]) => { const v = Math.min(fn(d), meta), ok = g.has(id); return `<div class="cq lg ${ok ? '' : 'off'}"><span class="md" aria-hidden="true">${ic}</span><b>${nome}</b><span>${txt}</span>${ok ? '<small>Desbloqueada</small>' : `<span class="pg"><i style="width:${(v / meta * 100).toFixed(1)}%"></i></span><small>${v.toLocaleString('pt-BR')} de ${meta.toLocaleString('pt-BR')}</small>`}</div>` }).join('')}</div><p class="pfnote">As conquistas de jogo contam as partidas feitas com a conta conectada.</p>`;
  confere(u.uid, d, false);
};
FL.ext.contaConquistas = async (u, p) => ganhas(await dadosCompletos(u.uid, p)).length;

/* ================= concursos ================= */
const STN = { inscricoes: 'Inscrições abertas', votacao: 'Votação aberta', encerrado: 'Encerrado' };
let KS = null;
const carregaKS = async (forca) => { if (!KS || forca) KS = await FB().concursos(); return KS };
addEventListener('fl-concurso', () => { KS = null });
const ativo = L => L.find(k => k.status === 'inscricoes' || k.status === 'votacao');
const ultimoVencedor = L => L.find(k => k.status === 'encerrado' && k.vencedor);
FL.ext.concursoAberto = async () => { if (!FB().on) return null; try { const k = ativo(await carregaKS()); return k && k.status === 'inscricoes' ? k : null } catch (e) { return null } };

/* página /concursos e /concurso/AAAA-MM */
FL.views.concurso = async arg => {
  const v = $('v-concurso'); document.title = 'Concursos · Flâmula';
  v.innerHTML = '<div class="phead"><h1>Concurso mensal</h1><p><span class="sk" style="width:240px"></span></p></div>';
  if (!(window.FB && window.FB.ready)) await new Promise(r => addEventListener('fb-user', r, { once: true }));
  if (!FB().on) { v.innerHTML = '<div class="phead"><h1>Concurso mensal</h1><p>Os concursos precisam do Firebase configurado.</p></div>'; return }
  let L; try { L = await carregaKS(true) } catch (e) { v.innerHTML = `<div class="phead"><h1>Concurso mensal</h1><p>${esc(erroTxt(e))}</p></div>`; return }
  const k = (arg && L.find(x => x.id === arg)) || ativo(L) || L[0];
  if (!k) { v.innerHTML = `<div class="phead"><h1>Concurso mensal</h1><p>Todo mês, um tema novo para redesenhar ou criar bandeiras, com votação da comunidade. O primeiro concurso ainda vai ser anunciado.</p></div>${FB().admin ? '<a class="btn acc pr" href="#admin">Criar o primeiro no painel</a>' : ''}`; return }
  document.title = `Concurso de ${mesNome(k.id).toLowerCase()} · Flâmula`;
  const u = FB().user, st = k.status;
  v.innerHTML = `<div class="kc-h"><div><span class="kc-st ${esc(st)}">${STN[st] || esc(st)}</span><h1>${esc(k.tema || 'Tema a definir')}</h1><p>${esc(k.descricao || '')}</p>
    <div class="kc-steps"><span class="${st === 'inscricoes' ? 'on' : ''}">1. Inscrições</span><span class="${st === 'votacao' ? 'on' : ''}">2. Votação</span><span class="${st === 'encerrado' ? 'on' : ''}">3. Resultado</span></div></div>
    <div>${st === 'inscricoes' ? '<a class="btn acc pr" href="#criar">Criar minha bandeira</a>' : st === 'votacao' ? (u ? '' : '<button class="btn acc pr" data-act="login">Entre para votar</button>') : ''}</div></div>
    <p class="pfnote" style="margin:12px 4px 0">${st === 'inscricoes' ? `Concurso de ${mesNome(k.id).toLowerCase()}. Para participar, crie a bandeira no editor e marque a opção do concurso ao enviar. As criações entram depois da moderação.` : st === 'votacao' ? 'Cada conta tem um voto e pode trocá-lo até o fim da votação. Não vale votar na própria criação.' : 'Votação encerrada. Obrigado a todos que participaram.'}</p>
    <section class="sec"><div class="shead"><div><h2>${st === 'encerrado' ? 'Resultado' : 'Participantes'}</h2><p id="kcn"></p></div></div><div id="kcl"><p class="tl-msg"><span class="sk" style="width:200px"></span></p></div></section>
    ${L.length > 1 ? `<section class="sec"><div class="shead"><div><h2>Edições</h2></div></div><div class="kc-arq">${L.map(x => `<a class="${x.id === k.id ? 'on' : ''}" href="#concurso-${esc(x.id)}">${esc(mesNome(x.id))}${x.vencedor ? ' · 🏆' : ''}</a>`).join('')}</div></section>` : ''}`;
  const desenha = async () => {
    let E, V = [];
    try { [E, V] = await Promise.all([FB().inscritos(k.id), st === 'inscricoes' ? Promise.resolve([]) : FB().votos(k.id).catch(() => [])]) } catch (e) { $('kcl').innerHTML = `<p class="tl-msg">${esc(erroTxt(e))}</p>`; return }
    const cont = {}; V.forEach(x => { cont[x.envio] = (cont[x.envio] || 0) + 1 });
    const meu = u && (V.find(x => x.uid === u.uid) || {}).envio;
    if (st === 'encerrado') E.sort((a, b) => (cont[b.id] || 0) - (cont[a.id] || 0)); else E.sort((a, b) => ((a.criadoEm?.seconds) || 0) - ((b.criadoEm?.seconds) || 0));
    if (!$('kcn')) return;
    $('kcn').textContent = `${E.length} ${E.length === 1 ? 'criação' : 'criações'}${st !== 'inscricoes' ? ` · ${V.length} ${V.length === 1 ? 'voto' : 'votos'}` : ''}`;
    $('kcl').innerHTML = E.length ? `<div class="kcg">${E.map(e => { const win = k.vencedor && k.vencedor.id === e.id, minha = u && e.uid === u.uid; return `<div class="kcc lg ${win ? 'win' : ''}">${win ? '<span class="crown">🏆 Vencedora</span>' : ''}<a class="im" href="#b-u-${esc(e.id)}"><img src="${dataSrc(e.svg)}" alt="${esc(e.nome)}" loading="lazy"></a><b>${esc(e.nome)}</b><div class="m"><span>@${esc(e.autor || 'anônimo')}</span>${st === 'encerrado' ? `<span>${cont[e.id] || 0} ${(cont[e.id] || 0) === 1 ? 'voto' : 'votos'}</span>` : st === 'votacao' && u && !minha ? `<button class="btn sm pr vt ${meu === e.id ? 'on' : 'gh'}" data-voto="${esc(e.id)}">${meu === e.id ? 'Seu voto' : 'Votar'}</button>` : minha ? '<span>Sua criação</span>' : ''}</div></div>` }).join('')}</div>` : `<div class="empty"><b>Nenhuma criação aprovada ainda</b><p>${st === 'inscricoes' ? 'Seja o primeiro a participar.' : 'Este concurso não teve participantes.'}</p>${st === 'inscricoes' ? '<a class="btn acc pr" href="#criar">Criar minha bandeira</a>' : ''}</div>`;
    FL.fixLinks && FL.fixLinks($('kcl'));
    $('kcl').querySelectorAll('[data-voto]').forEach(b => b.onclick = async () => { b.disabled = true; try { if (meu === b.dataset.voto) { await FB().desvotar(k.id); toast('Voto removido') } else { await FB().votar(k.id, b.dataset.voto); toast(meu ? 'Voto trocado' : 'Voto registrado') } desenha() } catch (e) { toast(erroTxt(e)); b.disabled = false } });
  };
  desenha();
};

/* destaque na página inicial */
const renderHome = async () => {
  let s = $('seckc'); if (!s) { const ref = $('dest')?.closest('section'); if (!ref) return; s = document.createElement('section'); s.className = 'sec wrap'; s.id = 'seckc'; s.hidden = true; ref.insertAdjacentElement('afterend', s) }
  if (!FB().on) return;
  let L; try { L = await carregaKS() } catch (e) { return }
  const a = ativo(L), w = ultimoVencedor(L); if (!a && !w) { s.hidden = true; return }
  const cA = a ? `<a class="lg pr ${w ? '' : 'solo'}" href="#concurso-${esc(a.id)}" style="background:linear-gradient(135deg,color-mix(in srgb,#0DB8D3 18%,var(--stage)),var(--stage))"><span class="kc-st ${esc(a.status)}">${STN[a.status]} · ${esc(mesNome(a.id))}</span><h3>${esc(a.tema)}</h3><p>${esc(a.descricao || '')}</p><span class="btn acc pr" style="justify-self:start">${a.status === 'inscricoes' ? 'Participar' : 'Votar'}</span></a>` : '';
  const cW = w ? `<a class="lg pr ${a ? '' : 'solo'}" href="#concurso-${esc(w.id)}"><span class="kc-st encerrado">🏆 Vencedora de ${esc(mesNome(w.id).toLowerCase())}</span><div class="wim">${w.vencedor.svg ? `<img src="${dataSrc(w.vencedor.svg)}" alt="${esc(w.vencedor.nome)}">` : ''}<div><h3>${esc(w.vencedor.nome)}</h3><p>de @${esc(w.vencedor.autor || 'anônimo')} · tema “${esc(w.tema)}”</p></div></div></a>` : '';
  s.innerHTML = `<div class="shead"><div><h2>Concurso mensal</h2><p>Um tema por mês, votação da comunidade e destaque para a vencedora.</p></div><a class="more" href="#concursos">Ver concursos</a></div><div class="kchome">${cA}${cW}</div>`;
  s.hidden = false; FL.fixLinks && FL.fixLinks(s);
};
FL.views.home = () => { renderHome() };
addEventListener('fb-on', () => { if (FL.view === 'home') renderHome() });

/* aba Concursos no painel de administração */
FL.ext.adminConcursos = async (box, recarrega) => {
  const L = await carregaKS(true); const mes = mesId();
  const sug = L.find(k => k.id === mes) ? (() => { const [y, m] = mes.split('-').map(Number); return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}` })() : mes;
  box.innerHTML = `<div class="box lg"><p><b>Novo concurso</b></p><div class="kc-form"><label class="field">Mês<input id="kcm" type="month" value="${sug}"></label><label class="field">Tema<input id="kct" maxlength="80" placeholder="Ex.: Redesenhe a bandeira do seu estado"></label><label class="field">Descrição e regras<textarea id="kcd" maxlength="600" placeholder="O que vale, o que não vale, prazos."></textarea></label><button class="btn acc pr" id="kcok" style="justify-self:start">Abrir inscrições</button></div></div>
  <div class="kc-ad">${L.length ? L.map(k => `<div class="li lg"><div><b>${esc(mesNome(k.id))} · ${esc(k.tema)}</b><div class="m"><span class="kc-st ${esc(k.status)}">${STN[k.status] || esc(k.status)}</span>${k.vencedor ? ` <span>🏆 ${esc(k.vencedor.nome)} (@${esc(k.vencedor.autor)}) · ${k.vencedor.votos} votos</span>` : ''}</div></div><div class="acts">${k.status === 'inscricoes' ? `<button class="btn acc pr sm" data-kv="${k.id}">Abrir votação</button>` : ''}${k.status === 'votacao' ? `<button class="btn acc pr sm" data-kf="${k.id}">Encerrar e apurar</button><button class="btn gh pr sm" data-ki="${k.id}">Voltar às inscrições</button>` : ''}<a class="btn gh pr sm" href="#concurso-${k.id}">Ver página</a><button class="btn dg pr sm" data-kx="${k.id}">Apagar</button></div></div>`).join('') : '<p class="pfnote">Nenhum concurso criado ainda.</p>'}</div>
  <p class="pfnote">Fluxo: abrir inscrições → as criações enviadas com a opção do concurso passam pela moderação normal → abrir votação → encerrar e apurar. A vencedora aparece na página inicial e a autora ou autor recebe uma notificação.</p>`;
  FL.fixLinks && FL.fixLinks(box);
  const salva = async (id, d, msg) => { try { await FB().salvarConcurso(id, d); toast(msg); recarrega() } catch (e) { toast(erroTxt(e)) } };
  $('kcok').onclick = () => { const id = $('kcm').value, t = $('kct').value.trim(); if (!/^\d{4}-\d{2}$/.test(id)) return toast('Escolha o mês'); if (!t) return toast('Escreva o tema'); if (L.some(k => k.id === id)) return toast('Já existe um concurso nesse mês'); if (L.some(k => k.status !== 'encerrado')) return toast('Encerre o concurso atual antes de abrir outro'); salva(id, { tema: t, descricao: $('kcd').value.trim(), status: 'inscricoes', vencedor: null, criadoEm: new Date().toISOString() }, 'Inscrições abertas') };
  box.querySelectorAll('[data-kv]').forEach(b => b.onclick = () => salva(b.dataset.kv, { status: 'votacao' }, 'Votação aberta'));
  box.querySelectorAll('[data-ki]').forEach(b => b.onclick = () => salva(b.dataset.ki, { status: 'inscricoes' }, 'Inscrições reabertas'));
  box.querySelectorAll('[data-kx]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarConcurso(b.dataset.kx); KS = null; toast('Concurso apagado'); recarrega() } catch (e) { toast(erroTxt(e)) } });
  box.querySelectorAll('[data-kf]').forEach(b => b.onclick = async () => {
    if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar apuração'; return }
    const id = b.dataset.kf; b.disabled = true;
    try {
      const [E, V] = await Promise.all([FB().inscritos(id), FB().votos(id)]); const c = {}; V.forEach(x => { c[x.envio] = (c[x.envio] || 0) + 1 });
      const top = E.slice().sort((a, z) => (c[z.id] || 0) - (c[a.id] || 0) || ((a.criadoEm?.seconds) || 0) - ((z.criadoEm?.seconds) || 0))[0];
      const venc = top && (c[top.id] || 0) > 0 ? { id: top.id, nome: top.nome, autor: top.autor || '', uid: top.uid || '', votos: c[top.id] || 0, svg: (top.svg || '').length < 200000 ? top.svg : '' } : null;
      await FB().salvarConcurso(id, { status: 'encerrado', vencedor: venc });
      if (venc && venc.uid) await FB().notificar(venc.uid, { tipo: 'concurso', texto: `Sua criação “${venc.nome}” venceu o concurso de ${mesNome(id).toLowerCase()} com ${venc.votos} ${venc.votos === 1 ? 'voto' : 'votos'}!`, link: 'concurso-' + id });
      toast(venc ? `Vencedora: ${venc.nome} (${venc.votos} votos)` : 'Concurso encerrado sem votos'); recarrega();
    } catch (e) { toast(erroTxt(e)); b.disabled = false }
  });
};
})();
