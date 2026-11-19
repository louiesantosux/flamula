/* Flâmula · dados históricos das bandeiras.
   Adoção, designer, contexto e linha do tempo vêm da Wikidata e da Wikipédia (CC BY-SA),
   consultadas no navegador e guardadas em cache por 7 dias. */
(() => {
const TTL = 7 * 864e5, VER = 'v2';
const cacheGet = k => { try { const v = JSON.parse(localStorage.getItem(`fl-w-${VER}-${k}`) || 'null'); if (v && Date.now() - v.t < TTL) return v.d } catch (e) { } return null };
const cacheSet = (k, d) => { try { localStorage.setItem(`fl-w-${VER}-${k}`, JSON.stringify({ t: Date.now(), d })) } catch (e) { } };
const tfetch = (u, ms = 10000) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return fetch(u, { signal: c.signal }).finally(() => clearTimeout(t)) };
const sparql = async q => { const r = await tfetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q)); if (!r.ok) throw new Error('Wikidata ' + r.status); return (await r.json()).results.bindings };
const val = (b, k) => b[k] && b[k].value;
const qid = u => u ? u.split('/').pop() : null;
const year = s => { if (!s) return null; const m = /^([+-]?\d{1,4})-/.exec(s); return m ? parseInt(m[1], 10) : null };
const https = u => u ? u.replace(/^http:/, 'https:') : null;
const thumb = (u, w = 360) => u ? https(u) + (u.includes('?') ? '&' : '?') + 'width=' + w : null;
const isQ = s => /^Q\d+$/.test(s || '');
const LBL = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "pt,pt-br,en". }';

