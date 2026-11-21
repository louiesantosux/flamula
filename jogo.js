/* Flâmula · jogo "Qual é o país?": modos clássico (3 níveis), silhueta, recorte, contra o tempo e desafio diário.
   Quantidade de bandeiras escolhida de 10 em 10. Ranking por modo e quantidade. */
(() => {
const FL = window.FL; if (!FL) return;
const { $, toast, esc, D, I } = FL;
const FB = () => window.FB || {};
const LIMIT_DIFICIL = 10000, TEMPO_MS = 60000, DIARIO_N = 10;

const css = document.createElement('style');
css.textContent = `
.jg{max-width:860px;margin:0 auto}
.jg-h{text-align:center;padding:34px 0 18px}
.jg-h h1{font-size:clamp(34px,5vw,56px)}
.jg-h p{color:var(--mut);margin:10px auto 0;max-width:54ch}
.jg-qty{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin:6px auto 20px;padding:10px 12px 10px 20px;border-radius:999px;width:max-content;max-width:100%}
.jg-qty>span{font-weight:600}
.jg-qty .stp{display:inline-flex;align-items:center;gap:4px;background:var(--chip);border-radius:999px;padding:4px}
.jg-qty .stp button{width:38px;height:38px;border-radius:999px;border:0;background:transparent;color:var(--ink);font:600 20px var(--font);display:grid;place-items:center}
.jg-qty .stp button:disabled{opacity:.35}
.jg-qty .stp b{min-width:44px;text-align:center;font:700 20px var(--font-d);font-variant-numeric:tabular-nums}
.jg-qty small{color:var(--mut);font-size:13px}
.jg-gt{font:600 13px var(--font);letter-spacing:.06em;text-transform:uppercase;color:var(--mut);margin:22px 4px 10px}
.lvls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.lvl{display:grid;gap:8px;align-content:start;text-align:left;padding:20px;border-radius:26px;border:0;color:var(--ink)}
.lvl b{font:700 22px var(--font-d);letter-spacing:-.02em}
.lvl span{color:var(--mut);font-size:14px}
.lvl em{font-style:normal;font-size:13px;font-weight:600;color:var(--azul)}
.lvl i{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font:700 18px var(--font-d);font-style:normal;color:#fff}
.lvl i svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.jg-dia{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:18px;align-items:center;padding:22px;border-radius:28px;margin-top:12px;background:linear-gradient(135deg,color-mix(in srgb,#0DB8D3 22%,var(--stage)),color-mix(in srgb,#065B98 16%,var(--stage)))}
.jg-dia i{width:54px;height:54px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(135deg,#0DB8D3,#1B7FDC 55%,#065B98);color:#fff;font:800 20px var(--font-d);font-style:normal}
.jg-dia b{font:700 22px var(--font-d);letter-spacing:-.02em;display:block}
.jg-dia span{color:var(--mut);font-size:14px}
.jg-dia .sq{font-size:18px;letter-spacing:2px;display:block;margin-top:4px}
.jg-dia .acts{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.jg-top{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:22px 0 12px}
.jg-pill{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:999px;font-weight:600;font-size:15px;font-variant-numeric:tabular-nums}
.jg-dots{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:0 auto 14px;max-width:640px}
.jg-dots i{width:8px;height:8px;border-radius:99px;background:var(--chip);transition:transform .5s var(--spring),background-color .3s}
.jg-dots i.ok{background:#34C759}.jg-dots i.no{background:#FF3B30}.jg-dots i.now{transform:scale(1.6);background:var(--ink)}
.jg-prog{height:6px;border-radius:99px;background:var(--chip);overflow:hidden;margin:0 0 14px}.jg-prog i{display:block;height:100%;background:linear-gradient(90deg,#0DB8D3,#1B7FDC);transition:width .3s}
.jg-stage{border-radius:34px;aspect-ratio:16/10;max-height:max(200px,calc(100dvh - 360px));width:100%;box-sizing:border-box;display:grid;place-items:center;padding:clamp(16px,4%,36px);position:relative;overflow:hidden}
.jg-stage{grid-template:minmax(0,1fr)/minmax(0,1fr)}
.jg-stage>img,.jg-stage>svg,.jg-stage .rc>img,.jg-stage .rc>svg{width:100%;height:100%;max-width:100%;max-height:100%;min-width:0;min-height:0;object-fit:contain;box-sizing:border-box}
.jg-stage .rc{grid-template:minmax(0,1fr)/minmax(0,1fr)}
.jg-stage>.rc,.jg-stage>.rc-tag{grid-area:1/1}.jg-stage>.jg-bar{grid-area:auto}
.jg.play .jg-top{margin:8px 0 10px}
@media(min-width:761px){.jg.play{max-width:1180px}.jg-board{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,300px);gap:16px;align-items:center}.jg-board .jg-stage{max-height:max(260px,calc(100dvh - 210px))}.jg-board .opts{grid-template-columns:minmax(0,1fr);margin-top:0}.jg-board .opt{min-height:64px;text-align:left;justify-content:flex-start;display:flex;align-items:center;gap:10px;padding:10px 18px}.jg-board .jg-rev{text-align:left;padding-left:6px}.jg.play .jg-dots,.jg.play .jg-prog{max-width:none}}.jg.play .jg-dots{margin-bottom:10px}.jg.play .opts{margin-top:10px}.jg.play .opt{min-height:54px}
.jg-stage img,.jg-stage svg{max-width:100%;max-height:100%;width:auto;height:auto;filter:drop-shadow(0 0 .6px rgba(0,0,0,.45)) drop-shadow(0 16px 28px rgba(0,0,0,.25));animation:jgin .6s var(--spring) both}
.jg-stage svg{width:100%;height:100%}
.jg-stage.rc-on{padding:0}
.jg-stage .rc{width:100%;height:100%;display:grid;place-items:center;padding:clamp(16px,4%,36px);box-sizing:border-box;transition:transform .9s var(--spring)}
.jg-stage .rc img,.jg-stage .rc svg{filter:none;animation:none}
.jg-stage .rc-tag{position:absolute;left:14px;top:14px;z-index:2;font:600 12px var(--font);padding:6px 10px;border-radius:999px;background:var(--glass);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.jg-stage svg.sil{filter:drop-shadow(0 16px 28px rgba(6,60,100,.25));overflow:visible}
.jg-stage svg.sil path{fill:url(#silg);stroke:color-mix(in srgb,#fff 60%,transparent);stroke-width:1.2;vector-effect:non-scaling-stroke}
@keyframes jgin{from{opacity:0;transform:scale(.86) translateY(10px)}}
.jg-bar{position:absolute;left:0;bottom:0;height:5px;background:var(--brasa);border-radius:0 4px 4px 0;transition:width .1s linear}
.opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
.opt{min-height:62px;padding:10px 16px;border-radius:22px;border:0;font-weight:600;font-size:17px;color:var(--ink);text-align:center;transition:transform var(--dur) var(--spring),background-color .25s,color .25s}
.opt:active{transform:scale(1.04)}
.opt.ok{background:#34C759!important;color:#fff;animation:bump .7s var(--spring)}
.opt.no{background:#FF3B30!important;color:#fff;animation:shake .45s}
.opt[disabled]{pointer-events:none}
.opt kbd{display:none}
.jg-rev{text-align:center;color:var(--mut);font-size:14px;min-height:20px;margin-top:10px}
@media(hover:hover){.opt kbd{display:inline;font:600 12px var(--font);color:var(--mut);margin-right:8px;opacity:.7}}
@keyframes shake{20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}
.jg-res{border-radius:34px;padding:30px 22px;text-align:center;display:grid;gap:10px;justify-items:center;margin-top:24px}
.jg-res .big{font:800 clamp(56px,10vw,96px)/1 var(--font-d);letter-spacing:-.05em}
.jg-res .sub{color:var(--mut)}
.jg-res .sq{font-size:22px;letter-spacing:3px;line-height:1.4;max-width:420px;word-break:break-all}
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
.rkm{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px;margin-top:12px}.rkm::-webkit-scrollbar{display:none}
.rkm button{flex:0 0 auto;min-height:38px;padding:0 14px;border-radius:999px;border:0;background:var(--chip);color:var(--ink);font:600 14px var(--font)}
.rkm button.on{background:var(--acc,#1B7FDC);color:#fff}
@media(max-width:760px){.lvls{grid-template-columns:minmax(0,1fr)}.opt{min-height:58px;font-size:16px}.jg-stage{border-radius:24px;max-height:max(170px,calc(100dvh - 430px))}.jg.play .jg-top{gap:6px;margin:4px 0 8px}.jg.play .jg-pill{min-height:36px;padding:0 11px;font-size:14px}.jg.play .opts{gap:8px}.jg.play .opt{min-height:50px;font-size:15px;padding:8px 10px;border-radius:18px}.jg.play .opt kbd{display:none}.jg-rev{min-height:0;margin-top:6px}.jg-dots i{width:6px;height:6px}.rk li{grid-template-columns:34px minmax(0,1fr) auto;}.rk li small.t2{display:none}.jg-dia{grid-template-columns:auto minmax(0,1fr)}.jg-dia .acts{grid-column:1/-1;justify-content:stretch}.jg-dia .acts .btn{flex:1}.jg-qty{border-radius:26px;padding:12px 16px}}
`;
document.head.appendChild(css);

/* bandeiras e modos */
const EASY = ['br', 'ar', 'us', 'ca', 'mx', 'fr', 'de', 'it', 'es', 'pt', 'gb', 'jp', 'cn', 'in', 'ru', 'au', 'za', 'eg', 'ng', 'kr', 'se', 'no', 'fi', 'dk', 'nl', 'be', 'ch', 'at', 'gr', 'tr', 'il', 'sa', 'cl', 'co', 'pe', 've', 'uy', 'cu', 'jm', 'ie', 'pl', 'ua', 'ma', 'nz', 'th', 'vn', 'id', 'ph', 'pk', 'ke', 'gh', 'sn', 'cm', 'py', 'bo', 'ec', 'cz', 'hu', 'ro', 'sg'];
const TERR = new Set(['aq', 'eh', 'hk', 'mo', 'tw', 'gf', 'um', 'hm', 'bv', 'tf', 'gs', 'io', 'xk', 'gb-eng', 'gb-nir', 'gb-sct', 'gb-wls']);
const paises = () => D.filter(f => f.t === 'pais');
const soberanos = () => paises().filter(x => !TERR.has(x.id) && !x.isl);
const ICO = {
  sil: '<svg viewBox="0 0 24 24"><path d="M4 7l5-2 6 2 5-2v12l-5 2-6-2-5 2z"/><path d="M9 5v12M15 7v12"/></svg>',
  rec: '<svg viewBox="0 0 24 24"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>',
  tmp: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>'
};
const MODOS = {
  facil: { nome: 'Fácil', cor: '#34C759', ic: 'F', txt: 'Bandeiras conhecidas, opções de todo o mundo.', qtd: true, pool: () => paises().filter(f => EASY.includes(f.id)), distr: () => soberanos() },
  medio: { nome: 'Médio', cor: '#FF9F0A', ic: 'M', txt: 'Países de todos os continentes.', qtd: true, pool: soberanos, distr: () => soberanos() },
  dificil: { nome: 'Difícil', cor: '#FF3B30', ic: 'D', txt: 'Inclui territórios, opções do mesmo continente e 10 segundos por bandeira.', qtd: true, limite: LIMIT_DIFICIL, pool: paises, distr: f => { const s = paises().filter(x => x.ct === f.ct); return s.length >= 6 ? s : paises() } },
  silhueta: { nome: 'Silhueta', cor: '#1B7FDC', ic: ICO.sil, txt: 'Sem bandeira: só o contorno do país no mapa.', qtd: true, pool: () => soberanos().filter(f => SIL.has(f.id)), distr: f => { const s = soberanos().filter(x => x.ct === f.ct); return s.length >= 6 ? s : soberanos() } },
  recorte: { nome: 'Recorte', cor: '#0DB8D3', ic: ICO.rec, txt: 'Só um pedaço ampliado da bandeira. A bandeira inteira aparece depois da resposta.', qtd: true, pool: soberanos, distr: f => { const s = soberanos().filter(x => x.ct === f.ct); return s.length >= 6 ? s : soberanos() } },
  tempo: { nome: 'Contra o tempo', cor: '#065B98', ic: ICO.tmp, txt: '60 segundos para acertar o máximo de bandeiras. Errar não para o relógio.', qtd: false, pool: soberanos, distr: () => soberanos() }
};
const ORDEM_RK = ['facil', 'medio', 'dificil', 'silhueta', 'recorte', 'tempo', 'diario'];
const NOME = m => m === 'diario' ? 'Desafio diário' : MODOS[m].nome;

const shuffle = (a, rnd = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
const tfmt = ms => { const s = ms / 1000, m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`.replace('.', ',') };
const chaveNome = n => (n || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const totalDe = r => r.total || 10;
/* um resultado por jogador e quantidade: o maior fica, o menor é descartado */
const melhores = L => { const m = new Map(); L.forEach(r => { const k = (r.uid || chaveNome(r.nome)) + '|' + totalDe(r); const a = m.get(k); if (!a || r.pontos > a.pontos) m.set(k, r) }); return [...m.values()].sort((a, b) => b.pontos - a.pontos) };
const LKEY = 'flamula-recordes';
const local = () => { try { return JSON.parse(localStorage.getItem(LKEY) || '{}') } catch (e) { return {} } };
const saveLocal = (modo, r) => { const all = local(); const k = chaveNome(r.nome); const ant = (all[modo] || []).find(x => chaveNome(x.nome) === k && totalDe(x) === totalDe(r) && (modo !== 'diario' || x.dia === r.dia)); const melhorou = !ant || r.pontos > ant.pontos; all[modo] = melhores((all[modo] || []).concat([r])).slice(0, 40); try { localStorage.setItem(LKEY, JSON.stringify(all)) } catch (e) { } return { melhorou, anterior: ant } };
const loadImg = f => new Promise(res => { if (!f.src) return res(f.ra ? 'draw' : false); const im = new Image(); const t = setTimeout(() => res(f.ra ? 'draw' : false), 6000); im.onload = () => { clearTimeout(t); res('img') }; im.onerror = () => { clearTimeout(t); res(f.ra ? 'draw' : false) }; im.src = f.src });

/* quantidade (de 10 em 10) */
const QKEY = 'flamula-jogo-qtd';
let qtd = Math.max(10, Math.round((+localStorage.getItem(QKEY) || 10) / 10) * 10);
const maxQ = m => Math.max(10, Math.floor(MODOS[m].pool().length / 10) * 10);
const MAXQ_GERAL = () => Math.max(...Object.keys(MODOS).filter(m => MODOS[m].qtd).map(maxQ));

/* desafio diário: mesma sequência para todos no dia (horário de Brasília) */
const hoje = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
const ontem = () => { const d = new Date(hoje() + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 1); return d.toISOString().slice(0, 10) };
const numDia = d => Math.round((new Date(d + 'T12:00:00Z') - new Date('2026-11-21T12:00:00Z')) / 864e5) + 1;
const seeded = str => { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19 } let a = h >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
const DKEY = 'flamula-diario';
const diarios = () => { try { return JSON.parse(localStorage.getItem(DKEY) || '{}') } catch (e) { return {} } };
const salvarDiario = (d, r) => { const all = diarios(); all[d] = r; const ks = Object.keys(all).sort(); while (ks.length > 60) delete all[ks.shift()]; try { localStorage.setItem(DKEY, JSON.stringify(all)) } catch (e) { } };
const quadrados = res => res.map(x => x ? '🟩' : '🟥').join('');
const textoDiario = (d, r) => `Flâmula · Desafio diário #${numDia(d)}\n${quadrados(r.res)}\n${r.ok}/${DIARIO_N} em ${tfmt(r.td * 100)}\n${location.origin}/jogo`;
const compartilhar = async txt => { try { if (navigator.share && matchMedia('(pointer:coarse)').matches) { await navigator.share({ text: txt }); return } } catch (e) { if (e.name === 'AbortError') return } try { await navigator.clipboard.writeText(txt); toast('Resultado copiado. É só colar onde quiser.') } catch (e) { toast('Não foi possível copiar o resultado') } };

/* silhuetas dos países (Natural Earth 1:50m via world-atlas, domínio público) */
const ISO = {ad:20,ae:784,af:4,ag:28,ai:660,al:8,am:51,ao:24,aq:10,ar:32,as:16,at:40,au:36,aw:533,ax:248,az:31,ba:70,bb:52,bd:50,be:56,bf:854,bg:100,bh:48,bi:108,bj:204,bl:652,bm:60,bn:96,bo:68,bq:535,br:76,bs:44,bt:64,bv:74,bw:72,by:112,bz:84,ca:124,cc:166,cd:180,cf:140,cg:178,ch:756,ci:384,ck:184,cl:152,cm:120,cn:156,co:170,cr:188,cu:192,cv:132,cw:531,cx:162,cy:196,cz:203,de:276,dj:262,dk:208,dm:212,'do':214,dz:12,ec:218,ee:233,eg:818,eh:732,er:232,es:724,et:231,fi:246,fj:242,fk:238,fm:583,fo:234,fr:250,ga:266,gb:826,gd:308,ge:268,gf:254,gg:831,gh:288,gi:292,gl:304,gm:270,gn:324,gp:312,gq:226,gr:300,gs:239,gt:320,gu:316,gw:624,gy:328,hk:344,hm:334,hn:340,hr:191,ht:332,hu:348,id:360,ie:372,il:376,im:833,'in':356,io:86,iq:368,ir:364,is:352,it:380,je:832,jm:388,jo:400,jp:392,ke:404,kg:417,kh:116,ki:296,km:174,kn:659,kp:408,kr:410,kw:414,ky:136,kz:398,la:418,lb:422,lc:662,li:438,lk:144,lr:430,ls:426,lt:440,lu:442,lv:428,ly:434,ma:504,mc:492,md:498,me:499,mf:663,mg:450,mh:584,mk:807,ml:466,mm:104,mn:496,mo:446,mp:580,mq:474,mr:478,ms:500,mt:470,mu:480,mv:462,mw:454,mx:484,my:458,mz:508,na:516,nc:540,ne:562,nf:574,ng:566,ni:558,nl:528,no:578,np:524,nr:520,nu:570,nz:554,om:512,pa:591,pe:604,pf:258,pg:598,ph:608,pk:586,pl:616,pm:666,pn:612,pr:630,ps:275,pt:620,pw:585,py:600,qa:634,re:638,ro:642,rs:688,ru:643,rw:646,sa:682,sb:90,sc:690,sd:729,se:752,sg:702,sh:654,si:705,sj:744,sk:703,sl:694,sm:674,sn:686,so:706,sr:740,ss:728,st:678,sv:222,sx:534,sy:760,sz:748,tc:796,td:148,tf:260,tg:768,th:764,tj:762,tk:772,tl:626,tm:795,tn:788,to:776,tr:792,tt:780,tv:798,tw:158,tz:834,ua:804,ug:800,um:581,us:840,uy:858,uz:860,va:336,vc:670,ve:862,vg:92,vi:850,vn:704,vu:548,wf:876,ws:882,ye:887,yt:175,za:710,zm:894,zw:716};
const SIL = new Set(Object.keys(ISO));
let topo = null, topoP = null;
const carregaTopo = () => topoP || (topoP = fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json').then(r => { if (!r.ok) throw new Error('mapa'); return r.json() }).then(t => {
  const { scale: [sx, sy], translate: [tx, ty] } = t.transform;
  const arcs = t.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty] }) });
  const porNum = {}; t.objects.countries.geometries.forEach(g => { if (g.id != null) porNum[+g.id] = g });
  topo = { arcs, porNum }; SIL.forEach(id => { if (!porNum[ISO[id]]) SIL.delete(id) }); return topo
}).catch(e => { topoP = null; throw e }));
const anel = idx => { const out = []; idx.forEach((i, k) => { const a = i < 0 ? topo.arcs[~i].slice().reverse() : topo.arcs[i]; (k ? a.slice(1) : a).forEach(p => out.push(p)) }); return out };
const silhueta = id => {
  const g = topo && topo.porNum[ISO[id]]; if (!g) return null;
  let polys = (g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []).map(p => p.map(anel));
  if (!polys.length) return null;
  const lons = polys.flat(2).map(p => p[0]); if (Math.max(...lons) - Math.min(...lons) > 180) polys = polys.map(p => p.map(r => r.map(([x, y]) => [x < 0 ? x + 360 : x, y])));
  const info = p => { const r = p[0]; let a = 0, cx = 0, cy = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const f = r[j][0] * r[i][1] - r[i][0] * r[j][1]; a += f; cx += (r[j][0] + r[i][0]) * f; cy += (r[j][1] + r[i][1]) * f } a /= 2; return { a: Math.abs(a), cx: a ? cx / (6 * a) : r[0][0], cy: a ? cy / (6 * a) : r[0][1] } };
  const I2 = polys.map(info), mx = I2.reduce((b, x, i) => x.a > I2[b].a ? i : b, 0), c0 = I2[mx];
  /* mantém só as partes próximas do território principal (ex.: França sem a Guiana Francesa) */
  polys = polys.filter((p, i) => Math.hypot((I2[i].cx - c0.cx) * Math.cos(c0.cy * Math.PI / 180), I2[i].cy - c0.cy) < 22);
  const k = Math.cos(c0.cy * Math.PI / 180), pts = polys.flat(2).map(([x, y]) => [x * k, -y]);
  const x0 = Math.min(...pts.map(p => p[0])), x1 = Math.max(...pts.map(p => p[0])), y0 = Math.min(...pts.map(p => p[1])), y1 = Math.max(...pts.map(p => p[1]));
  const W = 1000, H = 625, pad = 30, s = Math.min((W - 2 * pad) / (x1 - x0 || 1), (H - 2 * pad) / (y1 - y0 || 1));
  const ox = (W - (x1 - x0) * s) / 2, oy = (H - (y1 - y0) * s) / 2;
  const d = polys.map(p => p.map(r => 'M' + r.map(([x, y]) => ((x * k - x0) * s + ox).toFixed(1) + ' ' + ((-y - y0) * s + oy).toFixed(1)).join('L') + 'Z').join('')).join('');
  return `<svg class="sil" viewBox="0 0 ${W} ${H}" role="img" aria-label="Silhueta misteriosa"><defs><linearGradient id="silg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0DB8D3"/><stop offset=".55" stop-color="#1B7FDC"/><stop offset="1" stop-color="#065B98"/></linearGradient></defs><path fill-rule="evenodd" d="${d}"/></svg>`;
};

