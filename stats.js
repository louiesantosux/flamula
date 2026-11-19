/* Flâmula · contagens reais de downloads e curtidas (Cloud Firestore).
   Tudo fica num único documento: estatisticas/bandeiras
   { downloads: { br: 12, jp: 3, ... }, curtidas: { br: 5, ... } }
   Sem configuração em firebase-config.js, o site funciona normalmente e só esconde os contadores. */
const cfg = window.FLAMULA_FIREBASE;
const off = () => window.dispatchEvent(new CustomEvent('fl-stats-off'));

if (cfg && cfg.projectId && cfg.apiKey) {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const { getFirestore, doc, onSnapshot, setDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const app = initializeApp(cfg);
    const db = getFirestore(app);
    const ref = doc(db, 'estatisticas', 'bandeiras');

    onSnapshot(ref, snap => {
      const d = snap.data() || {};
      window.dispatchEvent(new CustomEvent('fl-stats', { detail: { downloads: d.downloads || {}, curtidas: d.curtidas || {} } }));
    }, err => { console.warn('[Flâmula] Contagens indisponíveis:', err.message); off(); });

    window.FL_STATS = {
      inc: (tipo, id, n = 1) => {
        if (!['downloads', 'curtidas'].includes(tipo) || !/^[a-z0-9-]{2,12}$/.test(id)) return;
        return setDoc(ref, { [tipo]: { [id]: increment(n) } }, { merge: true })
          .catch(err => console.warn('[Flâmula] Não foi possível registrar:', err.message));
      }
    };
  } catch (err) {
    console.warn('[Flâmula] Firebase não carregou:', err.message);
    off();
  }
} else {
  off();
}
