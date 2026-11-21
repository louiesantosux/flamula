/* Flâmula · login, perfil, comunidades, administração e formulários. */
(() => {
const FL = window.FL; if (!FL) return;
const { $, toast, esc, norm, D, byId, I, svg, sheet, closeSheet, dd } = FL;
const ADMIN_EMAIL = 'louieikishima@gmail.com';
const FB = () => window.FB || {};

const css = document.createElement('style');
css.textContent = `
.pf{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:20px;align-items:center;border-radius:32px;padding:22px;margin:30px 0 18px}
.pf .av{width:84px;height:84px;font-size:34px}
.pf h1{font-size:clamp(26px,3.4vw,40px)}
.pf p{margin:6px 0 0;color:var(--mut);max-width:60ch}
.pfst{display:flex;flex-wrap:wrap;gap:18px;margin-top:10px;font-size:14px;color:var(--mut)}
.pfst b{color:var(--ink);font-size:17px;margin-right:4px}
.pfa{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}
.tabsrow{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px}
.stl{display:inline-flex;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
.stl.pendente{background:rgba(255,159,10,.16);color:light-dark(#C77700,#FFB340)}
.stl.aprovada{background:rgba(52,199,89,.16);color:light-dark(#1E8E3E,#4ADE80)}
.stl.reprovada{background:rgba(255,59,48,.16);color:light-dark(#D70015,#FF6B61)}
.list{display:grid;gap:10px}
.li{display:grid;grid-template-columns:132px minmax(0,1fr) auto;gap:16px;align-items:center;padding:12px;border-radius:24px}
.li .th{aspect-ratio:3/2;display:grid;place-items:center;background:var(--chip);border-radius:16px;padding:10px}
.li .th img,.li .th svg{max-width:100%;max-height:100%;filter:drop-shadow(0 2px 6px rgba(0,0,0,.2))}
.li b{display:block;font-size:16px}
.li .m{color:var(--mut);font-size:13px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;margin-top:4px}
.li .why{font-size:14px;margin:6px 0 0}
.li .acts{justify-content:flex-end}
.chead{display:grid;grid-template-columns:minmax(160px,240px) minmax(0,1fr);gap:24px;align-items:center;border-radius:32px;padding:24px;margin:24px 0 18px}
.chead .cf{border-radius:22px;padding:16px;display:grid;place-items:center;background:rgba(127,127,127,.12)}
.chead .cf img,.chead .cf svg{width:100%;height:auto;filter:drop-shadow(0 10px 20px rgba(0,0,0,.25))}
.chead h1{font-size:clamp(28px,3.8vw,46px)}
.chead p{color:var(--mut);margin:10px 0 14px;max-width:62ch}
.mems{display:flex;flex-wrap:wrap;gap:8px}
.mem{display:flex;align-items:center;gap:8px;padding:5px 14px 5px 5px;border-radius:999px;font-size:14px;font-weight:600}
.mem .av{width:30px;height:30px;font-size:13px}
.ccard .stg{background:var(--cbg,var(--chip))}
.kv{display:grid;gap:12px}
.kv div{display:grid;gap:2px}
.kv small{color:var(--mut);font-size:13px}
.kv code{font:600 14px ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}
.box{border-radius:24px;padding:20px;display:grid;gap:12px}
.box p{margin:0}
.chk{display:flex;gap:10px;align-items:flex-start;font-size:14px;color:var(--mut);cursor:pointer}
.chk input{width:20px;height:20px;accent-color:var(--brasa);flex:none;margin-top:1px}
.shimg{display:grid;place-items:center;padding:14px;border-radius:18px;background:var(--chip)}
.shimg img{max-height:160px;filter:drop-shadow(0 6px 14px rgba(0,0,0,.2))}
.gbtn svg{width:20px;height:20px}
.restr{max-width:620px;margin:60px auto;text-align:center;border-radius:32px;padding:34px 24px;display:grid;gap:14px;justify-items:center}
.restr .ico{width:40px;height:40px;color:var(--mut)}
@media(max-width:760px){.pf{grid-template-columns:auto minmax(0,1fr);padding:18px}.pf .av{width:64px;height:64px;font-size:26px}.pfa{grid-column:1/-1;justify-content:stretch}.pfa .btn{flex:1}.li{grid-template-columns:96px minmax(0,1fr)}.li .acts{grid-column:1/-1}.li .acts .btn{flex:1}.chead{grid-template-columns:minmax(0,1fr);padding:18px}.chead .cf{max-width:280px}.tabsrow .seg{flex:1 1 100%}.tabsrow .seg button{flex:1}}
`;
css.textContent += `
/* página de login */
.ent{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:22px;align-items:stretch;margin:24px 0 40px;min-height:min(720px,calc(100vh - 140px))}
.ent-art{position:relative;border-radius:36px;overflow:hidden;background:var(--aurora);color:#fff;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(22px,4vw,44px);isolation:isolate}
.ent-art::before{content:'';position:absolute;inset:0;background:radial-gradient(60% 50% at 20% 10%,rgba(255,255,255,.28),transparent 60%),radial-gradient(50% 40% at 90% 90%,rgba(46,211,230,.35),transparent 70%);z-index:-1}
.ent-fl{position:absolute;inset:0;z-index:-1}
.ent-fl span{position:absolute;width:clamp(86px,12vw,160px);transform:rotate(calc((var(--k) - 3.5) * 4deg));animation:flt 7s ease-in-out infinite alternate;animation-delay:calc(var(--k) * -.9s)}
.ent-fl span:nth-child(1){left:5%;top:6%}.ent-fl span:nth-child(2){left:36%;top:3%}.ent-fl span:nth-child(3){left:68%;top:8%}.ent-fl span:nth-child(4){left:18%;top:24%}.ent-fl span:nth-child(5){left:52%;top:22%}.ent-fl span:nth-child(6){display:none}.ent-fl span:nth-child(7){display:none}.ent-fl span:nth-child(8){display:none}
.ent-art::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,transparent 30%,rgba(10,30,45,.55) 58%,rgba(10,30,45,.88) 100%)}
.ent-fl .fl{width:100%;height:auto;border-radius:6px;box-shadow:0 18px 40px rgba(10,30,45,.45)}
@keyframes flt{to{transform:translateY(-14px) rotate(calc((var(--k) - 3.5) * 5deg + 3deg))}}
@media(prefers-reduced-motion:reduce){.ent-fl span{animation:none}}
.ent-tx{position:relative}.ent-tx h2{font-size:clamp(26px,3.4vw,42px);max-width:16ch;text-shadow:0 2px 16px rgba(10,30,45,.6)}
.ent-tx ul{list-style:none;padding:0;margin:16px 0 0;display:grid;gap:8px;font-weight:600}
.ent-tx li{display:flex;gap:10px;align-items:center}.ent-tx li::before{content:'';width:8px;height:8px;border-radius:99px;background:#fff;box-shadow:0 0 12px #fff}
.ent-card{border-radius:36px;padding:clamp(22px,4vw,44px);display:flex;flex-direction:column;justify-content:center;gap:16px}
.ent-card h1{font-size:clamp(32px,4vw,46px)}.ent-sub{margin:-8px 0 4px;color:var(--mut)}
.ent-logo{margin-bottom:6px}.ent-logo .mk{width:30px;height:30px}
.ent-g{min-height:54px;justify-content:center;gap:12px;font-size:16px;background:#fff;color:#1F1F1F;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12),0 6px 18px rgba(10,30,45,.1)}
.ent-card .seg button{flex:1}
.pw{position:relative;display:block}.pw input{width:100%;padding-right:86px}.pwv{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:var(--chip);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:600;color:var(--ink)}
.ent-fine{font-size:12.5px;color:var(--mut);margin:4px 0 0}
.ent-in{display:grid;gap:12px;justify-items:center;text-align:center}.ent-av{width:96px;height:96px;font-size:38px}
@media(max-width:860px){.ent{grid-template-columns:minmax(0,1fr);min-height:0}.ent-art{min-height:240px}.ent-fl span{width:80px}.ent-tx ul{display:none}}
/* perfil */
.pfh{margin:22px 0 26px}
.pfc{height:clamp(150px,22vw,230px);border-radius:36px;position:relative;overflow:hidden;background:radial-gradient(60% 90% at 12% 15%,color-mix(in srgb,var(--c1) 75%,transparent),transparent 70%),radial-gradient(55% 80% at 70% 20%,color-mix(in srgb,var(--c2) 60%,transparent),transparent 70%),radial-gradient(50% 70% at 40% 100%,color-mix(in srgb,var(--c3) 55%,transparent),transparent 70%),linear-gradient(135deg,#0B4E7E,var(--noite))}
.pfc::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(10,30,45,.35))}
.pfcf{position:absolute;right:5%;top:50%;width:min(36%,300px);transform:translateY(-50%) rotate(-6deg);opacity:.92}
.pfcf .fl{width:100%;height:auto;border-radius:8px;box-shadow:0 20px 40px rgba(10,30,45,.4)}
.pfb{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:20px;align-items:end;border-radius:30px;padding:20px 22px;margin:-56px 0 0}
.pfav{width:112px;height:112px;font-size:44px;margin-top:-66px;box-shadow:0 0 0 5px var(--bg),0 14px 30px rgba(10,30,45,.3);background:var(--aurora)}
.pfn h1{font-size:clamp(26px,3.4vw,40px)}.pfn p{margin:6px 0 0;color:var(--mut);max-width:60ch}
.pfm{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-top:10px;font-size:13.5px;color:var(--mut)}
.pfchip{display:inline-flex;gap:8px;align-items:center;padding:4px 12px 4px 5px;border-radius:999px;background:var(--chip);color:var(--ink);font-weight:600}.pfchip img,.pfchip svg{width:26px;height:18px;object-fit:cover;border-radius:4px}
@media(max-width:760px){.pfa{flex-wrap:wrap}.pfa a.btn.pfadm{flex:1 1 100%;justify-content:center}}
.adst{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.adst button{border:0;border-radius:22px;padding:16px;text-align:left;display:grid;gap:2px;color:inherit}.adst button[disabled]{cursor:default;opacity:1}
.adst b{font:700 clamp(24px,2.8vw,32px)/1.1 var(--font-d);background:var(--aurora);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.adst span{font-size:13px;color:var(--mut);font-weight:600}
.adcol{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:26px}.adcol h3,.adsec h3{font-size:19px;margin-bottom:10px}.adsec h3 small{color:var(--mut);font-weight:600;font-size:14px}
.adsec{margin-bottom:34px}
.adtop{display:grid;gap:6px}.adtop a{display:grid;grid-template-columns:22px 44px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 12px;border-radius:14px;background:var(--chip)}
.adtop a>b{color:var(--mut);font-size:13px}.adtop img,.adtop svg{width:44px;height:30px;object-fit:cover;border-radius:5px}.adtop span{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.adtop small{color:var(--mut)}
.adchips{display:flex;flex-wrap:wrap;gap:8px}.adchip{display:inline-flex;align-items:center;gap:8px;padding:4px 4px 4px 6px;border-radius:999px;background:var(--chip);font-weight:600;font-size:14px}
.adchip img,.adchip svg{width:28px;height:19px;object-fit:cover;border-radius:4px}.adchip button{width:26px;height:26px;border-radius:999px;border:0;background:rgba(127,127,127,.2);color:inherit;font-size:16px;line-height:1}
.aduser .th{background:none;padding:0;width:64px;aspect-ratio:auto}.aduser .th .av{width:52px;height:52px;font-size:20px}.li.aduser{grid-template-columns:64px minmax(0,1fr) auto}
.pfaviso{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;border-radius:22px;padding:14px 18px;margin:14px 0 0}
@media(max-width:760px){.adst{grid-template-columns:repeat(2,minmax(0,1fr))}.adcol{grid-template-columns:minmax(0,1fr)}.li.aduser{grid-template-columns:56px minmax(0,1fr)}.pfaviso{margin:12px 0 0}}
.pfadm b{min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:#fff;color:var(--oceano,#1B7FDC);font-size:12px;display:inline-grid;place-items:center;margin-left:2px}
.avw{position:relative;display:inline-grid;flex:none;vertical-align:middle}
.selo{position:absolute;right:-2%;bottom:-2%;width:38%;aspect-ratio:1;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2.5px var(--bg),0 2px 6px rgba(0,0,0,.3);background:#fff;display:grid}
.selo img,.selo svg{width:100%;height:100%;object-fit:cover}
.pfc{isolation:isolate}.pfc>.pfsv{position:absolute;inset:0;width:100%;height:100%;z-index:-1}
.pfc.b-faixas,.pfc.b-nordica,.pfc.b-sol,.pfc.b-estrelas{background:var(--c1)}
.pfc.b-artico{background:radial-gradient(60% 90% at 85% 10%,rgba(13,184,211,.75),transparent 70%),radial-gradient(50% 70% at 10% 100%,rgba(27,127,220,.7),transparent 70%),linear-gradient(135deg,#0B4E7E,#193546)}
.pfc.b-artico::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(230,243,248,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(230,243,248,.08) 1px,transparent 1px);background-size:44px 44px}
.pfnau{position:absolute;inset:-40% -10%;display:grid;grid-template-columns:repeat(8,1fr);gap:18px;transform:rotate(-8deg);align-content:center;z-index:-1}
.pfnau span{animation:flt 6s ease-in-out infinite alternate;animation-delay:calc(var(--k) * -.4s)}.pfnau .fl{width:100%;height:auto;border-radius:4px;box-shadow:0 8px 18px rgba(0,0,0,.3)}
.pfc.b-nautico{background:linear-gradient(135deg,#0B4E7E,#193546)}
.pfmos{position:absolute;inset:-30% -6%;display:grid;grid-template-columns:repeat(10,1fr);gap:8px;transform:rotate(-8deg);z-index:-1;opacity:.95}
.pfmos img,.pfmos svg{width:100%;aspect-ratio:3/2;height:auto;object-fit:cover;border-radius:4px}
.pfc.b-mosaico{background:#193546}
.pfc.b-globo{background:radial-gradient(60% 90% at 80% 20%,color-mix(in srgb,var(--c1) 70%,transparent),transparent 70%),linear-gradient(135deg,#0B4E7E,#193546)}
.pfglo{position:absolute;right:-4%;top:-30%;width:min(46%,380px);z-index:-1}.pffla{position:absolute;left:4%;top:10%;width:min(18%,160px);transform:rotate(-10deg);z-index:-1}.pfglo svg,.pffla svg{width:100%;height:auto;display:block}
.pfcbtn{position:absolute;right:14px;top:14px;z-index:3;display:inline-flex;gap:6px;align-items:center;border:0;border-radius:999px;padding:8px 14px;color:#fff;font-weight:600;font-size:13.5px;--glass:rgba(10,30,45,.35)}
.pfcbtn .ico{width:16px;height:16px}
.pe-foto{display:flex;gap:16px;align-items:center;flex-wrap:wrap}.pe-av{width:84px;height:84px;font-size:34px}
.dd-full .dd-btn{width:100%;justify-content:space-between}
.field small{font-weight:400;color:var(--mut)}
.pebn{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:6px}
.pebn button{border:0;background:none;padding:0;display:grid;gap:5px;color:var(--ink);font:inherit;text-align:left}
.pebn .pfc.mini{display:block;height:58px;border-radius:14px;position:relative;overflow:hidden;box-shadow:0 0 0 1px var(--line)}
.pebn .pfc.mini::after{display:none}.pebn .pfc.mini .pfcf{width:46%;right:4%}
.pebn button.on .pfc.mini{box-shadow:0 0 0 3px var(--oceano,#1B7FDC)}.pebn small{font-size:12px;font-weight:600;color:var(--mut)}.pebn button.on small{color:var(--ink)}
/* perfil com tema da bandeira favorita: números, abas e destaques na cor dela */
body.tinted .pfs b,body.tinted .adst b{background:none;-webkit-text-fill-color:currentColor;color:color-mix(in srgb,var(--fa) 70%,#fff)}
body.tinted #pft .ind{background:color-mix(in srgb,var(--fa) 35%,transparent)}
body.tinted .pfchip,body.tinted .pfcbtn{--glass:color-mix(in srgb,var(--fa) 22%,rgba(10,20,30,.35))}
.dec{max-width:620px;display:grid;gap:6px}.dec p{margin:0}.dec-m{white-space:pre-wrap;padding:12px 14px;border-radius:14px;background:var(--chip);margin:6px 0!important}.dec .acts{margin-top:10px}
.adn{display:inline-grid;place-items:center;min-width:18px;height:18px;padding:0 5px;margin-left:6px;border-radius:999px;background:var(--fa,#1B7FDC);color:var(--fa-ink,#fff);font-size:11px}
.colg{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.colc{display:grid;gap:10px;padding:10px;border-radius:24px;color:inherit}.colc b{display:block;font-size:16px}.colc small{color:var(--mut)}.colc>div:last-child{padding:0 6px 4px}
.colm{display:grid;gap:3px;aspect-ratio:3/2;border-radius:16px;overflow:hidden;background:var(--chip)}
.colm.n1{grid-template-columns:1fr;grid-template-rows:1fr}.colm.n2{grid-template-columns:1fr 1fr;grid-template-rows:1fr}.colm.n3,.colm.n4{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.colm.n3>:first-child{grid-row:span 2}
.colm>*,.colm img,.colm svg{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover;display:block;border-radius:0!important;box-shadow:none!important;min-height:0}.colm>span{display:grid;place-items:center;color:var(--mut);font-size:13px}
.colpick{display:grid;gap:8px;max-height:46vh;overflow:auto}
.colpi{display:grid;grid-template-columns:64px minmax(0,1fr) 32px;gap:12px;align-items:center;padding:8px;border-radius:18px;border:1px solid var(--line);background:none;color:inherit;font:inherit;text-align:left}
.colpi .colm{border-radius:10px}.colpi b{display:block}.colpi small{color:var(--mut)}.colpi i{width:30px;height:30px;border-radius:999px;display:grid;place-items:center;background:var(--chip);font-style:normal;font-size:18px}
.colpi.on{border-color:var(--oceano,#1B7FDC)}.colpi.on i{background:var(--oceano,#1B7FDC);color:#fff}.colpi i .ico{width:16px;height:16px}
.colh{display:grid;grid-template-columns:200px minmax(0,1fr);gap:22px;align-items:center}.colh .colm{box-shadow:0 14px 34px rgba(0,0,0,.25)}
.colw{position:relative}.colx{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:999px;border:0;background:rgba(10,20,30,.55);color:#fff;font-size:18px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);z-index:2}
@media(max-width:760px){.colh{grid-template-columns:110px minmax(0,1fr);gap:14px}.colg{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.colc{padding:8px;border-radius:20px}}
.adapo{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:16px;align-items:start}@media(max-width:860px){.adapo{grid-template-columns:minmax(0,1fr)}}
.pfs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:14px 0 0}
.pfs button{border:0;border-radius:22px;padding:14px 16px;text-align:left;display:grid;gap:2px;color:inherit}
.pfs b{font:700 clamp(22px,2.6vw,30px)/1.1 var(--font-d);background:var(--aurora);-webkit-background-clip:text;background-clip:text;color:transparent}
.pfs span{font-size:13px;color:var(--mut);font-weight:600}
.tabsrow .seg{overflow-x:auto;scrollbar-width:none}.tabsrow #pft button,.tabsrow #adt button{flex:none!important}.tabsrow #adt{max-width:100%}
.pfj{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.pfjc{border-radius:24px;padding:18px;display:grid;gap:4px;border-top:3px solid var(--nv)}.pfjc small{color:var(--nv);font-weight:700}.pfjc b{font:700 34px/1 var(--font-d)}.pfjc span{color:var(--mut);font-size:14px}
.pfnote{color:var(--mut);font-size:13px;margin-top:14px}
@media(max-width:760px){.pfb{grid-template-columns:minmax(0,1fr);justify-items:start;margin:-46px 0 0;padding:18px}.pfav{width:88px;height:88px;font-size:34px;margin-top:-62px}.pfa{width:100%}.pfa .btn{flex:1}.pfs{grid-template-columns:repeat(2,minmax(0,1fr));margin:12px 0 0}.pfj{grid-template-columns:minmax(0,1fr)}.pfcf{width:46%}}
`;
document.head.appendChild(css);

/* utilidades */
const when = t => { const s = t && (t.seconds || (t.toDate && t.toDate().getTime() / 1000)); return s ? new Date(s * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'agora' };
const seloHTML = p => { const f = p && p.selo && byId[p.selo]; return f ? `<span class="selo" title="${esc(f.n)}">${svg(f, '', true)}</span>` : '' };
const avatar = (p, cls = 'av') => `<span class="avw">${'<span class="' + cls + '">'}${p && p.foto ? `<img src="${esc(p.foto)}" alt="" referrerpolicy="no-referrer">` : esc(((p && p.nome) || '?').trim()[0] || '?').toUpperCase()}</span>${seloHTML(p)}</span>`;
FL.seloHTML = seloHTML;
/* capas temáticas do perfil, desenhadas com as cores da bandeira favorita */
const BANNERS = [['artico', 'Ártico'], ['favorita', 'Bandeira favorita'], ['faixas', 'Faixas ao vento'], ['nordica', 'Cruz nórdica'], ['sol', 'Sol nascente'], ['estrelas', 'Céu de estrelas'], ['nautico', 'Sinais náuticos'], ['mosaico', 'Mosaico do mundo'], ['globo', 'Globo']];
const hashN = t => [...String(t || 'x')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const bannerHTML = (id, cs, fav, seed) => {
  const c = cs.length ? cs : ['#0DB8D3', '#1B7FDC', '#065B98'], c0 = c[0], c1 = c[1] || '#FFFFFF', c2 = c[2] || c0;
  const S = (inner, bg) => `<svg class="pfsv" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg ? `<rect width="1200" height="300" fill="${bg}"/>` : ''}${inner}</svg>`;
  if (id === 'faixas') { const n = Math.min(c.length, 4) || 3; return S(c.slice(0, n).map((col, i) => { const y = i === 0 ? -20 : i * 300 / n; return `<path d="M-20 ${y}Q300 ${y - 46} 600 ${y}T1220 ${y}V320H-20Z" fill="${col}"/>` }).join('') + '<path d="M-20 300Q300 220 600 270T1220 240V320H-20Z" fill="#fff" opacity=".08"/>') }
  if (id === 'nordica') return S(`<rect x="330" width="120" height="300" fill="${c1}"/><rect y="100" width="1200" height="100" fill="${c1}"/>${c[2] ? `<rect x="360" width="60" height="300" fill="${c2}"/><rect y="125" width="1200" height="50" fill="${c2}"/>` : ''}`, c0);
  if (id === 'sol') { let r = ''; for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, b = a + Math.PI / 16; r += `<path d="M900 300L${900 + 1400 * Math.cos(a)} ${300 - 1400 * Math.sin(a)}L${900 + 1400 * Math.cos(b)} ${300 - 1400 * Math.sin(b)}Z" fill="${c0}"/>` } return S(r + `<circle cx="900" cy="300" r="120" fill="${c0}"/><circle cx="900" cy="300" r="120" fill="#fff" opacity=".12"/>`, c1) }
  if (id === 'estrelas') { let r = ''; const rnd = (k => () => (k = (k * 16807) % 2147483647) / 2147483647)(hashN(seed) || 1); for (let k = 0; k < 46; k++) { const x = rnd() * 1200, y = rnd() * 300, z = 6 + rnd() * 16; r += `<use href="#pf-star" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(z / 10).toFixed(2)})" fill="${c1}" opacity="${(.45 + rnd() * .55).toFixed(2)}"/>` } return S(`<defs><path id="pf-star" d="M0-10L2.9-3.1 9.5-3.1 4.2 1.2 6.2 8.1 0 4 -6.2 8.1 -4.2 1.2 -9.5-3.1 -2.9-3.1Z"/></defs>` + r, c0) }
  if (id === 'nautico') { const N = D.filter(f => f.t === 'nautica').slice(0, 26); return `<div class="pfnau">${N.concat(N).slice(0, 24).map((f, k) => `<span style="--k:${k}">${svg(f, 'fl', false)}</span>`).join('')}</div>` }
  if (id === 'mosaico') { const P = D.filter(f => f.t === 'pais' && !f.isl); const h = hashN(seed); const L = Array.from({ length: 30 }, (_, k) => P[(h + k * 37) % P.length]); return `<div class="pfmos">${L.map(f => svg(f, 'fl', true)).join('')}</div>` }
  if (id === 'globo') return `<span class="pfglo"><svg viewBox="0 0 200 200"><use href="#s-globo"/></svg></span><span class="pffla"><svg viewBox="0 0 240 200"><use href="#s-flamula"/></svg></span>`;
  if (id === 'favorita') return fav ? `<span class="pfcf">${svg(fav, 'fl', false)}</span>` : '';
  return '';
};
const dataSrc = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s || '');
const segH = (id, items, cur) => `<div class="seg" id="${id}"><i class="ind" aria-hidden="true"></i>${items.map(([v, l]) => `<button data-v="${v}" class="${v === cur ? 'on' : ''}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
const segMove = el => { if (!el) return; const b = el.querySelector('button.on'), ind = el.querySelector('.ind'); if (!b || !b.offsetWidth) return; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft}px)`; ind.classList.add('moving'); setTimeout(() => ind.classList.remove('moving'), 220) };
const segBind = (el, fn) => { el.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; el.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b) }); segMove(el); fn(b.dataset.v) }); requestAnimationFrame(() => segMove(el)) };
const flagThumb = id => { const f = byId[id]; return f ? svg(f, 'fl') : '' };
const comCard = c => `<a class="card pr ccard" href="#c-${esc(c.id)}" style="--cbg:linear-gradient(135deg,${(c.cores && c.cores.length ? c.cores.slice(0, 3) : ['#888', '#555']).map(x => esc(x) + '33').join(',')})"><div class="stg">${flagThumb(c.bandeira)}</div><div class="meta"><b>${esc(c.nome)}</b><span>${c.membros || 0} ${c.membros === 1 ? 'membro' : 'membros'}</span></div><div class="cnt"><span>${esc((c.descricao || '').slice(0, 70))}${(c.descricao || '').length > 70 ? '…' : ''}</span></div></a>`;
const restricted = (title, text, btn) => `<div class="restr lg"><svg class="ico" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><h2>${title}</h2><p style="margin:0;color:var(--mut)">${text}</p>${btn || ''}</div>`;
const loading = () => `<div class="restr"><span class="sk" style="width:200px;height:18px"></span><span class="sk" style="width:140px"></span></div>`;
const offMsg = () => restricted('Contas indisponíveis', 'O Firebase ainda não está configurado neste site. Preencha o arquivo firebase-config.js para ativar login, perfis e comunidades.');
const needLogin = what => restricted('Entre para continuar', `Faça login para ${what}.`, '<button class="btn acc pr" data-act="login">Entrar</button>');
const fbErr = e => {
  const c = (e && e.code) || '';
  return ({ 'auth/invalid-credential': 'E-mail ou senha incorretos.', 'auth/wrong-password': 'E-mail ou senha incorretos.', 'auth/user-not-found': 'Não há conta com este e-mail.', 'auth/email-already-in-use': 'Já existe uma conta com este e-mail.', 'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.', 'auth/invalid-email': 'E-mail inválido.', 'auth/too-many-requests': 'Muitas tentativas. Tente de novo em alguns minutos.', 'auth/unauthorized-domain': 'Este domínio não está autorizado no Firebase (Authentication → Configurações → Domínios autorizados).', 'auth/operation-not-allowed': 'Este método de login não está ativado no console do Firebase.', 'auth/popup-blocked': 'O navegador bloqueou a janela de login. Permita pop-ups e tente de novo.', 'permission-denied': 'Sem permissão para esta ação.' })[c] || (e && e.message) || 'Algo deu errado.';
};
const waitUser = () => new Promise(r => { if (FB().ready) return r(); addEventListener('fb-user', () => r(), { once: true }); setTimeout(r, 8000) });

const GLOGO = '<svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
/* login: página própria (#entrar) */
const VOLTA = 'fl-volta';
FL.actions.login = () => { const h = FLKEY(); if (h && h !== 'entrar') try { sessionStorage.setItem(VOLTA, h) } catch (e) { } FL.go('entrar') };
const depois = () => { let h = ''; try { h = sessionStorage.getItem(VOLTA) || ''; sessionStorage.removeItem(VOLTA) } catch (e) { } FL.go(h && h !== 'entrar' ? h : 'perfil') };
FL.views.entrar = async () => {
  const v = $('v-entrar'); document.title = 'Entrar · Flâmula';
  const fotos = ['br', 'jp', 'za', 'kr', 'ca', 'np', 'gb', 'se'].map(id => byId[id]).filter(Boolean);
  v.innerHTML = `<div class="ent">
  <div class="ent-art"><div class="ent-fl">${fotos.map((f, k) => `<span style="--k:${k}">${svg(f, 'fl', false)}</span>`).join('')}</div>
   <div class="ent-tx"><h2>Bandeiras do mundo inteiro, e as suas também.</h2><ul><li>Envie suas criações para a galeria</li><li>Participe de comunidades</li><li>Entre no ranking do jogo</li></ul></div></div>
  <div class="ent-card lg" id="entc">${loading()}</div></div>`;
  if (!FB().ready) { await waitUser(); if (FL.view !== 'entrar') return }
  const c = $('entc'); if (!c) return;
  if (!FB().on) { c.innerHTML = '<h1>Entrar</h1><p class="ent-sub">O login ainda não está ativo: o Firebase não foi configurado neste site.</p>'; return }
  if (FB().user) { const p = FB().profile || {}; c.innerHTML = `<div class="ent-in">${avatar(p, 'av ent-av')}<h1>Olá, ${esc((p.nome || '').split(' ')[0] || 'tudo certo')}</h1><p class="ent-sub">Você já está conectado.</p><a class="btn acc pr" href="#perfil">Ir para meu perfil</a><button class="btn gh pr" id="entout">Sair da conta</button></div>`; $('entout').onclick = async () => { await FB().logout(); toast('Você saiu da conta'); FL.views.entrar() }; return }
  let mode = 'in';
  c.innerHTML = `<a class="logo ent-logo" href="#inicio"><svg class="mk"><use href="#mk"/></svg><span class="wm">flâmula</span></a>
   <h1 id="enth">Entrar</h1><p class="ent-sub" id="ents">Use sua conta Google ou seu e-mail.</p>
   <button class="btn pr ent-g" id="lgg">${GLOGO}<span>Continuar com Google</span></button>
   <div class="or">ou com e-mail</div>
   <div class="form">${segH('lgm', [['in', 'Entrar'], ['up', 'Criar conta']], 'in')}
    <label class="field" id="lgnw" hidden>Nome<input id="lgn" autocomplete="name" maxlength="60" placeholder="Como quer ser chamado"></label>
    <label class="field">E-mail<input id="lge" type="email" autocomplete="email" inputmode="email" placeholder="voce@exemplo.com"></label>
    <label class="field">Senha<span class="pw"><input id="lgp" type="password" autocomplete="current-password" minlength="6" placeholder="Mínimo de 6 caracteres"><button type="button" class="pwv" id="lgpv" aria-label="Mostrar senha">Mostrar</button></span></label>
    <p class="err" id="lgerr" hidden></p>
    <button class="btn acc pr" id="lgok">Entrar</button>
    <button class="lnk" id="lgreset" style="justify-self:center">Esqueci a senha</button></div>
   <p class="ent-fine">Ao continuar, você concorda em seguir as regras da comunidade. Suas criações passam por moderação antes de aparecer na galeria.</p>`;
  requestAnimationFrame(() => segMove($('lgm')));
  const err = m => { const e = $('lgerr'); e.textContent = m; e.hidden = !m };
  segBind($('lgm'), v2 => { mode = v2; $('lgnw').hidden = v2 !== 'up'; $('lgok').textContent = v2 === 'up' ? 'Criar conta' : 'Entrar'; $('enth').textContent = v2 === 'up' ? 'Criar conta' : 'Entrar'; $('lgreset').hidden = v2 === 'up'; $('lgp').autocomplete = v2 === 'up' ? 'new-password' : 'current-password'; err('') });
  $('lgpv').onclick = () => { const i = $('lgp'); const sh = i.type === 'password'; i.type = sh ? 'text' : 'password'; $('lgpv').textContent = sh ? 'Ocultar' : 'Mostrar' };
  const ok = () => { toast('Você entrou no Flâmula'); depois() };
  $('lgg').onclick = async () => { err(''); const b = $('lgg'); b.disabled = true; try { await FB().google(); if (FB().user || FL.view === 'entrar') ok() } catch (e) { if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') err(fbErr(e)) } finally { if ($('lgg')) $('lgg').disabled = false } };
  $('lgok').onclick = async () => {
    const em = $('lge').value.trim(), pw = $('lgp').value, nm = $('lgn').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(em)) return err('Informe um e-mail válido.');
    if (pw.length < 6) return err('A senha precisa ter pelo menos 6 caracteres.');
    if (mode === 'up' && !nm) return err('Informe seu nome.');
    $('lgok').disabled = true;
    try { mode === 'up' ? await FB().signup(nm, em, pw) : await FB().login(em, pw); ok() } catch (e) { err(fbErr(e)) } finally { const b = $('lgok'); if (b) b.disabled = false }
  };
  c.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') $('lgok').click() });
  $('lgreset').onclick = async () => { const em = $('lge').value.trim(); if (!/^\S+@\S+\.\S+$/.test(em)) return err('Digite seu e-mail acima para receber o link.'); try { await FB().reset(em); err(''); toast('Enviamos um link de redefinição para o seu e-mail') } catch (e) { err(fbErr(e)) } };
};

FL.actions['verificar-email'] = async () => { try { await FB().verificarEmail(); toast('Link de confirmação enviado para o seu e-mail') } catch (e) { toast(fbErr(e)) } };
FL.actions['ja-confirmei'] = async () => { try { await FB().atualizarConta(); toast(FB().admin ? 'Acesso de administrador ativado' : 'O e-mail ainda não aparece como confirmado'); if (FL.view === 'admin') FL.views.admin(); if (FL.view === 'perfil') FL.views.perfil() } catch (e) { toast(fbErr(e)) } };
/* pedir para ser administrador */
const STP = { pendente: ['Em análise', 'pendente'], aprovado: ['Aprovado', 'aprovada'], recusado: ['Recusado', 'reprovada'] };
FL.actions['admin-pedido'] = async () => {
  const u = FB().user, p = FB().profile;
  if (!FB().on) return toast(`Indisponível no momento. Escreva para ${ADMIN_EMAIL}.`);
  if (!u) { sheet('Seja administrador', `<div class="form"><p style="margin:0">Administradores aprovam as criações enviadas, cuidam das comunidades e dos pedidos. Entre na sua conta para fazer o pedido.</p><button class="btn acc pr" data-act="login">Entrar</button></div>`); return }
  if (FB().admin) return toast('Você já é administrador');
  const meus = (await FB().meusPedidos().catch(() => [])).filter(x => x.tipo === 'admin');
  const aberto = meus.find(x => x.status === 'pendente');
  if (aberto) { sheet('Seja administrador', `<div class="form"><p style="margin:0">Seu pedido está <b>em análise</b>. Você recebe o painel de administração no perfil assim que ele for aprovado.</p></div>`); return }
  sheet('Seja administrador', `<div class="form">
    <p style="margin:0;color:var(--mut)">Administradores aprovam as criações enviadas, cuidam das comunidades e dos pedidos. Conte por que quer ajudar: o pedido vai para o painel do administrador principal.</p>
    <label class="field">Nome<input id="apn" maxlength="80" value="${esc(p?.nome || '')}"></label>
    <label class="field">Por que quer ser administrador<textarea id="apm" maxlength="2000" placeholder="Sua experiência com bandeiras, moderação ou comunidades"></textarea></label>
    <p class="err" id="aperr" hidden></p><button class="btn acc pr" id="apok">Enviar pedido</button></div>`);
  $('apok').onclick = async () => {
    const nome = $('apn').value.trim(), mensagem = $('apm').value.trim(), er = $('aperr');
    if (!nome || mensagem.length < 10) { er.textContent = 'Informe o nome e escreva uma mensagem um pouco maior.'; er.hidden = false; return }
    const b = $('apok'); b.disabled = true; b.textContent = 'Enviando…'; er.hidden = true;
    try { const r = await FB().pedir('admin', { nome, mensagem }); closeSheet(); toast('Pedido enviado ao administrador. Acompanhe em Meu perfil → Conta.') }
    catch (e) { console.error('[Flâmula] pedido:', e); er.textContent = e && e.code === 'permission-denied' ? 'O site ainda não aceita pedidos: as regras novas do Firestore não foram publicadas.' : fbErr(e); er.hidden = false; b.disabled = false; b.textContent = 'Enviar pedido' }
  };
};


/* ---------- coleções ---------- */
const MAXCOL = 50, MAXIT = 200;
const nb = n => n === 1 ? '1 bandeira' : n + ' bandeiras';
const novoId = () => Math.random().toString(36).slice(2, 10);
const minhasCol = () => (FB().profile && Array.isArray(FB().profile.colecoes) ? FB().profile.colecoes : []).map(c => ({ ...c, bandeiras: (c.bandeiras || []).slice() }));
/* itens da coleção: bandeiras do acervo (id) ou imagens avulsas das páginas militares, guardadas em c.x[id] = { n, src } */
const flagDe = (c, id) => { if (byId[id]) return byId[id]; const x = c && c.x && c.x[id]; if (!x || !x.src) return null; const f = { id, k: '—', n: x.n || 'Bandeira', t: 'militar', o: 'oficial', r: '', pais: 'imagem das páginas militares', ra: null, c: ['#888888'], src: x.src, extra: true, d: (W, H) => `<rect width="${W}" height="${H}" fill="#ccc"/>` }; byId[id] = f; return f };
const idExtra = src => { let h = 0; for (const ch of src) h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0; return 'x-' + (h >>> 0).toString(36) };
const mosaico = c => { const L = (c.bandeiras || []).map(id => flagDe(c, id)).filter(Boolean).slice(0, 4); return `<div class="colm n${Math.max(1, L.length)}">${L.length ? L.map(f => svg(f, 'fl', true)).join('') : '<span>Vazia</span>'}</div>` };
const colCard = (c, uid) => `<a class="colc lg pr" href="#col-${esc(uid)}-${esc(c.id)}">${mosaico(c)}<div><b>${esc(c.nome)}</b><small>${nb((c.bandeiras || []).length)}</small></div></a>`;
/* bandeira favorita: qualquer bandeira do acervo (id) ou uma imagem avulsa das páginas militares (favExtra) */
const favDe = p => {
  if (!p || !p.bandeira) return null; if (byId[p.bandeira]) return byId[p.bandeira];
  const x = p.favExtra; if (!x || !x.src) return null;
  const f = { id: p.bandeira, k: '—', n: x.n || 'Bandeira', t: 'militar', o: 'oficial', r: '', ra: x.ra || null, c: (x.c && x.c.length ? x.c : ['#0DB8D3', '#1B7FDC']), src: x.src, extra: true, d: (W, H) => `<rect width="${W}" height="${H}" fill="${x.c && x.c[0] || '#1B7FDC'}"/>` };
  byId[f.id] = f; return f;
};
FL.favDe = favDe;
const usarFavorita = async (d, nome) => {
  if (!FB().on) return toast('Perfis indisponíveis no momento');
  if (!FB().user) { sheet('Usar como favorita', '<div class="form"><p style="margin:0">Entre na sua conta para escolher a bandeira favorita. Ela vira o tema de cores e a capa do seu perfil.</p><button class="btn acc pr" data-act="login">Entrar</button></div>'); return false }
  const p = FB().profile || {}; const upd = { ...d }; if (!p.banner || p.banner === 'artico') upd.banner = 'favorita';
  try { await FB().saveProfile(upd); toast(`${nome} agora é a sua favorita. O tema do perfil usa as cores dela.`); FL.refreshAcc && FL.refreshAcc(); return true } catch (e) { toast(fbErr(e)); return false }
};
FL.actions.favoritar = async el => {
  const id = el && el.dataset.id, f = id && byId[id]; if (!f) return;
  if ((FB().profile || {}).bandeira === id) return toast('Esta já é a sua favorita');
  if (await usarFavorita({ bandeira: id, favExtra: null }, f.n)) document.querySelectorAll(`[data-act="favoritar"]`).forEach(b => { const on = b.dataset.id === id; b.classList.toggle('on', on); const s = b.querySelector('span'); if (s) s.textContent = on ? 'Sua favorita' : 'Usar como favorita' });
};
FL.actions['favoritar-extra'] = async x => {
  let h = 0; for (const ch of x.src) h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0;
  await usarFavorita({ bandeira: 'x-' + (h >>> 0).toString(36), favExtra: x }, x.n);
};

const abrirColecoes = async (id, extra) => {
  if (!FB().on) return toast('Coleções indisponíveis no momento');
  if (!FB().user) { sheet('Salvar em coleção', '<div class="form"><p style="margin:0">Entre na sua conta para criar coleções e guardar bandeiras.</p><button class="btn acc pr" data-act="login">Entrar</button></div>'); return }
  let L = minhasCol(); let ocupado = Promise.resolve();
  sheet('Salvar em coleção', `<div class="form"><div class="colpick" id="colpick"><p class="pfnote" style="margin:0">Carregando suas coleções…</p></div>
    <div class="erow" style="flex-wrap:nowrap"><input id="colnova" maxlength="40" placeholder="Nova coleção" style="flex:1;min-height:44px;border-radius:999px;border:1px solid var(--line);background:var(--chip);padding:0 16px;font:inherit;color:inherit"><button class="btn acc pr" id="colcriar">Criar</button></div>
    <p class="err" id="colerr" hidden></p></div>`);
  /* busca a versão mais recente salva na conta (evita apagar o que foi feito em outro aparelho ou aba) */
  try { const fresh = await FB().perfilDe(FB().user.uid); if (fresh && Array.isArray(fresh.colecoes)) { FB().profile.colecoes = fresh.colecoes; L = minhasCol() } } catch (e) { }
  if (!$('colpick')) return;
  const tem = c => (c.bandeiras || []).includes(id);
  const draw = () => { const b = $('colpick'); if (!b) return; b.innerHTML = L.length ? L.map(c => { const t = tem(c); return `<button class="colpi pr ${t ? 'on' : ''}" data-c="${esc(c.id)}" aria-pressed="${t}">${mosaico(c)}<span><b>${esc(c.nome)}</b><small>${nb(c.bandeiras.length)}</small></span><i>${t ? FL.I('check') : '+'}</i></button>` }).join('') : '<p class="pfnote" style="margin:0">Você ainda não tem coleções. Crie a primeira abaixo.</p>' };
  const erro = m => { const er = $('colerr'); if (er) { er.textContent = m; er.hidden = !m } };
  /* salvamentos em fila: cada clique grava o estado completo, na ordem */
  const salva = msg => { const copia = JSON.parse(JSON.stringify(L)); ocupado = ocupado.then(async () => { try { await FB().salvarColecoes(copia); erro(''); if (msg) toast(msg) } catch (e) { console.warn('[Flâmula] coleções:', e); erro(e && e.code === 'permission-denied' ? 'A conta não tem permissão para salvar. Confira se as regras do Firestore foram publicadas.' : 'Não foi possível salvar: ' + fbErr(e)) } }); return ocupado };
  const poe = c => { c.bandeiras = [id].concat(c.bandeiras.filter(x => x !== id)); if (extra) c.x = { ...(c.x || {}), [id]: { n: String(extra.n || 'Bandeira').slice(0, 120), src: String(extra.src).slice(0, 600) } } };
  const tira = c => { c.bandeiras = c.bandeiras.filter(x => x !== id); if (c.x && c.x[id]) { const y = { ...c.x }; delete y[id]; c.x = y } };
  draw();
  $('colpick').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; const c = L.find(x => x.id === b.dataset.c); if (!c) return; const t = tem(c); if (!t && c.bandeiras.length >= MAXIT) return toast('Limite de ' + MAXIT + ' bandeiras por coleção'); t ? tira(c) : poe(c); draw(); salva(t ? `Removida de "${c.nome}"` : `Salva em "${c.nome}"`) };
  const criar = () => { const inp = $('colnova'), nome = inp.value.trim(); if (!nome) return inp.focus(); if (L.length >= MAXCOL) return toast('Limite de ' + MAXCOL + ' coleções'); if (L.some(c => c.nome.toLowerCase() === nome.toLowerCase())) return erro('Você já tem uma coleção com esse nome.'); const c = { id: novoId(), nome: nome.slice(0, 40), bandeiras: [], criadaEm: Date.now() }; poe(c); L.unshift(c); inp.value = ''; draw(); salva(`Coleção "${nome}" criada`) };
  $('colcriar').onclick = criar; $('colnova').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); criar() } });
};
FL.actions['salvar-colecao'] = el => { const id = el && el.dataset.id; if (!id || !byId[id]) return toast('Não foi possível identificar esta bandeira'); abrirColecoes(id, null) };
FL.actions['salvar-colecao-extra'] = x => { if (!x || !x.src) return; const id = byId[x.id] ? x.id : idExtra(x.src); abrirColecoes(id, byId[id] && !byId[id].extra ? null : x) };
FL.views.colecao = async arg => {
  const v = $('v-colecao'); v.innerHTML = loading();
  const m = String(arg || '').match(/^(.+)-([a-z0-9]{4,12})$/i);
  await waitUser(); if (FL.view !== 'colecao') return;
  if (!m || !FB().on) return v.innerHTML = '<div class="empty" style="margin-top:40px"><b>Coleção não encontrada</b></div>';
  const [, uid, cid] = m; const dono = FB().user && FB().user.uid === uid;
  let p; try { p = dono ? { id: uid, ...FB().profile } : await FB().perfilDe(uid) } catch (e) { p = null }
  const L = p && Array.isArray(p.colecoes) ? p.colecoes : []; const c = L.find(x => x.id === cid);
  if (!c) return v.innerHTML = '<div class="empty" style="margin-top:40px"><b>Coleção não encontrada</b><p>Ela pode ter sido apagada.</p></div>';
  document.title = c.nome + ' · Coleção · Flâmula';
  const fs = (c.bandeiras || []).map(id => flagDe(c, id)).filter(Boolean);
  const faltam = (c.bandeiras || []).length - fs.length, semImg = fs.filter(f => f.wt && !f.src);
  if ((faltam || semImg.length) && !FL._colTentou) { FL._colTentou = true; Promise.all([faltam && FL.reloadOriginals ? Promise.resolve(FL.reloadOriginals()).catch(() => { }) : 0, semImg.length && window.FLWIKI ? FLWIKI.militares(semImg).catch(() => { }) : 0]).then(() => { if (FL.view === 'colecao') FL.views.colecao(arg) }).finally(() => setTimeout(() => { FL._colTentou = false }, 1500)) }
  v.innerHTML = `<a class="back lg pr" href="${dono ? '#perfil' : '#explorar'}">${FL.I('back')}${dono ? 'Meu perfil' : 'Explorar'}</a>
   <div class="phead colh"><div>${mosaico(c)}</div><div><p class="pfnote" style="margin:0 0 4px">Coleção de ${esc(p.nome || 'Sem nome')}</p><h1>${esc(c.nome)}</h1><p>${nb(fs.length)}</p>
   <div class="erow" style="margin-top:12px"><button class="btn gh pr sm" id="colcp">${FL.I('link')}Copiar link</button>${dono ? '<button class="btn gh pr sm" id="colren">Renomear</button><button class="btn dg pr sm" id="coldel">Apagar coleção</button>' : ''}</div></div></div>
   ${fs.length ? `<div class="grid">${fs.map(f => `<div class="colw">${f.extra ? FL.card(f).replace(/^<a class="card pr" href="[^"]*"/, `<a class="card pr" href="${esc(f.src)}" target="_blank" rel="noopener"`) : FL.card(f)}${dono ? `<button class="colx pr" data-rm="${esc(f.id)}" aria-label="Tirar da coleção">×</button>` : ''}</div>`).join('')}</div>` : `<div class="empty"><b>Coleção vazia</b><p>Use o botão Salvar na página de qualquer bandeira.</p><a class="btn acc pr" href="#explorar">Explorar bandeiras</a></div>`}`;
  $('colcp').onclick = () => navigator.clipboard.writeText(location.href).then(() => toast('Link da coleção copiado')).catch(() => toast('Não foi possível copiar'));
  if (!dono) return;
  const all = minhasCol(), me2 = all.find(x => x.id === cid);
  const salva = async (msg, depois) => { try { await FB().salvarColecoes(all); toast(msg); depois ? depois() : FL.views.colecao(arg) } catch (e) { toast(fbErr(e)) } };
  v.querySelectorAll('[data-rm]').forEach(b => b.onclick = e => { e.preventDefault(); e.stopPropagation(); me2.bandeiras = me2.bandeiras.filter(x => x !== b.dataset.rm); if (me2.x && me2.x[b.dataset.rm]) { me2.x = { ...me2.x }; delete me2.x[b.dataset.rm] } salva('Bandeira removida da coleção') });
  $('colren').onclick = () => { sheet('Renomear coleção', `<div class="form"><label class="field">Nome<input id="colrn" maxlength="40" value="${esc(me2.nome)}"></label><button class="btn acc pr" id="colrnok">Salvar</button></div>`); $('colrnok').onclick = () => { const n = $('colrn').value.trim(); if (!n) return; me2.nome = n; closeSheet(); salva('Coleção renomeada') } };
  $('coldel').onclick = e => { const b = e.currentTarget; if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } all.splice(all.indexOf(me2), 1); salva('Coleção apagada', () => { FL.go('perfil') }) };
};

/* decisão vinda dos botões do e-mail: #decidir-<id>-aprovar | -declinar */
FL.views.decidir = async arg => {
  const v = $('v-decidir'); document.title = 'Pedido · Flâmula'; v.innerHTML = loading();
  const m = String(arg || '').match(/^([A-Za-z0-9]+)-(aprovar|declinar)$/);
  await waitUser(); if (FL.view !== 'decidir') return;
  const card = (t, txt, extra = '') => v.innerHTML = `<div class="phead"><h1>${t}</h1></div><div class="box lg dec">${txt}${extra}</div>`;
  if (!m) return card('Link inválido', '<p>Este link de decisão não está completo.</p>');
  if (!FB().on) return v.innerHTML = offMsg();
  if (!FB().user) { try { sessionStorage.setItem('fl-volta', FLKEY()) } catch (e) { } return v.innerHTML = needLogin('decidir este pedido') }
  if (!FB().admin) return card('Acesso restrito', '<p>Só administradores decidem pedidos. Entre com a conta de administrador.</p>');
  const [, id, acao] = m; const ap = acao === 'aprovar';
  try {
    const p = await FB().pedido(id); if (!p) return card('Pedido não encontrado', '<p>Ele pode ter sido apagado.</p>');
    const quem = `<p><b>${esc(p.nome || 'Sem nome')}</b>${p.email ? ' · ' + esc(p.email) : ''}</p><p style="color:var(--mut)">${p.tipo === 'admin' ? 'Pedido para ser administrador' : 'Pedido para ser colaborador'}</p>${p.mensagem ? `<p class="dec-m">${esc(p.mensagem)}</p>` : ''}`;
    const voltar = '<div class="acts"><a class="btn gh pr" href="#admin">Ver todos os pedidos</a></div>';
    if (p.status !== 'pendente') return card('Pedido já decidido', quem + `<p>Status: <span class="stl ${STP[p.status]?.[1] || ''}">${STP[p.status]?.[0] || esc(p.status)}</span></p>`, voltar);
    if (p.tipo === 'admin' && ap && !FB().dono) return card('Só o administrador principal', quem + '<p>Promover alguém a administrador é exclusivo do administrador principal.</p>', voltar);
    if (p.tipo === 'admin' && ap && !p.uid) return card('Pedido sem conta', quem + '<p>Este pedido não está ligado a uma conta do Flâmula.</p>', voltar);
    await FB().decidir(p, ap);
    adTab = 'pedidos';
    card(ap ? 'Pedido aprovado' : 'Pedido declinado', quem + (ap ? (p.tipo === 'admin' ? '<p>A pessoa agora é administradora: o botão de admin já aparece no perfil dela.</p>' : '<p>A pessoa agora aparece como colaboradora no Flâmula.</p>') : '<p>O pedido foi recusado e a pessoa verá o status no perfil.</p>'), voltar);
    toast(ap ? 'Pedido aprovado' : 'Pedido declinado');
  } catch (e) { card('Não foi possível decidir', `<p>${esc(fbErr(e))}</p>`) }
};

/* torne-se um colaborador */
FL.actions.colaborar = () => {
  const p = FB().profile, u = FB().user;
  sheet('Torne-se um colaborador', `<div class="form">
    <p style="margin:0;color:var(--mut)">Conte como você quer ajudar o Flâmula. Respondemos por e-mail.</p>
    <label class="field">Nome<input id="cbn" maxlength="80" autocomplete="name" value="${esc(p?.nome || '')}"></label>
    <label class="field">E-mail<input id="cbe" type="email" inputmode="email" maxlength="120" autocomplete="email" value="${esc(u?.email || '')}"></label>
    <div class="field">Como quer colaborar<div id="cba"></div></div>
    <label class="field">Mensagem<textarea id="cbm" maxlength="2000" placeholder="Fale um pouco sobre você e a sua ideia"></textarea></label>
    <p class="err" id="cberr" hidden></p>
    <button class="btn acc pr" id="cbok">Enviar</button></div>`);
  const area = dd($('cba'), { label: 'Como quer colaborar', value: 'curadoria', items: [{ v: 'curadoria', l: 'Curadoria de bandeiras' }, { v: 'pesquisa', l: 'Pesquisa histórica' }, { v: 'traducao', l: 'Tradução' }, { v: 'design', l: 'Design' }, { v: 'desenvolvimento', l: 'Desenvolvimento' }, { v: 'moderacao', l: 'Moderação' }, { v: 'direitos', l: 'Direitos autorais e remoção' }, { v: 'outro', l: 'Outro' }] });
  $('cba').querySelector('.dd-btn').style.cssText = 'width:100%;justify-content:space-between';
  const err = m => { const e = $('cberr'); e.textContent = m; e.hidden = !m };
  $('cbok').onclick = async () => {
    const d = { nome: $('cbn').value.trim(), email: $('cbe').value.trim(), area: area.value, mensagem: $('cbm').value.trim() };
    if (!d.nome) return err('Informe seu nome.'); if (!/^\S+@\S+\.\S+$/.test(d.email)) return err('Informe um e-mail válido.'); if (d.mensagem.length < 10) return err('Escreva uma mensagem um pouco maior.');
    if (!FB().on) return err(`Formulário indisponível no momento. Escreva para ${ADMIN_EMAIL}.`);
    const b = $('cbok'); b.disabled = true; b.textContent = 'Enviando…'; err('');
    try { await FB().pedir('colaborador', d); closeSheet(); toast('Recebemos o seu pedido. Obrigado!') } catch (e) { console.error('[Flâmula] pedido:', e); err(e && e.code === 'permission-denied' ? 'O site ainda não aceita pedidos: as regras novas do Firestore não foram publicadas.' : fbErr(e)); b.disabled = false; b.textContent = 'Enviar' }
  };
};

/* enviar criação do editor */
FL.actions.enviar = async data => {
  if (!FB().on) return toast('Envio indisponível: Firebase não configurado.');
  if (!FB().user) { toast('Entre para enviar sua criação'); return FL.actions.login() }
  const mine = (FB().profile?.comunidades || []);
  const coms = (await Promise.all(mine.map(id => FB().comunidade(id).catch(() => null)))).filter(Boolean);
  sheet('Enviar para a galeria', `<div class="form">
    <div class="shimg"><img src="${dataSrc(data.svg)}" alt="Prévia"></div>
    <label class="field">Nome da bandeira<input id="sbn" maxlength="60" value="${esc(data.nome)}"></label>
    <div class="field">Publicar também em<div id="sbc"></div></div>
    <div id="sbcon" hidden></div>
    <label class="chk"><input type="checkbox" id="sbk">A bandeira é original ou um remix, não usa escudos, logotipos ou marcas, nem conteúdo ofensivo ou dados pessoais.</label>
    <p class="err" id="sberr" hidden></p>
    <button class="btn acc pr" id="sbok">Enviar para moderação</button></div>`);
  const com = dd($('sbc'), { label: 'Comunidade', value: '', items: [{ v: '', l: 'Só na galeria' }, ...coms.map(c => ({ v: c.id, l: c.nome, sw: (c.cores || [])[0] }))] });
  $('sbc').querySelector('.dd-btn').style.cssText = 'width:100%;justify-content:space-between';
  if (FL.ext && FL.ext.concursoAberto) FL.ext.concursoAberto().then(k => { const b = $('sbcon'); if (!k || !b) return; b.innerHTML = `<label class="chk"><input type="checkbox" id="sbkc" value="${esc(k.id)}">Inscrever no concurso do mês: <b>${esc(k.tema)}</b></label>`; b.hidden = false });
  const err = m => { const e = $('sberr'); e.textContent = m; e.hidden = !m };
  $('sbok').onclick = async () => {
    const nome = $('sbn').value.trim(); if (!nome) return err('Dê um nome à bandeira.'); if (!$('sbk').checked) return err('Confirme as regras de envio.');
    $('sbok').disabled = true;
    try { await FB().submit({ nome, svg: data.svg, ra: data.ra, comunidade: com.value, concurso: $('sbkc') && $('sbkc').checked ? $('sbkc').value : '' }); closeSheet(); toast('Enviada! Ela aparece na galeria depois da moderação.'); FL.go('perfil') } catch (e) { err(fbErr(e)); $('sbok').disabled = false }
  };
};

/* criar comunidade */
FL.actions['nova-comunidade'] = () => {
  if (!FB().on) return toast('Comunidades indisponíveis: Firebase não configurado.');
  if (!FB().user) { toast('Entre para criar uma comunidade'); return FL.actions.login() }
  sheet('Criar comunidade', `<div class="form">
    <label class="field">Nome<input id="ncn" maxlength="40" placeholder="Ex.: Vexilologia Brasil"></label>
    <label class="field">Descrição<textarea id="ncd" maxlength="240" placeholder="Sobre o que é a comunidade"></textarea></label>
    <div class="field">Bandeira-símbolo<div id="ncb"></div></div>
    <p class="err" id="ncerr" hidden></p>
    <button class="btn acc pr" id="ncok">Criar comunidade</button></div>`);
  const of = D.filter(f => f.o === 'oficial' && f.t !== 'militar').sort((a, b) => a.n.localeCompare(b.n, 'pt'));
  const band = dd($('ncb'), { label: 'Bandeira-símbolo', value: 'br', search: true, width: 300, items: of.map(f => ({ v: f.id, l: f.n, sw: f.c[0] })) });
  $('ncb').querySelector('.dd-btn').style.cssText = 'width:100%;justify-content:space-between';
  const err = m => { const e = $('ncerr'); e.textContent = m; e.hidden = !m };
  $('ncok').onclick = async () => {
    const nome = $('ncn').value.trim(), descricao = $('ncd').value.trim(); if (nome.length < 3) return err('Dê um nome com pelo menos 3 letras.');
    const f = byId[band.value]; $('ncok').disabled = true;
    try { const id = await FB().criarComunidade({ nome, descricao, bandeira: f.id, cores: f.c.slice(0, 4) }); closeSheet(); toast('Comunidade criada'); FL.go('c-' + id) } catch (e) { err(fbErr(e)); $('ncok').disabled = false }
  };
};

/* copiar */
document.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (!b) return; navigator.clipboard.writeText(b.dataset.copy).then(() => toast('Copiado')).catch(() => toast('Não foi possível copiar')) });