let G = null, tick = null, rkTab = 'medio';
const stop = () => { clearInterval(tick); tick = null };
const segBind = (el, fn) => { const mv = () => { const b = el.querySelector('button.on'), ind = el.querySelector('.ind'); if (b && b.offsetWidth && ind) { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)` } }; el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; el.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); mv(); fn(b.dataset.v) }); requestAnimationFrame(mv) };

/* ---------- menu ---------- */
const recordeTxt = (m, rec) => {
  if (m === 'tempo') { const b = (rec.tempo || [])[0]; return b ? `Seu recorde: ${b.acertos} acertos` : 'Jogar' }
  const b = (rec[m] || []).filter(r => totalDe(r) === qtd)[0]; return b ? `Seu recorde: ${b.acertos}/${qtd} em ${tfmt(b.td * 100)}` : 'Jogar';
};
const cartao = (m, rec) => { const n = MODOS[m]; return `<button class="lvl lg pr" data-modo="${m}"><i style="background:${n.cor}">${n.ic}</i><b>${n.nome}</b><span>${n.txt}</span><em>${recordeTxt(m, rec)}</em></button>` };
const diaHTML = () => {
  const d = hoje(), r = diarios()[d];
  return `<div class="jg-dia lg"><i>#${numDia(d)}</i><div><b>Desafio diário</b>${r ? `<span>Você fez ${r.ok}/${DIARIO_N} em ${tfmt(r.td * 100)}. Volte amanhã para um novo desafio.</span><span class="sq">${quadrados(r.res)}</span>` : `<span>As mesmas ${DIARIO_N} bandeiras para todo mundo hoje. Uma tentativa por dia, com resultado para compartilhar.</span>`}</div>
  <div class="acts">${r ? '<button class="btn acc pr" id="jgdsh">Compartilhar</button><button class="btn gh pr" data-rk="diario">Ranking de hoje</button>' : '<button class="btn acc pr" data-modo="diario">Jogar o de hoje</button>'}</div></div>`;
};
const menu = () => {
  stop(); G = null; const rec = local(); const MX = MAXQ_GERAL(); qtd = Math.min(qtd, MX);
  $('v-jogo').innerHTML = `<div class="jg"><div class="jg-h"><h1>Qual é o país?</h1><p>Escolha um modo e a quantidade de bandeiras. Acerte o máximo no menor tempo e entre no ranking.</p></div>
  <div class="jg-qty lg"><span>Bandeiras por partida</span><span class="stp"><button id="jgq-" aria-label="Menos 10">−</button><b id="jgqv">${qtd}</b><button id="jgq+" aria-label="Mais 10">+</button></span><small>Vale para os modos clássicos, Silhueta e Recorte.</small></div>
  ${diaHTML()}
  <p class="jg-gt">Clássico</p><div class="lvls">${['facil', 'medio', 'dificil'].map(m => cartao(m, rec)).join('')}</div>
  <p class="jg-gt">Outros modos</p><div class="lvls">${['silhueta', 'recorte', 'tempo'].map(m => cartao(m, rec)).join('')}</div>
  <section class="jg-sec"><div class="shead"><div><h2>Ranking</h2><p id="rkp"></p></div></div><div class="rkm" id="rkm">${ORDEM_RK.map(m => `<button data-v="${m}" class="${m === rkTab ? 'on' : ''}">${NOME(m)}</button>`).join('')}</div><div class="rk" id="rkl"></div></section></div>`;
  const qset = v => { qtd = Math.max(10, Math.min(MX, v)); try { localStorage.setItem(QKEY, qtd) } catch (e) { } $('jgqv').textContent = qtd; $('jgq-').disabled = qtd <= 10; $('jgq+').disabled = qtd >= MX; const rc = local(); document.querySelectorAll('.lvl[data-modo]').forEach(b => { const em = b.querySelector('em'); if (em) em.textContent = recordeTxt(b.dataset.modo, rc) }); ranking() };
  $('jgq-').onclick = () => qset(qtd - 10); $('jgq+').onclick = () => qset(qtd + 10); qset(qtd);
  $('rkm').onclick = e => { const b = e.target.closest('button'); if (!b) return; rkTab = b.dataset.v; $('rkm').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); ranking() };
  if ($('jgdsh')) $('jgdsh').onclick = () => compartilhar(textoDiario(hoje(), diarios()[hoje()]));
  carregaTopo().catch(() => { });
};

/* ---------- ranking ---------- */
const ranking = async (hl) => {
  const box = $('rkl'); if (!box) return;
  const m = rkTab, dia = hoje(), comQ = MODOS[m] && MODOS[m].qtd;
  const desc = m === 'diario' ? `Desafio de hoje, #${numDia(dia)}.` : m === 'tempo' ? 'Mais acertos em 60 segundos.' : `${NOME(m)} · ${qtd} bandeiras.`;
  const filtra = L => melhores(L.filter(r => m === 'diario' ? r.dia === dia : !comQ || totalDe(r) === qtd));
  const row = (r, i) => `<li class="lg ${i < 3 ? 'medal' + (i + 1) : ''} ${hl && r.id === hl ? 'me' : ''}"><b>${i + 1}</b><span>${esc(r.nome)}</span><small>${m === 'tempo' ? r.acertos + ' acertos' : r.acertos + '/' + totalDe(r)}</small><small class="t2">${m === 'tempo' ? (Math.max(0, r.td - 600) / 10) + ' erros' : tfmt(r.td * 100)}</small></li>`;
  const vazio = (t, p) => `<div class="empty"><b>${t}</b><p>${p}</p></div>`;
  if (FB().on) {
    box.innerHTML = '<p class="tl-msg"><span class="sk" style="width:200px"></span></p>';
    try { const L = filtra(await FB().ranking(m, { dia })).slice(0, 25); if (rkTab !== m || !$('rkp')) return; $('rkp').textContent = 'Ranking global. ' + desc; box.innerHTML = L.length ? `<ol>${L.map(row).join('')}</ol>` : vazio('Ninguém entrou neste ranking ainda', 'Seja o primeiro.'); return } catch (e) { console.warn('[Flâmula] ranking:', e.message) }
  }
  const L = filtra(local()[m] || []); if (!$('rkp')) return; $('rkp').textContent = 'Seus resultados neste aparelho. ' + desc;
  box.innerHTML = L.length ? `<ol>${L.map(row).join('')}</ol>` : vazio('Sem resultados ainda', 'Jogue uma partida para aparecer aqui.');
};

/* ---------- partida ---------- */
const start = async modo => {
  const diario = modo === 'diario', base = diario ? 'medio' : modo, N = MODOS[base];
  if (diario && diarios()[hoje()]) { toast('Você já jogou o desafio de hoje'); return menu() }
  if (modo === 'silhueta') { $('v-jogo').innerHTML = '<div class="jg"><div class="jg-h"><h1>Silhueta</h1><p>Carregando o mapa…</p></div></div>'; try { await carregaTopo() } catch (e) { toast('Não foi possível carregar o mapa agora'); return menu() } if (!G && $('v-jogo').hidden) return }
  const dia = hoje(), rnd = diario ? seeded('flamula-' + dia) : Math.random;
  let total = diario ? DIARIO_N : modo === 'tempo' ? Infinity : Math.min(qtd, maxQ(modo));
  if (N.qtd && !diario && qtd > total) toast(`Este modo tem ${total} bandeiras disponíveis por partida`);
  const pool = shuffle(diario ? N.pool().slice().sort((a, b) => a.id < b.id ? -1 : 1) : N.pool(), rnd);
  G = { modo, base, diario, dia, rnd, total, i: 0, ok: 0, err: 0, res: [], q: [], pool, used: new Set(), t0: 0, run: false };
  const cor = diario ? '#1B7FDC' : N.cor;
  const contador = modo === 'tempo' ? '<div class="jg-prog"><i id="jgpr" style="width:100%"></i></div>' : total <= 30 ? `<div class="jg-dots" id="jgd">${Array.from({ length: total }, () => '<i></i>').join('')}</div>` : '<div class="jg-prog"><i id="jgpr" style="width:0"></i></div>';
  scrollTo(0, 0);
  $('v-jogo').innerHTML = `<div class="jg play"><div class="jg-top"><button class="jg-pill lg pr" id="jgsair">${I('back')}Sair</button><span class="jg-pill lg" style="color:${cor}">${diario ? 'Diário #' + numDia(dia) : N.nome}<span id="jgc" style="color:var(--mut)"></span></span><span class="jg-pill lg" id="jgt" aria-live="off">${modo === 'tempo' ? '1:00,0' : '0:00,0'}</span></div>
  ${contador}<div class="jg-board"><div class="jg-stage lg" id="jgs"><span class="sk" style="width:60%;height:40%"></span></div><div class="jg-side"><div class="opts" id="jgo"></div><p class="jg-rev" id="jgrv"></p></div></div></div>`;
  $('jgsair').onclick = () => { if (G && G.diario && G.i > 0 && !confirmaSair()) return; FL.stopGame(); menu() };
  next();
};
let sairArmado = 0;
const confirmaSair = () => { if (Date.now() - sairArmado < 3000) return true; sairArmado = Date.now(); toast('Sair agora conta como sua tentativa de hoje. Toque em Sair de novo para confirmar.'); return false };
const pick = async () => {
  const N = MODOS[G.base];
  for (let tries = 0; tries < 40; tries++) {
    const f = G.pool.find(x => !G.used.has(x.id)); if (!f) return null; G.used.add(f.id);
    let how;
    if (G.modo === 'silhueta') { how = silhueta(f.id) ? 'sil' : false } else how = await loadImg(f);
    if (!how) continue;
    const others = shuffle(N.distr(f).filter(x => x.id !== f.id && x.n !== f.n), G.rnd).slice(0, 3);
    return { f, how, opts: shuffle([f, ...others], G.rnd), ox: 20 + G.rnd() * 60, oy: 22 + G.rnd() * 56 };
  }
  return null;
};
const bandeira = q => q.how === 'img' ? `<img src="${esc(q.f.src)}" alt="Bandeira misteriosa">` : FL.draw(q.f, '').replace(/aria-label="[^"]*"/, 'aria-label="Bandeira misteriosa"');
const next = async () => {
  if (!G) return;
  if (G.i >= G.total) return finish();
  const dots = $('jgd'); if (dots) dots.children[G.i]?.classList.add('now');
  const gg = G, q = G.q[G.i] || (G.q[G.i] = await pick());
  if (G !== gg || !$('jgs')) return;
  if (!q) { if (G.modo === 'tempo') { G.used.clear(); G.q[G.i] = null; return next() } toast('Não foi possível carregar mais bandeiras agora'); return finish() }
  const st = $('jgs'); st.classList.toggle('rc-on', G.modo === 'recorte');
  if (G.modo === 'silhueta') st.innerHTML = silhueta(q.f.id);
  else if (G.modo === 'recorte') st.innerHTML = `<span class="rc-tag">Recorte ampliado</span><div class="rc" id="jgrc" style="transform-origin:${q.ox.toFixed(1)}% ${q.oy.toFixed(1)}%;transform:scale(2.3)">${bandeira(q)}</div>`;
  else st.innerHTML = bandeira(q);
  if (MODOS[G.base].limite && !G.diario) st.insertAdjacentHTML('beforeend', '<i class="jg-bar" id="jgb" style="width:100%"></i>');
  $('jgo').innerHTML = q.opts.map((o, k) => `<button class="opt lg" data-id="${esc(o.id)}"><kbd>${k + 1}</kbd>${esc(o.n)}</button>`).join('');
  $('jgrv').innerHTML = ''; $('jgc').textContent = G.total === Infinity ? ` · ${G.ok} acertos` : ` · ${G.i + 1}/${G.total}`;
  G.qStart = performance.now(); G.answered = false;
  if (!G.run) { G.run = true; G.t0 = performance.now() }
  if (!tick) tick = setInterval(upd, 100);
  G.pre = G.q[G.i + 1] ? null : pick().then(x => { if (G) G.q[G.i + 1] = x });
};
const upd = () => {
  if (!G || !$('jgt')) return stop();
  const el = performance.now() - G.t0;
  if (G.modo === 'tempo') { const left = Math.max(0, TEMPO_MS - el); $('jgt').textContent = tfmt(left); const p = $('jgpr'); if (p) p.style.width = (left / TEMPO_MS * 100) + '%'; if (left <= 0) return finish(); return }
  $('jgt').textContent = tfmt(el);
  const lim = MODOS[G.base].limite; if (lim && !G.diario && !G.answered) { const left = lim - (performance.now() - G.qStart); const b = $('jgb'); if (b) b.style.width = Math.max(0, left / lim * 100) + '%'; if (left <= 0) answer(null) }
};
const answer = id => {
  if (!G || G.answered) return; G.answered = true;
  const q = G.q[G.i], right = id === q.f.id; if (right) G.ok++; else G.err++;
  G.res.push(right);
  document.querySelectorAll('#jgo .opt').forEach(b => { b.disabled = true; if (b.dataset.id === q.f.id) b.classList.add('ok'); else if (b.dataset.id === id) b.classList.add('no') });
  if (!id) toast('Tempo esgotado: era ' + q.f.n);
  if (G.modo === 'recorte') { const rc = $('jgrc'); if (rc) rc.style.transform = 'scale(1)' }
  if (G.modo === 'silhueta') $('jgrv').innerHTML = `${q.f.n}`;
  const d = $('jgd'); if (d) { const c = d.children[G.i]; c.classList.remove('now'); c.classList.add(right ? 'ok' : 'no') }
  G.i++; const p = $('jgpr'); if (p && G.total !== Infinity) p.style.width = (G.i / G.total * 100) + '%';
  if ($('jgc') && G.total === Infinity) $('jgc').textContent = ` · ${G.ok} acertos`;
  const espera = G.modo === 'tempo' ? (right ? 350 : 800) : G.modo === 'recorte' ? (right ? 1100 : 1600) : right ? 750 : 1300;
  const gg = G; setTimeout(async () => { if (G !== gg) return; if (G.pre) await G.pre; if (G === gg) next() }, espera);
};

/* conquistas: contadores do jogo no perfil (quem está logado) */
const registra = (total, ok, diario) => {
  const fb = FB(); if (!fb.on || !fb.user || !fb.registrarJogo) return;
  fb.registrarJogo({ acertos: ok, gabarito: total >= 10 && total !== Infinity && ok === total, diario: diario ? hoje() : '', ontem: ontem() }).catch(e => console.warn('[Flâmula] conquistas:', e.message));
};

const finish = () => {
  stop(); if (!G) return; const g = G; G = null;
  const ms = performance.now() - g.t0, modo = g.modo, N = MODOS[g.base];
  const tempo = modo === 'tempo', total = tempo ? 60 : g.total;
  const td = tempo ? 600 + g.err * 10 : Math.max(30, Math.min(99999, Math.round(ms / 100)));
  const r = { nome: '', acertos: g.ok, td, total, pontos: g.ok * 100000 - td }; if (g.diario) r.dia = g.dia;
  if (g.diario) salvarDiario(g.dia, { ok: g.ok, td, res: g.res });
  registra(tempo ? Infinity : total, g.ok, g.diario);
  const p = FB().profile, frac = tempo ? 0 : g.ok / total;
  const msg = tempo ? (g.ok >= 30 ? 'Impressionante.' : g.ok >= 15 ? 'Muito bem.' : 'Dá para melhorar.') + ` ${g.err} ${g.err === 1 ? 'erro' : 'erros'}.` : `${frac === 1 ? 'Gabaritou!' : frac >= .7 ? 'Muito bem.' : frac >= .4 ? 'Dá para melhorar.' : 'Tente de novo.'} Tempo: <b>${tfmt(td * 100)}</b>`;
  const rkModo = g.diario ? 'diario' : modo; scrollTo(0, 0);
  $('v-jogo').innerHTML = `<div class="jg"><div class="jg-res lg"><span class="jg-pill" style="color:${g.diario ? '#1B7FDC' : N.cor};background:var(--chip)">${g.diario ? 'Desafio diário #' + numDia(g.dia) : N.nome}</span><div class="big">${tempo ? g.ok : g.ok + '/' + total}</div>${tempo ? '<p class="sub">acertos em 60 segundos</p>' : ''}<p class="sub">${msg}</p>
  ${g.diario ? `<div class="sq">${quadrados(g.res)}</div><button class="btn acc pr" id="jgsh">Compartilhar resultado</button>` : ''}
  <div class="jg-save"><input id="jgn" maxlength="24" placeholder="Seu nome no ranking" value="${esc((p && p.nome) || localStorage.getItem('flamula-apelido') || '')}"><button class="btn gh pr" id="jgsv">Salvar no ranking</button></div><p class="sub" id="jgst" style="font-size:14px;margin:0"></p>
  <div class="row2">${g.diario ? '' : '<button class="btn gh pr" id="jgag">Jogar de novo</button>'}<button class="btn gh pr" id="jgmn">Trocar de modo</button></div></div>
  <section class="jg-sec"><div class="shead"><div><h2>Ranking · ${NOME(rkModo)}</h2><p id="rkp"></p></div></div><div class="rk" id="rkl"></div></section></div>`;
  rkTab = rkModo; ranking();
  if ($('jgag')) $('jgag').onclick = () => start(modo); $('jgmn').onclick = menu;
  if ($('jgsh')) $('jgsh').onclick = () => compartilhar(textoDiario(g.dia, { ok: g.ok, td, res: g.res }));
  /* o resultado é salvo sozinho: na conta (ranking global) e neste aparelho. O nome pode ser trocado e salvo de novo. */
  const pior = a => g.diario ? 'Você já tem um resultado no ranking de hoje.' : `Seu recorde continua ${tempo ? a.acertos + ' acertos' : a.acertos + '/' + total + ' em ' + tfmt(a.td * 100)}. Este resultado foi descartado.`;
  const status = t => { const el = $('jgst'); if (el) el.textContent = t };
  const salvar = async (nome, auto) => {
    nome = (nome || '').trim().slice(0, 24); if (!nome) { if (!auto) toast('Digite um nome para o ranking'); status('Digite um nome para entrar no ranking.'); return }
    try { localStorage.setItem('flamula-apelido', nome) } catch (er) { }
    const rr = { ...r, nome }; const lc = saveLocal(rkModo, rr); const bt = $('jgsv'); if (bt) bt.disabled = true; status('Salvando…');
    if (!(window.FB && window.FB.ready)) await new Promise(ok => { addEventListener('fb-user', ok, { once: true }); setTimeout(ok, 6000) });
    if (FB().on) {
      try { const res = await FB().salvarPlacar(rkModo, rr); const t = res.melhorou ? (res.novo ? 'Resultado salvo no ranking global.' : 'Novo recorde! Seu resultado anterior foi substituído.') : pior(res.anterior); status(t); if (!auto || res.melhorou) toast(t); ranking(res.id) }
      catch (er) { console.warn('[Flâmula] placar:', er.code || er.message); status(er.code === 'permission-denied' ? 'Salvo neste aparelho. O ranking global recusou o resultado (regras do Firestore).' : 'Salvo neste aparelho. O ranking global não respondeu; tente salvar de novo.'); ranking() }
    } else { status(lc.melhorou ? 'Salvo neste aparelho.' : pior(lc.anterior)); ranking() }
    if (bt) { bt.disabled = false; bt.textContent = 'Salvar com este nome' }
  };
  $('jgsv').onclick = () => salvar($('jgn').value, false);
  salvar($('jgn').value, true);
};

addEventListener('keydown', e => { if (!G || $('v-jogo').hidden || G.answered) return; const k = +e.key; if (k >= 1 && k <= 4) { const b = document.querySelectorAll('#jgo .opt')[k - 1]; if (b) answer(b.dataset.id) } });
document.addEventListener('click', e => {
  if ($('v-jogo').hidden) return;
  const b = e.target.closest('#jgo .opt'); if (b) return answer(b.dataset.id);
  const l = e.target.closest('[data-modo]'); if (l) return start(l.dataset.modo);
  const r = e.target.closest('[data-rk]'); if (r) { rkTab = r.dataset.rk; const m = $('rkm'); if (m) m.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.v === rkTab)); ranking(); $('rkl')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
});

FL.views.jogo = () => { document.title = 'Jogo · Flâmula'; if (!G) menu() };
FL.stopGame = () => { if (G && G.diario && G.i > 0) salvarDiario(G.dia, { ok: G.ok, td: Math.round((performance.now() - G.t0) / 100), res: G.res.concat(Array(Math.max(0, G.total - G.res.length)).fill(false)) }); stop(); G = null };
FL.jogo = { hoje, diarios, numDia };
})();
