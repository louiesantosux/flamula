/* Flâmula · Firebase (login, perfis, envios, comunidades, colaboradores e contagens).
   Usa a configuração de firebase-config.js. Sem configuração, o site funciona sem as partes de conta. */
const cfg = window.FLAMULA_FIREBASE;
const ev = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
const FB = window.FB = { on: false, ready: false, user: null, admin: false, profile: null };

if (!(cfg && cfg.projectId && cfg.apiKey)) { FB.ready = true; ev('fb-off'); ev('fl-stats-off'); ev('fb-user', { user: null }) }
else {
  try {
    const base = 'https://www.gstatic.com/firebasejs/10.12.2/';
    const A = await import(base + 'firebase-app.js');
    const F = await import(base + 'firebase-firestore.js');
    const U = await import(base + 'firebase-auth.js');
    const app = A.initializeApp(cfg), db = F.getFirestore(app), auth = U.getAuth(app);
    auth.languageCode = 'pt';
    const list = async q => (await F.getDocs(q)).docs.map(d => ({ id: d.id, ...d.data() }));
    const col = n => F.collection(db, n);

    /* contagens públicas */
    const sref = F.doc(db, 'estatisticas', 'bandeiras');
    F.onSnapshot(sref, s => { const d = s.data() || {}; ev('fl-stats', { downloads: d.downloads || {}, curtidas: d.curtidas || {} }) }, e => { console.warn('[Flâmula] contagens:', e.message); ev('fl-stats-off') });
    window.FL_STATS = { inc: (t, id, n = 1) => { if (!['downloads', 'curtidas'].includes(t) || !/^[a-z0-9-]{2,40}$/i.test(id)) return; return F.setDoc(sref, { [t]: { [id]: F.increment(n) } }, { merge: true }).catch(e => console.warn('[Flâmula]', e.message)) } };

    /* sessão */
    U.onAuthStateChanged(auth, async u => {
      FB.user = u; FB.admin = false; FB.profile = null;
      if (u) {
        const ref = F.doc(db, 'usuarios', u.uid);
        try {
          const s = await F.getDoc(ref);
          if (!s.exists()) { const p = { nome: u.displayName || (u.email || '').split('@')[0] || 'Sem nome', foto: u.photoURL || '', bio: '', comunidades: [], criadoEm: F.serverTimestamp() }; await F.setDoc(ref, p); FB.profile = { ...p } }
          else FB.profile = s.data();
        } catch (e) { FB.profile = { nome: u.displayName || 'Sem nome', foto: u.photoURL || '', bio: '', comunidades: [] } }
        /* administrador principal e moderador: a conta do dono do site (e-mail verificado); demais admins ficam em admins/{uid} */
        FB.dono = (u.email || '').toLowerCase() === 'louieikishima@gmail.com' && u.emailVerified;
        try { FB.admin = FB.dono || (await F.getDoc(F.doc(db, 'admins', u.uid))).exists() } catch (e) { FB.admin = FB.dono }
      }
      FB.ready = true; ev('fb-user', { user: u, admin: FB.admin, profile: FB.profile });
    });

    const me = () => { if (!FB.user) throw new Error('login'); return FB.user };
    Object.assign(FB, {
      on: true,
      google: async () => {
        const pr = new U.GoogleAuthProvider(); pr.setCustomParameters({ prompt: 'select_account' });
        try { return await U.signInWithPopup(auth, pr) }
        catch (e) { if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) return U.signInWithRedirect(auth, pr); throw e }
      },
      login: (e, p) => U.signInWithEmailAndPassword(auth, e, p),
      signup: async (nome, e, p) => { const c = await U.createUserWithEmailAndPassword(auth, e, p); await U.updateProfile(c.user, { displayName: nome }); await F.setDoc(F.doc(db, 'usuarios', c.user.uid), { nome }, { merge: true }); FB.profile = { ...(FB.profile || {}), nome }; ev('fb-user', { user: c.user, admin: FB.admin, profile: FB.profile }); return c },
      reset: e => U.sendPasswordResetEmail(auth, e),
      logout: () => U.signOut(auth),
      saveProfile: async d => { await F.setDoc(F.doc(db, 'usuarios', me().uid), d, { merge: true }); FB.profile = { ...FB.profile, ...d }; ev('fb-user', { user: FB.user, admin: FB.admin, profile: FB.profile }) },

      /* criações enviadas pelo editor */
      submit: e => F.addDoc(col('envios'), { nome: e.nome, svg: e.svg, ra: e.ra, comunidade: e.comunidade || '', uid: me().uid, autor: FB.profile?.nome || 'Sem nome', status: 'pendente', motivo: '', criadoEm: F.serverTimestamp() }),
      meusEnvios: () => list(F.query(col('envios'), F.where('uid', '==', me().uid))),
      aprovadas: com => list(com ? F.query(col('envios'), F.where('status', '==', 'aprovada'), F.where('comunidade', '==', com)) : F.query(col('envios'), F.where('status', '==', 'aprovada'))),
      pendentes: () => list(F.query(col('envios'), F.where('status', '==', 'pendente'))),
      moderar: (id, status, motivo = '') => F.updateDoc(F.doc(db, 'envios', id), { status, motivo, moderadoEm: F.serverTimestamp(), moderadoPor: me().uid }),
      apagarEnvio: id => F.deleteDoc(F.doc(db, 'envios', id)),

      /* comunidades */
      comunidades: () => list(F.query(col('comunidades'), F.orderBy('membros', 'desc'), F.limit(100))),
      comunidade: async id => { const s = await F.getDoc(F.doc(db, 'comunidades', id)); return s.exists() ? { id, ...s.data() } : null },
      membros: id => list(F.query(F.collection(db, 'comunidades', id, 'membros'), F.limit(60))),
      criarComunidade: async d => { const r = await F.addDoc(col('comunidades'), { nome: d.nome, descricao: d.descricao, bandeira: d.bandeira, cores: d.cores, donoUid: me().uid, donoNome: FB.profile?.nome || '', membros: 0, criadaEm: F.serverTimestamp() }); await FB.entrar(r.id); return r.id },
      entrar: async id => { const u = me(), b = F.writeBatch(db); b.set(F.doc(db, 'comunidades', id, 'membros', u.uid), { nome: FB.profile?.nome || '', foto: FB.profile?.foto || '', entrouEm: F.serverTimestamp() }); b.update(F.doc(db, 'comunidades', id), { membros: F.increment(1) }); b.set(F.doc(db, 'usuarios', u.uid), { comunidades: F.arrayUnion(id) }, { merge: true }); await b.commit(); FB.profile.comunidades = [...new Set([...(FB.profile.comunidades || []), id])] },
      sair: async id => { const u = me(), b = F.writeBatch(db); b.delete(F.doc(db, 'comunidades', id, 'membros', u.uid)); b.update(F.doc(db, 'comunidades', id), { membros: F.increment(-1) }); b.set(F.doc(db, 'usuarios', u.uid), { comunidades: F.arrayRemove(id) }, { merge: true }); await b.commit(); FB.profile.comunidades = (FB.profile.comunidades || []).filter(x => x !== id) },
      apagarComunidade: id => F.deleteDoc(F.doc(db, 'comunidades', id)),

      /* ranking do jogo (uma coleção por nível) */
      ranking: nivel => list(F.query(col('ranking_' + nivel), F.orderBy('pontos', 'desc'), F.limit(25))),
      /* um placar por jogador e nível: id = uid (logado) ou "n-" + nome normalizado. Só substitui se a pontuação nova for maior */
      salvarPlacar: async (nivel, d) => {
        const uid = FB.user?.uid || '';
        const chave = uid || ('n-' + (d.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'anonimo'));
        const ref = F.doc(db, 'ranking_' + nivel, chave);
        const pontos = d.acertos * 100000 - d.td;
        const ant = await F.getDoc(ref);
        if (ant.exists() && (ant.data().pontos ?? -Infinity) >= pontos) return { id: chave, melhorou: false, anterior: ant.data() };
        await F.setDoc(ref, { nome: d.nome, uid, acertos: d.acertos, td: d.td, pontos, criadoEm: F.serverTimestamp() });
        return { id: chave, melhorou: true, novo: !ant.exists() };
      },

      /* colaboradores */
      colaborar: d => F.addDoc(col('colaboradores'), { nome: d.nome, email: d.email, area: d.area, mensagem: d.mensagem, uid: FB.user?.uid || '', criadoEm: F.serverTimestamp() }),
      colaboradores: () => list(F.query(col('colaboradores'), F.orderBy('criadoEm', 'desc'), F.limit(100))),
      apagarColaborador: id => F.deleteDoc(F.doc(db, 'colaboradores', id))
    });
    ev('fb-on');
  } catch (err) {
    console.warn('[Flâmula] Firebase não carregou:', err.message);
    FB.ready = true; ev('fb-off'); ev('fl-stats-off'); ev('fb-user', { user: null });
  }
}