const summary = async (lang, title) => {
  if (!title) return null;
  try {
    const r = await tfetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    if (!r.ok) return null; const j = await r.json();
    return j.extract ? { text: j.extract, url: j.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title)}`, lang } : null;
  } catch (e) { return null }
};
const titleOf = u => u ? decodeURIComponent(u.split('/wiki/')[1] || '').replace(/_/g, ' ') : null;

/* informações do item da bandeira (QID) */
const flagItem = async q => {
  const rows = await sparql(`SELECT ?label ?des ?desLabel ?inc ?img ?artPt ?artEn WHERE {
    BIND(wd:${q} AS ?f)
    OPTIONAL { ?f wdt:P287 ?des } OPTIONAL { ?f wdt:P571 ?inc } OPTIONAL { ?f wdt:P18 ?img }
    OPTIONAL { ?artPt schema:about ?f; schema:isPartOf <https://pt.wikipedia.org/> }
    OPTIONAL { ?artEn schema:about ?f; schema:isPartOf <https://en.wikipedia.org/> }
    ?f rdfs:label ?label . FILTER(LANG(?label) IN ("pt","en"))
    ${LBL} } LIMIT 40`);
  const des = [...new Set(rows.map(r => val(r, 'desLabel')).filter(x => x && !isQ(x)))];
  const r0 = rows[0] || {};
  return { des, inc: year(rows.map(r => val(r, 'inc')).filter(Boolean).sort()[0]), img: val(r0, 'img'), artPt: rows.map(r => val(r, 'artPt')).find(Boolean), artEn: rows.map(r => val(r, 'artEn')).find(Boolean) };
};
/* bandeiras anteriores encadeadas por "substitui" (P1365) ou "precedido por" (P155) */
const predecessors = async q => {
  const rows = await sparql(`SELECT ?p ?pLabel ?img ?inc ?end ?s ?e WHERE {
    wd:${q} (wdt:P1365|wdt:P155)+ ?p .
    OPTIONAL { ?p wdt:P18 ?img } OPTIONAL { ?p wdt:P571 ?inc } OPTIONAL { ?p wdt:P576 ?end }
    OPTIONAL { ?p wdt:P580 ?s } OPTIONAL { ?p wdt:P582 ?e }
    ${LBL} } LIMIT 60`);
  const by = {};
  rows.forEach(r => { const id = qid(val(r, 'p')); const o = by[id] || (by[id] = { label: val(r, 'pLabel'), img: null, from: null, to: null }); o.img = o.img || val(r, 'img'); o.from = o.from ?? year(val(r, 's') || val(r, 'inc')); o.to = o.to ?? year(val(r, 'e') || val(r, 'end')) });
  return Object.values(by).filter(x => x.img);
};

/* país (ISO 3166-1) ou estado (ISO 3166-2) */
const fromPlace = async (prop, code) => {
  const rows = await sparql(`SELECT ?c ?flag ?flagLabel ?img ?s ?e WHERE {
    ?c wdt:${prop} "${code}" .
    OPTIONAL { ?c p:P41 ?st . ?st ps:P41 ?img . OPTIONAL { ?st pq:P580 ?s } OPTIONAL { ?st pq:P582 ?e } }
    OPTIONAL { ?c wdt:P163 ?flag }
    ${LBL} } LIMIT 200`);
  if (!rows.length) return null;
  const flags = {}; rows.forEach(r => { const f = qid(val(r, 'flag')); if (f) flags[f] = val(r, 'flagLabel') || '' });
  const pick = Object.entries(flags).sort((a, b) => (/^(bandeira|flag)\s/i.test(b[1]) - /^(bandeira|flag)\s/i.test(a[1])) || (/(naval|marinha|civil|estado|state|ensign|jack|presid)/i.test(a[1]) - /(naval|marinha|civil|estado|state|ensign|jack|presid)/i.test(b[1])))[0];
  const tl = {}; rows.forEach(r => { const i = val(r, 'img'); if (!i) return; const o = tl[i] || (tl[i] = { img: i, from: null, to: null }); o.from = o.from ?? year(val(r, 's')); o.to = o.to ?? year(val(r, 'e')) });
  return { flagQ: pick ? pick[0] : null, timeline: Object.values(tl) };
};

const enApi = async titles => {
  const u = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&redirects=1&prop=pageimages|pageprops|langlinks&piprop=original|thumbnail&pithumbsize=600&ppprop=wikibase_item&lllang=pt&lllimit=1&titles=' + encodeURIComponent(titles.join('|'));
  const r = await tfetch(u); if (!r.ok) throw new Error('Wikipédia ' + r.status); const j = await r.json();
  const map = {}; const norm = {}; (j.query.normalized || []).forEach(n => norm[n.to] = n.from); (j.query.redirects || []).forEach(n => norm[n.to] = norm[n.from] || n.from);
  Object.values(j.query.pages || {}).forEach(p => { if (p.missing !== undefined) return; const asked = norm[p.title] || p.title; map[asked] = { title: p.title, q: p.pageprops?.wikibase_item, img: p.original?.source || p.thumbnail?.source || null, thumb: p.thumbnail?.source || null, pt: p.langlinks?.[0]?.['*'] || null } });
  return map;
};

const W = {};
/* imagens das bandeiras militares (uma chamada para todas) */
W.militares = async list => {
  const todo = list.filter(f => f.wt && !f.src); if (!todo.length) return false;
  const cached = cacheGet('mil'); let map = cached;
  if (!map) { try { map = await enApi(todo.map(f => f.wt)); cacheSet('mil', map) } catch (e) { return false } }
  let ch = false; todo.forEach(f => { const m = map[f.wt]; if (m && m.img) { f.src = m.img; f.wq = m.q; f.wpt = m.pt; f.wen = m.title; f.fonte = 'wiki'; ch = true } });
  return ch;
};

/* ficha completa: adoção, designer, contexto e linha do tempo */
W.info = async f => {
  const key = 'i-' + f.id; const c = cacheGet(key); if (c) return c;
  const out = { inc: null, des: [], ctx: null, tl: [], ok: false };
  try {
    let flagQ = null, tl = [];
    if (f.t === 'pais' || f.t === 'estado') {
      const code = f.t === 'estado' ? 'BR-' + f.k : (/^GB-/.test(f.k) ? f.k : f.k);
      const p = await fromPlace(f.t === 'estado' || /^GB-/.test(f.k) ? 'P300' : 'P297', code);
      if (p) { flagQ = p.flagQ; tl = p.timeline }
    } else if (f.t === 'militar') {
      if (!f.wq && f.wt) { try { const m = await enApi([f.wt]); const x = m[f.wt]; if (x) { f.wq = x.q; f.wpt = x.pt; f.wen = x.title; if (!f.src && x.img) f.src = x.img } } catch (e) { } }
      flagQ = f.wq || null;
    }
    let info = null;
    if (flagQ) { info = await flagItem(flagQ); out.inc = info.inc; out.des = info.des }
    if (flagQ && tl.filter(x => x.img).length < 2) {
      const prev = await predecessors(flagQ).catch(() => []);
      const cur = { img: info?.img || tl.find(x => !x.to)?.img || null, from: info?.inc || null, to: null, cur: true };
      tl = prev.concat(cur.img ? [cur] : []);
    }
    tl = tl.filter(x => x.img);
    const seen = new Set(); tl = tl.filter(x => { const k = x.img.split('/').pop(); if (seen.has(k)) return false; seen.add(k); return true });
    tl.sort((a, b) => (a.cur ? 1 : 0) - (b.cur ? 1 : 0) || (a.to == null) - (b.to == null) || (a.from ?? 9999) - (b.from ?? 9999));
    if (tl.length && !tl.some(x => x.cur)) { const last = tl.filter(x => x.to == null).pop() || tl[tl.length - 1]; last.cur = true }
    out.tl = tl.map(x => ({ img: thumb(x.img, 360), from: x.from, to: x.to, cur: !!x.cur, label: x.label || null }));
    const ptT = titleOf(info?.artPt) || (f.t === 'militar' ? f.wpt : null);
    const enT = titleOf(info?.artEn) || (f.t === 'militar' ? f.wen : null);
    out.ctx = await summary('pt', ptT) || await summary('en', enT);
    out.ok = true;
  } catch (e) { out.err = e.message }
  if (out.ok) cacheSet(key, out);
  return out;
};
window.FLWIKI = W;
})();