/* perfil */
let pfTab = 'criacoes';
const likesLocal = () => { try { return JSON.parse(localStorage.getItem('flamula-likes') || '[]') } catch (e) { return [] } };
const recLocal = () => { try { return JSON.parse(localStorage.getItem('flamula-recordes') || '{}') } catch (e) { return {} } };
const tfmt = ms => { const s = ms / 1000, m = Math.floor(s / 60); return `${m}:${(s - m * 60).toFixed(1).padStart(4, '0')}`.replace('.', ',') };
const NIVN = { facil: ['Fácil', '#30D158'], medio: ['Médio', '#FF9F0A'], dificil: ['Difícil', '#FF3B30'], silhueta: ['Silhueta', '#1B7FDC'], recorte: ['Recorte', '#0DB8D3'], todas: ['Todas as bandeiras', '#193546'], tempo: ['Contra o tempo', '#065B98'] };
const recTxt = (n, b) => n === 'tempo' ? b.acertos + ' acertos' : b.acertos + '/' + (b.total || 10);
FL.views.perfil = async () => {
  const v = $('v-perfil'); document.title = 'Meu perfil · Flâmula';
  if (!FB().ready) { v.innerHTML = loading(); await waitUser(); if (FL.view !== 'perfil') return }
  if (!FB().on) return v.innerHTML = offMsg();
  const u = FB().user, p = FB().profile || {};
  if (!u) { try { sessionStorage.setItem('fl-volta', 'perfil') } catch (e) { } return v.innerHTML = needLogin('ver seu perfil, enviar criações e participar de comunidades') }
  const fav = favDe(p);
  /* o tema da página do perfil segue as cores da bandeira favorita */
  if (fav && FL.tint) FL.tint(fav); else document.body.classList.remove('tinted');
  const cs = fav && fav.c && fav.c.length ? fav.c.slice(0, 4) : ['#0DB8D3', '#1B7FDC', '#065B98'];
  if (fav && FL.tint) FL.tint(fav);
  const bnr = BANNERS.some(b => b[0] === p.banner) ? p.banner : (fav ? 'favorita' : 'artico');
  const likes = likesLocal().filter(id => byId[id]);
  const rec = recLocal(); const melhor = ['dificil', 'medio', 'facil'].map(n => [n, (rec[n] || [])[0]]).find(x => x[1]);
  v.innerHTML = `<div class="pfh">
   <div class="pfc b-${esc(bnr)}" style="--c1:${esc(cs[0])};--c2:${esc(cs[1] || cs[0])};--c3:${esc(cs[2] || cs[0])}">${bannerHTML(bnr, cs, fav, u.uid)}<button class="pfcbtn lg pr" id="pfbanner" aria-label="Trocar a capa">${FL.I('edit')}<span>Capa</span></button></div>
   <div class="pfb lg">${avatar(p, 'av pfav')}
    <div class="pfn"><h1>${esc(p.nome || 'Sem nome')}</h1><p>${esc(p.bio || 'Conte um pouco sobre você e as bandeiras de que mais gosta.')}</p>
     <div class="pfm">${p.criadoEm ? `<span>No Flâmula desde ${when(p.criadoEm)}</span>` : ''}${fav ? (fav.extra ? `<span class="pfchip">${svg(fav, '', true)}Favorita: ${esc(fav.n)}</span>` : `<a class="pfchip" href="#b-${esc(fav.id)}">${svg(fav, '', true)}Favorita: ${esc(fav.n)}</a>`) : ''}${FB().admin ? `<span class="stl aprovada">${FB().dono ? 'Administrador e moderador' : 'Administrador'}</span>` : ''}${p.colaborador ? '<span class="stl pendente">Colaborador</span>' : ''}</div></div>
    <div class="pfa">${FB().admin ? `<a class="btn acc pr pfadm" href="#admin"><svg class="ico" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>Painel de administração<b id="pfpend" hidden></b></a>` : ''}<button class="btn ${FB().admin ? 'gh' : 'acc'} pr" id="pfedit">Editar perfil</button><button class="btn gh pr" id="pfout">Sair</button></div></div>
   ${FB().donoPendente ? `<div class="pfaviso lg"><span><b>Confirme o seu e-mail para ativar o painel de administração.</b> Ou entre com o Google usando o mesmo endereço.</span><span class="erow"><button class="btn acc pr sm" data-act="verificar-email">Enviar link</button><button class="btn gh pr sm" data-act="ja-confirmei">Já confirmei</button></span></div>` : ''}
   <div class="pfs"><button class="lg pr" data-go="criacoes"><b id="pfn">–</b><span>Criações</span></button><button class="lg pr" data-go="curtidas"><b>${likes.length}</b><span>Curtidas</span></button><button class="lg pr" data-go="comunidades"><b>${(p.comunidades || []).length}</b><span>Comunidades</span></button><button class="lg pr" data-go="jogo"><b>${melhor ? recTxt(melhor[0], melhor[1]) : '–'}</b><span>${melhor ? 'Recorde · ' + NIVN[melhor[0]][0] : 'Recorde no jogo'}</span></button></div></div>
  <div class="tabsrow">${segH('pft', [['criacoes', 'Criações'], ['colecoes', 'Coleções'], ['curtidas', 'Curtidas'], ['comunidades', 'Comunidades'], ['jogo', 'Jogo'], ['conquistas', 'Conquistas'], ['conta', 'Conta']], pfTab)}<div id="pfx"></div></div><div id="pfp"></div>`;
  requestAnimationFrame(() => segMove($('pft')));
  const setTab = t => { pfTab = t; $('pft').querySelectorAll('button').forEach(x => { x.classList.toggle('on', x.dataset.v === t); x.setAttribute('aria-pressed', x.dataset.v === t) }); segMove($('pft')); pane() };
  segBind($('pft'), t => { pfTab = t; pane() });
  v.querySelectorAll('.pfs [data-go]').forEach(b => b.onclick = () => { setTab(b.dataset.go); $('pft').scrollIntoView({ behavior: 'smooth', block: 'center' }) });
  $('pfout').onclick = async () => { await FB().logout(); toast('Você saiu da conta'); FL.go('inicio') };
  const editar = (foco) => {
    let band = p.bandeira || '', selo = p.selo || '', banner = bnr, foto = p.foto || '';
    const TPL = { estado: 'Estado', ilha: 'Ilha', nautica: 'Sinal náutico', militar: 'Militar', org: 'Organização', criacao: 'Criação' };
    const ops = D.filter(f => !f.oculta).sort((a, b) => a.n.localeCompare(b.n, 'pt')).map(f => ({ v: f.id, l: f.n + (TPL[f.t] ? ' · ' + (f.t === 'criacao' ? 'Criação de @' + (f.a || 'anônimo') : TPL[f.t]) : ''), fl: f.id }));
    const csOf = () => { const f = band && byId[band]; return f && f.c && f.c.length ? f.c.slice(0, 4) : ['#0DB8D3', '#1B7FDC', '#065B98'] };
    const el = sheet('Editar perfil', `<div class="form">
      <div class="pe-foto"><span id="pefv"></span><div class="erow"><label class="btn gh pr sm" for="pefile">Trocar foto</label>${u.photoURL ? '<button class="btn gh pr sm" id="pegoo">Usar a do Google</button>' : ''}<button class="btn gh pr sm" id="perm">Remover</button></div><input type="file" id="pefile" accept="image/*" hidden></div>
      <label class="field">Nome<input id="ped" maxlength="60" value="${esc(p.nome || '')}"></label>
      <label class="field">Bio<textarea id="peb" maxlength="280" placeholder="Até 280 caracteres">${esc(p.bio || '')}</textarea></label>
      <div class="field">Bandeira favorita<div id="pefav" class="dd-full"></div><small>As cores dela pintam a capa.</small></div>
      <div class="field">Mini bandeira no avatar<div id="pesel" class="dd-full"></div><small>Aparece no cantinho da sua foto, em todo o site.</small></div>
      <div class="field" id="pecapa">Capa do perfil<div class="pebn" id="pebn"></div></div>
      <p class="err" id="peerr" hidden></p><button class="btn acc pr" id="peok">Salvar</button></div>`);
    const prev = () => { $('pefv').innerHTML = avatar({ nome: $('ped') ? $('ped').value : p.nome, foto, selo }, 'av pe-av') };
    const capas = () => { const c = csOf(), fv = band && byId[band]; $('pebn').innerHTML = BANNERS.map(([id, nm]) => `<button type="button" class="pr ${id === banner ? 'on' : ''}" data-bn="${id}" aria-pressed="${id === banner}"><span class="pfc mini b-${id}" style="--c1:${c[0]};--c2:${c[1] || c[0]};--c3:${c[2] || c[0]}">${bannerHTML(id, c, fv, u.uid)}</span><small>${nm}</small></button>`).join('') };
    prev(); capas();
    dd($('pefav'), { label: 'Bandeira favorita', placeholder: 'Escolha uma bandeira…', search: true, value: band, width: 320, items: [{ v: '', l: 'Nenhuma' }].concat(ops), onChange: x => { band = x; if (x && banner === 'artico') banner = 'favorita'; capas() } });
    dd($('pesel'), { label: 'Mini bandeira no avatar', placeholder: 'Nenhuma', search: true, value: selo, width: 320, items: [{ v: '', l: 'Nenhuma' }].concat(ops), onChange: x => { selo = x; prev() } });
    $('ped').addEventListener('input', prev);
    $('pebn').onclick = e => { const b = e.target.closest('[data-bn]'); if (!b) return; banner = b.dataset.bn; capas() };
    $('pefile').onchange = async e => {
      const f = e.target.files[0]; if (!f) return; if (!/^image\//.test(f.type)) return toast('Escolha um arquivo de imagem');
      try { const bm = await createImageBitmap(f); const n = 320, k = Math.min(bm.width, bm.height); const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'); x.drawImage(bm, (bm.width - k) / 2, (bm.height - k) / 2, k, k, 0, 0, n, n); foto = c.toDataURL('image/jpeg', .86); if (foto.length > 240000) foto = c.toDataURL('image/jpeg', .7); prev() } catch (er) { toast('Não foi possível ler esta imagem') }
    };
    if ($('pegoo')) $('pegoo').onclick = () => { foto = u.photoURL; prev() };
    $('perm').onclick = () => { foto = ''; prev() };
    if (foco === 'capa') setTimeout(() => $('pecapa').scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    $('peok').onclick = async () => { const nome = $('ped').value.trim(); if (!nome) return; $('peok').disabled = true; try { await FB().saveProfile({ nome, bio: $('peb').value.trim(), bandeira: band, selo, banner, foto }); closeSheet(); toast('Perfil atualizado'); FL.views.perfil(); FL.refreshAcc && FL.refreshAcc() } catch (e) { const er = $('peerr'); er.textContent = fbErr(e); er.hidden = false; $('peok').disabled = false } };
  };
  $('pfedit').onclick = () => editar();
  $('pfbanner').onclick = () => editar('capa');

  if (FB().admin && FB().pendentes) Promise.all([FB().pendentes().catch(() => []), FB().contar('pedidos', 'status', 'pendente').catch(() => 0)]).then(([L, n]) => { const b = $('pfpend'), t = L.length + (n || 0); if (b && t) { b.textContent = t; b.hidden = false; b.title = `${L.length} envios e ${n || 0} pedidos aguardando` } });
  FB().meusEnvios().then(L => { const n = $('pfn'); if (n) n.textContent = L.length }).catch(() => { const n = $('pfn'); if (n) n.textContent = '0' });
  const pane = async () => {
    const box = $('pfp'), x = $('pfx'); if (!box) return;
    if (pfTab === 'criacoes') {
      x.innerHTML = '<a class="btn acc pr sm" href="#criar">Nova criação</a>'; box.innerHTML = loading();
      try {
        const L = (await FB().meusEnvios()).sort((a, b) => ((b.criadoEm?.seconds) || 0) - ((a.criadoEm?.seconds) || 0));
        box.innerHTML = L.length ? `<div class="list">${L.map(e => `<div class="li lg"><div class="th"><img src="${dataSrc(e.svg)}" alt=""></div><div><b>${esc(e.nome)}</b><div class="m"><span class="stl ${esc(e.status)}">${{ pendente: 'Em moderação', aprovada: 'Aprovada', reprovada: 'Reprovada' }[e.status] || esc(e.status)}</span><span>${when(e.criadoEm)}</span></div>${e.status === 'reprovada' && e.motivo ? `<p class="why">Motivo: ${esc(e.motivo)}</p>` : ''}</div><div class="acts">${e.status === 'aprovada' ? `<a class="btn gh pr sm" href="#b-u-${esc(e.id)}">Ver na galeria</a>` : ''}<button class="btn dg pr sm" data-del="${esc(e.id)}">Apagar</button></div></div>`).join('')}</div>` : `<div class="empty"><b>Você ainda não enviou criações</b><p>Crie uma bandeira no editor e envie para a galeria.</p><a class="btn acc pr" href="#criar">Abrir o editor</a></div>`;
        box.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarEnvio(b.dataset.del); toast('Criação apagada'); pane() } catch (e) { toast(fbErr(e)) } });
      } catch (e) { box.innerHTML = `<div class="empty"><b>Não foi possível carregar</b><p>${esc(fbErr(e))}</p></div>` }
    } else if (pfTab === 'colecoes') {
      x.innerHTML = '<a class="btn gh pr sm" href="#explorar">Explorar bandeiras</a>';
      const C = minhasCol();
      box.innerHTML = C.length ? `<div class="colg">${C.map(c => colCard(c, u.uid)).join('')}</div><p class="pfnote">Qualquer pessoa com o link de uma coleção consegue vê-la.</p>` : `<div class="empty"><b>Nenhuma coleção ainda</b><p>Na página de qualquer bandeira, toque em Salvar para criar uma coleção.</p><a class="btn acc pr" href="#explorar">Explorar bandeiras</a></div>`;
    } else if (pfTab === 'curtidas') {
      x.innerHTML = '<a class="btn gh pr sm" href="#explorar">Explorar bandeiras</a>';
      const L = likesLocal().map(id => byId[id]).filter(Boolean);
      box.innerHTML = L.length ? `<div class="grid">${L.map(FL.card).join('')}</div><p class="pfnote">As curtidas ficam salvas neste aparelho.</p>` : `<div class="empty"><b>Nenhuma bandeira curtida ainda</b><p>Toque no coração na página de uma bandeira para guardá-la aqui.</p><a class="btn acc pr" href="#explorar">Explorar bandeiras</a></div>`;
    } else if (pfTab === 'comunidades') {
      x.innerHTML = '<button class="btn acc pr sm" data-act="nova-comunidade">Criar comunidade</button>'; box.innerHTML = loading();
      const ids = FB().profile?.comunidades || [];
      const L = (await Promise.all(ids.map(id => FB().comunidade(id).catch(() => null)))).filter(Boolean);
      box.innerHTML = L.length ? `<div class="grid">${L.map(comCard).join('')}</div>` : `<div class="empty"><b>Você ainda não participa de comunidades</b><p>Encontre pessoas que gostam das mesmas bandeiras ou crie a sua.</p><a class="btn acc pr" href="#comunidades">Explorar comunidades</a></div>`;
    } else if (pfTab === 'jogo') {
      x.innerHTML = '<a class="btn acc pr sm" href="#jogo">Jogar</a>';
      const r = recLocal();
      const j = (FB().profile && FB().profile.jogo) || {};
      box.innerHTML = `${j.partidas ? `<div class="pfj" style="margin-bottom:12px">${[['Partidas', j.partidas], ['Acertos', j.acertos || 0], ['Gabaritos', j.gabaritos || 0], ['Sequência no diário', (j.sequencia || 0) + (j.maiorSequencia > (j.sequencia || 0) ? ' · recorde ' + j.maiorSequencia : '')]].map(([l, n]) => `<div class="lg pfjc"><small>${l}</small><b>${typeof n === 'number' ? n.toLocaleString('pt-BR') : n}</b></div>`).join('')}</div>` : ''}<div class="pfj">${Object.keys(NIVN).map(n => { const b = (r[n] || []).slice().sort((a, c) => (c.total || 10) - (a.total || 10) || c.pontos - a.pontos)[0]; return `<div class="lg pfjc" style="--nv:${NIVN[n][1]}"><small>${NIVN[n][0]}</small>${b ? `<b>${recTxt(n, b)}</b><span>${n === 'tempo' ? 'em 60 segundos' : tfmt(b.td * 100)}</span>` : '<b>–</b><span>Ainda sem partidas</span>'}</div>` }).join('')}</div><p class="pfnote">Melhores resultados neste aparelho (na maior quantidade de bandeiras jogada). O ranking global fica na página do jogo.</p>`;
    } else if (pfTab === 'conquistas') {
      if (FL.ext && FL.ext.conquistas) await FL.ext.conquistas(box, x, u, FB().profile || p); else box.innerHTML = '';
    } else {
      x.innerHTML = '';
      box.innerHTML = `<div class="list"><div class="box lg"><div class="kv"><div><small>E-mail da conta</small><code>${esc(u.email || '—')}</code></div><div><small>Forma de login</small><code>${(u.providerData || []).some(d => d.providerId === 'google.com') ? 'Google' : 'E-mail e senha'}</code></div><div><small>UID</small><code>${esc(u.uid)}</code></div></div><div class="acts"><button class="btn gh pr sm" data-copy="${esc(u.uid)}">Copiar UID</button></div></div>
      <div class="box lg">${FB().admin ? `<p><b>Você é administrador.</b> Acesse o painel para moderar envios, comunidades e formulários.</p><div class="acts"><a class="btn acc pr sm" href="#admin">Abrir painel</a></div>` : `<p><b>Quer ser administrador?</b> Faça o pedido aqui: ele vai para o painel do administrador principal, e o painel de administração aparece no seu perfil quando for aprovado.</p><div class="acts"><button class="btn acc pr sm" data-act="admin-pedido">Pedir acesso</button></div>`}</div>
      <div class="box lg" id="pfped"><p><b>Seus pedidos</b></p><p class="pfnote" style="margin:0">Carregando…</p></div>
      <div class="box lg"><p><b>Quer colaborar de outro jeito?</b> Curadoria, pesquisa histórica, tradução, design ou código.</p><div class="acts"><button class="btn gh pr sm" data-act="colaborar">Torne-se um colaborador</button></div></div></div>`;
      FB().meusPedidos().then(L => { const b = $('pfped'); if (!b) return; L.sort((a, c) => ((c.criadoEm?.seconds) || 0) - ((a.criadoEm?.seconds) || 0)); b.innerHTML = '<p><b>Seus pedidos</b></p>' + (L.length ? `<div class="list" style="gap:6px">${L.map(q => `<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span>${q.tipo === 'admin' ? 'Administrador' : 'Colaborador'} · ${when(q.criadoEm)}</span><span class="stl ${STP[q.status]?.[1] || ''}">${STP[q.status]?.[0] || esc(q.status)}</span></div>`).join('')}</div>` : '<p class="pfnote" style="margin:0">Nenhum pedido feito.</p>') }).catch(() => { const b = $('pfped'); if (b) b.remove() });
    }
  };
  pane();
};

