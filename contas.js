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
.stl.pendente{background:rgba(255,159,10,.16);color:#C77700}
.stl.aprovada{background:rgba(52,199,89,.16);color:#1E8E3E}
.stl.reprovada{background:rgba(255,59,48,.14);color:#D70015}
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
document.head.appendChild(css);

/* utilidades */
const when = t => { const s = t && (t.seconds || (t.toDate && t.toDate().getTime() / 1000)); return s ? new Date(s * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'agora' };
const avatar = (p, cls = 'av') => `<span class="${cls}">${p && p.foto ? `<img src="${esc(p.foto)}" alt="" referrerpolicy="no-referrer">` : esc(((p && p.nome) || '?').trim()[0] || '?').toUpperCase()}</span>`;
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

/* login */
FL.actions.login = () => {
  if (!FB().on) return toast(FB().ready ? 'Login indisponível: Firebase não configurado.' : 'Carregando… tente de novo em instantes.');
  const g = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12S6.6 21.7 12 21.7c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1.1-.2-1.6H12z"/></svg>';
  const el = sheet('Entrar no Flâmula', `<div class="form">
    <button class="btn gh pr gbtn" id="lgg">${g}Continuar com Google</button>
    <div class="or">ou com e-mail</div>
    ${segH('lgm', [['in', 'Entrar'], ['up', 'Criar conta']], 'in')}
    <label class="field" id="lgnw" hidden>Nome<input id="lgn" autocomplete="name" maxlength="60"></label>
    <label class="field">E-mail<input id="lge" type="email" autocomplete="email" inputmode="email"></label>
    <label class="field">Senha<input id="lgp" type="password" autocomplete="current-password" minlength="6"></label>
    <p class="err" id="lgerr" hidden></p>
    <button class="btn acc pr" id="lgok">Entrar</button>
    <button class="lnk" id="lgreset" style="justify-self:center">Esqueci a senha</button></div>`);
  let mode = 'in';
  const err = m => { const e = $('lgerr'); e.textContent = m; e.hidden = !m };
  segBind($('lgm'), v => { mode = v; $('lgnw').hidden = v !== 'up'; $('lgok').textContent = v === 'up' ? 'Criar conta' : 'Entrar'; $('lgp').autocomplete = v === 'up' ? 'new-password' : 'current-password'; err('') });
  const done = () => { closeSheet(); toast('Você entrou no Flâmula') };
  $('lgg').onclick = async () => { err(''); try { await FB().google(); done() } catch (e) { if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') err(fbErr(e)) } };
  $('lgok').onclick = async () => {
    const em = $('lge').value.trim(), pw = $('lgp').value, nm = $('lgn').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(em)) return err('Informe um e-mail válido.');
    if (pw.length < 6) return err('A senha precisa ter pelo menos 6 caracteres.');
    if (mode === 'up' && !nm) return err('Informe seu nome.');
    $('lgok').disabled = true;
    try { mode === 'up' ? await FB().signup(nm, em, pw) : await FB().login(em, pw); done() } catch (e) { err(fbErr(e)) } finally { const b = $('lgok'); if (b) b.disabled = false }
  };
  el.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') $('lgok').click() });
  $('lgreset').onclick = async () => { const em = $('lge').value.trim(); if (!/^\S+@\S+\.\S+$/.test(em)) return err('Digite seu e-mail acima para receber o link.'); try { await FB().reset(em); err(''); toast('Enviamos um link de redefinição para o seu e-mail') } catch (e) { err(fbErr(e)) } };
};

/* pedir para ser administrador */
FL.actions['admin-pedido'] = () => {
  const u = FB().user, p = FB().profile;
  const body = encodeURIComponent(`Olá! Quero me tornar administrador do Flâmula.\n\nNome: ${p?.nome || ''}\nUID: ${u?.uid || '(entre no site para ver seu UID)'}\n\nMotivo:\n`);
  sheet('Seja administrador', `<div class="form">
    <p style="margin:0">Administradores aprovam as criações enviadas pela comunidade e cuidam das comunidades e dos formulários. Para pedir acesso, envie um e-mail com o seu UID para:</p>
    <div class="box lg"><div class="kv"><div><small>E-mail</small><code>${ADMIN_EMAIL}</code></div>${u ? `<div><small>Seu UID</small><code>${esc(u.uid)}</code></div>` : ''}</div></div>
    ${u ? '' : '<p class="ehint" style="margin:0;color:var(--mut)">Entre na sua conta antes, para que o UID vá junto no e-mail.</p>'}
    <div class="acts"><a class="btn acc pr" href="mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('Pedido de administrador · Flâmula')}&body=${body}" target="_blank" rel="noopener">Escrever e-mail</a><button class="btn gh pr" data-copy="${ADMIN_EMAIL}">Copiar e-mail</button>${u ? `<button class="btn gh pr" data-copy="${esc(u.uid)}">Copiar UID</button>` : '<button class="btn gh pr" data-act="login">Entrar</button>'}</div></div>`);
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
    $('cbok').disabled = true;
    try { await FB().colaborar(d); closeSheet(); toast('Recebemos o seu formulário. Obrigado!') } catch (e) { err(fbErr(e)); $('cbok').disabled = false }
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
    <label class="chk"><input type="checkbox" id="sbk">A bandeira é original ou um remix, não usa escudos, logotipos ou marcas, nem conteúdo ofensivo ou dados pessoais.</label>
    <p class="err" id="sberr" hidden></p>
    <button class="btn acc pr" id="sbok">Enviar para moderação</button></div>`);
  const com = dd($('sbc'), { label: 'Comunidade', value: '', items: [{ v: '', l: 'Só na galeria' }, ...coms.map(c => ({ v: c.id, l: c.nome, sw: (c.cores || [])[0] }))] });
  $('sbc').querySelector('.dd-btn').style.cssText = 'width:100%;justify-content:space-between';
  const err = m => { const e = $('sberr'); e.textContent = m; e.hidden = !m };
  $('sbok').onclick = async () => {
    const nome = $('sbn').value.trim(); if (!nome) return err('Dê um nome à bandeira.'); if (!$('sbk').checked) return err('Confirme as regras de envio.');
    $('sbok').disabled = true;
    try { await FB().submit({ nome, svg: data.svg, ra: data.ra, comunidade: com.value }); closeSheet(); toast('Enviada! Ela aparece na galeria depois da moderação.'); FL.go('perfil') } catch (e) { err(fbErr(e)); $('sbok').disabled = false }
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
FL.views.perfil = async () => {
  const v = $('v-perfil'); document.title = 'Meu perfil · Flâmula';
  if (!FB().ready) { v.innerHTML = loading(); await waitUser(); if (FL.view !== 'perfil') return }
  if (!FB().on) return v.innerHTML = offMsg();
  const u = FB().user, p = FB().profile || {};
  if (!u) return v.innerHTML = needLogin('ver seu perfil, enviar criações e participar de comunidades');
  v.innerHTML = `<div class="pf lg">${avatar(p)}<div><h1>${esc(p.nome || 'Sem nome')}</h1><p>${esc(p.bio || 'Sem bio ainda.')}</p><div class="pfst"><span><b id="pfn">–</b>criações</span><span><b>${(p.comunidades || []).length}</b>comunidades</span>${FB().admin ? '<span class="stl aprovada">Administrador</span>' : ''}</div></div><div class="pfa"><button class="btn gh pr" id="pfedit">Editar perfil</button><button class="btn gh pr" id="pfout">Sair</button></div></div>
  <div class="tabsrow">${segH('pft', [['criacoes', 'Criações'], ['comunidades', 'Comunidades'], ['conta', 'Conta']], pfTab)}<div id="pfx"></div></div><div id="pfp"></div>`;
  segBind($('pft'), t => { pfTab = t; pane() });
  $('pfout').onclick = async () => { await FB().logout(); toast('Você saiu da conta'); FL.go('inicio') };
  $('pfedit').onclick = () => {
    sheet('Editar perfil', `<div class="form"><label class="field">Nome<input id="ped" maxlength="60" value="${esc(p.nome || '')}"></label><label class="field">Bio<textarea id="peb" maxlength="280">${esc(p.bio || '')}</textarea></label><p class="err" id="peerr" hidden></p><button class="btn acc pr" id="peok">Salvar</button></div>`);
    $('peok').onclick = async () => { const nome = $('ped').value.trim(); if (!nome) return; try { await FB().saveProfile({ nome, bio: $('peb').value.trim() }); closeSheet(); toast('Perfil atualizado') } catch (e) { const er = $('peerr'); er.textContent = fbErr(e); er.hidden = false } };
  };
  FB().meusEnvios().then(L => { const n = $('pfn'); if (n) n.textContent = L.length }).catch(() => { });
  const pane = async () => {
    const box = $('pfp'), x = $('pfx'); if (!box) return;
    if (pfTab === 'criacoes') {
      x.innerHTML = '<a class="btn acc pr sm" href="#criar">Nova criação</a>'; box.innerHTML = loading();
      try {
        const L = (await FB().meusEnvios()).sort((a, b) => ((b.criadoEm?.seconds) || 0) - ((a.criadoEm?.seconds) || 0));
        box.innerHTML = L.length ? `<div class="list">${L.map(e => `<div class="li lg"><div class="th"><img src="${dataSrc(e.svg)}" alt=""></div><div><b>${esc(e.nome)}</b><div class="m"><span class="stl ${esc(e.status)}">${{ pendente: 'Em moderação', aprovada: 'Aprovada', reprovada: 'Reprovada' }[e.status] || esc(e.status)}</span><span>${when(e.criadoEm)}</span></div>${e.status === 'reprovada' && e.motivo ? `<p class="why">Motivo: ${esc(e.motivo)}</p>` : ''}</div><div class="acts">${e.status === 'aprovada' ? `<a class="btn gh pr sm" href="#b-u-${esc(e.id)}">Ver na galeria</a>` : ''}<button class="btn dg pr sm" data-del="${esc(e.id)}">Apagar</button></div></div>`).join('')}</div>` : `<div class="empty"><b>Você ainda não enviou criações</b><p>Crie uma bandeira no editor e envie para a galeria.</p><a class="btn acc pr" href="#criar">Abrir o editor</a></div>`;
        box.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => { if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Confirmar'; return } try { await FB().apagarEnvio(b.dataset.del); toast('Criação apagada'); pane() } catch (e) { toast(fbErr(e)) } });
      } catch (e) { box.innerHTML = `<div class="empty"><b>Não foi possível carregar</b><p>${esc(fbErr(e))}</p></div>` }
    } else if (pfTab === 'comunidades') {
      x.innerHTML = '<button class="btn acc pr sm" data-act="nova-comunidade">Criar comunidade</button>'; box.innerHTML = loading();
      const ids = FB().profile?.comunidades || [];
      const L = (await Promise.all(ids.map(id => FB().comunidade(id).catch(() => null)))).filter(Boolean);
      box.innerHTML = L.length ? `<div class="grid">${L.map(comCard).join('')}</div>` : `<div class="empty"><b>Você ainda não participa de comunidades</b><p>Encontre pessoas que gostam das mesmas bandeiras ou crie a sua.</p><a class="btn acc pr" href="#comunidades">Explorar comunidades</a></div>`;
    } else {
      x.innerHTML = '';
      box.innerHTML = `<div class="list"><div class="box lg"><div class="kv"><div><small>E-mail da conta</small><code>${esc(u.email || '—')}</code></div><div><small>UID</small><code>${esc(u.uid)}</code></div></div><div class="acts"><button class="btn gh pr sm" data-copy="${esc(u.uid)}">Copiar UID</button></div></div>
      <div class="box lg">${FB().admin ? `<p><b>Você é administrador.</b> Acesse o painel para moderar envios, comunidades e formulários.</p><div class="acts"><a class="btn acc pr sm" href="#admin">Abrir painel</a></div>` : `<p><b>Quer ser administrador?</b> Envie um e-mail para <b>${ADMIN_EMAIL}</b> com o seu UID e conte por que quer ajudar.</p><div class="acts"><button class="btn acc pr sm" data-act="admin-pedido">Pedir acesso</button></div>`}</div>
      <div class="box lg"><p><b>Quer colaborar de outro jeito?</b> Curadoria, pesquisa histórica, tradução, design ou código.</p><div class="acts"><button class="btn gh pr sm" data-act="colaborar">Torne-se um colaborador</button></div></div></div>`;
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
let adTab = 'envios';
FL.views.admin = async () => {
  const v = $('v-admin'); document.title = 'Admin · Flâmula'; v.innerHTML = loading();
  await waitUser(); if (FL.view !== 'admin') return;
  if (!FB().on) return v.innerHTML = offMsg();
  if (!FB().user) return v.innerHTML = needLogin('acessar o painel de administração');
  if (!FB().admin) return v.innerHTML = restricted('Acesso restrito', `Esta página é só para administradores. Para pedir acesso, envie um e-mail para <b>${ADMIN_EMAIL}</b> com o seu UID.`, '<button class="btn acc pr" data-act="admin-pedido">Pedir acesso</button>');
  v.innerHTML = `<div class="phead"><h1>Administração</h1><p>Modere as criações enviadas, as comunidades e os formulários de colaboração.</p></div><div class="tabsrow">${segH('adt', [['envios', 'Envios'], ['comunidades', 'Comunidades'], ['colaboradores', 'Colaboradores']], adTab)}</div><div id="adp"></div>`;
  segBind($('adt'), t => { adTab = t; pane() });
  const pane = async () => {
    const box = $('adp'); box.innerHTML = loading();
    try {
      if (adTab === 'envios') {
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
      } else {
        const L = await FB().colaboradores();
        const AREA = { curadoria: 'Curadoria de bandeiras', pesquisa: 'Pesquisa histórica', traducao: 'Tradução', design: 'Design', desenvolvimento: 'Desenvolvimento', moderacao: 'Moderação', direitos: 'Direitos autorais e remoção', outro: 'Outro' };
        box.innerHTML = L.length ? `<div class="list">${L.map(c => `<div class="box lg"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><b>${esc(c.nome)}</b><span class="stl pendente">${esc(AREA[c.area] || c.area)}</span></div><p style="color:var(--mut);font-size:14px">${esc(c.email)} · ${when(c.criadoEm)}</p><p style="white-space:pre-wrap">${esc(c.mensagem)}</p><div class="acts"><a class="btn gh pr sm" href="mailto:${esc(c.email)}" target="_blank" rel="noopener">Responder</a><button class="btn dg pr sm" data-rmk="${esc(c.id)}">Apagar</button></div></div>`).join('')}</div>` : '<div class="empty"><b>Nenhum formulário recebido</b></div>';
        box.querySelectorAll('[data-rmk]').forEach(b => b.onclick = async () => { try { await FB().apagarColaborador(b.dataset.rmk); pane() } catch (e) { toast(fbErr(e)) } });
      }
    } catch (e) { box.innerHTML = `<div class="empty"><b>Não foi possível carregar</b><p>${esc(fbErr(e))}</p></div>` }
  };
  pane();
};
})();