/* lista de comunidades */
FL.views.comunidades = async () => {
  const v = $('v-comunidades'); document.title = 'Comunidades · Flâmula';
  v.innerHTML = `<div class="phead"><h1>Comunidades</h1><p>Grupos para reunir pessoas em torno de bandeiras, regiões e projetos. Os membros publicam criações no mural da comunidade.</p></div>
  <div class="bar lg" style="position:relative;top:auto"><label class="srch" for="cq"><svg class="ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="cq" type="search" placeholder="Buscar comunidades" autocomplete="off"></label><button class="btn acc pr" data-act="nova-comunidade">Criar comunidade</button></div><div id="cl">${loading()}</div>`;
  await waitUser(); if (FL.view !== 'comunidades') return;
  if (!FB().on) return $('cl').innerHTML = offMsg();
  try {
    const L = await FB().comunidades();
    const draw = q => { const nq = norm(q), F = L.filter(c => !nq || norm(c.nome + ' ' + c.descricao).includes(nq)); $('cl').innerHTML = F.length ? `<div class="grid">${F.map(comCard).join('')}</div>` : `<div class="empty"><b>${L.length ? 'Nenhuma comunidade encontrada' : 'Ainda não há comunidades'}</b><p>${L.length ? 'Tente outro termo.' : 'Crie a primeira e convide outras pessoas.'}</p><button class="btn acc pr" data-act="nova-comunidade">Criar comunidade</button></div>` };
    draw(''); $('cq').addEventListener('input', e => draw(e.target.value));
  } catch (e) { $('cl').innerHTML = `<div class="empty"><b>Não foi possível carregar</b><p>${esc(fbErr(e))}</p></div>` }
};

/* página da comunidade */
FL.views.comunidade = async id => {
  const v = $('v-comunidade'); v.innerHTML = loading();
  await waitUser(); if (FL.view !== 'comunidade') return;
  if (!FB().on) return v.innerHTML = offMsg();
  let c; try { c = await FB().comunidade(id) } catch (e) { return v.innerHTML = restricted('Não foi possível carregar', esc(fbErr(e))) }
  if (!c) return v.innerHTML = restricted('Comunidade não encontrada', 'Ela pode ter sido apagada.', '<a class="btn acc pr" href="#comunidades">Ver comunidades</a>');
  document.title = c.nome + ' · Flâmula';
  const f = byId[c.bandeira]; FL.tint({ c: c.cores && c.cores.length ? c.cores : (f ? f.c : ['#888888']) });
  const u = FB().user, member = !!(u && (FB().profile?.comunidades || []).includes(id)), owner = u && c.donoUid === u.uid;
  v.innerHTML = `<a class="back lg pr" href="#comunidades">${I('back')}Comunidades</a>
  <div class="chead lg"><div class="cf">${f ? svg(f, 'fl', false) : ''}</div><div><h1>${esc(c.nome)}</h1><p>${esc(c.descricao || 'Sem descrição.')}</p><div class="pills"><span class="o">${c.membros || 0} ${c.membros === 1 ? 'membro' : 'membros'}</span><span>Criada por ${esc(c.donoNome || 'alguém')}</span><span>${when(c.criadaEm)}</span></div>
  <div class="acts">${u ? (member ? `<button class="btn gh pr" id="csair">Sair da comunidade</button><a class="btn acc pr" href="#criar">Publicar criação</a>` : `<button class="btn acc pr" id="centrar">Participar</button>`) : '<button class="btn acc pr" data-act="login">Entre para participar</button>'}${owner || FB().admin ? '<button class="btn dg pr" id="capagar">Apagar comunidade</button>' : ''}</div></div></div>
  <section class="sec"><div class="shead"><div><h2>Mural</h2><p>Criações dos membros, aprovadas pela moderação.</p></div></div><div id="cmur">${loading()}</div></section>
  <section class="sec"><div class="shead"><div><h2>Membros</h2></div></div><div class="mems" id="cmem">${loading()}</div></section>`;
  const reload = () => FL.views.comunidade(id);
  if ($('centrar')) $('centrar').onclick = async e => { e.currentTarget.disabled = true; try { await FB().entrar(id); toast('Você agora participa de ' + c.nome); reload() } catch (er) { toast(fbErr(er)); e.currentTarget.disabled = false } };
  if ($('csair')) $('csair').onclick = async e => { try { await FB().sair(id); toast('Você saiu da comunidade'); reload() } catch (er) { toast(fbErr(er)) } };
  if ($('capagar')) $('capagar').onclick = async e => { const b = e.currentTarget; if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar exclusão'; return } try { await FB().apagarComunidade(id); toast('Comunidade apagada'); FL.go('comunidades') } catch (er) { toast(fbErr(er)) } };
  FB().aprovadas(id).then(L => { const fs = L.map(e => FL.addOriginal(e) || byId['u-' + e.id]).filter(Boolean); const m = $('cmur'); if (m) m.innerHTML = fs.length ? `<div class="grid">${fs.map(FL.card).join('')}</div>` : `<div class="empty"><b>O mural está vazio</b><p>Envie uma criação pelo editor e escolha esta comunidade.</p>${member ? '<a class="btn acc pr" href="#criar">Abrir o editor</a>' : ''}</div>` }).catch(e => { const m = $('cmur'); if (m) m.innerHTML = `<p class="tl-msg">${esc(fbErr(e))}</p>` });
  FB().membros(id).then(L => { const m = $('cmem'); if (m) m.innerHTML = L.length ? L.map(x => `<span class="mem lg">${avatar(x)}${esc(x.nome || 'Membro')}</span>`).join('') : '<p class="tl-msg" style="padding:0">Ainda sem membros.</p>' }).catch(() => { const m = $('cmem'); if (m) m.innerHTML = '' });
};

/* painel de administração (só administradores) */
let adTab = 'geral';
const fmtN = n => n == null ? '–' : Number(n).toLocaleString('pt-BR');
const soma = o => Object.values(o || {}).reduce((a, b) => a + (+b || 0), 0);
FL.views.admin = async () => {
  const v = $('v-admin'); document.title = 'Admin · Flâmula'; v.innerHTML = loading();
  await waitUser(); if (FL.view !== 'admin') return;
  if (!FB().on) return v.innerHTML = offMsg();
  if (!FB().user) return v.innerHTML = needLogin('acessar o painel de administração');
  if (!FB().admin) return v.innerHTML = FB().donoPendente ? restricted('Confirme o seu e-mail', 'Esta conta é a do administrador principal, mas o e-mail ainda não foi confirmado. Confirme pelo link enviado ao seu e-mail, ou entre com o Google usando o mesmo endereço.', '<button class="btn acc pr" data-act="verificar-email">Enviar link de confirmação</button><button class="btn gh pr" data-act="ja-confirmei">Já confirmei</button>') : restricted('Acesso restrito', `Esta página é só para administradores. Para pedir acesso, envie um e-mail para <b>${ADMIN_EMAIL}</b> com o seu UID.`, '<button class="btn acc pr" data-act="admin-pedido">Pedir acesso</button>');
  v.innerHTML = `<div class="phead"><h1>Administração</h1><p>${FB().dono ? 'Você é o administrador principal e moderador do Flâmula.' : 'Você é administrador do Flâmula.'} Acompanhe os números, modere envios, cuide da galeria e das contas.</p></div><div class="tabsrow">${segH('adt', [['geral', 'Visão geral'], ['envios', 'Envios'], ['galeria', 'Galeria'], ['usuarios', 'Usuários'], ['comunidades', 'Comunidades'], ['pedidos', 'Pedidos<b class="adn" id="adnp" hidden></b>'], ['concursos', 'Concursos'], ['apoio', 'Apoio']], adTab)}</div><div id="adp"></div>`;
  requestAnimationFrame(() => segMove($('adt')));
  FB().contar('pedidos', 'status', 'pendente').then(n => { const b = $('adnp'); if (b && n) { b.textContent = n; b.hidden = false } }).catch(() => { });
  segBind($('adt'), t => { adTab = t; pane() });
  const irPara = t => { adTab = t; $('adt').querySelectorAll('button').forEach(x => { x.classList.toggle('on', x.dataset.v === t); x.setAttribute('aria-pressed', x.dataset.v === t) }); segMove($('adt')); pane() };
  const pane = async () => {
    const box = $('adp'); box.innerHTML = loading();
    try {
      if (adTab === 'geral') {
        const [us, pe, ap, re, co, cb, est] = await Promise.all([FB().contar('usuarios'), FB().contar('envios', 'status', 'pendente'), FB().contar('envios', 'status', 'aprovada'), FB().contar('envios', 'status', 'reprovada'), FB().contar('comunidades'), FB().contar('pedidos', 'status', 'pendente'), FB().estatisticas().catch(() => ({}))]);
        const top = (o, n = 8) => Object.entries(o || {}).filter(([id]) => byId[id]).sort((a, b) => b[1] - a[1]).slice(0, n);
        const tl = (L, u) => L.length ? `<div class="adtop">${L.map(([id, n], k) => `<a class="pr" href="#b-${esc(id)}"><b>${k + 1}</b>${flagThumb(id)}<span>${esc(byId[id].n)}</span><small>${fmtN(n)} ${u}</small></a>`).join('')}</div>` : '<p class="pfnote">Ainda sem dados.</p>';
        box.innerHTML = `<div class="adst">${[['Usuários', us, 'usuarios'], ['Aguardando moderação', pe, 'envios'], ['Criações aprovadas', ap, 'galeria'], ['Reprovadas', re, 'envios'], ['Comunidades', co, 'comunidades'], ['Pedidos pendentes', cb, 'pedidos'], ['Downloads', soma(est.downloads), ''], ['Curtidas', soma(est.curtidas), '']].map(([l, n, t]) => `<button class="lg pr" ${t ? `data-ir="${t}"` : 'disabled'}><b>${fmtN(n)}</b><span>${l}</span></button>`).join('')}</div>
        <div class="adcol"><section><h3>Mais baixadas</h3>${tl(top(est.downloads), 'downloads')}</section><section><h3>Mais curtidas</h3>${tl(top(est.curtidas), 'curtidas')}</section></div>`;
        box.querySelectorAll('[data-ir]').forEach(b => b.onclick = () => irPara(b.dataset.ir));
      }
      else if (adTab === 'envios') {
        const L = (await FB().pendentes()).sort((a, b) => ((a.criadoEm?.seconds) || 0) - ((b.criadoEm?.seconds) || 0));
        box.innerHTML = L.length ? `<div class="list">${L.map(e => `<div class="li lg"><div class="th"><img src="${dataSrc(e.svg)}" alt=""></div><div><b>${esc(e.nome)}</b><div class="m"><span>@${esc(e.autor)}</span><span>${when(e.criadoEm)}</span>${e.comunidade ? '<span>Para uma comunidade</span>' : ''}</div></div><div class="acts"><button class="btn acc pr sm" data-ok="${esc(e.id)}">Aprovar</button><button class="btn gh pr sm" data-no="${esc(e.id)}">Reprovar</button><button class="btn dg pr sm" data-rm="${esc(e.id)}">Apagar</button></div></div>`).join('')}</div>` : '<div class="empty"><b>Nenhum envio aguardando</b><p>Tudo moderado por aqui.</p></div>';
        box.querySelectorAll('[data-ok]').forEach(b => b.onclick = async () => { try { await FB().moderar(b.dataset.ok, 'aprovada'); toast('Criação aprovada'); FL.reloadOriginals(); pane() } catch (e) { toast(fbErr(e)) } });
        box.querySelectorAll('[data-rm]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarEnvio(b.dataset.rm); toast('Envio apagado'); pane() } catch (e) { toast(fbErr(e)) } });
        box.querySelectorAll('[data-no]').forEach(b => b.onclick = () => {
          sheet('Reprovar criação', `<div class="form"><div class="field">Motivo<div id="rjm"></div></div><label class="field">Detalhes (opcional)<textarea id="rjd" maxlength="300"></textarea></label><button class="btn acc pr" id="rjok">Reprovar</button></div>`);
          const m = dd($('rjm'), { label: 'Motivo', value: 'marca', items: [{ v: 'marca', l: 'Usa escudo, logotipo ou marca' }, { v: 'copia', l: 'Cópia sem alteração de uma bandeira existente' }, { v: 'ofensivo', l: 'Conteúdo ofensivo ou de ódio' }, { v: 'dados', l: 'Contém dados pessoais' }, { v: 'qualidade', l: 'Qualidade insuficiente' }, { v: 'outro', l: 'Outro motivo' }] });
          $('rjm').querySelector('.dd-btn').style.cssText = 'width:100%;justify-content:space-between';
          $('rjok').onclick = async () => { const lab = { marca: 'Usa escudo, logotipo ou marca', copia: 'Cópia sem alteração de uma bandeira existente', ofensivo: 'Conteúdo ofensivo ou de ódio', dados: 'Contém dados pessoais', qualidade: 'Qualidade insuficiente', outro: 'Outro motivo' }[m.value]; const det = $('rjd').value.trim(); try { await FB().moderar(b.dataset.no, 'reprovada', lab + (det ? ': ' + det : '')); closeSheet(); toast('Criação reprovada'); pane() } catch (e) { toast(fbErr(e)) } };
        });
      } else if (adTab === 'comunidades') {
        const L = await FB().comunidades();
        box.innerHTML = L.length ? `<div class="list">${L.map(c => `<div class="li lg"><div class="th">${flagThumb(c.bandeira)}</div><div><b>${esc(c.nome)}</b><div class="m"><span>${c.membros || 0} membros</span><span>Criada por ${esc(c.donoNome || '—')}</span><span>${when(c.criadaEm)}</span></div></div><div class="acts"><a class="btn gh pr sm" href="#c-${esc(c.id)}">Abrir</a><button class="btn dg pr sm" data-rmc="${esc(c.id)}">Apagar</button></div></div>`).join('')}</div>` : '<div class="empty"><b>Nenhuma comunidade criada</b></div>';
        box.querySelectorAll('[data-rmc]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarComunidade(b.dataset.rmc); toast('Comunidade apagada'); pane() } catch (e) { toast(fbErr(e)) } });
      } else if (adTab === 'concursos') {
        if (FL.ext && FL.ext.adminConcursos) await FL.ext.adminConcursos(box, pane);
      } else if (adTab === 'apoio') {
        const A = (await FB().apoio().catch(() => null)) || {};
        let modo = A.codigo ? 'codigo' : 'chave';
        box.innerHTML = `<div class="adapo"><div class="box lg form" style="display:grid;gap:14px">
          <p style="margin:0"><b>Pix do botão "Apoie o projeto"</b><br><span class="pfnote">Aparece no rodapé para todos os visitantes. Sem valor fixo: quem apoia escolhe quanto enviar.</span></p>
          <div id="apmodo"></div>
          <div id="apchave" class="form" style="display:grid;gap:12px">
           <label class="field">Chave Pix<input id="apk" maxlength="77" value="${esc(A.chave || '')}" placeholder="E-mail, celular (+55…), CPF/CNPJ ou chave aleatória"></label>
           <label class="field">Nome do recebedor<input id="apn" maxlength="25" value="${esc(A.nome || '')}" placeholder="Como aparece no banco"></label>
           <label class="field">Cidade<input id="apc" maxlength="15" value="${esc(A.cidade || '')}" placeholder="Ex.: São Paulo"></label></div>
          <label class="field" id="apcodw">Código Pix copia e cola<textarea id="apcod" maxlength="512" placeholder="Cole aqui o código gerado no app do seu banco">${esc(A.codigo || '')}</textarea></label>
          <label class="field">Mensagem (opcional)<textarea id="apm" maxlength="240" placeholder="O Flâmula é gratuito e sem anúncios…">${esc(A.mensagem || '')}</textarea></label>
          <p class="err" id="aperr2" hidden></p>
          <div class="erow"><button class="btn acc pr" id="apsalva">Salvar</button>${A.chave || A.codigo ? '<button class="btn dg pr" id="apdesl">Desativar</button>' : ''}</div></div>
          <div class="box lg apo-prev"><p class="elabel" style="margin:0">Prévia</p><div id="apprev"></div></div></div>`;
        const modoUI = () => { $('apchave').hidden = modo !== 'chave'; $('apcodw').hidden = modo !== 'codigo'; prev() };
        const dados = () => modo === 'chave' ? { chave: $('apk').value.trim(), nome: $('apn').value.trim(), cidade: $('apc').value.trim(), mensagem: $('apm').value.trim() } : { codigo: $('apcod').value.replace(/[\r\n\t]+/g, '').trim(), nome: $('apn').value.trim(), mensagem: $('apm').value.trim() };
        const prev = () => { const d = dados(), c = FL.pix.codigoDe(d); $('apprev').innerHTML = c ? `<div class="apo-qr" style="width:180px;margin:10px auto">${FLQR(c)}</div><div class="apo-cod">${esc(c)}</div>` : `<p class="pfnote">${modo === 'codigo' && d.codigo ? 'Código inválido: confira se colou o código inteiro.' : 'Preencha os campos para ver o QR Code.'}</p>` };
        dd($('apmodo'), { label: 'Como informar o Pix', value: modo, items: [{ v: 'chave', l: 'Gerar a partir da chave Pix' }, { v: 'codigo', l: 'Colar código copia e cola do banco' }], onChange: v => { modo = v; modoUI() } });
        $('apmodo').querySelector('.dd-btn').style.cssText = 'width:100%;justify-content:space-between';
        ['apk', 'apn', 'apc', 'apcod'].forEach(i => $(i).addEventListener('input', prev)); modoUI();
        $('apsalva').onclick = async () => {
          const d = dados(), er = $('aperr2'); er.hidden = true;
          if (modo === 'chave' && (!d.chave || !d.nome || !d.cidade)) { er.textContent = 'Preencha a chave, o nome e a cidade.'; er.hidden = false; return }
          if (modo === 'codigo' && !FL.pix.valido(d.codigo)) { er.textContent = 'O código copia e cola não é válido.'; er.hidden = false; return }
          try { await FB().salvarApoio(d); toast('Pix do apoio salvo'); pane() } catch (e) { er.textContent = fbErr(e); er.hidden = false }
        };
        if ($('apdesl')) $('apdesl').onclick = async () => { try { await FB().salvarApoio({}); toast('Botão de apoio desativado'); pane() } catch (e) { toast(fbErr(e)) } };
      } else if (adTab === 'pedidos') {
        const P = await FB().pedidos();
        const AREA2 = { curadoria: 'Curadoria de bandeiras', pesquisa: 'Pesquisa histórica', traducao: 'Tradução', design: 'Design', desenvolvimento: 'Desenvolvimento', moderacao: 'Moderação', direitos: 'Direitos autorais e remoção', outro: 'Outro' };
        const antigos = await FB().colaboradores().catch(() => []);
        box.innerHTML = (P.length ? `<div class="list">${P.map(p => `<div class="box lg"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>${esc(p.nome || 'Sem nome')}</b><span><span class="stl ${p.tipo === 'admin' ? 'aprovada' : 'pendente'}">${p.tipo === 'admin' ? 'Administrador' : 'Colaborador' + (p.area ? ' · ' + esc(AREA2[p.area] || p.area) : '')}</span> <span class="stl ${STP[p.status]?.[1] || ''}">${STP[p.status]?.[0] || esc(p.status)}</span></span></div><p style="color:var(--mut);font-size:14px">${esc(p.email || '')}${p.uid ? '' : ' · sem conta'} · ${when(p.criadoEm)}</p>${p.mensagem ? `<p style="white-space:pre-wrap">${esc(p.mensagem)}</p>` : ''}<div class="acts">${p.status === 'pendente' ? `${p.tipo === 'admin' && !FB().dono ? '' : `<button class="btn acc pr sm" data-pa="${esc(p.id)}">Aprovar</button>`}<button class="btn gh pr sm" data-pd="${esc(p.id)}">Declinar</button>` : ''}${p.email ? `<a class="btn gh pr sm" href="mailto:${esc(p.email)}" target="_blank" rel="noopener">Responder</a>` : ''}<button class="btn dg pr sm" data-px="${esc(p.id)}">Apagar</button></div></div>`).join('')}</div>` : '<div class="empty"><b>Nenhum pedido ainda</b><p>Os pedidos de administrador e de colaboração aparecem aqui.</p></div>')
          + (antigos.length ? `<h3 style="margin:30px 0 10px">Formulários antigos de colaboração</h3><div id="adold"></div>` : '');
        const go = async (id, ap) => { const p = P.find(x => x.id === id); try { await FB().decidir(p, ap); toast(ap ? 'Pedido aprovado' : 'Pedido declinado'); pane() } catch (e) { toast(fbErr(e)) } };
        box.querySelectorAll('[data-pa]').forEach(b => b.onclick = () => go(b.dataset.pa, true));
        box.querySelectorAll('[data-pd]').forEach(b => b.onclick = () => go(b.dataset.pd, false));
        box.querySelectorAll('[data-px]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarPedido(b.dataset.px); pane() } catch (e) { toast(fbErr(e)) } });
        if (!antigos.length) return;
        const L = antigos; const box0 = box; { const box = $('adold');
        const AREA = { curadoria: 'Curadoria de bandeiras', pesquisa: 'Pesquisa histórica', traducao: 'Tradução', design: 'Design', desenvolvimento: 'Desenvolvimento', moderacao: 'Moderação', direitos: 'Direitos autorais e remoção', outro: 'Outro' };
        box.innerHTML = L.length ? `<div class="list">${L.map(c => `<div class="box lg"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>${esc(c.nome)}</b><span class="stl pendente">${esc(AREA[c.area] || c.area)}</span></div><p style="color:var(--mut);font-size:14px">${esc(c.email)} · ${when(c.criadoEm)}</p><p style="white-space:pre-wrap">${esc(c.mensagem)}</p><div class="acts"><a class="btn gh pr sm" href="mailto:${esc(c.email)}" target="_blank" rel="noopener">Responder</a><button class="btn dg pr sm" data-rmk="${esc(c.id)}">Apagar</button></div></div>`).join('')}</div>` : '<div class="empty"><b>Nenhum formulário recebido</b></div>';
        box.querySelectorAll('[data-rmk]').forEach(b => b.onclick = async () => { try { await FB().apagarColaborador(b.dataset.rmk); pane() } catch (e) { toast(fbErr(e)) } }); }
      }
      if (adTab === 'galeria') {
        const G = { destaques: [], ocultas: [], nomes: {}, dia: null, ...(await FB().galeria().catch(() => ({}))) };
        const ap = await FB().aprovadas().catch(() => []);
        const salvar = async (d, msg) => { try { await FB().salvarGaleria(d); toast(msg); pane() } catch (e) { toast(fbErr(e)) } };
        const oficiais = D.filter(f => f.t !== 'criacao').sort((a, b) => (a.n0 || a.n).localeCompare(b.n0 || b.n, 'pt'));
        const hoje = (d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))(new Date());
        const dia = G.dia && G.dia.id && byId[G.dia.id] && (!G.dia.ate || G.dia.ate === hoje) ? G.dia : null;
        box.innerHTML = `<section class="adsec"><h3>Bandeira do dia</h3><p class="pfnote" style="margin:0 0 10px">${dia ? `Escolhida: <b>${esc(byId[dia.id].n)}</b> · ${dia.ate ? 'só hoje' : 'até você mudar'}.` : 'Sem escolha: a página inicial sorteia uma bandeira de país por dia.'}</p>
          <div class="erow">${dia ? `<span class="adchip">${flagThumb(dia.id)}${esc(byId[dia.id].n)}</span>` : ''}<div id="addia"></div><div id="addiaq"></div>${dia ? '<button class="btn gh pr sm" id="limpadia">Voltar ao sorteio</button>' : ''}</div></section>
         <section class="adsec"><h3>Destaques da página inicial</h3><p class="pfnote" style="margin:0 0 10px">Escolha até 12 bandeiras para a seção "Em destaque". Sem escolha, a seção mostra as mais baixadas.</p>
          <div class="adchips">${G.destaques.map(id => byId[id] ? `<span class="adchip">${flagThumb(id)}${esc(byId[id].n)}<button class="pr" data-undest="${esc(id)}" aria-label="Tirar dos destaques">×</button></span>` : '').join('') || '<span class="pfnote">Nenhum destaque escolhido.</span>'}</div>
          <div class="erow" style="margin-top:10px"><div id="addest"></div>${G.destaques.length ? '<button class="btn gh pr sm" id="limpadest">Voltar às mais baixadas</button>' : ''}</div></section>
         <section class="adsec"><h3>Criações publicadas <small>${ap.length}</small></h3>${ap.length ? `<div class="list">${ap.map(e => `<div class="li lg"><div class="th"><img src="${dataSrc(e.svg)}" alt=""></div><div><b>${esc(e.nome)}</b><div class="m"><span>@${esc(e.autor)}</span><span>${when(e.criadoEm)}</span></div></div><div class="acts"><a class="btn gh pr sm" href="#b-u-${esc(e.id)}">Ver</a><button class="btn gh pr sm" data-ren="${esc(e.id)}">Renomear</button><button class="btn gh pr sm" data-volta="${esc(e.id)}">Voltar à moderação</button><button class="btn dg pr sm" data-rmp="${esc(e.id)}">Apagar</button></div></div>`).join('')}</div>` : '<div class="empty"><b>Nenhuma criação publicada ainda</b></div>'}</section>
         <section class="adsec"><h3>Bandeiras do acervo</h3><p class="pfnote" style="margin:0 0 10px">Renomeie, oculte da galeria ou destaque qualquer bandeira oficial. As mudanças valem para todos os visitantes.</p>
          <div class="fw-busca" style="margin:0 0 12px"><input id="adq" type="search" placeholder="Buscar bandeira do acervo" autocomplete="off"></div><div class="list" id="adres"></div>
          ${G.ocultas.length ? `<p class="elabel" style="margin-top:16px">Ocultas da galeria</p><div class="adchips">${G.ocultas.map(id => byId[id] ? `<span class="adchip">${flagThumb(id)}${esc(byId[id].n0 || byId[id].n)}<button class="pr" data-mostra="${esc(id)}" aria-label="Mostrar de novo">×</button></span>` : '').join('')}</div>` : ''}</section>`;
        let diaModo = dia && !dia.ate ? 'sempre' : 'hoje';
        dd($('addiaq'), { label: 'Duração', value: diaModo, items: [{ v: 'hoje', l: 'Só hoje' }, { v: 'sempre', l: 'Até eu mudar' }], onChange: v => { diaModo = v; if (dia) salvar({ dia: { id: dia.id, ate: v === 'hoje' ? hoje : null } }, 'Duração atualizada') } });
        dd($('addia'), { label: 'Escolher bandeira do dia', placeholder: dia ? 'Trocar bandeira…' : 'Escolher bandeira…', search: true, value: '', width: 320, items: oficiais.filter(f => !f.oculta).map(f => ({ v: f.id, l: f.n, fl: f.id })), onChange: id => { if (id) salvar({ dia: { id, ate: diaModo === 'hoje' ? hoje : null } }, 'Bandeira do dia definida') } });
        if ($('limpadia')) $('limpadia').onclick = () => salvar({ dia: null }, 'A bandeira do dia voltou ao sorteio');
        dd($('addest'), { label: 'Adicionar destaque', placeholder: 'Adicionar destaque…', search: true, value: '', width: 320, items: oficiais.concat(D.filter(f => f.t === 'criacao')).filter(f => !G.destaques.includes(f.id)).map(f => ({ v: f.id, l: f.n, sw: f.c && f.c[0] })), onChange: id => { if (!id) return; if (G.destaques.length >= 12) return toast('Máximo de 12 destaques'); salvar({ destaques: G.destaques.concat([id]) }, 'Destaque adicionado') } });
        box.querySelectorAll('[data-undest]').forEach(b => b.onclick = () => salvar({ destaques: G.destaques.filter(x => x !== b.dataset.undest) }, 'Destaque removido'));
        if ($('limpadest')) $('limpadest').onclick = () => salvar({ destaques: [] }, 'A seção volta a mostrar as mais baixadas');
        box.querySelectorAll('[data-mostra]').forEach(b => b.onclick = () => salvar({ ocultas: G.ocultas.filter(x => x !== b.dataset.mostra) }, 'Bandeira visível de novo'));
        box.querySelectorAll('[data-ren]').forEach(b => b.onclick = () => { const e = ap.find(x => x.id === b.dataset.ren); sheet('Renomear criação', `<div class="form"><label class="field">Nome<input id="rnn" maxlength="60" value="${esc(e.nome)}"></label><button class="btn acc pr" id="rnok">Salvar</button></div>`); $('rnok').onclick = async () => { const nome = $('rnn').value.trim(); if (!nome) return; try { await FB().editarEnvio(e.id, { nome }); closeSheet(); toast('Nome atualizado'); FL.reloadOriginals(); pane() } catch (er) { toast(fbErr(er)) } } });
        box.querySelectorAll('[data-volta]').forEach(b => b.onclick = async () => { try { await FB().moderar(b.dataset.volta, 'pendente'); toast('A criação voltou para a moderação'); FL.reloadOriginals(); pane() } catch (e) { toast(fbErr(e)) } });
        box.querySelectorAll('[data-rmp]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarEnvio(b.dataset.rmp); toast('Criação apagada'); FL.reloadOriginals(); pane() } catch (e) { toast(fbErr(e)) } });
        const res = () => {
          const q = norm($('adq').value || ''); const L = q ? oficiais.filter(f => norm([f.n0 || f.n, f.n, f.k, f.pais].join(' ')).includes(q)).slice(0, 30) : [];
          $('adres').innerHTML = !q ? '<p class="pfnote" style="margin:0">Digite para buscar entre as bandeiras oficiais.</p>' : L.length ? L.map(f => `<div class="li lg"><div class="th">${flagThumb(f.id)}</div><div><b>${esc(f.n)}</b><div class="m"><span>${esc(f.n0 && f.n0 !== f.n ? 'Nome original: ' + f.n0 : f.of || '')}</span>${f.oculta ? '<span class="stl reprovada">Oculta</span>' : ''}${G.destaques.includes(f.id) ? '<span class="stl aprovada">Destaque</span>' : ''}</div></div><div class="acts"><button class="btn gh pr sm" data-renb="${esc(f.id)}">Renomear</button><button class="btn gh pr sm" data-oc="${esc(f.id)}">${f.oculta ? 'Mostrar' : 'Ocultar'}</button><button class="btn gh pr sm" data-dst="${esc(f.id)}">${G.destaques.includes(f.id) ? 'Tirar destaque' : 'Destacar'}</button></div></div>`).join('') : '<p class="pfnote" style="margin:0">Nada encontrado.</p>';
          $('adres').querySelectorAll('[data-oc]').forEach(b => b.onclick = () => { const id = b.dataset.oc; const oc = G.ocultas.includes(id) ? G.ocultas.filter(x => x !== id) : G.ocultas.concat([id]); salvar({ ocultas: oc }, G.ocultas.includes(id) ? 'Bandeira visível de novo' : 'Bandeira oculta da galeria') });
          $('adres').querySelectorAll('[data-dst]').forEach(b => b.onclick = () => { const id = b.dataset.dst; if (!G.destaques.includes(id) && G.destaques.length >= 12) return toast('Máximo de 12 destaques'); salvar({ destaques: G.destaques.includes(id) ? G.destaques.filter(x => x !== id) : G.destaques.concat([id]) }, 'Destaques atualizados') });
          $('adres').querySelectorAll('[data-renb]').forEach(b => b.onclick = () => { const f = byId[b.dataset.renb]; sheet('Renomear bandeira', `<div class="form"><label class="field">Nome exibido<input id="rnb" maxlength="80" value="${esc(f.n)}"></label><p class="pfnote" style="margin:0">Nome original: ${esc(f.n0 || f.n)}. Deixe igual ao original para desfazer.</p><button class="btn acc pr" id="rnbok">Salvar</button></div>`); $('rnbok').onclick = () => { const nome = $('rnb').value.trim(); const nm = { ...G.nomes }; if (!nome || nome === (f.n0 || f.n)) delete nm[f.id]; else nm[f.id] = nome; closeSheet(); FB().salvarGaleria({ nomes: nm }).then(() => { toast('Nome atualizado'); pane() }).catch(e => toast(fbErr(e))) } });
        };
        $('adq').oninput = res; res();
      } else if (adTab === 'usuarios') {
        const [U, A] = await Promise.all([FB().usuarios(), FB().admins().catch(() => [])]);
        const adm = new Set(A), meu = FB().user.uid;
        U.sort((a, b) => ((b.criadoEm?.seconds) || 0) - ((a.criadoEm?.seconds) || 0));
        box.innerHTML = `<div class="tabsrow" style="margin-bottom:12px"><div class="fw-busca" style="margin:0;flex:1"><input id="adu" type="search" placeholder="Buscar por nome ou UID" autocomplete="off"></div><span class="pfnote" style="margin:0">${U.length} contas</span></div><div class="list" id="adul"></div>
          <p class="pfnote">${FB().dono ? 'Só você, como administrador principal, promove e remove administradores.' : 'Só o administrador principal promove e remove administradores.'} Contas banidas não enviam criações, não criam nem entram em comunidades e não entram no ranking.</p>`;
        const draw = () => {
          const q = norm($('adu').value || ''); const L = U.filter(u => !q || norm((u.nome || '') + ' ' + u.id).includes(q)).slice(0, 200);
          $('adul').innerHTML = L.length ? L.map(u => { const eu = u.id === meu, ad = adm.has(u.id) || (eu && FB().admin); return `<div class="li lg aduser"><div class="th">${avatar(u)}</div><div><b>${esc(u.nome || 'Sem nome')}${eu ? ' <small style="color:var(--mut)">(você)</small>' : ''}</b><div class="m">${ad ? '<span class="stl aprovada">Administrador</span>' : ''}${u.banido ? '<span class="stl reprovada">Banido</span>' : ''}<span>${u.criadoEm ? 'Desde ' + when(u.criadoEm) : 'Sem data'}</span><span>${(u.comunidades || []).length} comunidades</span><code style="font-size:12px">${esc(u.id.slice(0, 10))}…</code></div></div><div class="acts"><button class="btn gh pr sm" data-env="${esc(u.id)}">Envios</button>${!eu && FB().dono && !u.banido ? `<button class="btn gh pr sm" data-adm="${esc(u.id)}">${adm.has(u.id) ? 'Remover admin' : 'Tornar admin'}</button>` : ''}${!eu && !adm.has(u.id) ? `<button class="btn ${u.banido ? 'gh' : 'dg'} pr sm" data-ban="${esc(u.id)}">${u.banido ? 'Desbanir' : 'Banir'}</button>` : ''}</div></div>` }).join('') : '<div class="empty"><b>Nenhuma conta encontrada</b></div>';
          $('adul').querySelectorAll('[data-ban]').forEach(b => b.onclick = async () => { const u = U.find(x => x.id === b.dataset.ban); if (!u.banido && b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar banimento'; return } try { await FB().banir(u.id, !u.banido); u.banido = !u.banido; toast(u.banido ? 'Conta banida' : 'Banimento removido'); draw() } catch (e) { toast(fbErr(e)) } });
          $('adul').querySelectorAll('[data-adm]').forEach(b => b.onclick = async () => { const id = b.dataset.adm; try { if (adm.has(id)) { await FB().rebaixar(id); adm.delete(id); toast('Acesso de administrador removido') } else { await FB().promover(id); adm.add(id); toast('Conta promovida a administrador') } draw() } catch (e) { toast(fbErr(e)) } });
          $('adul').querySelectorAll('[data-env]').forEach(b => b.onclick = async () => { const u = U.find(x => x.id === b.dataset.env); const el = sheet('Envios de ' + (u.nome || 'Sem nome'), loading()); try { const L2 = await FB().enviosDe(u.id); const bx = el.querySelector('.restr') ? el.querySelector('.restr').parentElement : el; bx.innerHTML = L2.length ? `<div class="list">${L2.map(e => `<div class="li"><div class="th"><img src="${dataSrc(e.svg)}" alt=""></div><div><b>${esc(e.nome)}</b><div class="m"><span class="stl ${esc(e.status)}">${esc(e.status)}</span><span>${when(e.criadoEm)}</span></div></div></div>`).join('')}</div>` : '<p class="pfnote">Esta conta ainda não enviou criações.</p>' } catch (e) { toast(fbErr(e)) } });
        };
        $('adu').oninput = draw; draw();
      }
    } catch (e) { box.innerHTML = `<div class="empty"><b>Não foi possível carregar</b><p>${esc(fbErr(e))}</p></div>` }
  };
  pane();
};
})();
